import { createClient } from "jsr:@supabase/supabase-js@2";

export type LemonOrderAttributes = {
  customer_id?: number | string | null;
  first_order_item?: {
    variant_id?: number | null;
    product_name?: string | null;
    variant_name?: string | null;
  } | null;
  identifier?: string | null;
  refunded?: boolean | null;
  status?: string | null;
  store_id?: number | null;
  test_mode?: boolean | null;
  updated_at?: string | null;
  user_email?: string | null;
};

export function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function createAdminClient() {
  const url = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

export async function hmacHex(secret: string, payload: string) {
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

export async function verifyWebhookSignature(request: Request, rawBody: string) {
  const signingSecret = getRequiredEnv("LEMON_SQUEEZY_WEBHOOK_SECRET");
  const signature = request.headers.get("X-Signature") || "";
  const digest = await hmacHex(signingSecret, rawBody);
  return signature.length > 0 && signature === digest;
}

export function matchesConfiguredProduct(attributes: LemonOrderAttributes) {
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

export async function upsertEntitlementFromOrder(args: {
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
