/* Concept for scene-r5-mi: "Building Major Martin" - the planners assemble the fake officer's life at a lamp-lit desk.
   Loop 24 ticks (2 s): xa 2x12, xb 4x6, xc 3x8. State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { xa: 12, xb: 6, xc: 8 };

CH.mincedesk = { xa: 2, xb: 4, xc: 3 };
S.mincedesk = (p) => {
  const c = Cv(160, 70, "D"), xa = p.xa || 0, xb = p.xb || 0, xc = p.xc || 0;
  const LX = 17, LY = 27;                                                  // lamp position
  // wall and desk
  c.r(0, 0, 159, 27, "E"); c.r(0, 27, 159, 69, "s");
  for (let y = 30; y < 70; y += 5) for (let x = 0; x < 160; x++) if ((x + y * 3) % 23 > 3) c.p(x, y, "E");   // plank seams (subtle)
  c.r(0, 27, 159, 28, "m"); c.r(0, 29, 159, 29, "E");                      // desk edge lip
  c.r(0, 5, 159, 5, "D");                                                   // picture rail
  // wall map, pinned
  c.r(72, 8, 130, 25, "s"); c.r(73, 9, 129, 24, "Q");
  c.poly([[74, 9], [100, 9], [104, 13], [96, 15], [90, 14], [86, 18], [82, 17], [78, 14], [74, 15]], "O");      // Europe
  c.poly([[90, 15], [96, 15], [100, 18], [103, 21], [100, 22], [96, 19], [92, 17]], "V");                      // Italy
  c.poly([[104, 10], [128, 10], [128, 13], [118, 14], [110, 14]], "O");
  c.poly([[74, 22], [96, 20], [110, 21], [128, 20], [128, 24], [74, 24]], "O");                                // north Africa
  c.p(101, 22, "V"); c.p(97, 24, "O");                                                                         // Sicily-ish islets
  c.p(98, 20, "R"); c.p(100, 22, "R"); c.p(92, 19, "A");
  c.l(98, 20, 92, 19, "W");
  c.r(74, 9, 128, 9, "B");
  // blotter
  c.r(40, 34, 134, 66, "O"); c.r(40, 34, 134, 34, "V"); c.r(40, 34, 40, 66, "V"); c.r(135, 35, 135, 67, "E"); c.r(41, 67, 135, 67, "E");
  // ---- briefcase with chain
  c.r(46, 55, 88, 57, "E");                                                 // shadow
  c.poly([[48, 41], [86, 41], [88, 46], [46, 46]], "m");                    // lid top face
  c.r(46, 46, 88, 57, "s"); c.r(46, 46, 88, 46, "l"); c.r(46, 57, 88, 57, "r");
  c.r(46, 46, 46, 57, "m"); c.r(88, 46, 88, 57, "E");
  c.r(46, 50, 88, 50, "r"); c.l(48, 41, 86, 41, "l");
  c.r(61, 38, 72, 40, "K"); c.r(62, 39, 71, 39, "D"); c.r(61, 41, 62, 41, "K"); c.r(71, 41, 72, 41, "K"); // handle
  c.r(64, 48, 69, 52, "A"); c.r(65, 49, 68, 51, "s"); c.p(66, 50, "A");    // lock plate
  c.r(52, 48, 53, 51, "A"); c.r(81, 48, 82, 51, "A");                      // side clasps
  // chain from the handle round to the left, links alternating
  for (let x = 30; x < 62; x++) { const y = 41 + Math.round(5 * Math.sin((x - 30) / 31 * Math.PI)) ; c.p(x, 39 + (y - 41) * 0 + Math.round(4 * Math.sin((x - 30) / 31 * Math.PI)), x % 2 ? "W" : "g"); }
  c.e(32, 46, 3, 2, "g"); c.e(32, 46, 1.4, 0.8, "s");                        // ring end
  // ---- Pam's photograph in a small frame (stands up against the case)
  c.r(92, 38, 105, 53, "A"); c.r(93, 39, 104, 52, "W"); c.r(94, 40, 103, 51, "N");
  c.e(98.5, 44, 3, 3.2, "l"); c.r(95, 41, 98, 43, "s"); c.r(96, 41, 101, 41, "s"); c.p(102, 43, "s"); c.r(95, 44, 96, 47, "s");   // hair
  c.p(97, 44, "K"); c.p(100, 44, "K"); c.p(98, 46, "R"); c.p(99, 46, "R");
  c.poly([[94, 51], [95, 48], [102, 48], [103, 51]], "R"); c.r(97, 48, 100, 48, "l");
  c.r(92, 54, 105, 54, "E");
  // ---- letters: papers, one with a red seal
  c.r(108, 39, 128, 53, "W"); c.r(108, 53, 128, 53, "g"); c.r(128, 39, 128, 53, "g");
  for (let y = 42; y <= 50; y += 2) c.r(111, y, 124 - (y % 3) * 2, y, "H");
  c.r(111, 41, 118, 41, "C"); c.r(111, 51, 119, 51, "H");
  c.r(112, 54, 133, 63, "W"); c.r(112, 54, 133, 54, "g"); c.poly([[112, 54], [122, 60], [133, 54]], "g");     // envelope flap
  c.l(112, 63, 121, 58, "g"); c.l(133, 63, 123, 58, "g");
  c.e(122, 60, 2, 2, "R"); c.p(122, 60, "r");                               // seal
  // ---- ticket stubs, keys, coins
  c.r(91, 58, 98, 61, "R"); c.p(91, 58, "O"); c.p(98, 61, "O"); c.r(93, 59, 96, 59, "W"); c.r(93, 60, 95, 60, "l");
  c.r(96, 62, 104, 65, "R"); c.p(104, 62, "O"); c.p(96, 65, "O"); c.r(98, 63, 102, 63, "W"); c.r(98, 64, 101, 64, "l");
  c.e(55, 62, 3, 2, "g"); c.e(55, 62, 1.2, .6, "O"); c.l(58, 62, 64, 64, "g"); c.r(64, 63, 66, 65, "A"); c.r(60, 60, 64, 61, "g"); c.p(64, 60, "A"); c.p(65, 60, "A");  // key ring + keys
  c.e(72, 62, 2.4, 2, "A"); c.e(72, 62, 1.2, 1, "m"); c.e(78, 64, 2.4, 2, "A"); c.e(78, 64, 1.2, 1, "m"); c.e(76, 60, 2.2, 1.8, "l"); c.p(76, 60, "A");     // coins
  // ---- ink bottle and a pen lying by it
  c.r(34, 52, 41, 58, "N"); c.r(34, 52, 34, 58, "B"); c.r(41, 52, 41, 58, "Q"); c.r(36, 50, 39, 51, "K"); c.r(35, 55, 40, 56, "W"); c.r(36, 55, 39, 56, "B");
  c.l(30, 62, 44, 60, "K"); c.l(30, 63, 44, 61, "A"); c.p(29, 62, "A");
  // ---- ashtray with a cigarette (left, under the lamp)
  c.e(26, 63, 5, 2.4, "g"); c.e(26, 63, 3.4, 1.4, "E"); c.l(24, 62, 30, 61, "W"); c.p(31, 61, "A"); c.p(23, 63, "g");
  // ---- lamp: base, arm, shade, bulb
  c.r(LX - 5, LY - 2, LX + 5, LY, "H"); c.r(LX - 5, LY - 2, LX + 5, LY - 2, "g");
  c.l(LX, LY - 3, LX - 4, 15, "H"); c.l(LX + 1, LY - 3, LX - 3, 15, "g");
  c.poly([[LX - 9, 14], [LX + 1, 14], [LX + 6, 20], [LX - 12, 20]], "C"); c.l(LX - 8, 14, LX, 14, "g"); c.l(LX - 11, 20, LX + 5, 20, "H");
  c.r(LX - 10, 21, LX + 3, 21, "W"); c.r(LX - 8, 22, LX + 1, 22, "A");
  // lamp light: a cone down the wall and a pool on the desk
  const warm = { D: "E", E: "C", C: "H", s: "m", m: "l", O: "V", K: "D", H: "g", Q: "N", N: "B" };
  const glow = (r, band) => { for (let y = 0; y < 70; y++) for (let x = 0; x < 160; x++) {
      if (y < 28) continue; const d = Math.hypot((x - 12) / 1.6, (y - 24) / 1.3); if (d > r || (band && d < band)) continue; const ch = c.c[y][x];
      if (warm[ch]) c.c[y][x] = warm[ch]; } };
  c.poly([[LX - 12, 21], [LX + 6, 21], [LX + 30, 27], [LX - 36, 27]], (x, y) => (c.c[y][x] === "E" ? "C" : c.c[y][x]));
  if (!xa) glow(26, 0);
  else { glow(26, 0); glow(30, 26); }
  c.r(LX - 12, 21, LX + 6, 22, "A"); c.r(LX - 10, 21, LX + 3, 21, "W");
  // ---- hand with a pen, writing on the letter (a person's sleeve, cuff, lit hand)
  const wx = [0, 1, 2, 1][xb], wy = [0, 0, 1, 0][xb];
  c.poly([[160, 55], [160, 69], [146, 69], [142, 58]], "O"); c.l(142, 58, 160, 55, "V"); c.l(146, 69, 142, 58, "E");   // sleeve
  c.poly([[141, 57], [147, 61], [143, 63], [138, 59]], "W");                 // cuff
  c.poly([[132 - wx, 49 + wy], [141, 54], [140, 60], [133 - wx, 56 + wy]], "l"); c.l(132 - wx, 49 + wy, 140, 54, "m");  // hand
  c.l(131 - wx, 50 + wy, 136 - wx, 56 + wy, "m"); c.l(131 - wx, 51 + wy, 135 - wx, 56 + wy, "s");                       // fingers
  c.l(137, 52, 124 - wx, 43 + wy, "K"); c.l(137, 53, 125 - wx, 44 + wy, "A"); c.p(123 - wx, 42 + wy, "N");                  // pen
  c.l(112, 52, 124, 52, "N");                                              // fresh ink line
  // cigarette smoke (small curling wisps)
  [[26, 59], [27, 57], [26, 55], [25, 53], [26, 51]].forEach(([x, y], i) => { const d = [[0, 0], [1, 0], [0, 0]][xc]; c.p(x + (xc === 1 ? (i % 2 ? 1 : -1) : xc === 2 ? (i % 2 ? -1 : 1) : 0) + (xc ? 0 : 0), y - xc, i < 3 ? "g" : "H"); });
  c.p(31, 60, "A"); if (xc === 1) c.p(31, 60, "R");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
