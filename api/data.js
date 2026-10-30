// All routes need the team password in the x-rd-key header.
// GET    /api/data                             -> { products: [...], notes: [...] }  (photos left out)
// GET    /api/data?coll=photos&id=pax-a6630    -> { data: "data:image/jpeg;base64,..." }
// GET    /api/data?coll=docs&id=pax-a6630      -> { name, type, data: "data:application/pdf;base64,..." }
// PUT    /api/data?coll=products&id=... {doc}  -> { ok }  create or replace a document
// PATCH  /api/data?coll=products&id=... {part} -> { ok }  merge top-level fields into a document
// DELETE /api/data?coll=notes&id=...           -> { ok }
import { loadBoard, updateBoard, getFile, putFile, delFile, authorized, json, fail } from './_db.js';

const COLLS = new Set(['products', 'notes', 'photos', 'docs']);
const FILES = new Set(['photos', 'docs']);
const ID = /^[A-Za-z0-9_\-.~:@+]{1,80}$/;
const MAX_BODY = 4 * 1024 * 1024; // under Vercel's 4.5 MB request limit; the page caps attachments at 3 MB

function target(req) {
  const coll = String(req.query?.coll || ''), id = String(req.query?.id || '');
  if (!COLLS.has(coll) || !ID.test(id)) throw Object.assign(new Error('Send a valid coll and id'), { status: 400 });
  return { coll, id };
}
function bodyOf(req) {
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > MAX_BODY) throw Object.assign(new Error('Record is too large'), { status: 413 });
  const b = JSON.parse(raw || '{}');
  if (!b || typeof b !== 'object' || Array.isArray(b)) throw Object.assign(new Error('Send a JSON object'), { status: 400 });
  delete b.id;
  return b;
}
const list = map => Object.entries(map || {}).map(([id, b]) => ({ ...b, id }));
const notFound = () => Object.assign(new Error('No record with that id'), { status: 404 });

export default async function handler(req, res) {
  try {
    if (!authorized(req)) return json(res, 401, { error: 'Wrong or missing team password' });
    if (req.method === 'GET') {
      if (req.query?.coll) {
        const { coll, id } = target(req);
        if (FILES.has(coll)) { const f = await getFile(coll, id); if (!f) throw notFound(); return json(res, 200, { ...f, id }); }
        const { board } = await loadBoard(); const d = board[coll]?.[id];
        if (!d) throw notFound();
        return json(res, 200, { ...d, id });
      }
      const { board } = await loadBoard();
      return json(res, 200, { products: list(board.products), notes: list(board.notes) });
    }
    if (req.method === 'PUT') {
      const { coll, id } = target(req); const b = bodyOf(req);
      if (FILES.has(coll)) await putFile(coll, id, b);
      else await updateBoard(board => { (board[coll] ||= {})[id] = b; });
      return json(res, 200, { ok: true });
    }
    if (req.method === 'PATCH') {
      const { coll, id } = target(req); const b = bodyOf(req);
      if (FILES.has(coll)) throw Object.assign(new Error('Use PUT for files'), { status: 400 });
      await updateBoard(board => { const cur = board[coll]?.[id]; if (!cur) throw notFound(); board[coll][id] = { ...cur, ...b }; });
      return json(res, 200, { ok: true });
    }
    if (req.method === 'DELETE') {
      const { coll, id } = target(req);
      if (FILES.has(coll)) { await delFile(coll, id); return json(res, 200, { ok: true }); }
      await updateBoard(board => {
        delete board[coll]?.[id];
        if (coll === 'products') for (const [nid, n] of Object.entries(board.notes || {})) if (n.product === id) delete board.notes[nid];
      });
      if (coll === 'products') await Promise.all([delFile('photos', id), delFile('docs', id)]);
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    if (e instanceof SyntaxError) return json(res, 400, { error: 'Body is not valid JSON' });
    return fail(res, e);
  }
}
