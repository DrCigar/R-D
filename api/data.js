// All routes need the team password in the x-rd-key header.
// GET    /api/data                             -> { products: [...], notes: [...] }  (photos left out)
// GET    /api/data?coll=photos&id=pax-a630     -> { data: "data:image/jpeg;base64,..." }
// PUT    /api/data?coll=products&id=... {doc}  -> { ok }  create or replace a document
// PATCH  /api/data?coll=products&id=... {part} -> { ok }  merge top-level fields into a document
// DELETE /api/data?coll=notes&id=...           -> { ok }
import { ensureSchema, sql, authorized, json, fail } from './_db.js';

const COLLS = new Set(['products', 'notes', 'photos']);
const ID = /^[A-Za-z0-9_\-.~:@+]{1,80}$/;
const MAX_BODY = 600 * 1024; // photos are resized in the browser to well under this

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
  return b;
}

export default async function handler(req, res) {
  try {
    if (!authorized(req)) return json(res, 401, { error: 'Wrong or missing team password' });
    await ensureSchema();
    const q = sql();
    if (req.method === 'GET') {
      if (req.query?.coll) {
        const { coll, id } = target(req);
        const r = await q`SELECT body FROM docs WHERE coll = ${coll} AND id = ${id}`;
        if (!r.length) return json(res, 404, { error: 'No record with that id' });
        return json(res, 200, { ...r[0].body, id });
      }
      const rows = await q`SELECT coll, id, body FROM docs WHERE coll IN ('products', 'notes')`;
      const out = { products: [], notes: [] };
      for (const r of rows) out[r.coll].push({ ...r.body, id: r.id });
      return json(res, 200, out);
    }
    if (req.method === 'PUT') {
      const { coll, id } = target(req); const b = bodyOf(req); delete b.id;
      await q`INSERT INTO docs (coll, id, body) VALUES (${coll}, ${id}, ${JSON.stringify(b)}::jsonb)
              ON CONFLICT (coll, id) DO UPDATE SET body = EXCLUDED.body, updated_at = now()`;
      return json(res, 200, { ok: true });
    }
    if (req.method === 'PATCH') {
      const { coll, id } = target(req); const b = bodyOf(req); delete b.id;
      const r = await q`UPDATE docs SET body = body || ${JSON.stringify(b)}::jsonb, updated_at = now()
                        WHERE coll = ${coll} AND id = ${id} RETURNING id`;
      if (!r.length) return json(res, 404, { error: 'No record with that id' });
      return json(res, 200, { ok: true });
    }
    if (req.method === 'DELETE') {
      const { coll, id } = target(req);
      await q`DELETE FROM docs WHERE coll = ${coll} AND id = ${id}`;
      if (coll === 'products') {
        await q`DELETE FROM docs WHERE coll = 'photos' AND id = ${id}`;
        await q`DELETE FROM docs WHERE coll = 'notes' AND body->>'product' = ${id}`;
      }
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { error: 'Method not allowed' });
  } catch (e) {
    if (e instanceof SyntaxError) return json(res, 400, { error: 'Body is not valid JSON' });
    return fail(res, e);
  }
}
