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

Attached files (vendor proposals, spec sheets; up to 3 MB, one per product) are uploaded inside the app and kept in that storage, never in this repo.
- `api/data.js`, `api/_db.js` – the API. Storage is picked automatically: **Neon** when `DATABASE_URL` is set (one table, `rd_store`), otherwise a private **Vercel Blob** store. Either way the board is one JSON document, and a save only lands if nobody else saved in between (otherwise it re-reads and retries), so two people editing at once don't overwrite each other.
- `build.mjs` – run `node build.mjs` to make `index.html` (the page Vercel serves). Commit `index.html`.

## Deploy on Vercel

1. Import this repo in Vercel (Framework preset: **Other**, no build command).
2. Storage → connect **Neon** (or a private **Blob** store) to the project. No keys to copy; Vercel wires it up.
3. Redeploy. Until the first edit, the board shows the starter products; the first save creates the board file.

Everyone signs in with just the team password, which is set as `TEAM_PASSWORD` in `api/_db.js`. To change it, edit that line and push. Adding a name is optional: type it in the box next to Notes and the browser remembers it for notes and phase stamps (otherwise they show "Team member"). The board refreshes every 30 seconds.

Opened anywhere without the API or a connected Blob store, the page shows the starter products and keeps changes only in that browser (a banner says so).
