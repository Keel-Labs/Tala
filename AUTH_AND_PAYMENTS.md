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
6. Lemon Squeezy sends a webhook to the backend.
7. Backend verifies the webhook signature and marks the user as `lifetime_saves_unlocked`.
8. User can save and reload blend settings across devices.

## Supabase Auth Setup

Tāla uses Supabase Auth for passwordless email login.

1. Create a Supabase project.
2. In Supabase Auth URL configuration, set the Site URL to the public Tāla URL.
3. Add local and production redirect URLs:

```text
http://127.0.0.1:4173/
https://keel-labs.org/Tala/
```

4. Copy the project URL and anon public key into `index.html`:

```js
const supabaseConfig = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY"
};
```

The anon key is intended for browser use, but database access must still be protected with Row Level Security.

## Lemon Squeezy Integration

Use Lemon Squeezy checkout for the $5.99 Favorite Blends unlock.

Do not put Lemon Squeezy API keys in the browser. The browser should call a backend endpoint such as:

```text
POST /api/billing/create-checkout
```

The backend creates the Lemon Squeezy checkout and passes the authenticated user ID in checkout custom data.

Relevant Lemon Squeezy behavior:

- Checkout creation supports `checkout_data.custom`, which can include a `user_id`.
- Checkout options can enable an embedded checkout overlay.
- Webhooks should be used to confirm successful payment.

## Backend Responsibilities

Minimum backend tables:

```text
users
- id
- email
- created_at

entitlements
- user_id
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

Minimum endpoints:

```text
POST /api/auth/magic-link
GET /api/auth/callback
POST /api/billing/create-checkout
POST /api/billing/lemon-squeezy-webhook
GET /api/me
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
```

## Launch Requirements

The static app includes the production-facing account and unlock flow, but a real launch needs these services behind it:

- Email magic-link authentication or another passwordless auth provider.
- Server-side Lemon Squeezy checkout creation when custom user metadata is needed.
- Lemon Squeezy webhook verification before granting `lifetime_saves_unlocked`.
- Server-side Favorite Blends storage keyed by authenticated user ID.
- Public Terms, Privacy, and refund/support language before taking payments at scale.
