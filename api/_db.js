// Storage for the API routes: one private Vercel Blob file holds the whole board
// (rd/board.json = { products: {id: doc}, notes: {id: doc} }); photos and attached files are
// rd/photos/<id>.json and rd/docs/<id>.json (one each per product).
// Connect a Blob store to the Vercel project and credentials are picked up automatically.
import { get, put, del, BlobPreconditionFailedError } from '@vercel/blob';
import { createHash, timingSafeEqual } from 'crypto';
import { SEED_PRODUCTS } from './_seed.js';

const BOARD = 'rd/board.json';
const WRITE = { access: 'private', contentType: 'application/json', addRandomSuffix: false };

// Team password lives here in the code (Nate's call). An RD_PASSWORD env var in Vercel, if ever set, overrides it.
const TEAM_PASSWORD = 'Payments123$';

const text = r => new Response(r.stream).text();
const seedBoard = () => ({ products: Object.fromEntries(SEED_PRODUCTS.map(({ id, ...p }) => [id, p])), notes: {} });

// Always read past the CDN cache so a save is never built on stale data.
export async function loadBoard() {
  const r = await get(BOARD, { access: 'private', useCache: false });
  if (r && r.statusCode === 200) return { board: JSON.parse(await text(r)), etag: r.blob.etag };
  return { board: seedBoard(), etag: null }; // nothing saved yet: start from the starter products
}

// Read, change, write back only if nobody else saved in between; retry a few times if they did.
export async function updateBoard(change) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const { board, etag } = await loadBoard();
    const result = change(board);
    try {
      await put(BOARD, JSON.stringify(board), etag ? { ...WRITE, allowOverwrite: true, ifMatch: etag } : { ...WRITE, allowOverwrite: false });
      return result;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError || /precondition|already exists/i.test(e?.message || '')) continue;
      throw e;
    }
  }
  throw Object.assign(new Error('Someone else was saving at the same moment. Try again.'), { status: 409, expose: true });
}

// kind is 'photos' or 'docs'
export async function getFile(kind, id) {
  const r = await get(`rd/${kind}/${id}.json`, { access: 'private', useCache: false });
  return r && r.statusCode === 200 ? JSON.parse(await text(r)) : null;
}
export const putFile = (kind, id, doc) => put(`rd/${kind}/${id}.json`, JSON.stringify(doc), { ...WRITE, allowOverwrite: true });
export const delFile = (kind, id) => del(`rd/${kind}/${id}.json`).catch(() => {});

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
    : status === 500 ? 'Storage is not available. Check that a Blob store is connected to this Vercel project.'
    : (e.message || 'Request failed');
  json(res, status, { error: msg });
}
