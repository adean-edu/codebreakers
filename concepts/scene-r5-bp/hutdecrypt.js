/* Concept for scene-r5-bp: "Decrypts in the hut", Bletchley Park, April 1943. Loop 24 ticks (2 s). State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { ba: 6, bb: 8, bc: 6, bd: 8, be: 6, bf: 12 };

// ---- Bletchley Park, a hut at night, April 1943: an analyst reads a decrypt while the wall map shows
// German forces moving toward Greece and Sardinia.
// ba: teleprinter paper creeps up 4x6, bb: lamp flicker 3x8, bc: steam 4x6, bd: marching arrows 3x8,
// be: pencil moves 4x6, bf: pin glow 2x12. All divide 24 ticks.
CH.hutdecrypt = { ba: 4, bb: 3, bc: 4, bd: 3, be: 4, bf: 2 };
const LT = Object.assign({}, lighter, { s: "m", m: "l", r: "s", K: "D", G: "V" });
S.hutdecrypt = (p) => {
  const c = Cv(160, 70, "E"), ba = p.ba || 0, bb = p.bb || 0, bc = p.bc || 0, bd = p.bd || 0, be = p.be || 0, bf = p.bf || 0;
  // back wall: vertical planks, ceiling beam
  c.r(0, 0, 159, 58, (x, y) => (x % 12 === 0 ? "D" : "E")); c.r(0, 0, 159, 2, "D"); c.r(0, 3, 159, 3, "C");
  // floor and table
  c.r(0, 59, 159, 69, (x, y) => (y % 5 === 4 ? "D" : "E"));
  c.r(0, 48, 159, 48, "m"); c.r(0, 49, 159, 53, "s"); c.r(0, 54, 159, 54, "m"); c.r(0, 55, 159, 58, "r"); c.r(0, 55, 159, 55, "s");
  for (const x of [6, 150]) c.r(x, 59, x + 2, 69, "C");
  // lamp light on wall and table (flickers)
  const R = [30, 27, 32][bb], lx = 80, ly = 43;
  for (let y = 3; y < 59; y++) for (let x = 24; x < 160; x++) { const d = Math.hypot(x - lx, (y - ly) * 1.2), ch = c.c[y][x];
    let n = d < R * .5 ? 2 : d < R ? 1 : 0; if (y >= 48 && y <= 54) n = Math.min(n, ch === "s" ? 1 : 0); while (n-- > 0 && LT[ch]) c.c[y][x] = LT[c.c[y][x]]; }
  // blackout curtain with a taped edge
  c.r(0, 0, 22, 47, (x, y) => (x % 5 === 2 ? "E" : "D")); c.r(0, 0, 22, 1, "g"); c.r(22, 2, 23, 47, "H"); c.r(0, 46, 22, 47, "C");
  for (let x = 1; x < 22; x += 5) c.r(x, 20, x, 22, "C");
  // wall map: Mediterranean, dark sea, land, red pins on Sardinia and Greece
  c.r(51, 3, 125, 35, "s"); c.r(52, 4, 124, 34, "Q"); c.r(52, 4, 124, 6, "N");
  c.r(52, 4, 72, 6, "O"); c.r(52, 7, 58, 8, "O");                                                    // France / coast
  c.e(68, 15, 2.6, 5, "O"); c.r(70, 12, 70, 18, "V");                                                // Sardinia
  c.poly([[78, 4], [86, 4], [89, 9], [95, 15], [101, 21], [103, 25], [100, 26], [96, 22], [90, 17], [86, 13]], "O"); c.l(86, 4, 89, 9, "V"); c.l(89, 9, 101, 21, "V");   // Italy
  c.poly([[88, 28], [95, 27], [92, 31]], "O");                                                       // Sicily
  c.poly([[111, 6], [122, 6], [122, 20], [118, 28], [115, 32], [113, 26], [115, 20], [111, 14]], "O"); c.l(111, 6, 111, 14, "V"); // Greece
  c.r(52, 32, 98, 34, "s"); c.r(52, 32, 98, 32, "m");                                                // North Africa
  for (let x = 54; x < 124; x += 9) for (let y = 8; y < 32; y += 8) c.p(x, y, "B");                  // faint grid ticks
  // marching arrows: German moves, dashes run toward Sardinia and Greece
  const arrow = (x0, y0, x1, y1) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) if ((i + bd) % 3 === 0) c.p(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, "A"); };
  arrow(82, 10, 71, 13); arrow(96, 8, 113, 15);
  // pins
  for (const [x, y] of [[68, 15], [117, 17]]) { c.r(x, y, x + 1, y + 1, "R"); c.p(x, y, "W"); if (bf) { c.p(x - 1, y - 1, "r"); c.p(x + 2, y + 2, "r"); c.p(x + 2, y - 1, "r"); c.p(x - 1, y + 2, "r"); } }
  // chair, analyst (lit from the lamp on her right)
  c.r(27, 36, 29, 52, "s"); c.r(27, 36, 27, 52, "m");
  c.poly([[32, 37], [44, 37], [47, 40], [47, 50], [29, 50], [29, 40]], "N"); c.r(29, 40, 30, 50, "Q"); c.r(45, 40, 47, 50, "B"); c.r(37, 37, 41, 38, "W");
  c.r(38, 35, 40, 36, "s"); c.e(37, 30, 4.4, 5, "r"); c.e(33, 27, 2, 2, "r"); c.r(39, 29, 42, 34, "m"); c.r(42, 29, 42, 34, "l"); c.p(41, 31, "K"); c.p(43, 32, "l"); c.r(39, 27, 41, 28, "r");
  c.r(46, 41, 47, 46, "N"); c.r(46, 47, 51, 49, "N"); c.r(46, 47, 51, 47, "B"); c.r(52, 47, 52, 49, "W");   // arm and cuff
  // decrypt slip on the table (short German text lines) and a spare sheet
  c.poly([[50, 48], [64, 48], [62, 53], [48, 53]], "W"); c.r(51, 49, 62, 49, "C"); c.r(50, 50, 59, 50, "C"); c.r(50, 51, 61, 51, "C"); c.r(49, 52, 55, 52, "C"); c.r(63, 48, 64, 49, "R");
  c.poly([[66, 51], [73, 51], [72, 53], [65, 53]], "g");
  // hand and pencil (be)
  const dx = [0, 1, 2, 1][be]; c.r(53 + dx, 46, 54 + dx, 47, "l"); c.l(55 + dx, 47, 57 + dx, 50, "A"); c.p(58 + dx, 51, "K");
  // mug and steam (bc)
  c.r(76, 44, 79, 48, "B"); c.r(76, 44, 76, 48, "W"); c.p(80, 45, "B"); c.p(80, 46, "B"); c.r(76, 44, 79, 44, "g");
  const sx = [[77, 41], [78, 40], [78, 38], [77, 37]], sy = [[78, 40], [77, 39], [78, 37], [78, 36]]; // wobble
  for (let k = 0; k < 4; k++) { const j = (k + bc) % 4; c.p(77 + (j % 2 ? 1 : 0) + (k === 3 ? 1 : 0), 42 - k * 2 - (bc ? 0 : 0), k < 2 ? "W" : "g"); }
  // lamp: green shade, warm bulb
  c.r(92, 40, 92, 47, "C"); c.r(88, 48, 96, 48, "H"); c.poly([[86, 36], [98, 36], [101, 41], [83, 41]], "G"); c.r(86, 36, 98, 36, "V"); c.r(83, 41, 101, 41, "O"); c.r(86, 42, 98, 42, "A"); c.r(88, 43, 96, 43, "r");
  // teleprinter on the right with a paper strip (ba)
  c.r(128, 41, 154, 47, "H"); c.r(128, 41, 154, 41, "g"); c.r(128, 41, 129, 47, "g"); c.r(152, 42, 154, 47, "C"); c.r(128, 47, 154, 47, "C");
  c.r(131, 43, 148, 44, "C"); for (let x = 132; x < 148; x += 2) c.p(x, 43, "W"); for (let x = 133; x < 148; x += 2) c.p(x, 45, "g");
  c.r(139, 39, 144, 40, "C"); c.r(140, 28, 143, 40, "W"); c.r(143, 28, 143, 40, "g");
  for (let y = 29; y < 39; y++) if ((y + ba) % 4 === 0) c.r(141, y, 142, y, "H"); else if ((y + ba) % 4 === 2) c.p(141, y, "H");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
