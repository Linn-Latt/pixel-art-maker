# Pixel Art Maker
A browser-based pixel art editor. No install, no dependencies — just open and draw.


## Features
- **Configurable grid** — set any size up to 64×64
- **Drawing tools** — Pencil, Eraser, Flood Fill
- **Color picker** — native color input + 8 preset colors
- **Undo / Redo** — up to 30 steps
- **Zoom** — 100%, 150%, 200%, 300%
- **Save** — stores your canvas in `localStorage`, restored on next visit
- **Download** — exports as a PNG at 32px per cell
- **Responsive** — works on desktop and mobile

## Getting Started
Open the project in VS Code and click **Go Live** in the status bar (requires the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension). 

## Project Structure
```
pixel-art-maker/
├── index.html        # App entry point
├── style.css         # All styles — layout, components, responsive
└── js/
    ├── main.js       # Entry point — DOM wiring and event listeners
    ├── state.js      # AppState class — tool, color, zoom, history
    ├── tools.js      # Flood fill algorithm
    └── export.js     # PNG export via Canvas API
```

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript (ES Modules)
- [Font Awesome 7.0.0](https://fontawesome.com) — icons
- [Google Fonts](https://fonts.google.com) — Pixelify Sans, Google Sans

