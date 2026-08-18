# Musical Atlas Relational Lattice — v1.0

Official first public working-model release of the playable Musical Atlas Relational Lattice.

## Naming hierarchy

- **Musical Atlas Relational Lattice** — core infrastructure.
- **Merkabarina** — the function produced by the relative movement of the relational structures.
- **Atlas Relational Ocarina** — the instrument created from persistent observation of Merkabarina events.
- **Merkable Theramin** — the mixer/performance function that combines live geometry, incidence, event trains, and reference-point performance.
- **Merk** — planned persistent musical stem / saved relational phrase.
- **re-Merk** — a Merk reused, transformed, layered, or remixed.
- **Re-Merkable Theramin** — planned future persistent/import-export version.

`Theramin` with an **A** is intentionally the internal-field instrument term. Conventional `Theremin` with an **E** remains the external-field instrument.

## v1.0 views

1. **2D Incidence**
2. **3D Geometry**
3. **Ocarina**
4. **Perform**

The standalone exploratory layers are solo surfaces. Perform is the explicit mixer.

## Musical behavior

- Two movable reference points select pentatonic degrees and octaves.
- Relative geometry contributes harmonic lock or controlled dissonance.
- Geometry generates Click/Ding observations automatically.
- Bell is never directly programmable; it emerges only when integration crosses threshold.
- Ocarina event trains may be reordered, looped, and saved for the current session.
- Perform mixes saved trains, live pads, incidence, and live geometry references.
- Reference-generated phrases may be captured as event trains.
- Captured Bell events are displayed but are not stored as direct Bell instructions.

## v1.0 reliability changes

v0.4 exposed a deployment/cache failure mode: a browser could temporarily receive the new `index.html` while still using an older cached `app.js`, causing the old script to fail on controls that no longer existed.

v1.0 therefore adds:

- cache-busted `styles.css?v=1.0.0` and `app.js?v=1.0.0`;
- no-store loading of `core.json?v=1.0.0`;
- a fail-safe tab router embedded in `index.html`;
- defensive optional-control binding;
- runtime diagnostics that do not disable basic navigation.

The display should therefore remain navigable even if an individual audio/geometry module reports an error.

## Deployment

Upload the full contents of this directory to the GitHub Pages repository root in one pull request and merge.

After GitHub Pages deploys, do one hard refresh on devices that previously loaded v0.4.

No build step or external libraries are required.
