# sgiaworks

Personal portfolio / resume site for Steven Gia.

Static single-page site: HTML, CSS, and React (loaded via UMD + Babel standalone — no build step). Deployed as plain static files.

## Local preview

Any static file server will do. From the repo root:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

Or with Node:

```sh
npx serve .
```

## Files

- `index.html` — entry point, loads React + Babel standalone, then the JSX scripts in order.
- `styles.css` — all styling. Theme variables (dark / light / reading) and intensity (restrained / balanced) live at the top.
- `app.jsx` — sidebar, page routing, all five page components (Home / Skills / Projects / Resume / Contact), top-level `App`.
- `pipeline.jsx` — animated 6-phase ML pipeline diagram for the Projects page.
- `tweaks-panel.jsx` — design-tool authoring affordance from the original handoff. Stays inert in production (only activates if a parent window posts the host protocol message, which never happens on the deployed site). Kept because `app.jsx` still imports `useTweaks` / `TweaksPanel` / `TweakRadio` from it; ripping it out would mean editing app.jsx for no user-visible benefit.

## Edit notes

- All resume content (roles, skills, education) is in `app.jsx` — `ROLES`, `SKILLS`, and the `ResumePage` / `HomePage` components.
- Theme palettes live in `styles.css` under `:root`, `.theme-light`, and `.theme-reading`.

## Hosting

See deployment runbook in repo discussion / commit history. TL;DR: GitHub Pages or Cloudflare Pages, point the Squarespace-registered domain via DNS.
