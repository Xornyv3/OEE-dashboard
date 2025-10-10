# Prodex — Smart OEE & Productivity Dashboard

Welcome! This project is the Prodex dashboard for OEE and productivity insights.

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

## Theme & Fonts

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

```
npm install
```

Then, you'll be able to run a development version of the project with:

```
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)


If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```
