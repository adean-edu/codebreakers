/* sandslu: "Ultra at dawn", scene-r3-ul. loop 24 ticks. */
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
const S = {}, CH = {}, HOLD = { ua: 3, ub: 4, uc: 4, ud: 6, ue: 12 };

// ---- January 1942: an Ultra liaison officer decodes a signal in a signals truck at dawn
CH.sandslu = { ua: 4, ub: 6, uc: 3, ud: 4, ue: 2 };
S.sandslu = (p) => {
  const c = Cv(160, 70, "K"), ua = p.ua || 0, ub = p.ub || 0, uc = p.uc || 0, ud = p.ud || 0, ue = p.ue || 0;
  c.sky(0, 36, [["D", 4], ["Q", 9], ["N", 14], ["B", 19], ["m", 24], ["A", 28], ["l", 36]]); stars(c, 5, 52);
  c.e(34, 33, 6, 6, "W"); c.e(34, 33, 4, 4, "A");                                                              // sun just up behind the far dune
  c.poly([[0, 36], [30, 33], [60, 35], [100, 32], [130, 35], [160, 33], [160, 70], [0, 70]], "s");               // far dunes, hazy
  c.l(0, 36, 30, 33, "m"); c.l(30, 33, 60, 35, "m"); c.l(60, 35, 100, 32, "m"); c.l(100, 32, 130, 35, "m"); c.l(130, 35, 159, 33, "m");
  // far camp: two tents and a lorry on the horizon
  c.poly([[118, 37], [124, 32], [130, 37]], "H"); c.poly([[135, 37], [139, 33], [144, 37]], "C"); c.r(146, 34, 152, 37, "C"); c.r(147, 32, 149, 33, "H");
  // near ground: smooth sand, lit slope at the top, long shadows to the right
  c.poly([[0, 41], [50, 39], [110, 41], [160, 38], [160, 69], [0, 69]], "m");
  c.l(0, 41, 50, 39, "l"); c.l(50, 39, 110, 41, "l"); c.l(110, 41, 159, 38, "l");
  c.poly([[0, 42], [50, 40], [110, 42], [160, 39], [160, 41], [110, 44], [50, 42], [0, 44]], "l");
  c.r(0, 66, 159, 69, "s");                                                                                       // darker sand in the foreground
  // wind-blown sand: low streaks drifting right (drawn before the objects so they stay behind them)
  for (let i = 0; i < 40; i++) { const y = 46 + ((i * 7) % 21), len = 3 + (i % 3), x0 = (i * 37 + ub * 4) % 160, t = (y < 58 ? "l" : "s"); for (let k = 0; k < len; k++) c.p((x0 + k) % 160, y, t); }
  // ground shadow of the truck
  c.r(76, 58, 140, 62, "s");
  // aerial wire to a pole on the left
  c.r(24, 22, 24, 56, "E"); c.p(23, 22, "g"); c.p(25, 22, "g");
  // truck: cab and hood
  c.r(52, 47, 58, 56, "O"); c.r(52, 47, 52, 56, "V"); c.r(51, 49, 51, 54, "K");                                    // hood with lit edge
  c.r(58, 41, 72, 56, "O"); c.r(58, 41, 72, 41, "V"); c.r(59, 43, 63, 47, "B"); c.l(59, 43, 63, 43, "W"); c.r(66, 43, 70, 47, "E");   // cab, windscreen
  c.r(58, 52, 72, 52, "E"); c.r(60, 55, 70, 55, "E");
  // the box body, cut away to show the lit interior
  c.r(73, 36, 123, 37, "O"); c.r(73, 36, 123, 36, "V"); c.r(72, 38, 72, 57, "O"); c.r(124, 38, 124, 57, "O");   // roof and frame
  c.r(73, 38, 123, 56, "E"); c.r(73, 56, 123, 57, "C");                                                           // dark interior and floor
  const lx = 100, ly = 43, rr = [8, 7, 8, 6][ua];                                                                  // lamp glow: warm pool
  c.r(73, 38, 123, 53, "C"); c.e(lx + 4, ly + 4, rr + 10, rr, "s"); c.e(lx + 4, ly + 4, rr + 6, rr - 2, "m"); c.e(lx + 3, ly + 4, rr + 2, rr - 4, "l"); c.r(73, 36, 123, 37, "O"); c.r(73, 36, 123, 36, "V");
  for (let y = 38; y < 56; y++) for (let x = 73; x < 124; x++) { /* keep interior walls inside frame */ }
  c.r(lx, 38, lx, ly - 1, "g"); c.r(lx - 1, ly, lx + 1, ly + 2, "A"); c.p(lx, ly + 1, "W"); c.r(lx - 1, ly - 1, lx + 1, ly - 1, "C");   // hanging lantern
  c.r(73, 54, 123, 56, "C"); c.r(73, 54, 123, 54, "H");                                                           // floor edge
  // table, radio, paper
  c.r(93, 47, 120, 47, "l"); c.r(93, 48, 120, 48, "s"); c.r(95, 49, 96, 56, "E"); c.r(117, 49, 118, 56, "E");
  c.r(105, 40, 116, 46, "C"); c.r(105, 40, 116, 40, "H"); c.r(106, 41, 111, 45, "E"); c.r(113, 42, 115, 44, "g");   // radio set
  c.p(112, 43, "A"); c.p(107, 42, "A"); c.p(109, 42, ue ? "R" : "A"); c.p(107, 44, "g"); c.p(110, 44, "g");           // dial lights, one blinks
  c.r(95, 46, 100, 46, "W"); c.r(96, 45, 99, 45, "g");                                                           // pad of paper and one-time pad
  // the liaison officer, seated: cap, lit face, khaki jacket
  c.r(86, 39, 90, 39, "O"); c.r(86, 40, 91, 40, "V"); c.r(91, 40, 92, 40, "E");                                  // cap and peak (to the right)
  c.r(87, 41, 91, 43, "m"); c.r(90, 41, 91, 43, "l"); c.p(91, 42, "E");                                           // face, lit from the right, eye
  c.r(86, 44, 91, 50, "O"); c.r(90, 44, 91, 50, "V"); c.r(86, 44, 86, 50, "E"); c.r(86, 47, 91, 47, "E");         // jacket and belt
  c.r(89, 51, 96, 52, "V"); c.r(95, 53, 96, 55, "V"); c.r(95, 56, 97, 56, "K"); c.r(87, 51, 88, 55, "E");         // thigh, shin, boot, far leg
  c.r(88, 50, 91, 50, "V");
  const hx = [0, 1, 0, -1][ud];                                                                                   // writing hand
  c.r(92, 45, 93 + hx, 46, "V"); c.l(93, 46, 94 + hx, 46, "l"); c.p(95 + hx, 46, "A"); c.p(96 + hx, 46, "l");
  c.r(86, 51, 94, 51, "V");
  // wheels
  [[62, 58], [96, 58], [112, 58]].forEach(([x, y]) => { c.e(x, y, 4, 4, "K"); c.e(x, y, 1.6, 1.6, "H"); });
  // aerial mast on the roof, with a pennant
  c.r(80, 14, 80, 35, "E"); c.r(79, 35, 81, 36, "C");
  c.l(80, 14, 80, 12, "g"); c.p(80, 11, "W");
  const pen = [[[81, 13], [86, 13], [86, 14]], [[81, 13], [86, 14], [86, 15]], [[81, 13], [86, 12], [86, 13]]][uc];
  c.poly([pen[0], pen[1], pen[2], [81, 15]], "R");
  for (let x = 24; x <= 80; x++) c.p(x, Math.round(22 + (x - 24) * (14 - 22) / 56 + 2.5 * Math.sin((x - 24) / 56 * Math.PI)), "g");
  // a second man outside, a dispatch rider-style courier with a folder, cap and green coat
  { const x = 141, yb = 66;
    c.r(x - 2, yb - 17, x + 1, yb - 17, "H"); c.r(x - 3, yb - 16, x + 2, yb - 16, "H"); c.r(x - 4, yb - 15, x - 3, yb - 15, "C");   // cap, peak left
    c.r(x - 2, yb - 15, x + 1, yb - 13, "m"); c.r(x - 2, yb - 15, x - 2, yb - 13, "l"); c.p(x - 2, yb - 14, "E");
    c.r(x - 3, yb - 12, x + 2, yb - 5, "O"); c.r(x - 3, yb - 12, x - 3, yb - 5, "V"); c.r(x + 2, yb - 12, x + 2, yb - 5, "E"); c.r(x - 3, yb - 8, x + 2, yb - 8, "E");
    c.r(x - 3, yb - 4, x - 1, yb - 1, "C"); c.r(x + 1, yb - 4, x + 2, yb - 1, "C"); c.r(x - 4, yb, x - 1, yb, "K"); c.r(x + 1, yb, x + 3, yb, "K");
    c.r(x - 6, yb - 10, x - 4, yb - 8, "O"); c.r(x - 7, yb - 9, x - 5, yb - 7, "W"); c.p(x - 7, yb - 7, "l"); }          // arm out with the folder
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
