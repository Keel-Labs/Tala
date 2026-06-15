# Tala

Tala is an ephemeral listening prototype for pairing archival Indian music streams with original generated beats.

## Prototype

Open the local prototype at:

http://127.0.0.1:4173/

The current prototype demonstrates:

- Official SoundCloud embeds for Archive of Indian Music streams.
- Original generated beat patterns using the browser's Web Audio API.
- Random Blend, which selects a stream and beat and starts live co-playback from a user click.
- Co-located stream, beat, blend, and stop controls beside the SoundCloud player.
- Full-archive discovery through SoundCloud search, plus paste-to-load for any SoundCloud track URL.
- A longer preloaded AIM queue, plus locally persisted pasted SoundCloud streams.
- Expanded generated beat library across lo-fi, tabla-fusion, garage, dub, trap, and EDM styles.
- Search for archival streams and beat patterns.
- Stream volume through the SoundCloud embed, plus beat volume, tempo, and swing feel controls.
- Favorite blends, storing only the source URL, beat choice, and slider settings in local browser storage.
- No export, download, capture, or combined audio rendering.

## Product Guardrail

The first experience is live co-playback, not stored remixing. Archival audio stays in the original streaming embed, and Tala only plays a separate beat beside it.
