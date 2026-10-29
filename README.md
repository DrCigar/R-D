# Product R&D Board

A shared board for Supply Chain Ops and Systems to track new hardware from first look to approval. Each product has a photo, vendor, cost, lead time, MOQ, pros and cons, demo unit status, five testing phases, an approval decision, and a notes thread.

## How status works

Status is worked out from the record, so nobody has to set it by hand:

| Status | When |
|---|---|
| Approved / On hold / Not approved | The approval decision is set |
| In testing | A demo unit is in house (or returned), or any phase has started |
| Pre-launch | No demo yet and the launch date is set for later or unknown |
| Awaiting demo | Product is available but no demo unit is in house yet |

Testing phases (in order): Spec and pricing review (SC Ops), Bench test (Systems), Software and integration (Systems), Field pilot (both teams), Supply sign-off (SC Ops). Each phase records who changed it and when.

## Files

- `src/rd.html` – the page (edit this one)
- `api/_seed.js` – starter products, loaded once into an empty database
- `img/` – product photos for the starter products (`<id>.png`)
- `api/data.js`, `api/_db.js` – Neon-backed API (one `docs` table: `products`, `notes`, `photos`)
- `build.mjs` – run `node build.mjs` to make `index.html` (the page Vercel serves). Commit `index.html`.

## Deploy on Vercel

1. Import this repo in Vercel (Framework preset: **Other**, no build command).
2. Storage → add **Neon** from the Marketplace and connect it to the project (sets `DATABASE_URL`).
3. Settings → Environment Variables → add `RD_PASSWORD` set to the team password. (It lives only in Vercel, never in this repo.)
4. Redeploy. On first load the database seeds itself with the starter products.

Everyone signs in with just the team password. Adding a name is optional: type it in the box next to Notes and the browser remembers it for notes and phase stamps (otherwise they show "Team member"). The board refreshes every 30 seconds.

Opened anywhere without the API (for example as a local file), the page runs in **preview mode**: it shows the starter data and saves changes only in that browser.
