# Blue Upgrade Technology — Smart OEE & Productivity Dashboard

Welcome! This project is the Blue Upgrade Technology dashboard for OEE and productivity insights.

## Documentation

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

## Theme & Fonts

The app now supports a single unified demo dataset so every dashboard field can populate without any external systems:

Location: `server/server-data/demo/demo-dataset.json`

Contents (high-level):

```json
{
   generatedAt,
   people: { operators[] },
   production: { lines[] { machines[] ... }, hourly[] },
   planning: { articles[], shifts[], assignments[] },
   quality: { fpy, scrapReasons[] },
   maintenance: { failureModes[] },
   analytics: { rootCauses[] }
}
```

Client access helpers live in `src/lib/demo.ts` and existing feature clients (e.g. `realtime.ts`, `planning.ts`) first attempt to source from this dataset before calling any API endpoints. This preserves the original fallback pattern but centralizes fake data so updates propagate consistently across all UI sections.

To extend:

1. Add new structure under the JSON file.
2. Export a slice helper in `demo.ts`.
3. Update the corresponding `src/lib/<domain>.ts` module to read from the dataset before network fetch.

This approach keeps offline/demo mode realistic while remaining zero-config: absence of `VITE_API_BASE_URL` still works, but even with an API configured you can intentionally rely on the unified dataset for demos.
This dashboard uses a refined dark theme with black base, grayscale content, and subtle purple/blue accents.

- Primary font: `Objectivity` (commercial license). For legal reasons the font files are not included.
- Fallback font: `Inter` (loaded from Google Fonts).

To enable Objectivity locally:

1. Place your licensed font files in `public/fonts/`:
   - `Objectivity-Regular.woff2` and `Objectivity-Regular.woff`
   - `Objectivity-Medium.woff2` and `Objectivity-Medium.woff` (optional)
   - `Objectivity-Bold.woff2` and `Objectivity-Bold.woff` (optional)
2. Restart the dev server if running. The CSS includes `@font-face` rules pointing to these files.

If the files are not present, the app will fall back to `Inter` seamlessly.
To get started with your project, you'll first need to install the dependencies with:

```bash
npm install
```

Then, you'll be able to run a development version of the project with:

```bash
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)

If you are satisfied with the result, you can finally build the project for release with:

```bash
npm run build
```
