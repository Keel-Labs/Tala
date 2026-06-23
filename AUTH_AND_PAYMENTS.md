# Tāla Auth and Payments Plan

## Goal

Tāla should let listeners save Favorite Blend settings to an account. The app should save only configuration:

- Source stream URL
- Beat ID
- Stream volume
- Beat volume
- Tempo
- Swing

It should not save, render, download, or redistribute archival audio.

## Recommended Flow

1. User explores Tāla without an account.
2. User clicks Favorite.
3. Tāla asks the user to continue with email.
4. If the user has not unlocked Favorite Blends, Tāla presents a one-time $5.99 unlock.
5. User completes Lemon Squeezy checkout.
6. Lemon Squeezy sends a webhook to Supabase Edge Functions.
7. The webhook verifies the signature and writes an unlocked entitlement row for the buyer email.
8. When Tāla opens again, it reads the entitlement row and unlocks Favorite Blends.
9. If a payment happened before the webhook was live, Tāla can reconcile the signed-in email against Lemon Squeezy orders and backfill the unlock.

## Supabase Auth Setup

Tāla uses Supabase Auth for passwordless email login.

1. Create a Supabase project.
2. In Supabase Auth URL configuration, set the Site URL to the public Tāla URL.
3. Add local and production redirect URLs:

```text
http://127.0.0.1:4173/
https://keel-labs.org/Tala/
```

4. Copy the project URL and publishable key into `index.html`:

```js
const supabaseConfig = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY"
};
```

The publishable key is intended for browser use, but database access must still be protected with Row Level Security.

## Real Unlock Architecture

This repo now includes:

- `supabase/migrations/20260616_create_entitlements.sql`
- `supabase/functions/lemon-webhook/index.ts`
- `supabase/functions/lemon-reconcile/index.ts`

The frontend does two things after sign-in:

1. Reads the `entitlements` table for the signed-in user email.
2. If checkout was just started and no unlock is found yet, calls `lemon-reconcile` to look up the latest Lemon Squeezy order for that email.

### Entitlements table

The `entitlements` table stores:

- user email
- optional Supabase user id
- one-time unlock boolean
- Lemon Squeezy order metadata

Users can only read their own entitlement row through RLS.

### Webhook function

`lemon-webhook` should be used as the Lemon Squeezy webhook destination.

It:

- verifies the `X-Signature` HMAC
- accepts `order_created`
- accepts `order_refunded`
- filters to your configured store / variant if those env vars are set
- upserts the entitlement row by buyer email

### Reconcile function

`lemon-reconcile` is a signed-in recovery endpoint for the app.

It:

- verifies the current Supabase user from the bearer token
- calls Lemon Squeezy Orders API with `filter[user_email]`
- finds a paid order for the configured product
- upserts the entitlement row

This is especially useful when:

- someone paid before the webhook was turned on
- webhook delivery was delayed
- the user comes back from checkout and wants to force a sync immediately

## Backend Responsibilities

Minimum backend tables:

```text
users
- id
- email
- created_at

entitlements
- user_id
- email
- lifetime_saves_unlocked
- lemon_squeezy_order_id
- updated_at

favorite_blends
- id
- user_id
- track_url
- track_title
- beat_title
- beat_index
- stream_volume
- beat_volume
- tempo
- swing
- created_at
```

## Launch Requirements

The frontend and Supabase function scaffolding are now in place, but launch still requires configuration:

1. Run the SQL migration in Supabase.
2. Deploy both Edge Functions.
3. Set these Supabase function secrets:

```text
LEMON_SQUEEZY_WEBHOOK_SECRET=
LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=          optional but recommended
LEMON_SQUEEZY_VARIANT_ID=        optional but recommended
```

4. Create a Lemon Squeezy webhook pointing to:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/lemon-webhook
```

5. Subscribe that webhook to at least:

```text
order_created
order_refunded
```

6. Keep Favorite Blends storage on the server keyed by authenticated user ID.
7. Publish Terms, Privacy, and refund/support language before taking payments broadly.
