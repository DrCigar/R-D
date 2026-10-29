// Neon Postgres access for the API routes. Expects DATABASE_URL (set by the Neon
// integration in the Vercel Marketplace). The team password is TEAM_PASSWORD below.
import { neon } from '@neondatabase/serverless';
import { createHash, timingSafeEqual } from 'crypto';
import { SEED_PRODUCTS } from './_seed.js';

let client = null;
let ready = null;

export function sql() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error('DATABASE_URL is not set'), { status: 500 });
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}

export function ensureSchema() {
  if (!ready) {
    const q = sql();
    ready = (async () => {
      await q`CREATE TABLE IF NOT EXISTS docs (
        coll text NOT NULL, id text NOT NULL, body jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (coll, id))`;
      const seeded = await q`SELECT 1 FROM docs WHERE coll = 'config' AND id = 'seeded'`;
      if (!seeded.length) {
        for (const { id, ...p } of SEED_PRODUCTS) {
          await q`INSERT INTO docs (coll, id, body) VALUES ('products', ${id}, ${JSON.stringify(p)}::jsonb) ON CONFLICT DO NOTHING`;
        }
        await q`INSERT INTO docs (coll, id, body) VALUES ('config', 'seeded', '{"at":"seed"}'::jsonb) ON CONFLICT DO NOTHING`;
      }
    })().catch(e => { ready = null; throw e; });
  }
  return ready;
}

const digest = s => createHash('sha256').update(String(s)).digest();

// Team password lives here in the code (Nate's call). An RD_PASSWORD env var in Vercel, if ever set, overrides it.
const TEAM_PASSWORD = 'Payments123$';

// Every request carries the team password in x-rd-key; compare in constant time.
export function authorized(req) {
  const want = process.env.RD_PASSWORD || TEAM_PASSWORD;
  return timingSafeEqual(digest(req.headers['x-rd-key'] || ''), digest(want));
}

export function json(res, status, body) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.status(status).send(body === undefined ? '' : JSON.stringify(body));
}

export function fail(res, e) {
  const status = e && e.status ? e.status : 500;
  const msg = e && e.expose ? e.message
    : status === 500 ? 'Storage is not available. Check that the Neon database is attached and DATABASE_URL is set.'
    : (e.message || 'Request failed');
  json(res, status, { error: msg });
}
