# Tala Product Brief

## Overview

Tala is a simple music-mixing tool for reviving archival recordings and historic music. A user drags in a main track, adds beats from a beat library, and quickly creates a fresh version of an old or overlooked recording.

The product should feel approachable and immediate: less like a professional digital audio workstation and more like a focused creative surface for experimenting with sound.

## Product Thesis

There is a large body of archival audio, historic music, field recordings, and older tracks that feels culturally rich but inaccessible to modern listeners. Tala gives creators a lightweight way to reintroduce that material by pairing it with contemporary beats and simple mixing controls.

The unique value is not maximum production power. It is fast creative revival: take something old, hear it differently, and make it feel alive again.

## Target Users

- Music hobbyists who want an easy way to remix tracks without learning a full production suite.
- DJs and beatmakers looking for unusual source material and quick sketching workflows.
- Archivists, educators, and cultural projects that want to make historic recordings more engaging.
- Listeners and creators interested in sampling, preservation, and musical reinterpretation.

## Core Use Case

1. The user opens Tala.
2. The user drags in a main track from their track library or local files.
3. The user drags in a beat from the beat library.
4. Tala aligns the two enough for quick playback and experimentation.
5. The user adjusts the blend and swaps beats until the track feels right.
6. The user saves or exports the mix.

## Core Features

### Track Library

The track library stores the source recordings users want to revive.

Initial capabilities:

- Import audio files by drag and drop.
- Display track title, duration, and basic metadata.
- Mark tracks as archival, historic, personal, or uncategorized.
- Search and filter tracks.
- Drag a track from the library into the main track area.

Future possibilities:

- Collections by era, place, artist, archive, or project.
- Notes about provenance and historical context.
- Public-domain and rights-status indicators.

### Beat Library

The beat library stores loops, drum patterns, and backing tracks that can be layered with source recordings.

Initial capabilities:

- Import beat files by drag and drop.
- Display beat title, BPM when known, duration, and style/tag.
- Preview beats before adding them.
- Search and filter beats.
- Drag a beat into the mix.

Future possibilities:

- Built-in starter beat packs.
- Beat recommendations based on track tempo or mood.
- User-created beat collections.

### Mixing Workspace

The mixing workspace is the main creative surface.

Initial capabilities:

- Main track drop zone.
- Beat drop zone.
- Playback controls: play, pause, restart.
- Volume controls for main track and beat.
- Simple timeline or waveform view.
- Beat swapping without losing the main track.
- Save a mix as a project.

Future possibilities:

- Tempo detection and beat matching.
- Looping, trimming, and cue points.
- Effects such as EQ, reverb, filters, and compression.
- Stems or multi-layer beat arrangements.

### Export and Saving

Initial capabilities:

- Save a project with selected main track, beat, and mix settings.
- Export a finished mix as an audio file.

Future possibilities:

- Export share pages with track notes and source attribution.
- Publish mixes into a community gallery.
- Version history for experiments.

## Design Principles

- Simple first: The user should understand the product within seconds.
- Drag-and-drop as the primary gesture: Mixing should feel physical and direct.
- Respect the source material: Historic audio should be presented with context where possible.
- Fast experimentation: Swapping beats and replaying combinations should be effortless.
- Creative, not technical: Avoid exposing professional audio complexity until it is truly needed.

## Platform Strategy

Tala should start as a SaaS web app. The web is the fastest way to support accounts, cloud libraries, saved projects, sharing, and listening across devices without asking non-technical users to install production software.

Initial platform:

- Web app for creating mixes.
- Cloud account for saved tracks, beats, projects, favorites, and playlists.
- Mobile-friendly listening experience for saved mixes and liked tracks.

Later platform expansion:

- Desktop app for offline work, large local files, and heavier audio processing.
- Mobile app for listening, organizing, favoriting, sharing, and lightweight remix prompts.

## Source Strategy

Tala should distinguish between music that is available to stream, music that is safe to remix, and music that can be commercially reused.

The first editorial focus should be Indian archival music, using Archive of Indian Music as the cultural and curatorial north star while relying only on rights-safe sources for built-in remix material.

Initial source categories:

- User-uploaded tracks and beats.
- Public-domain recordings.
- CC0 and remix-compatible Creative Commons recordings.
- Curated starter packs with clear rights.

Potential archival and cultural sources:

- Internet Archive audio collections.
- Library of Congress audio collections and public-domain recordings.
- Europeana public-domain and CC0 audiovisual records.
- Freesound for loops, field recordings, textures, and beat-building material.
- Archive of Indian Music as a culturally aligned inspiration and potential partnership source.

Archive of Indian Music is especially aligned with Tala's mission because it preserves gramophone recordings of India across Hindustani classical, Carnatic classical, theatre, early cinema, folk, and other traditions. However, AIM's website currently states that tracks are streaming-only unless otherwise mentioned, and that download or commercial misuse is prohibited. Tala should not treat AIM as a default remixable source without explicit permission or a partnership.

Rights requirements:

- Store source URL, archive name, license, rights note, and attribution for every imported catalog track.
- Show a plain-language rights status such as "Safe to remix," "Listen only," or "Needs permission."
- Allow export and sharing only when the source rights support the intended use, or when the user confirms they own/have permission for uploaded material.
- Preserve attribution in saved projects and shared pages.

## MVP Scope

The first version should prove that users can create a compelling mix from one source track and one beat.

Must-have:

- Track import and track library.
- Beat import and beat library.
- Drag-and-drop selection for one main track and one beat.
- Basic playback of both audio layers.
- Independent volume controls.
- Cloud account and saved project state.

Nice-to-have:

- Waveform display.
- Beat preview in the library.
- BPM metadata.
- Basic search and tags.
- Export to audio.
- Mobile-friendly library and listening view.

Out of scope for MVP:

- Multi-track professional editing.
- Marketplace or public community.
- Advanced effects.
- Automatic rights management.
- Native desktop or mobile apps.

## Success Metrics

Early success should focus on whether people can quickly make something that feels worth saving.

- Activation: Percentage of users who import at least one track and one beat.
- Creation: Percentage of users who play a combined mix.
- Save rate: Percentage of users who save a project.
- Time to first mix: Median time from opening the app to hearing a combined track and beat.
- Repeat use: Percentage of users who return to create another mix within 7 days.

## Positioning

Tala is for people who want to make old music feel new again.

It is not trying to replace Ableton, Logic, Serato, or other professional tools. It is a focused creative instrument for exploring archival audio through modern rhythm, mood, and texture.

## Open Questions

- What kinds of archival recordings should the first experience emphasize: public-domain music, field recordings, speeches, radio archives, personal collections, or all of the above?
- Should Tala ship with sample archival tracks and beat packs, or should users bring all content themselves?
- How important is automatic beat matching for the first usable version?
- Should the product foreground historical context and attribution, or keep the first experience purely creative?
- Which sources are safe enough for a built-in starter catalog?
- Would Archive of Indian Music or similar archives be open to a remix-focused partnership, or should Tala only link out for listening?
