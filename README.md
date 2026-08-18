# Musical Atlas Relational Lattice — v1.2

Official public working-model release.

## Naming

- **Musical Atlas Relational Lattice** — infrastructure.
- **ROCK / Petrified Core** — invariant inner lattice.
- **Rick** — dynamic outer relational system.
- **Merkabarina** — relative-motion function.
- **Atlas Relational Ocarina** — instrument produced from persistent Merkabarina observation.
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

## v1.2 UI changes

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


## v1.2 audio-routing correction

- Geometry is continuous and cannot be stopped.
- Perform `Stop` is replaced by **Mute Geometry / Listen Geometry**.
- A separate **Mute Mercs / Listen Mercs** isolates saved/event-train playback.
- A and B are now muted at source generation rather than only through UI state.
- A/B mute state remains synchronized across Geometry, Ocarina, and Perform.
- `auto-sonify geometry` is the automatic Click/Ding scanner toggle.
