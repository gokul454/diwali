# Swathi's Diwali Magic ✨

A responsive, interactive Diwali greeting experience built with React, Vite, Three.js / React Three Fiber and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Customize the greeting

Edit `src/App.jsx`:
- Change the personal letter in the `.letter` section.
- Change the final wish in `.final-section`.
- Update the sender sign-off in the footer.
- Add Swathi's photo by adding an image to `public/` and placing an `<img>` in the hero or letter section.

## Notes
- The 3D diya is interactive: drag to orbit slightly and tap the lamp or its button to light it.
- Rangoli, envelope, fireworks and final wish are interactive.
- Mobile layout and reduced-motion preferences are supported.
- The sound toggle is a visual placeholder; no audio is bundled.
