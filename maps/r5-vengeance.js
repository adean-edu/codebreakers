/* Draws the r5 Real History map (Operation Vengeance, 18 April 1943) from real coastline data, following
   maps/redraw/STEPS.md: Mercator, true scale bar, intelligence-plot style (flat teal sea, sand land, Courier New Bold),
   everything drawn in code at real coordinates.
   Usage (repo root): node maps/r5-vengeance.js <path to ne_10m_land.geojson> img/r5.png
   Data: Natural Earth ne_10m_land.geojson (github.com/nvkelso/natural-earth-vector, geojson/). Not committed. */
const fs = require("fs"), { chromium } = require("playwright");
const [geo, out] = [process.argv[2], process.argv[3] || "img/r5.png"];
const W = 1536, H = 1024, F0 = 948;
const NAVY = "#16264A", RED = "#A01E18", BLUE = "#1E3C82", CREAM = "#F6E8C8", SEA = "#96B0B0", LAND = "#D8BA84";
// ---- projection: Mercator, lon 150..162 E, top 2.6 S
const LON0 = 150, LON1 = 162, TOP = -2.6, S = W / (LON1 - LON0), D = 180 / Math.PI;
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + lat / D / 2)) * D;
const P = (lon, lat) => [(lon - LON0) * S, (merc(TOP) - merc(lat)) * S];
const SCALE_LAT = -6.5, PX_MI = S / (69.17 * Math.cos(SCALE_LAT / D));
// ---- coastlines
const land = JSON.parse(fs.readFileSync(geo, "utf8"));
let landD = "";
for (const f of land.features) {
  const g = f.geometry, polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  for (const poly of polys) for (const ring of poly) {
    if (!ring.some(([x, y]) => x > LON0 - 2 && x < LON1 + 2 && y < TOP + 2 && y > -13)) continue;
    let d = "", last = null;
    for (const [x, y] of ring) { const p = P(x, y); if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < .7) continue; d += (d ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); last = p; }
    landD += d + "Z";
  }
}
// ---- helpers
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const C = (sz, c, extra) => `font:700 ${sz}px 'Courier New', Courier, monospace;fill:${c || NAVY};${extra || ""}`;
const T = (x, y, s, st, a, halo) => `<text x="${x.toFixed ? x.toFixed(1) : x}" y="${y.toFixed ? y.toFixed(1) : y}" text-anchor="${a || "middle"}" style="${st};${halo ? `paint-order:stroke;stroke:${halo};stroke-width:6px;stroke-linejoin:round` : ""}">${esc(s)}</text>`;
const lab = (lon, lat, s, sz, opt) => { const [x, y] = P(lon, lat); opt = opt || {}; return String(s).split("\n").map((ln, i) => T(x + (opt.dx || 0), y + (opt.dy || 0) + i * sz * 1.15, ln, C(sz, opt.c, opt.ls ? `letter-spacing:${opt.ls}px` : ""), opt.a, opt.halo === undefined ? LAND : opt.halo)).join(""); };
const seaLab = (lon, lat, s, sz, ls) => lab(lon, lat, s, sz, { ls, halo: SEA });
const dot = (lon, lat, r, col) => { const [x, y] = P(lon, lat); return `<circle cx="${x}" cy="${y}" r="${r || 9}" fill="${col || RED}" stroke="${CREAM}" stroke-width="3"/>`; };
const route = (pts, col, dash, w) => { const q = pts.map(([a, b]) => P(a, b)); let d = `M${q[0][0]} ${q[0][1]}`; for (let i = 1; i < q.length; i++) { const a = q[i - 1], b = q[i]; if (i < q.length - 1) { const m = [(b[0] + q[i + 1][0]) / 2, (b[1] + q[i + 1][1]) / 2]; d += `Q${b[0]} ${b[1]} ${m[0]} ${m[1]}`; } else d += `L${b[0]} ${b[1]}`; } return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w || 5}" stroke-dasharray="${dash}" stroke-linecap="round" marker-end="url(#ah${col === RED ? "r" : "b"})"/>`; };
const box = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CREAM}" stroke="${col || NAVY}" stroke-width="3"/><rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" fill="none" stroke="${col || NAVY}" stroke-width="1.2"/>`;
const leader = (x1, y1, x2, y2, col) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col || RED}" stroke-width="2.5"/>`;
// P-38 Lightning, top view: twin booms, central pod, one tailplane joining the booms
const p38 = (x, y, rot, s) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s || 1})" fill="${BLUE}"><rect x="-30" y="-3" width="60" height="6" rx="2"/><rect x="-14" y="-6" width="5" height="34" rx="2"/><rect x="9" y="-6" width="5" height="34" rx="2"/><ellipse cx="0" cy="2" rx="4.5" ry="11"/><rect x="-16" y="26" width="32" height="4"/><rect x="-16" y="22" width="3" height="10"/><rect x="13" y="22" width="3" height="10"/><circle cx="-11.5" cy="-7" r="3" fill="${NAVY}"/><circle cx="11.5" cy="-7" r="3" fill="${NAVY}"/></g>`;
// G4M "Betty" bomber, top view: cigar fuselage, two engines, tapered wings
const betty = (x, y, rot, s) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s || 1})" fill="${RED}"><ellipse cx="0" cy="0" rx="5" ry="26"/><path d="M-40 -2L40 -2L34 6L-34 6Z"/><ellipse cx="-14" cy="-6" rx="3.5" ry="9"/><ellipse cx="14" cy="-6" rx="3.5" ry="9"/><path d="M-13 20L13 20L10 25L-10 25Z"/></g>`;
const burst = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 -24L6 -9 22 -14 11 -2 24 8 8 8 6 24 -2 10 -16 20 -10 4 -24 -2 -9 -8 -14 -22 -2 -10Z" fill="${RED}" stroke="${CREAM}" stroke-width="2.5"/></g>`;

