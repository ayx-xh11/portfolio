# Ayush Jaiswal — Portfolio

A production-focused personal portfolio built with semantic HTML, modern CSS, and dependency-free JavaScript. Its signature interaction is a field of square cells that responds to pointer movement with a localized downward gravity effect while the content remains stable.

## Design foundation

The site extends the original portfolio's visual language:

- Segoe UI system font stack
- `#111111` page background
- translucent charcoal navigation
- white and accessible gray typography
- thin `#27272a` borders
- compact rounded cards and a centered layout

The navbar is deliberately excluded from the gravity field. Motion is progressive enhancement: touch devices and visitors who prefer reduced motion receive the complete static design.

## Project structure

```text
src/
  assets/
    favicon.svg
  css/
    style.css
  js/
    app.js
    gravity-grid.js
  index.htm
tests/
  site.test.mjs
PRD.md
```

## Local preview

From the `website` directory, serve the `src` folder with any static file server. With Python installed:  

```powershell
py -3 -m http.server 4173 --directory src
```

Then open `http://127.0.0.1:4173/`.

## Checks

The test suite has no third-party dependencies. It verifies local asset references, internal navigation targets, unique IDs, semantic landmarks, accessibility fallbacks, and removal of starter placeholders.

```powershell
npm test
```

## Updating portfolio content

Portfolio content is currently authored directly in `src/index.htm` so it remains crawlable and readable without JavaScript.

Before launch, replace the in-progress project and milestone copy with verified details:

- project problem, contribution, result, technologies, source, and live links
- awards, certifications, and milestones with issuer, date, and verification links
- final biography, availability, and preferred social profiles
- resume link once the final file is available

Do not add unsupported proficiency percentages or unverified claims. The complete content requirements and acceptance criteria are in `PRD.md`.

## Interaction architecture

`gravity-grid.js` renders a fixed, viewport-sized canvas beneath the page content. It:

- caps device pixel ratio to limit GPU and memory cost
- batches pointer updates through `requestAnimationFrame`
- moves only cells within a local influence radius
- animates transforms within the canvas rather than changing document layout
- stops requesting frames after the cells settle
- resets immediately when reduced motion is enabled
- ignores touch-pointer movement so scrolling remains natural

If JavaScript is unavailable, CSS supplies a static square grid and all content remains usable.
