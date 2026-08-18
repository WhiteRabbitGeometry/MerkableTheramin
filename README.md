# Atlas Lattice Relational Ocarina (Merkable Theramin) v0.4

A static GitHub Pages build of the Atlas Lattice playable display model and geometric sequencer.

## What changed in v0.4

### Four real modes
- 2D Incidence
- 3D Geometry
- Ocarina
- Perform

There is no separate Explore toggle.

### Audio bus behavior
Only the active exploratory layer is audible by itself:
- 3D Geometry = geometry scanner only
- Ocarina = Ocarina sequence only
- Perform = explicitly armed/saved layers mixed together

The 3D Geometry view never writes scanner events into the Ocarina train.

### Dual-reference harmonic engine
Each mirrored shell now has its own draggable reference point:
- Gold A reference
- Blue B reference

Each point selects a pentatonic degree and octave from its screen position.

The relative geometry/shell phase determines whether the interval is harmonically locked or receives controlled detuning/dissonance.

### Geometry scan
- Adjustable scan rate
- Automatic Click/Ding generation
- Bell remains threshold-generated
- Standalone Geometry is audible but non-recording

### Ocarina
- Click / Ding / No Bell composition
- Bell cannot be programmed
- Reorder event chips
- Save event trains for the current session
- Loop playback
- Independent Click/Ding/No-Bell rates
- Live Bell threshold and integration growth

### Perform
- Geometry theremin with both live references
- Incidence layer
- Live Ocarina pads
- Saved tracks
- Per-track Mute / Solo
- Loop all audible tracks
- Capture live reference-generated Click/Ding/Bell event path
- Save captured reference phrase as a new event train
- Optional fading reference trails and captured event-path display

Captured Bells remain visible in the captured phrase, but are not written into saved replay trains. Bell is always recomputed from the live threshold.

## Deploy

Replace the contents of your existing GitHub Pages repo with this folder and commit/push, or use it as the source branch for a pull request.

No build step, package manager, backend, or external audio files are required.

## Browser audio note

Browsers require a user gesture before Web Audio may start. Merkable Theramin is logically Sound On by default; the first click/touch/key unlocks audio automatically. The visible control is only Sound On / Muted.
