import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
  };
  data?: {
    id?: string;
    attributes?: {
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
};

type LemonOrderAttributes = NonNullable<NonNullable<LemonWebhookPayload["data"]>["attributes"]>;

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

async function hmacHex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyWebhookSignature(request: Request, rawBody: string) {
  const signingSecret = getRequiredEnv("LEMON_SQUEEZY_WEBHOOK_SECRET");
  const signature = request.headers.get("X-Signature") || "";
  const digest = await hmacHex(signingSecret, rawBody);
  return signature.length > 0 && signature === digest;
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
    console.error("lemon-webhook: invalid method", request.method);
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const rawBody = await request.text();
  const validSignature = await verifyWebhookSignature(request, rawBody);

  if (!validSignature) {
    console.error("lemon-webhook: invalid signature");
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  const payload = (JSON.parse(rawBody)) as LemonWebhookPayload;
  const eventName = payload.meta?.event_name || "";
  const attributes = payload.data?.attributes;
  console.log("lemon-webhook: event received", eventName);

  if (!attributes) {
    console.log("lemon-webhook: ignored missing attributes");
    return Response.json({ ok: true, ignored: "missing_attributes" }, { headers: corsHeaders });
  }

  if (!matchesConfiguredProduct(attributes)) {
    console.log("lemon-webhook: ignored different product", {
      storeId: attributes.store_id || null,
      variantId: attributes.first_order_item?.variant_id || null
    });
    return Response.json({ ok: true, ignored: "different_product" }, { headers: corsHeaders });
  }

  if (eventName !== "order_created" && eventName !== "order_refunded") {
    console.log("lemon-webhook: ignored event", eventName || "unknown_event");
    return Response.json({ ok: true, ignored: eventName || "unknown_event" }, { headers: corsHeaders });
  }

  const unlocked =
    eventName === "order_created" &&
    attributes.status === "paid" &&
    attributes.refunded !== true;

  await upsertEntitlementFromOrder({
    email: attributes.user_email || "",
    unlocked,
    orderId: payload.data?.id || null,
    orderIdentifier: attributes.identifier || null,
    customerId: attributes.customer_id ? String(attributes.customer_id) : null,
    variantId: attributes.first_order_item?.variant_id || null
  });

  console.log("lemon-webhook: entitlement upserted", {
    email: attributes.user_email || "",
    unlocked,
    orderId: payload.data?.id || null
  });
  return Response.json({
    ok: true,
    event: eventName,
    unlocked
  }, { headers: corsHeaders });
});
