// Storage for the API routes. The whole board is one JSON document
// ({ products: {id: doc}, notes: {id: doc} }); each product can also have one photo and one attached file.
// Two backends, picked automatically:
//   - Neon Postgres, when DATABASE_URL (or POSTGRES_URL) is set by the Neon integration: table rd_store(k, body, ver)
//   - otherwise a private Vercel Blob store: rd/board.json, rd/photos/<id>.json, rd/docs/<id>.json
// Saves only land if nobody else saved in between (row version / blob ETag); otherwise they re-read and retry.
import { get, put, del, BlobPreconditionFailedError } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { createHash, timingSafeEqual } from 'crypto';
import { SEED_PRODUCTS } from './_seed.js';

// Team password lives here in the code (Nate's call). An RD_PASSWORD env var in Vercel, if ever set, overrides it.
const TEAM_PASSWORD = 'Payments123$';

const seedBoard = () => ({ products: Object.fromEntries(SEED_PRODUCTS.map(({ id, ...p }) => [id, p])), notes: {} });
const CONFLICT = Symbol('conflict');

/* ---------- Neon ---------- */
const dbUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL;
let sqlClient = null, tableReady = null;
async function sql() {
  if (!sqlClient) sqlClient = neon(dbUrl());
  if (!tableReady) tableReady = sqlClient`CREATE TABLE IF NOT EXISTS rd_store (
      k text PRIMARY KEY, body jsonb NOT NULL, ver integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now())`
    .catch(e => { tableReady = null; throw e; });
  await tableReady;
  return sqlClient;
}
const neonStore = {
  async read(k) { const q = await sql(); const r = await q`SELECT body, ver FROM rd_store WHERE k = ${k}`; return r.length ? { body: r[0].body, tag: r[0].ver } : null; },
  async writeIf(k, body, tag) {
    const q = await sql(), json = JSON.stringify(body);
    const r = tag == null
      ? await q`INSERT INTO rd_store (k, body) VALUES (${k}, ${json}::jsonb) ON CONFLICT DO NOTHING RETURNING k`
      : await q`UPDATE rd_store SET body = ${json}::jsonb, ver = ver + 1, updated_at = now() WHERE k = ${k} AND ver = ${tag} RETURNING k`;
    if (!r.length) throw CONFLICT;
  },
  async write(k, body) { const q = await sql(); await q`INSERT INTO rd_store (k, body) VALUES (${k}, ${JSON.stringify(body)}::jsonb)
    ON CONFLICT (k) DO UPDATE SET body = EXCLUDED.body, ver = rd_store.ver + 1, updated_at = now()`; },
  async remove(k) { const q = await sql(); await q`DELETE FROM rd_store WHERE k = ${k}`; },
};

/* ---------- Vercel Blob (private) ---------- */
const WRITE = { access: 'private', contentType: 'application/json', addRandomSuffix: false };
const path = k => `rd/${k}.json`;
const blobStore = {
  // useCache:false always reads the latest save, never a cached copy
  async read(k) { const r = await get(path(k), { access: 'private', useCache: false });
    return r && r.statusCode === 200 ? { body: JSON.parse(await new Response(r.stream).text()), tag: r.blob.etag } : null; },
  async writeIf(k, body, tag) {
    try { await put(path(k), JSON.stringify(body), tag == null ? { ...WRITE, allowOverwrite: false } : { ...WRITE, allowOverwrite: true, ifMatch: tag }); }
    catch (e) { if (e instanceof BlobPreconditionFailedError || /precondition|already exists/i.test(e?.message || '')) throw CONFLICT; throw e; }
  },
  async write(k, body) { await put(path(k), JSON.stringify(body), { ...WRITE, allowOverwrite: true }); },
  async remove(k) { await del(path(k)); },
};

const store = () => (dbUrl() ? neonStore : blobStore);

export async function loadBoard() {
  const r = await store().read('board');
  return r ? { board: r.body, tag: r.tag } : { board: seedBoard(), tag: null }; // nothing saved yet: starter products
}

// Read, change, write back only if nobody else saved in between; retry a few times if they did.
export async function updateBoard(change) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { board, tag } = await loadBoard();
    const result = change(board);
    try { await store().writeIf('board', board, tag); return result; }
    catch (e) { if (e !== CONFLICT) throw e; }
  }
  throw Object.assign(new Error('Someone else was saving at the same moment. Try again.'), { status: 409, expose: true });
}

// kind is 'photos' or 'docs'
export async function getFile(kind, id) { const r = await store().read(`${kind}/${id}`); return r ? r.body : null; }
export const putFile = (kind, id, doc) => store().write(`${kind}/${id}`, doc);
export const delFile = (kind, id) => store().remove(`${kind}/${id}`).catch(() => {});

const digest = s => createHash('sha256').update(String(s)).digest();

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
    : status === 500 ? 'Storage is not available. Connect a Neon database (or a Blob store) to this Vercel project, then redeploy.'
    : (e.message || 'Request failed');
  json(res, status, { error: msg });
}
