# Product R&D Board

A shared board for Supply Chain Ops and Systems to track new hardware from first look to approval. Each product has a photo, vendor, cost, lead time, MOQ, pros and cons, demo unit status, five testing phases, an approval decision, and a notes thread.

## How the board works

The Overview (default view) has three parts:

- **Just approved:** approvals from the last 90 days, newest first. Older ones move to Approval history automatically.
- **In the lab:** everything still being worked on, in two lanes: **Coming soon** (pre-launch or no demo unit yet) and **Testing** (demo in hand). Anything waiting on sign-offs sits at the top of Testing with a Waiting on sign-off tag. Each card shows its next step and the sign-off buttons.
- **Not approved:** always visible at the bottom, listing anything marked Not approved or On hold.
- **Older approvals** (collapsed): approvals from more than 90 days ago.

**Approvals are three sign-offs.** Each lab card has SC Ops, Systems and C-Suite buttons. When all three have signed, the product is approved automatically with today's date and moves to Just approved. Products approved before sign-offs existed count as signed by all three. Hold and Not approved are in the product panel under Sign-offs. The five-step testing checklist is still in the panel, but it's optional and doesn't decide the status.

**By category** is the second view: every product grouped by category.

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
