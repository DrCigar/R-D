// Starter products, loaded once into an empty database (and into the offline preview).
// Approval dates are approximate, worked back from "approved N weeks ago" on 2026-10-29.
const ALL_PASS = { spec: { s: 'pass' }, bench: { s: 'pass' }, software: { s: 'pass' }, pilot: { s: 'pass' }, supply: { s: 'pass' } };

// Product photos committed under img/<id>.png
const PHOTOS = new Set(['pax-a6650', 'pax-a6630', 'pax-a3700', 'hanasis-floor', 'hanasis-counter', 'matsuda-counter', 'matsuda-floor', 'pax-a920-duo',
  'pax-a360', 'pax-a380', 'inhand-ir602', 'inhand-ir624', 'aures-odp333', 'evo-sim.svg']);

const base = {
  category: '', vendor: '', cost: null, costNote: '', leadTime: '', moq: '',
  availability: 'now', launch: '', pros: [], cons: [],
  demoStatus: '', demoDate: '', demoQty: '',
  decision: 'pending', decisionDate: '', decisionBy: '', phases: {}, photo: null, photoUrl: '', docUrl: '', doc: null, quotes: [], isDefault: false,
};

export const SEED_PRODUCTS = [
  { id: 'pax-a6650', name: 'PAX A6650 Tablet', category: 'POS tablets', vendor: 'POS Portal', cost: 711,
    quotes: [{ vendor: 'TRG', price: 680 }, { vendor: 'DCC', price: 709 }, { vendor: 'POS Portal', price: 711 }],
    leadTime: '2 weeks', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-08-29', phases: ALL_PASS },
  { id: 'pax-a6630', name: 'PAX A6630 Tablet', category: 'POS tablets', vendor: 'POS Portal', cost: 360,
    quotes: [{ vendor: 'POS Portal', price: 360 }],
    demoStatus: 'inhouse' },
  { id: 'hanasis-floor', name: 'Amaze Hanasis Kiosk – Floor Standing', category: 'Kiosks', vendor: 'MS-Cash Drawer',
    cost: 1700, leadTime: '1 week', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-10-15', phases: ALL_PASS },
  { id: 'hanasis-counter', name: 'Amaze Hanasis Kiosk – Countertop', category: 'Kiosks', vendor: 'MS-Cash Drawer',
    cost: 1500, leadTime: '1 week', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-10-15', phases: ALL_PASS },
  { id: 'matsuda-counter', name: 'Matsuda Countertop Kiosk', category: 'Kiosks', vendor: 'Matsuda',
    cost: 615, leadTime: '12 weeks', decision: 'approved', decisionDate: '2026-10-01', phases: ALL_PASS },
  { id: 'pax-a3700', name: 'PAX A3700 Pin Pad', category: 'Pin pads and terminals', vendor: 'POS Portal', cost: 390,
    decision: 'approved', decisionDate: '2025-01-01', phases: ALL_PASS,
    quotes: [{ vendor: 'POS Portal', price: 390 }, { vendor: 'TRG', price: 425 }, { vendor: 'DCC', price: 450 }] },
  { id: 'pax-a920-duo', name: 'PAX A920 Duo', category: 'Pin pads and terminals', vendor: 'PAX',
    availability: 'soon', launch: 'Available to purchase soon', demoStatus: 'none',
    pros: ['Customer-facing price screen', 'Replaces the A920'] },
  { id: 'pax-a360', name: 'PAX A360 Pin Pad', category: 'Pin pads and terminals', vendor: 'PAX',
    availability: 'unknown', launch: 'Details and launch date not yet known', demoStatus: 'none' },
  { id: 'pax-a380', name: 'PAX A380 Pin Pad', category: 'Pin pads and terminals', vendor: 'PAX',
    availability: 'unknown' },
  { id: 'evo-sim', name: 'EVO SIM Card for Cradlepoint Routers', category: 'Networking and connectivity', vendor: 'Mobility Help Desk',
    demoStatus: 'inhouse',
    pros: ['Better data plan', 'Better coverage across cellular networks'] },
  { id: 'cradlepoint-s800', name: 'Cradlepoint S800 Router', category: 'Networking and connectivity', vendor: 'Cradlepoint',
    cost: 450, costNote: 'Likely price, NetCloud included for life', leadTime: '30 days after go-live',
    availability: 'future', launch: 'Launching Q2 2027', demoStatus: 'none',
    pros: ['NetCloud license built in, no renewals'] },
  { id: 'inhand-ir602', name: 'InHand IR602 Router (5G RedCap)', category: 'Networking and connectivity', vendor: 'InHand Networks',
    cost: 279, demoStatus: 'inhouse',
    pros: ['~85–150 Mbps down / ~50 Mbps up, plenty for POS and kiosks', 'Module cost ~50% less than full 5G',
      'Low power, compact', 'Built for POS, kiosk, telematics, sensors and light video'],
    cons: ['20 MHz bandwidth (sub-6 GHz), 1–2 Rx antennas with reduced MIMO', 'Low but not ultra-low latency',
      'Needs a 5G SA network; falls back to LTE'] },
  { id: 'inhand-ir624', name: 'InHand IR624 Router (Full 5G NR)', category: 'Networking and connectivity', vendor: 'InHand Networks',
    cost: 340, demoStatus: 'inhouse', launch: 'About 120 units in stock',
    pros: ['Up to 100 MHz bandwidth plus carrier aggregation', '4×4 MIMO', 'Multi-Gbps peak speed (3.4 Gbps)',
      'Lowest latency (URLLC-capable)', 'Works on 5G SA and NSA networks'],
    cons: ['Premium module cost', 'Higher power draw, larger unit',
      'Built for HD video, gigabit edge and high density, more than a typical store needs'] },
  { id: 'pax-kiosk', name: 'PAX Kiosk', category: 'Kiosks', vendor: 'PAX',
    availability: 'future', launch: 'Available late 2027 (TRG)', leadTime: '12–16 weeks (TRG)', demoStatus: 'none' },
  { id: 'matsuda-floor', name: 'Matsuda K300-215 Floor Standing Kiosk', category: 'Kiosks', vendor: 'Matsuda',
    cost: 900, leadTime: '12 weeks', demoStatus: 'inhouse' },
  { id: 'aures-odp333', name: 'Aures ODP 333 Receipt Printer', category: 'Printers', vendor: 'Aures',
    cost: 140, decision: 'approved', decisionDate: '2026-07-29', phases: ALL_PASS,
    pros: ['Big cost savings compared to Epson'] },
  { id: 'pkg-360pro-brown', name: '360 Pro Packaging Redesign', category: 'Foam and packaging', vendor: 'Brown Packaging',
    pros: ['Shipping cube 7.19 → 4.80 ft³ (33.2% smaller)', 'Foam 3.04 → 1.54 ft³ (49.6% less)',
      'Carton 20.75 × 19.75 × 20.25 in (was 22.75 × 22.75 × 24)', 'Drops the lower foam pad and the foam around the lower box',
      'Faster assembly: lower box no longer has to be centered before the foam slides on',
      'Branded lower box, no tape needed', 'Cleaner, more tailored top foam'] },
].map((p, i) => ({ ...base, photoUrl: PHOTOS.has(p.id) ? 'img/' + p.id + '.png' : PHOTOS.has(p.id + '.svg') ? 'img/' + p.id + '.svg' : '', ...p, order: i, createdAt: Date.parse('2026-10-29T12:00:00Z'), createdBy: 'Starter data' }));

// One-time updates. Each runs once per saved board (its id is recorded in board.applied) and only
// touches the fields it names. startingBoard() runs them all on the starter list, so a change only
// has to be written here to reach both fresh boards and boards already saved.
const quote = (p, vendor, price, note) => {
  if (!p) return;
  const qs = (p.quotes || []).filter(q => (q.vendor || '').toLowerCase() !== vendor.toLowerCase());
  p.quotes = [...qs, { vendor, price, note }];
};
export const UPDATES = [
  { id: '2026-11-02-vendor-quotes', apply(board) {
    const set = (id, part) => { if (board.products[id]) Object.assign(board.products[id], part); };
    set('pax-a6650', { vendor: 'POS Portal', quotes: [{ vendor: 'TRG', price: 680 }, { vendor: 'DCC', price: 709 }, { vendor: 'POS Portal', price: 711 }] });
    set('pax-a6630', { vendor: 'POS Portal', cost: 360, quotes: [{ vendor: 'POS Portal', price: 360 }] });
  } },
  { id: '2026-11-02-a3700-pin-pads', apply(board) {
    for (const p of Object.values(board.products)) if (p.category === 'Payment devices') p.category = 'Pin pads and terminals';
    if (!board.products['pax-a3700']) {
      const seed = SEED_PRODUCTS.find(p => p.id === 'pax-a3700'); const { id, ...doc } = seed;
      board.products[id] = { ...doc, createdAt: Date.now(), createdBy: 'Added by update' };
    }
  } },
  { id: '2026-11-02-dcc-bulk', apply(board) {
    const P = board.products;
    quote(P['pax-a3700'], 'DCC', 409, 'Bulk 25+ ($489 under 25) · 44 on hand');
    quote(P['pax-a6650'], 'DCC', 705, 'Bulk 25+ ($865 under 25; was $709) · 110 on hand');
    quote(P['pax-a6630'], 'DCC', 349, 'Bulk 25+ ($405 under 25) · 12 on hand, 200 inbound this month or next');
    const duo = P['pax-a920-duo'];
    if (duo) {
      quote(duo, 'DCC', 389, 'Bulk 25+ ($409 under 25) · 480 on hand');
      Object.assign(duo, { name: 'PAX A920Pro Duo', availability: 'now', launch: 'DCC has 480 on hand; demo unit needed' });
    }
  } },
  // Nate: leave the A3700 Hub off the board (an earlier version of the update above added it)
  { id: '2026-11-02-remove-a3700-hub', apply(board) {
    delete board.products['pax-a3700-hub'];
    for (const [id, n] of Object.entries(board.notes || {})) if (n.product === 'pax-a3700-hub') delete board.notes[id];
  } },
  { id: '2026-11-02-trg-pricing', apply(board) {
    const P = board.products;
    if (!P['pax-kiosk']) {
      const { id, ...doc } = SEED_PRODUCTS.find(p => p.id === 'pax-kiosk');
      P[id] = { ...doc, createdAt: Date.now(), createdBy: 'Added by update' };
    }
    const lead = (p, t) => { if (p && !p.leadTime) p.leadTime = t + ' (TRG)'; }; // only fills an empty box
    quote(P['pax-a3700'], 'TRG', 419, 'On hand · 4–12 weeks lead time'); lead(P['pax-a3700'], '4–12 weeks');
    quote(P['pax-a6650'], 'TRG', 682, 'On hand · 4–12 weeks lead time');
    quote(P['pax-a6630'], 'TRG', 340, 'On hand · 8–12 weeks lead time'); lead(P['pax-a6630'], '8–12 weeks');
    quote(P['pax-a920-duo'], 'TRG', 363, 'On hand · 4–12 weeks lead time'); lead(P['pax-a920-duo'], '4–12 weeks');
    quote(P['pax-kiosk'], 'TRG', null, 'Available late 2027 · 12–16 weeks lead time · no price yet');
    for (const id of ['pax-a360', 'pax-a380']) {
      const p = P[id]; if (!p) continue;
      quote(p, 'TRG', id === 'pax-a360' ? 347 : 443, 'Available in January · 4–12 weeks lead time');
      lead(p, '4–12 weeks');
      Object.assign(p, { availability: 'future', launch: 'Available in January (TRG)' });
    }
  } },
];

export function startingBoard() {
  const board = { products: Object.fromEntries(SEED_PRODUCTS.map(({ id, ...p }) => [id, structuredClone(p)])), notes: {}, applied: [] };
  for (const u of UPDATES) u.apply(board);
  board.applied = UPDATES.map(u => u.id);
  return board;
}
