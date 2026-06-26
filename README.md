# Tāla

Tāla is an ephemeral listening tool for pairing archival Indian music streams with original browser-made beats.

## App

Open the local app at:

http://127.0.0.1:4173/

Tāla includes:

- Official SoundCloud embeds for Archive of Indian Music streams.
- Original beat patterns using the browser's Web Audio API.
- Random Blend, which selects a stream and beat and starts live co-playback from a user click.
- A single Play Blend toggle plus Random Blend and Favorite Blend actions.
- Curated AIM shelves for discovery, plus paste-to-load for SoundCloud and Spotify URLs.
- A larger preloaded AIM queue across Hindustani, Carnatic, Qawwali, Theatre, and Tagore shelves.
- Expanded beat library across lo-fi, tabla-fusion, garage, dub, trap, and EDM styles.
- Search for archival streams and beat patterns.
- Stream volume through the SoundCloud embed, plus beat volume, tempo, and swing feel controls.
- Favorite Blends for saving blend settings; Tāla saves only the source URL, beat choice, and slider settings.
- Supabase passwordless email auth for creating or opening Favorite Blends.
- Supabase Edge Functions for Lemon Squeezy webhook handling and payment reconciliation.
- No export, download, capture, or combined audio rendering.

## Product Guardrail

The first experience is live co-playback, not stored remixing. Archival audio stays in the original streaming embed, and Tāla only plays a separate beat beside it. Tāla does not own the underlying archive recordings or their rights.

## Auth and Payments

See [AUTH_AND_PAYMENTS.md](./AUTH_AND_PAYMENTS.md) for the account library, Supabase Edge Functions, and Lemon Squeezy one-time unlock flow.

## Launch Assets

- [BRANDED_AUTH_EMAIL_TEMPLATE.md](./BRANDED_AUTH_EMAIL_TEMPLATE.md)
- [LIVE_MODE_CHECKLIST.md](./LIVE_MODE_CHECKLIST.md)
- [LAUNCH_LEGAL_SUPPORT_COPY.md](./LAUNCH_LEGAL_SUPPORT_COPY.md)
