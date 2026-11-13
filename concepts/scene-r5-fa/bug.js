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
  c.sky(0, 30, [["K", 6], ["D", 14], ["E", 24], ["C", 28], ["s", 31]]); stars(c, 9, 41);
  for (let x = 0; x < 160; x++) if ((x * 7) % 11 < 4) c.p(x, 22, "C");                                        // a thin cloud bank in the afterglow
  // far bank: low trees and a few willows
  for (let x = 0; x < 160; x++) { const top = 26 + Math.round(1.8 * Math.sin(x / 5) + 1.4 * Math.sin(x / 1.7) + hs(x, 2, 7) * 1.2); c.r(x, top, x, 32, "K"); }
  [[18, 20], [63, 21], [121, 19]].forEach(([x, top]) => c.e(x, top + 5, 5, 6, "K"));
  // the river: dark water, the afterglow reflected in broken streaks
  c.r(0, 33, 159, 45, (x, y) => (y < 37 ? "N" : y < 41 ? "Q" : "E"));
  for (let y = 33; y <= 45; y++) for (let x = 0; x < 160; x++) { const k = (x + y * 7 + rv * 3) % 13; if (y % 2 === 0 && k < 3) c.p(x, y, y < 37 ? "m" : y < 41 ? "B" : "N"); if (y % 3 === 1 && (x * 3 + y + rv * 5) % 17 === 0) c.p(x, y, "N"); }
  // near bank: grass and mud
  c.poly([[0, 46], [40, 44], [100, 45], [160, 44], [160, 69], [0, 69]], (x, y) => (hs(x, y, 13) > .9 ? "O" : hs(x, y, 4) > .55 ? "E" : hs(x, y, 6) > .5 ? "C" : "E"));
  c.l(0, 46, 40, 44, "s"); c.l(40, 44, 100, 45, "s"); c.l(100, 45, 159, 44, "s");                              // mud line at the water
  // reeds along the edge, leaning with the breeze
  for (let i = 0; i < 40; i++) { const x = 2 + i * 4 + (i % 3), h = 6 + (i * 5) % 6, lean = rd ? 1 : 0; if (x > 30 && x < 48) continue;
    for (let k = 0; k < h; k++) c.p(x + (k > h / 2 ? lean : 0), 46 - k, k > h - 2 ? "s" : i % 4 ? "O" : "V"); }
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
  // three Home Army men: one kneels by the fins with a lantern, one points, one brings a rope
  const man = (x, yb, cap) => { c.r(x - 1, yb - 10, x + 1, yb - 8, "K"); if (cap) c.r(x - 2, yb - 10, x + 1, yb - 10, "K");
    c.poly([[x - 2, yb - 7], [x + 2, yb - 7], [x + 2, yb - 2], [x - 2, yb - 2]], "K"); c.l(x - 1, yb - 1, x - 1, yb, "K"); c.l(x + 1, yb - 1, x + 1, yb, "K"); };
  // kneeling man (left of the tail), lantern on the ground in front of him
  c.r(104, 50, 106, 52, "K"); c.r(103, 53, 107, 57, "K"); c.r(101, 57, 107, 58, "K"); c.l(102, 54, 99, 55, "K");
  const LX = 99, LY = 57; c.r(LX - 1, LY - 2, LX + 1, LY, "C"); c.p(LX, LY - 3, "K");
  c.p(LX, LY - 1, ["A", "A", "m", "A"][lt]); c.p(LX - 1, LY - 1, lt === 2 ? "s" : "m"); c.p(LX + 1, LY - 1, lt === 1 ? "s" : "m");
  const glow = [5, 6, 4, 6][lt];
  for (let dy = -glow; dy <= glow; dy++) for (let dx = -glow * 2; dx <= glow * 2; dx++) { const d = (dx * dx) / (4 * glow * glow) + (dy * dy) / (glow * glow); const x = LX + dx, y = LY - 1 + dy;
    if (d <= 1 && d > .08 && (x + y) % 2 === 0) { const q = c.c[y] && c.c[y][x]; if (q === "K" && y > 46 && (x < 96 || x > 107)) continue; if (q === "W") c.p(x, y, "l"); else if (q === "g") c.p(x, y, "W"); else if (q === "D" || q === "E") c.p(x, y, "s"); else if (q === "C") c.p(x, y, "m"); } }
  man(116, 60, 1); c.l(114, 52, 109, 49, "K"); c.p(108, 49, "K"); for (let y = 51; y < 58; y++) c.p(114, y, "m"); c.p(115, 50, "m");                                               // pointing at the rocket
  man(136, 63, 0); c.e(140, 57, 2.5, 2, "s"); c.e(140, 57, 1.2, .8, "K"); for (let y = 54; y < 61; y++) c.p(134, y, "C");
  c.r(103, 50, 103, 52, "m"); c.r(102, 53, 102, 57, "m"); c.p(104, 49, "m");                                        // lantern light on the kneeling man                                         // rope coil on his shoulder
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
