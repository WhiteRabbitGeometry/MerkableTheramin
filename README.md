# Atlas Lattice Ocarina v0.2

A static, playable display model for the Atlas Lattice.

## What it is

- **2D incidence model** — five A4 sectors, ten C3 relations, six C5 gate frames, and the unresolved C2 attachment socket.
- **3D relational geometry** — paired mirrored dodecahedral carriers that counter-rotate and support ripple deformation.
- **Ocarina / audio instrument** — synthesized Click, Ding, Bell, and No-Bell events using the Web Audio API.
- **Explore mode** — the Bell is gated by accumulated integration.
- **Perform mode** — direct musical control.

The current frozen mathematical source is:

**Atlas Lattice — Draft 2, Revision 12 (Canonical Core Closure)**

The display intentionally distinguishes the frozen core from project-defined operators. The rejected arithmetic-to-geometric bridge remains visibly **NO BELL**.

## GitHub Pages deployment

1. Create a new repository, e.g. `atlas-lattice-ocarina`.
2. Upload all files in this folder to the repository root.
3. Commit / push.
4. In GitHub: **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select your main branch and `/ (root)`.
7. Save.

GitHub will provide the Pages URL after deployment.

## File layout

```text
atlas-lattice-ocarina/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
├── README.md
└── data/
    └── core.json
```

## Audio

Browsers require a user gesture before audio can begin. Press **Enable Audio** once.

The sounds are synthesized in-browser; there are no external audio files.

- Click = local match / local integration
- Ding = partial integration / excitation
- Bell = closure
- No Bell = failed or non-closing registration

## Design rule

**Sound reflects state. Sound does not determine truth.**

The musical instrument may be playful; the mathematical status labels should remain epistemically strict.

## Next development steps

- Map the six C5 gate frames to exact geometric fivefold axes.
- Replace the schematic mirror motion with the frozen SO(3)/A5 scanner law.
- Add a real event-train sequencer and loop controls.
- Add Bird Song as a generative/resonant layer, separate from Bell.
- Add Atlas routing / sonar only as operational layers, never as retrospective proof of the core.


## v0.2 — Loop / modulation engine

The Ocarina now treats a composition as an ordered event train of:

- Click
- Ding
- No Bell

**Bell is not programmable.** During playback, Click and Ding contribute integration energy. When the live threshold is crossed, the Bell emerges.

New controls:

- Play once
- Loop / Stop
- Independent Click rate
- Independent Ding rate
- Independent No-Bell rate
- Live Bell threshold
- Live integration-growth factor

The modulation controls remain live while a loop is running. The sequence order stays fixed, while each event type can stretch or compress its own interval.

This keeps the epistemic rule intact:

> You can compose the evidence. You cannot compose the conclusion.