// ---- places (approximate where noted in the review note)
const RABAUL = [152.18, -4.2], BALLALE = [155.88, -6.86], BUIN = [155.68, -6.75], SHOOT = [155.52, -6.68], HENDERSON = [160.05, -9.43];
let s = "";
// labels: islands and seas
s += lab(151.35, -5.75, "NEW BRITAIN", 22, { ls: 3 }) + lab(155.35, -5.85, "BOUGAINVILLE", 22, { ls: 2, dx: 0 });
s += lab(157.25, -6.95, "CHOISEUL", 18, { ls: 2 }) + lab(159.1, -8.05, "SANTA ISABEL", 18, { ls: 2 }) + lab(158.15, -8.62, "NEW GEORGIA", 17, { ls: 1, halo: SEA, a: "start" }) + lab(160.45, -9.62, "GUADALCANAL", 17, { ls: 1 });
s += seaLab(153.2, -7.7, "SOLOMON  SEA", 34, 10) + seaLab(158.7, -5.6, "PACIFIC  OCEAN", 34, 10);
// routes (drawn before markers)
const vengeance = [HENDERSON, [159.2, -9.75], [157.6, -9.35], [156.2, -8.35], [155.25, -7.35], [155.2, -6.95], SHOOT];
s += route(vengeance, BLUE, "16 10");
const flight = [RABAUL, [153.9, -5.45], SHOOT];
s += route(flight, RED, "16 10");
{ const a = P(...SHOOT), b = P(...BALLALE); s += `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="${RED}" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>`; }
// markers
s += dot(...RABAUL) + lab(RABAUL[0], RABAUL[1], "RABAUL", 22, { dx: 16, dy: -12, a: "start" });
s += dot(...BALLALE, 7) + lab(BALLALE[0], BALLALE[1], "BALLALE", 18, { dx: -6, dy: 30, a: "middle", halo: SEA });
s += dot(...BUIN, 7, NAVY) + lab(BUIN[0], BUIN[1], "BUIN", 18, { dx: 12, dy: -10, a: "start" });
s += dot(...HENDERSON, 9, BLUE) + lab(HENDERSON[0], HENDERSON[1], "HENDERSON FIELD", 20, { dx: 14, dy: -14, a: "start" });
{ const [x, y] = P(...SHOOT); s += burst(x, y); }
// aircraft along the routes
{ const a = P(153.05, -4.95), b = P(156.95, -8.95); s += betty(a[0], a[1], 126, 1.1) + p38(b[0], b[1], -52, 1.3) + p38(b[0] + 40, b[1] + 30, -52, 1.1); }
// callouts
{ const [x, y] = P(...SHOOT); s += leader(x - 18, y - 8, 440, 474) + box(170, 420, 270, 112, RED) + T(305, 460, "SHOT DOWN", C(24, RED)) + T(305, 488, "18 April 1943,", C(18)) + T(305, 512, "near Buin", C(18)); }
{ const m = P(153.9, -5.45); s += box(620, 168, 290, 112, RED) + T(765, 206, "YAMAMOTO'S FLIGHT", C(20, RED)) + T(765, 234, "Rabaul to Ballale,", C(17)) + T(765, 258, "schedule decoded", C(17)) + leader(m[0] + 10, m[1] - 6, 620, 240, RED); }
{ const m = P(156.2, -8.35); s += box(320, 694, 340, 112, BLUE) + T(490, 732, "16 P-38 LIGHTNINGS", C(20, BLUE)) + T(490, 760, "from Henderson Field,", C(17)) + T(490, 784, "low and far out at sea", C(17)) + leader(m[0] - 8, m[1] + 2, 660, 750, BLUE); }
// info box
const items = [["MESSAGE", "Japanese navy signal giving"], ["", "Yamamoto's schedule, decoded"], ["TARGET", "his flight, 18 April 1943"], ["STRIKE", "P-38s from Guadalcanal,"], ["", "flying low and far out at sea"], ["COVER", "credit given to coast-watchers"]];
s += box(930, 34, 566, 290) + T(956, 74, "OPERATION VENGEANCE", C(24, RED), "start") + `<line x1="954" x2="1472" y1="86" y2="86" stroke="${RED}" stroke-width="2"/>`;
items.forEach(([k, v], i) => { const y = 120 + i * 32; if (k) s += `<circle cx="964" cy="${y - 6}" r="5.5" fill="${i < 3 ? RED : NAVY}"/>` + T(980, y, k + ":", C(18), "start"); s += T(1098, y, v, C(17, NAVY, "font-weight:400"), "start"); });
// title box
s += box(40, 34, 560, 128) + T(320, 90, "SPENDING A SECRET", C(36)) + `<line x1="74" x2="196" y1="126" y2="126" stroke="${RED}" stroke-width="2.5"/><line x1="444" x2="566" y1="126" y2="126" stroke="${RED}" stroke-width="2.5"/>` + T(320, 134, "April 1943", C(28, RED, "font-style:italic"));
// scale bar (true at 6.5 S) and compass
{ const x0 = 60, y0 = 870, mi = 200 * PX_MI, km = PX_MI / 1.609;
  s += box(x0 - 20, y0 - 50, mi + 220, 102) + `<line x1="${x0}" x2="${x0 + mi}" y1="${y0}" y2="${y0}" stroke="${NAVY}" stroke-width="2.5"/>`;
  [0, 50, 100, 150, 200].forEach((m) => { const x = x0 + m * PX_MI; s += `<line x1="${x}" x2="${x}" y1="${y0 - 8}" y2="${y0}" stroke="${NAVY}" stroke-width="2.5"/>` + T(x, y0 - 14, m, C(15)); });
  [0, 100, 200, 300].forEach((k) => { const x = x0 + k * km; s += `<line x1="${x}" x2="${x}" y1="${y0}" y2="${y0 + 8}" stroke="${NAVY}" stroke-width="2.5"/>` + T(x, y0 + 24, k, C(15)); });
  s += T(x0 + mi + 30, y0 - 14, "Miles", C(15), "start") + T(x0 + mi + 30, y0 + 24, "Kilometres", C(15), "start") + T(x0 + mi + 30, y0 + 42, "Scale true at 6.5°S", C(12, NAVY, "font-weight:400"), "start"); }
