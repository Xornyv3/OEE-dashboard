# AI guide for Prodex (OEE-dashboard)

Goal: make AI agents productive fast with repo-specific patterns. Keep answers concrete; follow these conventions.

## Architecture
- Static SPA (Vite + React 18 + TS + Tailwind). Entry: `index.html` → `src/index.tsx`.
- Root providers: `AuthProvider` + `SelectionProvider`, wrapped by `ErrorBoundary`.
- Main screen: `src/screens/DashboardLineAnd/DashboardLineAnd.tsx` controls tabs via `activeTab` and renders sections under `sections/*`.
- UI kit: use `src/components/ui/*` (button, card, table, select, etc) for consistent styling.

## Data & env
- API base: `VITE_API_BASE_URL`. If absent, libs return stubs so UI works offline.
- Clients: `src/lib/data.ts` (OEE/overview), `src/lib/realtime.ts` (snapshots), `src/lib/erpnext.ts` (ERPNext), `src/lib/system.ts` (health/users).
- Pattern to copy when adding endpoints: check config → fetch → catch → return realistic fallback sample.

## Dev/build/deploy
- Node 20.x required. Dev: `npm run dev` (Vite on 5173). Build: `npm run build` (sets `ROLLUP_DISABLE_NATIVE=1`). Output: `dist/` with `base: "./"`.
- Deploy: Vercel (`vercel.json` rewrites `/*` → `/index.html`, cache headers; build runs `npm ci` + `npm run build`) or Netlify (`netlify.toml` publish `dist`, SPA redirect).
- Tailwind: tokens in `tailwind.config.js`; global CSS in `tailwind.css`. Use `cn()` from `src/lib/utils.ts` to compose classes.

## Conventions
- Sections are read-only UI by default; do data writes only via `src/lib/*` clients.
- New data access belongs in `src/lib/*` with strict TS types and offline stubs.
- No react-router: navigation is local state; add new tabs in `NavigationMenuSection.tsx` + the switch in `DashboardLineAnd.tsx`.
- Theme: use design tokens; avoid ad‑hoc colors. Fonts: don’t commit Objectivity files; Inter is the fallback.

## Concrete examples
- OEE by group: `data.ts::fetchOeeMetrics({ scope, entity, groupBy })` → returns `{ availability, performance, quality, oee, by[] }` (falls back offline).
- ERPNext article: `erpnext.ts::fetchItemDetails(name)` reads `/api/resource/Item/:name` when configured; otherwise a local stub image/fields.
- Add a new section: create `src/screens/DashboardLineAnd/sections/MySection/MySection.tsx` (+ `index.ts`), then wire tab + switch.

## Editing guidelines
- Keep strict TS (see tsconfigs). Export types used across files.
- Preserve offline mode; never throw on missing env—return sensible stubs.
