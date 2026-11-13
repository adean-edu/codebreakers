/* Concept B for scene-r4-ul: "Through the periscope" - a Malta submarine sights a darkened convoy at night, 1942.
   art.js style; loop: ja 2x12, jb 3x8, jc 6x4 -> every period divides 24 ticks (2 s). State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { ja: 12, jb: 8, jc: 4 };

CH.periscope = { ja: 2, jb: 3, jc: 6 };
S.periscope = (p) => {
  const c = Cv(160, 70, "K"), ja = p.ja || 0, jb = p.jb || 0, jc = p.jc || 0;
  const hz = 41 + ja;                                                                                          // horizon rocks one row with the swell
  c.sky(0, hz, [["D", 5], ["E", 11], ["C", 18], ["H", 25], ["N", 31], ["B", 60]]); stars(c, 16, 23);
  c.r(0, hz, 159, hz, "g");                                                                                    // hazy horizon line
  // sea: dark swell with starlit streaks that widen toward us
  c.r(0, hz + 1, 159, 69, (x, y) => (y < hz + 6 ? "N" : y < hz + 16 ? "Q" : "N"));
  for (let y = hz + 2; y < 70; y++) for (let x = 0; x < 160; x++) { const k = (x * 3 + y * 5 + (y >> 2) * 7) % 23; if (k < 2 + ((y - hz) >> 3)) c.p(x, y, y < hz + 6 ? "B" : "Q" === "x" ? "Q" : "B"); }
  // ---- the merchant ship, darkened, bows left, about 3/4 of a mile off
  const mp = (dx, f) => ({ r: (a, b, x2, d, e) => c.r(Math.round(dx + a * f), b, Math.round(dx + x2 * f), d, e), l: (a, b, x2, d, e) => c.l(Math.round(dx + a * f), b, Math.round(dx + x2 * f), d, e), p: (a, b, e) => c.p(Math.round(dx + a * f), b, e), poly: (pts, e) => c.poly(pts.map(([a, b]) => [dx + a * f, b]), e) });
  const M = mp(47 - 34 * .72, .72), E = mp(11.8, .7);
  const sy = hz;  const sy2 = hz + 3;                                                                                               // waterline row
  M.poly([[40, sy - 7], [88, sy - 7], [86, sy], [38, sy]], "C"); M.r(40, sy - 7, 88, sy - 7, "H");             // hull with a lit deck edge
  M.poly([[36, sy - 9], [40, sy - 7], [38, sy], [34, sy]], "C"); M.r(40, sy - 3, 86, sy - 3, "E");
  M.r(44, sy - 12, 60, sy - 8, "E"); M.r(44, sy - 12, 60, sy - 12, "H"); M.r(50, sy - 15, 56, sy - 13, "C"); M.r(50, sy - 15, 56, sy - 15, "H");   // bridge
  M.r(62, sy - 14, 65, sy - 8, "K"); M.r(62, sy - 14, 65, sy - 14, "H");                                       // funnel
  M.r(76, sy - 11, 80, sy - 8, "E"); M.r(76, sy - 11, 80, sy - 11, "H");                                       // after house
  M.r(46, sy - 22, 46, sy - 12, "C"); M.r(73, sy - 20, 73, sy - 8, "C"); M.l(46, sy - 20, 36, sy - 8, "C"); M.l(73, sy - 18, 84, sy - 8, "C");   // masts, derricks
  M.r(40, sy - 10, 43, sy - 8, "H");                                                                           // deck cargo
  M.l(34, sy + 1, 28, sy + 2, "B"); M.l(88, sy + 1, 96, sy + 2, "B");                                          // wash
  M.p(46, sy - 22, jc === 1 ? "H" : "A"); if (jc !== 1) { M.p(45, sy - 22, "s"); M.p(47, sy - 22, "s"); M.p(46, sy - 21, "s"); }   // masthead lamp blinks once
  // ---- the escort: low, fast, a gun forward and a thin mast, with a bow wave
  E.poly([[106, sy - 3], [134, sy - 3], [132, sy], [102, sy]], "C"); E.r(106, sy - 3, 134, sy - 3, "H");
  E.r(112, sy - 6, 118, sy - 4, "E"); E.r(112, sy - 6, 118, sy - 6, "H"); E.r(122, sy - 5, 124, sy - 4, "E"); E.r(115, sy - 11, 115, sy - 7, "C"); E.r(105, sy - 5, 107, sy - 4, "H");
  E.l(100, sy + 1, 103, sy, "W"); E.l(98, sy + 2, 102, sy + 1, "g"); E.l(132, sy + 1, 142, sy + 2, "B");
  // ---- lens: black outside the circle, brass rim, crosshair and range ticks
  const cx = 79.5, cy = 34.5, R = 33.5;
  for (let y = 0; y < 70; y++) for (let x = 0; x < 160; x++) { const d = Math.hypot(x - cx, y - cy); if (d > R) c.c[y][x] = "K"; else if (d > R - 1.2) c.c[y][x] = "C"; }
  c.r(80, 5, 80, 28, "g"); c.r(80, 41, 80, 64, "g"); c.r(48, 35, 73, 35, "g"); c.r(87, 35, 111, 35, "g");           // crosshair, gap at the centre
  for (let k = 1; k <= 5; k++) { c.r(87 + k * 4 - 4, 33, 87 + k * 4 - 4, 37, "g"); c.r(73 - k * 4 + 4, 33, 73 - k * 4 + 4, 37, "g"); }
  for (let k = 0; k < 4; k++) { c.r(78, 43 + k * 5, 82, 43 + k * 5, "g"); }
  // spray droplets on the lens
  [[[52, 22], [53, 22], [100, 48]], [[64, 52], [65, 52], [108, 24], [109, 25]], [[96, 18], [97, 18], [58, 44]]][jb].forEach(([x, y]) => { c.p(x, y, "W"); c.p(x + 1, y, "g"); });
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
