/* Concept B for scene-r5-fa: "The find on the Bug River", May 1944.
   art.js style; loop: rv 3x4, rd 2x6, lt 4x2 -> every period divides 24 ticks (2 s). State 0 = the still. */
const PAL = { K: "#07090a", D: "#11161a", E: "#1b2226", C: "#2c373c", H: "#46555b", r: "#7a2a25", R: "#b3352b", s: "#6b4a3a", m: "#a67c5c", l: "#d3ab86", A: "#f0b93a", W: "#e6e3d6", O: "#4a5232", g: "#8d9a96", G: "#5f9e6e", V: "#518c5f", N: "#33627f", Q: "#244560", B: "#4f7d96" };
const hs = (x, y, s) => { let n = (x * 374761393 + y * 668265263 + (s || 0) * 69069) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967295; };
function Cv(w, h, bg) {
  const c = Array.from({ length: h }, () => Array(w).fill(bg || "K")), v = (a, x, y) => (typeof a === "function" ? a(x, y) : a);
  const o = { w, h, c,
    p(x, y, ch) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h) c[y][x] = ch; },
    r(x0, y0, x1, y1, a) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) o.p(x, y, v(a, x, y)); },
    e(cx, cy, rx, ry, a) { for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) { const u = (x + .5 - cx) / rx, q = (y + .5 - cy) / ry; if (u * u + q * q <= 1) o.p(x, y, v(a, x, y)); } },
    l(x0, y0, x1, y1, a) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); o.p(x, y, v(a, x, y)); } },
    poly(pts, a) { const ys = pts.map((q) => q[1]); for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) { const yc = y + .5, xs = []; for (let i = 0; i < pts.length; i++) { const A = pts[i], B = pts[(i + 1) % pts.length]; if ((A[1] <= yc && B[1] > yc) || (B[1] <= yc && A[1] > yc)) xs.push(A[0] + (yc - A[1]) * (B[0] - A[0]) / (B[1] - A[1])); } xs.sort((a, b) => a - b); for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) o.p(x, y, v(a, x, y)); } },
    sky(y0, y1, list) { for (let y = y0; y <= y1; y++) for (let x = 0; x < w; x++) { let i = list.findIndex((q) => y < q[1]); if (i < 0) i = list.length - 1; let ch = list[i][0]; if (i < list.length - 1 && y >= list[i][1] - 2 && ((x + y) & 1)) ch = list[i + 1][0]; c[y][x] = ch; } } };
  return o;
}
const lighter = { E: "C", C: "H", B: "g", D: "E", H: "g", N: "B", Q: "N", O: "V" };
const stars = (c, y1, seed) => { for (let y = 0; y < y1; y++) for (let x = 0; x < c.w; x++) if (hs(x, y, seed) > .985) c.p(x, y, "W"); };
const S = {}, CH = {}, HOLD = { rv: 4, rd: 6, lt: 2 };