s += `<g transform="translate(1470 380)"><path d="M0 -30L13 18L0 8L-13 18Z" fill="${NAVY}"/><path d="M0 -30L0 8L-13 18Z" fill="#33536d"/><text y="46" text-anchor="middle" style="${C(30)}">N</text></g>`;
// footer: intelligence-plot style, left-aligned record line and a two-line tag on the right
s += `<rect x="14" y="${F0}" width="${W - 28}" height="${H - 14 - F0}" fill="${CREAM}"/><line x1="14" x2="${W - 14}" y1="${F0}" y2="${F0}" stroke="${NAVY}" stroke-width="2.5"/>` +
  T(44, F0 + 40, "FROM THE RECORD · Operation Vengeance, 18 April 1943", C(22), "start") + T(W - 44, F0 + 26, "YAMAMOTO", C(16), "end") + T(W - 44, F0 + 48, "INTERCEPT PLOT", C(16), "end");
// sea waves (sparse), then land with a light coastal tint underneath
let waves = ""; for (let y = 20; y < F0; y += 26) for (let x = ((y * 37) % 90) - 60; x < W; x += 150) waves += `<path d="M${x} ${y}q8 -4 16 0t16 0t16 0"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
  <marker id="ahr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${RED}"/></marker><marker id="ahb" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10z" fill="${BLUE}"/></marker>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .22  0 0 0 0 .1  0 0 0 .16 0"/></filter>
  <filter id="blot"><feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .3  0 0 0 0 .15  0 0 0 .35 -.12"/></filter>
  <radialGradient id="vig" cx="50%" cy="48%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#4a3410" stop-opacity=".35"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="${SEA}"/><g stroke="#AAC4C4" stroke-width="2" fill="none" opacity=".8">${waves}</g>
  <path d="${landD}" fill="none" stroke="#AAC4C4" stroke-width="22" stroke-linejoin="round" opacity=".7"/>
  <path d="${landD}" fill="${LAND}" stroke="${NAVY}" stroke-width="2" stroke-linejoin="round" fill-rule="nonzero"/>
  <rect width="${W}" height="${H}" filter="url(#blot)"/><rect width="${W}" height="${H}" filter="url(#grain)"/>
  ${s}<rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect x="5" y="5" width="${W - 10}" height="${H - 10}" fill="none" stroke="${NAVY}" stroke-width="4"/><rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${NAVY}" stroke-width="1.4"/></svg>`;
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(`<style>body{margin:0}</style>${svg}`); await p.waitForTimeout(200);
  await p.screenshot({ path: out.replace(/\.png$/, "@2x.png") }); await b.close();
  // checks from STEPS.md: measure known distances with the map's own scale
  const dist = (a, b) => { const A = P(...a), B = P(...b); return Math.hypot(A[0] - B[0], A[1] - B[1]) / PX_MI; };
  console.log("Rabaul-Ballale on map:", dist(RABAUL, BALLALE).toFixed(0), "mi (real ~313)");
  console.log("Henderson-Buin on map:", dist(HENDERSON, BUIN).toFixed(0), "mi (real ~352)");
  console.log("wrote", out.replace(/\.png$/, "@2x.png"));
})();
