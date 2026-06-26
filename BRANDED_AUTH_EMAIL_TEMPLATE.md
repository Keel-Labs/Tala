# Tāla Branded Auth Email

Use this file when configuring Supabase Auth email templates and custom SMTP.

## Why this matters

By default, Supabase sends generic email from `Supabase Auth <noreply@mail.app.supabase.io>`.

For public launch, Tāla should:

- send from a branded address
- mention Tāla in the subject line
- explain the one-click sign-in flow clearly
- avoid sounding like infrastructure email

## Recommended sender setup

Configure custom SMTP in Supabase Auth with:

- Sender name: `Tāla`
- From address: `hello@yourdomain.com` or `auth@yourdomain.com`
- Reply-to: `support@yourdomain.com`

If you do not yet have a dedicated support inbox, use a monitored address temporarily.

## Recommended subject

```text
Sign in to Tāla
```

Alternative:

```text
Your Tāla sign-in link
```

## Recommended preview text

```text
Use this secure link to open your Favorite Blends in Tāla.
```

## Plain-text email copy

```text
Sign in to Tāla

Use the secure link below to sign in to Tāla and open your Favorite Blends.

{{ .ConfirmationURL }}

This link expires shortly and can only be used once.

If you did not request this email, you can safely ignore it.

Tāla
Ephemeral listening for archival discovery
```

## HTML email copy

Use this in the Supabase magic-link template editor:

```html
<h2 style="margin:0 0 16px;font-family:Arial,sans-serif;color:#251634;">Sign in to Tāla</h2>
<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#4f4360;">
  Use the secure link below to sign in to Tāla and open your Favorite Blends.
</p>
<p style="margin:0 0 24px;">
  <a
    href="{{ .ConfirmationURL }}"
    style="display:inline-block;padding:12px 20px;border-radius:8px;background:#ff5b7c;color:#fff7e8;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;"
  >
    Sign in to Tāla
  </a>
</p>
<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#6c5d78;">
  This link expires shortly and can only be used once.
</p>
<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#6c5d78;">
  If you did not request this email, you can safely ignore it.
</p>
```

## Supabase template notes

For the magic-link flow, the key token you need is:

```text
{{ .ConfirmationURL }}
```

Update the template inside:

```text
Supabase -> Authentication -> Templates
```

## Final QA checklist

- Sender shows `Tāla`, not `Supabase Auth`
- Subject mentions `Tāla`
- Button label says `Sign in to Tāla`
- Redirect returns to the correct live URL
- Email looks good in Gmail and Apple Mail
