import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

type LemonOrder = {
  id: string;
  attributes: {
    customer_id?: number | string | null;
    first_order_item?: {
      variant_id?: number | null;
    } | null;
    identifier?: string | null;
    refunded?: boolean | null;
    status?: string | null;
    store_id?: number | null;
    user_email?: string | null;
  };
};

type LemonOrderAttributes = LemonOrder["attributes"];

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function createAdminClient() {
  const url = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

function matchesConfiguredProduct(attributes: LemonOrderAttributes) {
  const expectedStoreId = Deno.env.get("LEMON_SQUEEZY_STORE_ID");
  const expectedVariantId = Deno.env.get("LEMON_SQUEEZY_VARIANT_ID");

  if (expectedStoreId && String(attributes.store_id) !== String(expectedStoreId)) {
    return false;
  }

  if (
    expectedVariantId &&
    String(attributes.first_order_item?.variant_id || "") !== String(expectedVariantId)
  ) {
    return false;
  }

  return true;
}

async function upsertEntitlementFromOrder(args: {
  userId?: string | null;
  email: string;
  unlocked: boolean;
  orderId?: string | null;
  orderIdentifier?: string | null;
  customerId?: string | null;
  variantId?: number | null;
}) {
  const admin = createAdminClient();
  const email = normalizeEmail(args.email);

  if (!email) {
    throw new Error("Order is missing a customer email.");
  }

  const { error } = await admin
    .from("entitlements")
    .upsert(
      {
        email,
        user_id: args.userId || null,
        provider: "lemon_squeezy",
        lifetime_saves_unlocked: args.unlocked,
        lemon_order_id: args.orderId || null,
        lemon_order_identifier: args.orderIdentifier || null,
        lemon_customer_id: args.customerId || null,
        lemon_variant_id: args.variantId || null,
        unlocked_at: args.unlocked ? new Date().toISOString() : null
      },
      {
        onConflict: "email"
      }
    );

  if (error) throw error;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    console.error("lemon-reconcile: invalid method", request.method);
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.replace(/^Bearer\s+/i, "");

  if (!token) {
    console.error("lemon-reconcile: missing auth token");
    return Response.json({ error: "Missing auth token" }, { status: 401, headers: corsHeaders });
  }

  const admin = createAdminClient();
  const {
    data: { user },
    error: userError
  } = await admin.auth.getUser(token);

  if (userError || !user?.email) {
    console.error("lemon-reconcile: could not verify user", userError);
    return Response.json({ error: "Could not verify signed-in user" }, { status: 401, headers: corsHeaders });
  }

  const email = normalizeEmail(user.email);
  console.log("lemon-reconcile: checking email", email);
  const apiKey = getRequiredEnv("LEMON_SQUEEZY_API_KEY");
  const query = new URL("https://api.lemonsqueezy.com/v1/orders");
  query.searchParams.set("filter[user_email]", email);
  query.searchParams.set("page[size]", "10");

  const response = await fetch(query, {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("lemon-reconcile: lemon lookup failed", response.status, errorBody);
    return Response.json(
      { error: `Lemon Squeezy lookup failed with ${response.status}`, details: errorBody },
      { status: 502, headers: corsHeaders }
    );
  }

  const payload = (await response.json()) as { data?: LemonOrder[] };
  console.log("lemon-reconcile: orders returned", (payload.data || []).length);
  const matchingOrder = (payload.data || []).find((order) => {
    const attrs = order.attributes || {};
    return (
      matchesConfiguredProduct(attrs) &&
      attrs.status === "paid" &&
      attrs.refunded !== true
    );
  });

  if (!matchingOrder) {
    console.log("lemon-reconcile: no matching paid order found");
    return Response.json(
      {
        unlocked: false,
        message: "No paid Favorite Blends unlock was found for this email yet."
      },
      { headers: corsHeaders }
    );
  }

  console.log("lemon-reconcile: matching order found", {
    orderId: matchingOrder.id,
    identifier: matchingOrder.attributes.identifier || null,
    customerId: matchingOrder.attributes.customer_id || null,
    variantId: matchingOrder.attributes.first_order_item?.variant_id || null
  });

  await upsertEntitlementFromOrder({
    userId: user.id,
    email,
    unlocked: true,
    orderId: matchingOrder.id,
    orderIdentifier: matchingOrder.attributes.identifier || null,
    customerId: matchingOrder.attributes.customer_id ? String(matchingOrder.attributes.customer_id) : null,
    variantId: matchingOrder.attributes.first_order_item?.variant_id || null
  });

  console.log("lemon-reconcile: entitlement upserted", email);
  return Response.json(
    {
      unlocked: true,
      message: "Payment found. Favorite Blends are now unlocked.",
      orderId: matchingOrder.id
    },
    { headers: corsHeaders }
  );
});
