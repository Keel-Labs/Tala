# Tāla

Tāla is an ephemeral listening tool for pairing archival Indian music streams with original generated beats.

## App

Open the local app at:

http://127.0.0.1:4173/

Tāla includes:

- Official SoundCloud embeds for Archive of Indian Music streams.
- Original beat patterns using the browser's Web Audio API.
- Random Blend, which selects a stream and beat and starts live co-playback from a user click.
- Co-located stream, beat, blend, and stop controls beside the SoundCloud player.
- Full-archive discovery through SoundCloud search, plus paste-to-load for any SoundCloud track URL.
- A longer preloaded AIM queue, plus saved pasted SoundCloud streams.
- Expanded generated beat library across lo-fi, tabla-fusion, garage, dub, trap, and EDM styles.
- Search for archival streams and beat patterns.
- Stream volume through the SoundCloud embed, plus beat volume, tempo, and swing feel controls.
- Favorite Blends for saving blend settings; Tāla saves only the source URL, beat choice, and slider settings.
- Supabase passwordless email auth for creating or opening Favorite Blends.
- Supabase Edge Functions for Lemon Squeezy webhook handling and payment reconciliation.
- No export, download, capture, or combined audio rendering.

## Product Guardrail

The first experience is live co-playback, not stored remixing. Archival audio stays in the original streaming embed, and Tāla only plays a separate beat beside it.

## Auth and Payments

See [AUTH_AND_PAYMENTS.md](./AUTH_AND_PAYMENTS.md) for the account library, Supabase Edge Functions, and Lemon Squeezy one-time lifetime unlock flow.
