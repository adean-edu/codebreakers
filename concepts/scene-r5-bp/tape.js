/* Concept B for scene-r5-bp: "Greece, in the tape", close-up, April 1943. Loop 24 ticks. State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { ya: 6, yb: 8, yc: 12, yd: 6 };

const FONT = { A: "010101111101101", C: "011100100100011", D: "110101101101110", E: "111100110100111", G: "011100101101011", H: "101101111101101", I: "111010010010111", L: "100100100100111", N: "111101101101101", R: "110101110101101", S: "011100010001110", U: "101101101101111", F: "111100110100100", K: "101101110101101", P: "110101110100100", O: "010101101101010", T: "111010010010010", M: "101111111101101" };
// ---- Extreme close-up: a decrypt sheet under a lamp. GRIECHENLAND underlined in red pencil, SARDINIEN being typed.
// ya: pencil tip along the underline 4x6, yb: lamp flicker 3x8, yc: cursor blink 2x12, yd: tape slides 4x6.
CH.tape = { ya: 4, yb: 3, yc: 2, yd: 4 };
S.tape = (p) => {
  const c = Cv(160, 70, "s"), ya = p.ya || 0, yb = p.yb || 0, yc = p.yc || 0, yd = p.yd || 0;
  const gl = (s, x0, y0, sc, col) => { s.split("").forEach((ch, i) => { const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.r(x0 + i * 4 * sc + (k % 3) * sc, y0 + ((k / 3) | 0) * sc, x0 + i * 4 * sc + (k % 3) * sc + sc - 1, y0 + ((k / 3) | 0) * sc + sc - 1, col); }); };
  // desk, lit warmer toward the lamp (upper right)
  const R = [96, 90, 102][yb], lx = 150, ly = -6;
  c.r(0, 0, 159, 69, (x, y) => { const d = Math.hypot(x - lx, (y - ly) * 1.3); return d < R * .7 ? "m" : d < R ? ((x + y) & 1 ? "m" : "s") : "s"; });
  for (let y = 6; y < 70; y += 16) c.r(0, y, 159, y, "r");                                                      // desk-board seams
  // the sheet, W near the lamp, aged tan further away
  c.r(14, 3, 146, 52, (x, y) => { const d = Math.hypot(x - lx, (y - ly) * 1.3); return d < R * .8 ? "W" : d < R ? ((x + y) & 1 ? "W" : "l") : "l"; });
  c.r(14, 3, 14, 52, "m"); c.r(14, 52, 146, 52, "m"); c.r(147, 5, 147, 52, "E");                               // edges and a shadow
  gl("FUNKSPRUCH", 33, 7, 1, "H");                                                                              // header, small
  gl("GRIECHENLAND", 33, 15, 2, "K");
  c.r(33, 28, 123, 29, "R");                                                                                    // red pencil underline
  gl("SARDINIEN", 33, 34, 2, "K");
  if (yc) c.r(33 + 9 * 8 + 1, 34, 33 + 9 * 8 + 5, 43, "K");                                                    // cursor block
  for (let i = 0; i < 4; i++) c.r(33, 46 + i * 2, 60 + (i * 23) % 40, 46 + i * 2, "g");
  // pencil: tip moves along the underline end
  const d = [0, 1, 2, 1][ya]; c.r(124, 28, 124 + d, 29, "R");
  c.poly([[126 + d, 27], [128 + d, 27], [152, 6], [149, 4]], "R"); c.l(127 + d, 27, 151, 6, "A"); c.r(124 + d, 29, 126 + d, 29, "K"); c.p(125 + d, 28, "K");
  // paper tape across the bottom, holes slide left
  c.r(0, 55, 159, 64, "W"); c.r(0, 55, 159, 55, "l"); c.r(0, 64, 159, 64, "g");
  for (let x = 0; x < 160; x++) { if ((x + yd) % 4 === 0) { c.p(x, 58, "K"); if ((x + yd) % 8 === 0) c.p(x, 61, "K"); if (((x + yd) >> 2) % 3 === 1) c.p(x, 59, "K"); } }
  for (let x = 0; x < 160; x += 2) c.p(x, 60, "K");                                                              // sprocket row
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