// ---- The Bug River near Sarnaki, May 1944: the Home Army finds a V-2 that came down almost intact
CH.bug = { rv: 3, rd: 2, lt: 4 };
S.bug = (p) => {
  const c = Cv(160, 70, "K"), rv = p.rv || 0, rd = p.rd || 0, lt = p.lt || 0;
  c.sky(0, 30, [["D", 5], ["E", 12], ["C", 20], ["H", 25], ["s", 28], ["m", 31]]); stars(c, 7, 41); 
  for (let x = 0; x < 160; x++) if ((x * 7) % 11 < 4) c.p(x, 22, "g");                                        // a thin cloud bank in the afterglow
  // far bank: low trees and a few willows
  for (let x = 0; x < 160; x++) { const top = 26 + Math.round(1.8 * Math.sin(x / 5) + 1.4 * Math.sin(x / 1.7) + hs(x, 2, 7) * 1.2); c.r(x, top, x, 32, "K"); }
  [[18, 20], [63, 21], [121, 19]].forEach(([x, top]) => c.e(x, top + 5, 5, 6, "K"));
  // the river: dark water, the afterglow reflected in broken streaks
  c.r(0, 33, 159, 45, (x, y) => (y < 37 ? "B" : y < 41 ? "N" : "Q"));
  for (let y = 33; y <= 45; y++) for (let x = 0; x < 160; x++) { const k = (x + y * 7 + rv * 3) % 13; if (y % 2 === 0 && k < 3) c.p(x, y, y < 37 ? "l" : y < 41 ? "m" : "B"); if (y % 3 === 1 && (x * 3 + y + rv * 5) % 17 === 0) c.p(x, y, "N"); }
  // near bank: grass and mud
  c.poly([[0, 46], [40, 44], [100, 45], [160, 44], [160, 69], [0, 69]], (x, y) => { const n = hs(x >> 2, y >> 1, 4); return hs(x, y, 13) > .97 ? "V" : n > .78 ? "E" : (n > .62 && (x + y) % 2) ? "E" : "O"; });
  c.l(0, 46, 40, 44, "s"); c.l(40, 44, 100, 45, "s"); c.l(100, 45, 159, 44, "s");                              // mud line at the water
  // reeds along the edge, leaning with the breeze
  for (let i = 0; i < 27; i++) { const x = 2 + i * 6 + (i % 3), h = 6 + (i * 5) % 6, lean = rd ? 1 : 0; if (x > 30 && x < 48) continue;
    for (let k = 0; k < h; k++) c.p(x + (k > h / 2 ? lean : 0), 46 - k, k > h - 2 ? "m" : i % 4 ? "V" : "G"); }
  // ---- the V-2, lying on the bank, nose in the mud by the reeds, black-and-white test paint
  const RY = 52, X0 = 34, X1 = 98;                                                                               // nose tip .. tail end
  const radius = (x) => { const t = (x - X0) / (X1 - X0); return t < .18 ? 3.6 * Math.sqrt(t / .18) : t > .9 ? 3.6 - (t - .9) * 8 : 3.6; };
  for (let x = X0; x <= X1; x++) { const r = radius(x); for (let y = Math.round(RY - r); y <= Math.round(RY + r); y++) {
      const seg = Math.floor((x - X0) / 8), top = y < RY; let col = (seg + (top ? 0 : 1)) % 2 ? "K" : "W";
      if (col === "W" && y > RY + 1) col = "g"; if (col === "K" && y < RY - 1) col = "C"; c.p(x, y, col); } }
  c.l(X0 + 10, RY - 3, X1 - 6, RY - 3, "W");                                                                      // highlight along the top
  // tail fins: one up, one down (half buried), with the jet vane ring
  c.poly([[86, 49], [96, 41], [99, 41], [99, 49]], "C"); c.l(86, 49, 96, 41, "H"); c.l(96, 41, 99, 41, "g"); c.poly([[88, 55], [97, 61], [99, 61], [99, 55]], "C");
  c.r(98, 50, 100, 54, "H"); c.p(101, 52, "K");
  // damage: a dented panel and a split near the middle, the nose pushed into the mud
  c.r(60, 49, 63, 50, "H"); c.p(61, 50, "K"); c.l(70, 49, 72, 55, "K");
  c.e(34, 54, 5, 2.4, "s"); c.r(30, 55, 40, 56, "E"); c.p(29, 53, "s"); c.p(39, 57, "s");
  // furrow it ploughed in the bank
  for (let x = 100; x < 124; x++) c.p(x, 54 + ((x * 3) % 2), x % 3 ? "s" : "E");
  // three Home Army men, lit from the lantern on their left: caps, faces, olive and brown coats
  const person = (x, yb, coat, armL, armR) => {
    c.r(x - 1, yb - 13, x + 1, yb - 13, "K"); c.r(x - 2, yb - 12, x + 1, yb - 12, "K");                          // cap and peak (peak to the left)
    c.r(x - 1, yb - 11, x + 1, yb - 10, "m"); c.p(x - 1, yb - 11, "l"); c.p(x - 1, yb - 10, "l"); c.p(x + 1, yb - 10, "s");   // face, lit side left
    c.r(x - 2, yb - 9, x + 2, yb - 5, coat); c.r(x + 2, yb - 9, x + 2, yb - 5, "E"); c.r(x - 2, yb - 9, x - 2, yb - 5, coat === "H" ? "g" : "m");   // coat with lit and shaded edges
    c.r(x - 2, yb - 4, x + 2, yb - 4, "K");                                                                        // belt
    c.r(x - 2, yb - 3, x - 1, yb - 1, "E"); c.r(x + 1, yb - 3, x + 2, yb - 1, "E"); c.r(x - 2, yb, x - 1, yb, "K"); c.r(x + 1, yb, x + 2, yb, "K");   // legs, boots
    if (armL) armL(x, yb); if (armR) armR(x, yb); };
  // kneeling man by the tail, reaching toward the lantern
  { const x = 106, yb = 58;
    c.r(x - 1, yb - 12, x + 1, yb - 12, "K"); c.r(x - 2, yb - 11, x + 1, yb - 11, "K");
    c.r(x - 1, yb - 10, x + 1, yb - 9, "m"); c.p(x - 1, yb - 10, "l"); c.p(x - 1, yb - 9, "l");
    c.r(x - 2, yb - 8, x + 2, yb - 4, "s"); c.r(x - 2, yb - 8, x - 2, yb - 4, "m"); c.r(x + 2, yb - 8, x + 2, yb - 4, "E");
    c.r(x - 5, yb - 3, x + 1, yb - 2, "E"); c.r(x - 5, yb - 1, x - 4, yb, "E");                                     // thigh forward, shin down to the ground
    c.r(x + 1, yb - 3, x + 3, yb, "E"); c.r(x + 2, yb, x + 5, yb, "K");                                              // other knee down, boot behind
    c.l(x - 2, yb - 7, x - 6, yb - 3, "s"); c.p(x - 7, yb - 2, "l"); }                                                // arm to the lantern, lit hand
  // standing man pointing at the rocket
  person(118, 59, "H", (x, yb) => { c.l(x - 3, yb - 8, x - 8, yb - 10, "g"); c.p(x - 9, yb - 10, "l"); }, (x, yb) => c.r(x + 3, yb - 8, x + 3, yb - 5, "E"));
  // man arriving with a coil of rope over his shoulder
  person(138, 62, "s", (x, yb) => c.r(x - 3, yb - 8, x - 3, yb - 5, "m"), (x, yb) => c.r(x + 3, yb - 8, x + 3, yb - 5, "E"));
  c.e(141, 55, 2.4, 2.2, "m"); c.e(141, 55, 1.2, 1, "s"); c.p(141, 55, "E");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
