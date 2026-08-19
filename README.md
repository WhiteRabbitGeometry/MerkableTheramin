# Musical Atlas Relational Lattice — v2.1.0

Official public working-model release.

## Naming

- **Musical Atlas Relational Lattice** — infrastructure.
- **ROCK / Petrified Core** — invariant inner lattice.
- **Rick** — dynamic outer relational system.
- **Mercabarina** — relative-motion function.
- **Atlas Relational Ocarina** — instrument produced from persistent Mercabarina observation.
- **Merkable Theramin** — internal-field performance/mixer layer.
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

## v2.1.0 UI changes

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


## v2.1.0 audio-routing correction

- Geometry is continuous and cannot be stopped.
- Perform `Stop` is replaced by **Mute Geometry / Listen Geometry**.
- A separate **Mute Mercs / Listen Mercs** isolates saved/event-train playback.
- A and B are now muted at source generation rather than only through UI state.
- A/B mute state remains synchronized across Geometry, Ocarina, and Perform.
- `auto-sonify geometry` is the automatic Click/Ding scanner toggle.


## v2.1.0 mixer/UI correction

- Merc = Mathematical Endogenic Relational Carrot.
- Merkable is retained as the relational capability term.
- Geometry and Perform now have local CLICK / DING / BELL / NO BELL indicators.
- All active mode selectors receive a full-box state.
- Perform has independent Geometry, Merc, and master audio mutes.
- Merc playback is explicitly routed through the Merc bus.
- Per-Merc mute state is excluded from selected playback.
- Independent Ocarina and Perform looping remains permitted.


## v2.1.0 coordinate-input refinement

The v2.1.0 engine is unchanged. Geometry and Perform now expose editable A/B reference coordinates at the top of their modules. Dragging a reference updates the numeric fields; typing coordinates moves the reference point. This makes exact states such as A=(0.50,0.50), B=(0.50,0.51) reproducible.


## v2.1.0 Reference Metronomes

- Save the current A/B coordinate pair as a named reference preset.
- Recall a preset to move the live A/B references exactly back to that address.
- Arm one or more presets without moving the live pair.
- Armed presets continue scanning the rotating geometry as independent reference metronomes.
- Multiple armed reference metronomes may Click/Ding/Bell against the same shells concurrently.
- Armed reference locations are shown as faint ghost markers.
- Reference presets use `sessionStorage`: they survive a page reload in the same browser tab/session, but are not yet permanent user data.


## v2.1.0 Portable Data
- `.mld` — Mutable Lattice Data: reconstructible geometry, references, reference metronomes, transport, event train, Mercs, and routing state.
- `.pms` — Persistent Merc Songbook: portable collection of Mercs.
- WAV — lossless 44.1 kHz / 16-bit PCM render of the current Ocarina event train. WAV is a render, not the authoritative lattice source.
- `player/index.html` — self-contained local MLD/PMS player with WAV export.
- The same root ZIP is intended for both GitHub Pages and itch.io HTML5 hosting.


## v2.1.0 Merc workspace refinement
- Save MLD and Save PMS moved into the Saved Mercs workspace.
- Saved Mercs can be renamed by double-clicking their names.
- Captured reference paths retain a distinct path name and can be renamed independently.
- Ocarina event order is CLICK → DING → NO BELL → BELL.
- Bell is gold, locked, and visibly non-clickable because it is threshold-generated.


## v2.0.0 public-generation cleanup
- Correct nomenclature: **Merkable** (Merkaba / capable of being Merked) versus **Merc** (carrot object).
- Visible in-application public version badge.
- Canonical event order: CLICK → DING → NO BELL → BELL.
- Incidence map is now an audible inspection surface: node inspection produces local Ding; bridge inspection can manually ring the otherwise threshold-generated Bell.
- Incidence event state illuminates locally.
- Geometry registrations leave temporary visual traces.
- Ocarina event-train playback highlights the active train position.
- A/B audio mute controls removed: A/B are geometric contributors, not independent sound channels.
- Ocarina uses a single metronome/audio toggle.
- MLD/PMS/WAV persistence controls live inside Perform.
- Rainbow Harmonium link centralized in Perform.


