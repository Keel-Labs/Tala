# Tāla Live-Mode Launch Checklist

Use this when Lemon Squeezy store approval is complete and the project moves from sandbox to live mode.

## Supabase

1. Confirm live Site URL and redirect URLs in Supabase Auth.
2. Turn on custom SMTP for branded Tāla email.
3. Update Supabase Auth email template using [BRANDED_AUTH_EMAIL_TEMPLATE.md](./BRANDED_AUTH_EMAIL_TEMPLATE.md).
4. Confirm `entitlements` table exists in production.
5. Confirm `lemon-webhook` and `lemon-reconcile` are deployed.
6. Confirm function secrets are set:

```text
LEMON_SQUEEZY_WEBHOOK_SECRET
LEMON_SQUEEZY_API_KEY
LEMON_SQUEEZY_STORE_ID
LEMON_SQUEEZY_VARIANT_ID
```

## Lemon Squeezy

1. Switch from test mode to live mode after store approval.
2. Generate a live API key and update `LEMON_SQUEEZY_API_KEY`.
3. Create or update the live webhook endpoint:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/lemon-webhook
```

4. Subscribe to:

```text
order_created
order_refunded
```

5. Confirm the webhook signing secret matches Supabase exactly.
6. Confirm the live product variant matches the configured `LEMON_SQUEEZY_VARIANT_ID`.

## End-to-end verification

1. Sign in with a fresh email.
2. Trigger a real checkout.
3. Complete purchase.
4. Confirm webhook delivery in Lemon.
5. Confirm entitlement row is written in Supabase.
6. Confirm Tāla returns to unlocked Favorite Blends state.
7. Sign out and sign back in.
8. Confirm unlocked status persists only for the entitled account.

## Final public-facing copy check

Before public launch, confirm the site includes:

- listening notice
- support link
- privacy page
- terms page
- refund/payment note

Use [LAUNCH_LEGAL_SUPPORT_COPY.md](./LAUNCH_LEGAL_SUPPORT_COPY.md) as the starting draft.
