// Starter products, loaded once into an empty database (and into the offline preview).
// Approval dates are approximate, worked back from "approved N weeks ago" on 2026-10-29.
const ALL_PASS = { spec: { s: 'pass' }, bench: { s: 'pass' }, software: { s: 'pass' }, pilot: { s: 'pass' }, supply: { s: 'pass' } };

// Product photos committed under img/<id>.png
const PHOTOS = new Set(['pax-a6650', 'pax-a6630', 'hanasis-floor', 'hanasis-counter', 'matsuda-counter', 'matsuda-floor', 'pax-a920-duo',
  'pax-a360', 'pax-a380', 'inhand-ir602', 'inhand-ir624', 'aures-odp333', 'evo-sim.svg']);

const base = {
  category: '', vendor: '', cost: null, costNote: '', leadTime: '', moq: '',
  availability: 'now', launch: '', pros: [], cons: [],
  demoStatus: '', demoDate: '', demoQty: '',
  decision: 'pending', decisionDate: '', decisionBy: '', phases: {}, photo: null, photoUrl: '',
};

export const SEED_PRODUCTS = [
  { id: 'pax-a6650', name: 'PAX A6650 Tablet', category: 'POS tablets', vendor: 'POSPortal', cost: 711,
    leadTime: '2 weeks', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-08-29', phases: ALL_PASS },
  { id: 'pax-a6630', name: 'PAX A6630 Tablet', category: 'POS tablets', vendor: 'POSPortal', cost: 450,
    demoStatus: 'inhouse' },
  { id: 'hanasis-floor', name: 'Amaze Hanasis Kiosk – Floor Standing', category: 'Kiosks', vendor: 'MS-Cash Drawer',
    cost: 1700, leadTime: '1 week', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-10-15', phases: ALL_PASS },
  { id: 'hanasis-counter', name: 'Amaze Hanasis Kiosk – Countertop', category: 'Kiosks', vendor: 'MS-Cash Drawer',
    cost: 1500, leadTime: '1 week', demoStatus: 'inhouse', decision: 'approved', decisionDate: '2026-10-15', phases: ALL_PASS },
  { id: 'matsuda-counter', name: 'Matsuda Countertop Kiosk', category: 'Kiosks', vendor: 'Matsuda',
    cost: 615, leadTime: '12 weeks', decision: 'approved', decisionDate: '2026-10-01', phases: ALL_PASS },
  { id: 'pax-a920-duo', name: 'PAX A920 Duo', category: 'Payment devices', vendor: 'PAX',
    availability: 'soon', launch: 'Available to purchase soon', demoStatus: 'none',
    pros: ['Customer-facing price screen', 'Replaces the A920'] },
  { id: 'pax-a360', name: 'PAX A360 Pin Pad', category: 'Payment devices', vendor: 'PAX',
    availability: 'unknown', launch: 'Details and launch date not yet known', demoStatus: 'none' },
  { id: 'pax-a380', name: 'PAX A380 Pin Pad', category: 'Payment devices', vendor: 'PAX',
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
  { id: 'matsuda-floor', name: 'Matsuda K300-215 Floor Standing Kiosk', category: 'Kiosks', vendor: 'Matsuda',
    cost: 900, leadTime: '12 weeks', demoStatus: 'inhouse' },
  { id: 'aures-odp333', name: 'Aures ODP 333 Receipt Printer', category: 'Printers', vendor: 'Aures',
    cost: 140, decision: 'approved', decisionDate: '2026-07-29', phases: ALL_PASS,
    pros: ['Big cost savings compared to Epson'] },
].map((p, i) => ({ ...base, photoUrl: PHOTOS.has(p.id) ? 'img/' + p.id + '.png' : PHOTOS.has(p.id + '.svg') ? 'img/' + p.id + '.svg' : '', ...p, order: i, createdAt: Date.parse('2026-10-29T12:00:00Z'), createdBy: 'Starter data' }));
