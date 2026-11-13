/* Concept for scene-r4-ul: "Dawn at a Malta airfield" - a recon plane readied to be seen first, 1942.
   art.js style; loop: ma 2x2, mb 3x4, mc 2x12, md 2x12 -> every period divides 24 ticks (2 s). State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { ma: 2, mb: 4, mc: 12, md: 12 };

CH.maltadawn = { ma: 2, mb: 3, mc: 2, md: 2 };
S.maltadawn = (p) => {
  const c = Cv(160, 70, "K"), ma = p.ma || 0, mb = p.mb || 0, mc = p.mc || 0, md = p.md || 0;
  c.sky(0, 36, [["D", 4], ["E", 9], ["C", 15], ["H", 20], ["s", 25], ["m", 30], ["l", 37]]); stars(c, 6, 17);
  c.e(26, 29, 8, 7, "A"); c.e(26, 29, 5, 4, "W");                                                           // the sun just up behind the wall
  // far town: flat limestone roofs, a church dome and a bell tower
  for (let x = 0; x < 160; x++) { const h = 4 + ((x >> 3) * 5) % 7; c.r(x, 38 - h, x, 38, (x >> 3) % 3 ? "s" : "r"); if (x % 8 === 0) c.r(x, 38 - h, x, 38, "E"); }
  c.e(82, 31, 6, 5, "m"); c.r(76, 32, 88, 38, "l"); c.r(78, 24, 79, 26, "m"); c.p(78, 23, "W");
  c.r(111, 24, 115, 38, "l"); c.r(111, 24, 111, 38, "m"); c.r(112, 21, 114, 23, "l"); c.p(113, 20, "W");
  for (let x = 0; x < 160; x += 6) c.p(x + 2, 36, "K");
  // stone dispersal wall with two waiting bombers' tails behind it
  [[108, 25], [138, 23]].forEach(([x, y]) => { c.poly([[x, 41], [x + 2, y + 8], [x + 6, y], [x + 9, y], [x + 11, 41]], "O"); c.l(x + 2, y + 8, x + 6, y, "V"); c.r(x + 7, y + 4, x + 8, 41, "C"); c.r(x - 5, 37, x + 17, 37, "O"); c.r(x - 5, 36, x + 17, 36, "V"); c.p(x + 8, y + 8, "W"); c.p(x + 8, y + 9, "R"); });
  c.r(100, 41, 159, 49, (x, y) => ((x + (((y - 41) >> 1) & 1) * 4) % 8 === 0 || (y - 41) % 3 === 2 ? "s" : "l"));
  c.r(100, 41, 159, 41, "W");
  // airfield ground, lit from the sun on the left; runway strip
  c.r(0, 39, 159, 69, (x, y) => (y < 60 ? "m" : "s")); c.r(0, 39, 99, 39, "l"); c.r(100, 50, 159, 50, "s");
  c.r(0, 61, 159, 68, "E"); c.r(0, 61, 159, 61, "C");
  for (let x = 0; x < 160; x++) if (hs(x, 66, 3) > .85) c.p(x, 64 + (x % 3), "D");   // worn, patched surface (no painted lines)
  // windsock on a pole at the left
  c.r(12, 33, 12, 48, "E"); c.p(12, 32, "g");
  const sag = [1, 0, 1][mb];
  for (let i = 0; i < 6; i++) { const x = 13 + i, y = 33 + (i * sag >> 1) + (i > 3 ? sag : 0); c.r(x, y, x, y + 2 - (i > 3 ? 1 : 0), i % 2 ? "W" : "R"); }
  // ---- the twin-engined reconnaissance plane, nose left (drawn on a spare canvas, lifted 6 rows)
  const q = Cv(160, 70, "."), dy = -6;
  q.e(78, 63, 30, 1.3, "s");                                                                                     // ground shadow
  q.poly([[82, 47], [98, 47], [100, 50], [84, 50]], "C"); q.r(84, 48, 92, 51, "E");                            // far wing, far engine
  q.poly([[98, 40], [106, 35], [110, 35], [108, 48], [96, 48]], "V"); q.l(98, 40, 106, 35, "G"); q.r(108, 36, 109, 47, "O");   // fin
  q.poly([[97, 46], [115, 46], [115, 48], [97, 50]], "O"); q.l(97, 46, 114, 46, "V");                           // tailplane
  const fy = (x) => { const t = (x - 50) / 62; return t < .15 ? 2.5 + 7 * t : t > .6 ? 5 - (t - .6) * 8 : 5; };
  for (let x = 50; x <= 112; x++) { const r = fy(x); for (let y = Math.round(51 - r); y <= Math.round(51 + r); y++) q.p(x, y, y < 50 ? "V" : y < 53 ? "G" : "O"); }
  for (let x = 51; x <= 111; x++) { q.p(x, Math.round(51 - fy(x)), "G"); q.p(x, Math.round(51 + fy(x)), "E"); }
  q.poly([[50, 52], [52, 46], [60, 45], [61, 52]], "B"); q.r(52, 46, 59, 46, "g"); q.r(54, 47, 54, 51, "H"); q.r(57, 47, 57, 51, "H");   // glazed nose
  q.r(62, 43, 73, 47, "N"); q.r(62, 43, 73, 43, "g"); q.r(67, 44, 67, 47, "H");
  q.r(63, 44, 65, 44, "K"); q.r(63, 45, 65, 47, "m"); q.r(63, 45, 63, 47, "l"); q.p(65, 45, "K");              // pilot: cap, face lit on the left
  q.e(90, 49, 3.6, 3.6, "N"); q.e(90, 49, 2.6, 2.6, "W"); q.e(90, 49, 1.3, 1.3, "R");                         // roundel
  q.r(100, 49, 101, 52, "W"); q.r(103, 49, 104, 52, "W"); q.r(101, 51, 103, 51, "W");
  q.poly([[68, 52], [88, 52], [97, 61], [58, 61]], "O"); q.l(68, 52, 88, 52, "V"); q.l(58, 61, 97, 61, "E"); q.l(68, 52, 58, 61, "G");   // near wing
  q.r(60, 53, 76, 58, "H"); q.r(60, 53, 76, 53, "g"); q.r(60, 58, 76, 58, "C"); q.e(60, 55.5, 2, 3, "g"); q.p(59, 54, "W");   // nacelle and hub
  q.r(70, 59, 71, 63, "E"); q.e(70.5, 64, 2.4, 2.4, "K"); q.p(70, 63, "H"); q.r(54, 52, 55, 62, "C"); q.e(54.5, 63, 2, 2, "K");   // wheels
  q.r(106, 52, 106, 57, "C"); q.e(106, 58, 1.5, 1.5, "K");
  if (ma === 0) { for (let y = 47; y <= 63; y += 2) q.p(58 + (y % 4 ? 0 : 1), y, "g"); q.l(58, 50, 59, 61, "H"); } else { for (let y = 48; y <= 62; y += 2) q.p(58 + (y % 4 ? 1 : 0), y, "g"); q.l(59, 49, 58, 62, "H"); }
  for (let y = 0; y < 70; y++) for (let x = 0; x < 160; x++) if (q.c[y][x] !== ".") c.p(x, y + dy, q.c[y][x]);
  // ---- ground crew
  const man = (x, yb, cap, shirt, armF) => {
    c.r(x - 2, yb - 13, x + 1, yb - 12, cap); c.p(x - 3, yb - 12, cap);                                         // cap with peak left
    c.r(x - 1, yb - 11, x + 1, yb - 9, "m"); c.r(x - 1, yb - 11, x - 1, yb - 9, "l");                           // face, lit left
    c.r(x - 2, yb - 8, x + 2, yb - 4, shirt); c.r(x - 2, yb - 8, x - 2, yb - 4, shirt === "N" ? "B" : "l"); c.r(x + 2, yb - 8, x + 2, yb - 4, "E");
    c.r(x - 2, yb - 3, x + 2, yb - 3, "O");
    c.r(x - 2, yb - 2, x - 1, yb, "m"); c.r(x + 1, yb - 2, x + 2, yb, "s"); c.r(x - 2, yb, x - 1, yb, "H"); c.r(x + 1, yb, x + 2, yb, "H");   // bare legs, boots
    armF(x, yb); };
  // mechanic left of the nose, waves the plane on
  man(30, 66, "W", "m", (x, yb) => { c.r(x + 3, yb - 8, x + 3, yb - 5, "s"); if (mc) { c.l(x - 3, yb - 8, x - 6, yb - 14, "l"); c.p(x - 6, yb - 15, "l"); } else { c.r(x - 3, yb - 8, x - 3, yb - 5, "l"); } });
  // man in blue overalls by the tail with a clipboard
  man(128, 67, "Q", "N", (x, yb) => { c.r(x - 3, yb - 8, x - 3, yb - 6, "B"); c.r(x - 6, yb - 8 - md, x - 4, yb - 6 - md, "W"); c.p(x - 5, yb - 7 - md, "K"); c.r(x + 3, yb - 8, x + 3, yb - 5, "C"); });
  // man in a red shirt hauling the wheel chock rope under the nose
  man(46, 68, "A", "R", (x, yb) => { c.l(x + 3, yb - 7, x + 7, yb - 2, "l"); c.r(x - 3, yb - 8, x - 3, yb - 5, "E"); });
  c.l(53, 66, 56, 66, "g"); c.r(56, 65, 59, 66, "H");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
