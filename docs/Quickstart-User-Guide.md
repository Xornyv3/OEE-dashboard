# Prodex Dashboard — Quickstart User Guide

This short guide shows how to run the app, click through the main screens, and quickly verify everything works (frontend + backend).

## 1) Start the app

If you don’t already have it running:

- Windows (PowerShell):

```powershell
# From the project root
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\dev-up.ps1 -Open
```

This will:

- Install dependencies (frontend + backend)
- Create `.env.local` pointing the frontend to `http://localhost:4000`
- Start the backend at `http://localhost:4000`
- Start the frontend (Vite) at `http://localhost:5173` and open it

Manual alternative (two terminals):

```powershell
# Terminal A (backend)
cd server
npm install
npm run dev

# Terminal B (frontend)
cd ..  # project root
npm install
npm run dev
```

## 2) Open the dashboard

- Visit <http://localhost:5173> in your browser.
- The app is a single-page React application with tabs/sections for OEE and productivity.

Tip: If fonts aren’t present locally, the UI will fall back to Inter automatically.

## 3) Quick tour: what to look for

- Top navigation: Switch between key sections (Overview, Real‑time, Analytics, etc.).
- Real‑time widgets: You should see data like machine list and production counts.
- Charts: Minute‑by‑minute OEE, micro‑stops, and heatmaps render with realistic sample data when offline.
- Reference targets: The “study” targets (e.g., OEE 85%) load from the backend fallback file.

The UI is read‑only by default; it focuses on presenting KPIs and insights.

## 4) Validate the backend quickly

Open these in the browser or run them in a terminal — they should return JSON:

- Backend health:
  - <http://localhost:4000/health>
- Real‑time machines:
  - <http://localhost:4000/realtime/machines>
- Production counts:
  - <http://localhost:4000/realtime/counts>
- Reference study targets:
  - <http://localhost:4000/reference/study>

Notes:

- Some routes (like `/realtime/operators`, `/realtime/shift`, `/realtime/workorders`, `/realtime/downtime`) are not implemented — 404s there are expected in dev logs.
- If Influx env vars aren’t configured, the backend serves realistic fallback samples from `server/server-data`.

## 5) One‑command smoke test

We added a small script that checks the endpoints above and the frontend root page.

```powershell
npm run smoke:test
```

It will print a short PASS/FAIL summary. Make sure the dev servers are running before executing.

## 6) Basic functional checklist

Use this as a quick acceptance run:

- [ ] The dashboard loads at <http://localhost:5173> without errors
- [ ] Machine list shows at least a few entries (e.g., M‑01)
- [ ] Production counts (total, good, scrap) display non‑zero values
- [ ] Minute‑OEE chart renders a trend for the last 60 minutes
- [ ] Micro‑stops list/visualization shows 1–2 sample entries
- [ ] Heatmap grid displays values across hours/assets
- [ ] Targets (e.g., OEE 85%) appear in the reference/study area
- [ ] Backend health at <http://localhost:4000/health> returns `{ ok: true }`

## 7) Troubleshooting

- Node version: Project targets Node 20.x. Newer Node versions show a warning but usually work for dev. If you hit issues, switch to Node 20.
- Port conflicts: If 5173 or 4000 are in use, stop other processes or adjust the ports (backend honors `PORT`; frontend uses Vite defaults).
- Proxy/Firewall: If endpoints don’t load in terminal tools but open fine in the browser, a corporate proxy might be interfering; prefer using the browser or set `NO_PROXY=localhost,127.0.0.1` for terminal tools.

## 8) Stopping the app

- If you used `dev-up.ps1`, closing the PowerShell window will stop both processes.
- If you started both manually, press Ctrl+C in each terminal running `npm run dev`.

You’re all set. Use this guide to do a 2–3 minute tour and confirm the dashboard is healthy end‑to‑end.
