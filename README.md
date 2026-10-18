# Delivery Plus website

A static showcase site for Delivery Plus: plain HTML, CSS and JavaScript, no build step and no framework.

## View it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve website        # or: python -m http.server -d website
```

Fonts load from Google Fonts. Without a network connection the page falls back to system fonts.

## What's inside

| Path | What it is |
| --- | --- |
| `index.html` | The page: hero, the story of one order, the apps and the gallery, Arabic, engineering, status and stack |
| `css/site.css` | Styles. Brand tokens come from the apps' `BRANDING.md` |
| `js/site.js` | Story player, gallery filters, lightbox, English/Arabic switch, navigation |
| `js/screens.js` | Generated: every screenshot with its caption and how it was reached |
| `assets/screens/` | Generated: the 103 real screenshots, copied unchanged |
| `assets/brand/` | Generated: the official `logo.png` and `icon.png` from the backend repository |
| `scripts/sync-screens.mjs` | Copies the screenshots and brand files, and writes `js/screens.js` |

## Refresh the screenshots

The screenshots come from `../artifacts/delivery-plus-ui-screenshots/` (see its README for how they were captured). After a new capture, run:

```bash
cd website
node scripts/sync-screens.mjs
```

## Rules this site follows

- **Real screenshots only.** Images are copied byte for byte from the capture; no mockups and no edited pixels. The phone and laptop frames are CSS drawn around the images.
- **The official logo.** `logo.png` and `icon.png` are used as they are: never redrawn or recolored, and only on light backgrounds. No light-on-dark version of the wordmark exists, so the site is light only.
- **Honest claims.** The Status section says what is simulated or missing: payments, SMS, push notifications, payouts and native device testing.
