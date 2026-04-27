# sgiaworks

Personal portfolio / resume site for Steven Gia. Live at https://www.sgia.works.

Built with Vite + React 18 and deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## Local development

```sh
npm install
npm run dev      # http://localhost:5173 with HMR
npm run build    # production build to dist/
npm run preview  # serve dist/ at http://127.0.0.1:5174
```

Requires Node 20+ and npm 10+.

## Layout

- `index.html` — Vite entry HTML at the project root.
- `src/main.jsx` — React mount point. Imports `styles.css` and `App`.
- `src/app.jsx` — sidebar nav, page routing, and all five page components (Home / Skills / Projects / Resume / Contact).
- `src/pipeline.jsx` — animated 6-phase ML pipeline diagram for the Projects page (default export).
- `src/tweaks-panel.jsx` — design-tool authoring affordance from the original handoff. Stays inert in production (only activates if a parent window posts the host protocol message, which never happens on the deployed site). Exports `useTweaks`, `TweaksPanel`, `TweakRadio`, `TweakSection`, etc.
- `src/styles.css` — all styling. Theme variables (dark / light / reading) and intensity (restrained / balanced) live at the top.
- `public/CNAME` — copied verbatim into `dist/CNAME` at build time. Required for the custom domain on GitHub Pages.
- `vite.config.js` — `base: '/'` because the custom domain serves from root.

## Edit notes

- All resume content (roles, skills, education) is in `src/app.jsx` — `ROLES`, `SKILLS`, and the `ResumePage` / `HomePage` components.
- Theme palettes live in `src/styles.css` under `:root`, `.theme-light`, and `.theme-reading`.

## Hosting

GitHub Pages, deployed from the `dist/` artifact produced by the GitHub Actions workflow on every push to `main`. Pages source must be set to "GitHub Actions" (not "Deploy from a branch") in the repo settings — the workflow uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`.

The `CNAME` file (`www.sgia.works`) is shipped from `public/CNAME` so the custom domain survives every deploy.
