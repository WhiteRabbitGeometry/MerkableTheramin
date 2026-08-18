# Musical Atlas Relational Lattice — v1.5

Official public working-model release.

## Naming

- **Musical Atlas Relational Lattice** — infrastructure.
- **ROCK / Petrified Core** — invariant inner lattice.
- **Rick** — dynamic outer relational system.
- **Mercabarina** — relative-motion function.
- **Atlas Relational Ocarina** — instrument produced from persistent Mercabarina observation.
- **Mercable Theramin** — internal-field performance/mixer layer.
- **Merc** — reusable/adaptive relational musical unit.
- **Joker** — irreducible connective participle.
- **Bell Bridge** — recurrent bridge relation revealed by Bell sequences.

## Merc / Joker logic

A Merc is treated as an **OR unit**: it can stand alone and adapt among alternative contexts.

A Joker is treated as an **AND unit**: it carries the irreducible connective relation.

Only Mercs connect to Jokers by default. Joker is not universal glue.

Together:

`Merc + Joker = AND–OR interstice`

This preserves connectivity without collapsing the lattice into universal equivalence.

## v1.5 UI changes

- `ROCK: PETRIFIED`
- `BELL BRIDGE: NO BELL`
- Removed runtime dependency on `data/core.json`; public petrified metrics are compiled directly into the release.
- A and B voices can be muted independently in Geometry, Ocarina, and Perform.
- Geometry continues rotating even when a voice is muted.
- Numeric readouts added for Speed A, Speed B, Ripple, and Scan Rate.
- Ripple is bipolar around homeostasis (`negative ↔ 0 ↔ positive`).
- `Tracks` renamed to **Mercs** in the public interface.
- Live CLICK / DING / BELL / NO BELL words visibly flash when events fire.
- Perform remains the merged performance surface.

## Petrified public metrics

- A₄ sectors: 5
- C₃ bridges: 10
- C₅ gate frames: 6
- minimum A₄→C₅ departure: 72°

These values are compiled into the public model. `data/core.json` remains in the repository as a machine-readable record, but the browser does not need to fetch it to operate.

## Deployment

Replace the full contents of the GitHub Pages repository with this package in one pull request.

After merge/deploy, hard refresh once on devices that previously loaded older releases.

No build step or external libraries are required.


## v1.5 audio-routing correction

- Geometry is continuous and cannot be stopped.
- Perform `Stop` is replaced by **Mute Geometry / Listen Geometry**.
- A separate **Mute Mercs / Listen Mercs** isolates saved/event-train playback.
- A and B are now muted at source generation rather than only through UI state.
- A/B mute state remains synchronized across Geometry, Ocarina, and Perform.
- `auto-sonify geometry` is the automatic Click/Ding scanner toggle.


## v1.5 mixer/UI correction

- Merc = Mathematical Endogenic Relational Carrot.
- Mercable is retained as the relational capability term.
- Geometry and Perform now have local CLICK / DING / BELL / NO BELL indicators.
- All active mode selectors receive a full-box state.
- Perform has independent Geometry, Merc, and master audio mutes.
- Merc playback is explicitly routed through the Merc bus.
- Per-Merc mute state is excluded from selected playback.
- Independent Ocarina and Perform looping remains permitted.


## v1.5 coordinate-input refinement

The v1.5 engine is unchanged. Geometry and Perform now expose editable A/B reference coordinates at the top of their modules. Dragging a reference updates the numeric fields; typing coordinates moves the reference point. This makes exact states such as A=(0.50,0.50), B=(0.50,0.51) reproducible.


## v1.5 Reference Metronomes

- Save the current A/B coordinate pair as a named reference preset.
- Recall a preset to move the live A/B references exactly back to that address.
- Arm one or more presets without moving the live pair.
- Armed presets continue scanning the rotating geometry as independent reference metronomes.
- Multiple armed reference metronomes may Click/Ding/Bell against the same shells concurrently.
- Armed reference locations are shown as faint ghost markers.
- Reference presets use `sessionStorage`: they survive a page reload in the same browser tab/session, but are not yet permanent user data.


## v1.5 Portable Data
- `.mld` — Mutable Lattice Data: reconstructible geometry, references, reference metronomes, transport, event train, Mercs, and routing state.
- `.pms` — Persistent Merc Songbook: portable collection of Mercs.
- WAV — lossless 44.1 kHz / 16-bit PCM render of the current Ocarina event train. WAV is a render, not the authoritative lattice source.
- `player/index.html` — self-contained local MLD/PMS player with WAV export.
- The same root ZIP is intended for both GitHub Pages and itch.io HTML5 hosting.
