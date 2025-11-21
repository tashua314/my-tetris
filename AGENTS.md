# Repository Guidelines

## Project Structure & Module Organization

- `src/main.js` boots `src/App.svelte`; keep global state lean and delegate behavior down to components.
- UI components live in `src/components/` (Game, UI chrome, modals, side panels). Favor small, focused components.
- Game logic and shared helpers sit in `src/logic.js` and `src/lib/`; keep these framework-agnostic so they stay testable.
- Static assets: `src/assets/` for in-app imports, `public/` for passthrough files served as-is.
- Build artifacts land in `dist/`; avoid editing this directory directly. Tooling configs: `vite.config.js`, `svelte.config.js`, `jsconfig.json`.

## Build, Test, and Development Commands

```bash
npm install           # install dependencies (uses npm via package-lock.json)
npm run dev -- --open # start Vite dev server with HMR and open the browser
npm run build         # production build to dist/ (Svelte + Vite)
npm run lint          # ESLint (flat config) across JS and Svelte files
npm run format        # Prettier write pass (Svelte-aware)
npm run preview       # serve the production build locally
```

Use the dev server for rapid iteration; prefer `preview` when validating deploy-ready output.

## Coding Style & Naming Conventions

- Indent with 4 spaces; keep files UTF-8 and ES modules (`type: module`). Prettier config lives in `.prettierrc`.
- Svelte components: PascalCase filenames in `src/components/`; keep `<script>`, markup, and scoped `<style>` co-located.
- Functions and variables: camelCase; constants in UPPER_SNAKE_CASE only when shared across modules.
- Keep `logic.js` pure (no DOM access) so it can be reused and tested; UI state belongs in components or lightweight stores.
- Place app-wide styles in `src/app.css`; component-specific styles should stay scoped to their Svelte files.

## Testing Guidelines

- No automated test suite exists yet; add covering tests alongside changes.
- Recommended setup: Vitest + @testing-library/svelte; name files `*.spec.js` under `src/`.
- Aim to cover game mechanics (rotation, drop speed, collision) in `logic.js` with deterministic inputs.
- Before opening a PR, run the relevant specs plus a manual smoke test in `npm run dev`.

## Commit & Pull Request Guidelines

- Use short, imperative commit subjects; optional prefixes like `feat:`, `fix:`, or `chore:` help scan history.
- For PRs, include: scope/goal, notable implementation choices, and any follow-up work.
- Attach screenshots or short clips for UI-visible changes (game screen, modals, side panel).
- List verification steps (commands run, manual checks) so reviewers can reproduce quickly.
