# Sreeshanth Namireddy — Complete Portfolio

This archive contains the complete current published website, including every tracked source file and local asset, unchanged.

## Run locally

Extract the ZIP, open a terminal in this folder, then run:

```sh
python3 -m http.server 8000 --directory dist
```

On Windows, use `py -m http.server 8000 --directory dist` if needed.
Open http://localhost:8000 in your browser. Click the central star to enter.

No npm installation or build step is required. The HTML, CSS and JavaScript in dist are the actual source, not generated bundles.

## File guide

- dist/index.html — main portfolio and entry markup
- dist/style.css — styling and animation styles
- dist/app.js — entry, video playback, scrolling and main interactions
- dist/work-orbit.js — interactive project archive
- dist/sketchbook.html and dist/sketchbook.js — separate sketchbook
- dist/viewer.js — image viewer interactions
- dist/art/ — artwork, project visuals, clouds, star, stickers and fonts
- dist/original/ — original reference images
- dist/media/gateway-original.mp4 — unchanged gateway video
- .openai/hosting.json — existing Sites hosting configuration
- FILES-SHA256.txt — complete source file inventory and integrity hashes

## Hosting

Serve dist as the website root on any static host. Keep the folder structure intact so relative asset paths continue working. The included hosting manifest identifies the existing Sites project; use your own project configuration for a separate deployment.

The hero now uses a 3840 x 1800 Lanczos upscale with light sharpening and cropped video edges to remove baked black bars and the lower watermark. CSS cover fills the viewport and may crop to its aspect ratio. The 720p original remains included; the upscale is not native 4K detail. A silent forward/reverse ambient clip keeps the original birds moving after the entrance. Cloud layers dissolve and part without a circular mask. The horse image scale is multiplied by 0.85; surrounding controls and layout are retained. Two empty 100svh sections before the footer use blurred blue cloth. See dist/app.js, dist/style.css and dist/index.html for these changes.

All tracked project files are included. Git history, temporary preview tooling, and credentials are excluded. This is the current implementation, not a claim that it has no bugs or that reference artwork has a transferable license.

Source commit: fdcd268106436bda6b14906ec609fdac959d88e7
