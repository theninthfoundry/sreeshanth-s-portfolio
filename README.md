# Sreeshanth Namireddy — Portfolio & Visual Sketchbook

A cinematic, editorial web portfolio combining classical linework, surrealist collage, and modern WebGL depth composition.

## Highlights

- **The Gateway**: Text-free cinematic 4K entrance film with fine linework, seamless ambient motion, and icon-only controls.
- **Ascension Through Clouds**: Multi-plane parallax cloud flight synchronized with scroll dynamics.
- **The Rider**: Classical rearing steed linework with elliptical celestial constellation orbit tracing and GPU-accelerated interactive indigo cloth simulation (`cloth-wave.js`).
- **Depth Field**: Interactive 3D WebGL project archive featuring spatial perspective and inertia controls.
- **The Craft (Chapter III)**: Archival studies in physical precision, sub-micron tolerances, and material engineering (horological escapements, Inconel manifolds, and two-needle saddle stitching).
- **The High Contour (Chapter IV)**: Himalayan elevation topography paired with a real-time mountain terrain GitHub activity heatmap (`github-heatmap.js`).
- **Direct Dialogue (Chapter V)**: High-tactility interactive action button and foundry communication telemetry.
- **Celestial Star Cursor**: Minimalist four-point star cursor with difference-blend inversion and contextual inertia (`star-cursor.js`).
- **Inside the Sketchbook**: Tactile reading room featuring archival bookcloth bindings and high-resolution folios.
- **Universal Viewer**: Full-screen clipping lightbox with double-click zoom, touch gestures, and keyboard navigation.

## Run Locally

```bash
python -m http.server 8000 --directory Sreeshanth-Portfolio/dist
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Technologies

- Vanilla ES2022 JavaScript (zero runtime dependencies)
- WebGL & GLSL Shaders for 3D depth field
- CSS Custom Properties & Responsive Viewports (`svh`/`dvh`)
- High-Efficiency H.264 / NVENC Video Encoding

## Architecture & Materiality

- **Pure Vanilla Stack**: Zero framework runtime overhead; sub-millisecond DOM responsiveness.
- **Dual Pipeline Simulation**: 60fps wave-equation cloth ripple (`cloth-wave.js`) alongside spatial 3D geometry (`work-orbit.js`).
- **Autonomous Activity Terrain**: Edge-cached GraphQL telemetry with deterministic fallbacks (`github-heatmap.js`).
- **Celestial Cursor Engine**: Difference-blended pointer kinematics with spring-damped trajectory smoothing (`star-cursor.js`).
