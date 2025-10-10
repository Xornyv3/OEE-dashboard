# Deploying Prodex (Vite + React)

This app is a static SPA built with Vite. The build output is in `dist/`.

## 1) Vercel (recommended)

Prereqs: Node 18+, a Vercel account.

```powershell
npm i -g vercel
vercel login
# from project root
vercel --yes --prod
```

If prompted to configure, select:
- Framework Preset: `Vite`
- Build Command: `vite build` (or `npm run build`)
- Output Directory: `dist`

Next deploys are a single command:
```powershell
vercel --prod
```

## 2) Netlify

Prereqs: Node 18+, Netlify account.

```powershell
npm i -g netlify-cli
netlify login
# from project root
npm run build
netlify deploy --dir=dist --prod
```

## 3) GitHub Pages (static hosting)

- Set `base` in `vite.config.ts` to your repo name (e.g. `/my-repo/`).
- Push the repo to GitHub.
- Build and push `dist` to `gh-pages` branch.

```powershell
npm run build
npm i -g gh-pages
# publish dist/ to gh-pages branch
gh-pages -d dist
```

Enable Pages in GitHub settings: source = `gh-pages`.

## SPA Routing

This app uses client-side routing. We included:
- `vercel.json` with a rewrite to `index.html`
- `netlify.toml` with a catch-all redirect to `index.html`

These ensure deep links load correctly.