## v2.1.0 — four-tab synthesis

**2D Incidence**
- Removed static architecture metrics and persistence/player clutter.
- Event order is CLICK → DING → NO BELL → BELL.
- A₄/C₅ interactions illuminate their relevant incidence structure.
- C₂ bridge is directly clickable as an inspection Bell.

**3D Geometry**
- Removed A/B audio mutes.
- Rotate is explicitly Rotate / Pause.
- Reference Metronome has a shared Mute / Unmute control.
- Auto-Sonify Geometry controls automatic geometry audio; geometry still evaluates visually when silent.
- Paused geometry may be rotated manually by dragging.
- Click/Ding/Bell registrations leave fading connective traces.

**Ocarina**
- Removed redundant A/B mutes and persistence controls.
- Pads remain CLICK → DING → NO BELL → BELL, with Bell locked/threshold-generated.
- Event train highlights the active step during playback.

**Perform**
- Removed A/B audio mutes and static architecture metrics.
- Shares the Reference Metronome mute state with Geometry.
- Incidence remains interactive, including C₂ inspection Bell.
- Geometry retains manual paused rotation and registration traces.
- MLD / PMS / WAV / Rainbow Harmonium controls live inside Perform above Mercs.


## v2.1.1 — public hotfix
- Fixed Geometry animation/runtime failure caused by the `drawGeometry` Boolean parameter shadowing the browser `performance` API used by trace timing.
- Restores automatic rotation, Speed A/B, Ripple, Scan Rate, Geometry Theremin rendering in Perform, and reference-metronome scanning.
- Clicking incidence space that is not an A₄ node, C₅ gate, or C₂ bridge now produces an explicit NO BELL event and brief visual pulse.


## v2.1.2 — interaction/runtime hotfix
- Incidence and Ocarina: left click plays low octave; right click plays high octave.
- Empty Incidence space explicitly plays NO BELL in low/high octave.
- NO BELL redesigned as an audible thunk that survives laptop/phone speakers.
- Geometry: left click nudges yellow/A shell 15°; right click nudges blue/B shell 15°.
- Paused drag manually rotates geometry; running drag moves the reference.
- Geometry frame loop is fail-safe so one rendering exception cannot permanently freeze animation.
- Auto-Sonify controls moving-geometry sound. Shared Reference Metronome mute controls armed saved metronomes independently.
- Manual Bell pad remains locked; supporter unlock is reserved for a future payment-enabled release.


## v2.1.3
- A/B reference points are directly draggable on Geometry and Perform Geometry.
- Off-point left click/drag controls yellow/A shell; right click/drag controls blue/B shell.
- Incidence, Ocarina and Perform share canonical CLICK/DING/NO BELL event generators.
- Ocarina CLICK/DING/NO BELL button identities normalized.
- Event-train highlighting is observer-only and transport playback is repaired.


## v2.1.4 — Geometry interaction only
- No changes to Incidence, Ocarina, or Perform behavior.
- A and B anchors are small direct drag targets.
- Everywhere else on Geometry: left click/drag controls yellow/A shell; right click/drag controls blue/B shell.
- Clicking or dragging Geometry never manually plays an event sound.
- Geometry audio remains generated only by automatic registration/scan events.


## v2.1.5 — canonical event semantics
- Removed the redundant Reference Metronome mute control.
- Geometry anchor/shell interaction is unchanged from v2.1.4.
- CLICK and DING semantics are corrected globally:
  - CLICK = rarer / outer / vertex-style registration.
  - DING = more frequent / inner / resonant registration.
- 2D Incidence node mapping updated to match the corrected event semantics.
- Ocarina, Perform, saved-reference scanning, and event-train playback inherit the same canonical mapping.
