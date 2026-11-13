/* advance: "Rommel strikes back", scene-r3-ul concept B. loop 48 ticks. */
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
const S = {}, CH = {}, HOLD = { va: 4, vb: 6, vc: 6, vd: 12, ve: 24 };

// ---- January 1942: a forward post sees German tanks emerge from a dust storm
CH.advance = { va: 24, vb: 4, vc: 8, vd: 4, ve: 2 };
const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
S.advance = (p) => {
  const c = Cv(160, 70, "K"), va = p.va || 0, vb = p.vb || 0, vc = p.vc || 0, vd = p.vd || 0, ve = p.ve || 0;
  c.sky(0, 34, [["N", 5], ["B", 13], ["g", 22], ["W", 30], ["l", 34]]);
  c.r(0, 34, 159, 40, "l"); c.r(0, 41, 159, 49, "m"); c.r(0, 50, 159, 69, (x, y) => (y < 62 ? "m" : "s"));        // washed-out far desert, tan near ground
  c.r(0, 41, 159, 41, "l");
  // wind-blown dust drifting left, behind everything (period 48 px)
  for (let i = 0; i < 9; i++) { const y = 38 + (i * 7) % 30, len = 4 + (i % 3), x0 = (i * 19 + 7) % 48, t = y < 45 ? "W" : "l";
    for (let k = -1; k < 4; k++) for (let j = 0; j < len; j++) c.p(x0 + 48 * k - 6 * vc + j, y, t); }
  // German tanks, a column at long range moving left (period 12 px)
  const fade = (x, y, col) => { if (BAY[y & 3][x & 3] / 16 < Math.max(0, Math.min(1, (x - 14) / 20))) c.p(x, y, col); };
  const tank = (x, y) => { for (let i = -4; i <= 9; i++) { if (i <= 1) fade(x + i, y + 1, "H");
      if (i >= 2 && i <= 6) { fade(x + i, y + 1, "C"); if (i >= 3 && i <= 5) fade(x + i, y, "H"); }
      if (i >= 1) fade(x + i, y + 2, "C"); if (i >= 0) fade(x + i, y + 3, i % 2 ? "H" : "E"); }
    fade(x + 1, y + 2, "H"); fade(x + 9, y + 2, "H"); };
  for (let k = -1; k < 8; k++) { tank(24 * k + 8 - va, 36); tank(24 * k + 20 - va, 31); }
  // the dust wall: thin on the left, solid on the right, billowing on top
  for (let y = 0; y <= 40; y++) for (let x = 0; x < 160; x++) {
    const a = Math.max(0, Math.min(1, (x - 92) / 44)); let top = 12 + (1 - a) * 18; if (top < 26) top += Math.round(1.6 * Math.sin(x / 6 + vd * Math.PI / 2));
    if (y < top) continue; const d = a * Math.max(0, Math.min(1, .45 + (y - top) * .09));
    if (BAY[y & 3][x & 3] / 16 < d) c.p(x, y, y < top + 4 ? "s" : y < top + 9 ? "m" : "l"); }
  // truck parked beyond the post
  c.r(76, 58, 124, 61, "s");
  c.r(93, 41, 122, 47, "l"); for (let x = 96; x < 122; x += 6) c.r(x, 41, x, 47, "m"); c.r(93, 41, 122, 41, "E");   // stone-coloured canvas tilt
  c.r(93, 48, 122, 55, "m"); c.r(100, 49, 108, 53, "s"); c.r(112, 48, 120, 51, "s"); c.r(82, 46, 93, 55, "m"); c.r(85, 51, 91, 55, "s");   // sand body, darker disruptive patches
  c.r(82, 46, 93, 46, "E"); c.r(82, 46, 82, 55, "E"); c.r(93, 41, 93, 55, "E"); c.r(122, 41, 122, 55, "E"); c.r(82, 55, 122, 55, "E"); c.r(93, 48, 122, 48, "E");
  c.r(83, 47, 86, 50, "B"); c.r(83, 47, 86, 47, "W");
  [[88, 57], [100, 57], [114, 57]].forEach(([x, y]) => { c.e(x, y, 3.2, 3.2, "K"); c.p(x, y, "H"); });
  // soldiers behind the sandbags, lit from the right: tin hats, lit faces, green jackets
  const man = (x, ty) => { c.r(x - 2, ty, x + 2, ty, "H"); c.r(x, ty, x + 1, ty, "g"); c.r(x - 4, ty + 1, x + 4, ty + 1, "C"); c.r(x + 1, ty + 1, x + 4, ty + 1, "H");   // Brodie helmet with wide brim
    c.r(x - 2, ty + 2, x + 2, ty + 4, "m"); c.r(x + 1, ty + 2, x + 2, ty + 4, "l"); c.p(x + 1, ty + 3, "E"); c.p(x - 2, ty + 4, "s");
    c.r(x - 3, ty + 5, x + 3, ty + 16, "s"); c.r(x + 2, ty + 5, x + 3, ty + 16, "m"); c.r(x - 4, ty + 5, x - 4, ty + 16, "E"); c.r(x - 3, ty + 12, x + 3, ty + 12, "E"); c.r(x - 3, ty + 5, x + 3, ty + 5, "m"); };
  man(11, 43); c.r(15, 37, 15, 46, "E"); c.p(15, 36, "H");                                                       // far man with rifle
  man(28, 40); c.l(31, 46, 38, 42, "s"); c.p(39, 42, "l"); c.p(39, 41, "l");                                     // pointing
  const by = -ve; man(46, 37); c.l(49, 44, 50, 41 + by, "s"); c.r(49, 39 + by, 53, 40 + by, "K"); c.p(54, 39 + by, "H"); c.p(54, 40 + by, "H"); c.p(51, 41 + by, "l");   // binoculars
  // sandbag wall
  for (let r = 0; r < 3; r++) for (let x0 = -4 + (r % 2) * 4; x0 < 66 + r * 2; x0 += 8) { const y = 51 + r * 4, x1 = Math.min(x0 + 7, 66 + r * 2);
    for (let x = Math.max(0, x0); x <= x1; x++) { c.r(x, y, x, y + 3, "m"); c.p(x, y, "l"); c.p(x, y + 3, "s"); } c.r(Math.max(0, x0), y, Math.max(0, x0), y + 3, "s"); c.p(x0 + 3, y + 1, "l"); }
  c.r(0, 63, 70, 65, "s");
  // whip aerial on the post: it sways in the wind, with a small pennant at the tip
  const bend = [0, 1, 2, 1][vb];
  for (let y = 51; y >= 12; y--) { const t = (51 - y) / 39; c.p(63 - Math.round(bend * t * t), y, y > 40 ? "E" : "C"); }
  const tx = 63 - bend; c.p(tx, 11, "W");
  const fl = [[[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [1, 1], [2, 2]], [[0, 0], [1, 0], [2, 0], [3, -1], [4, -1], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 1], [3, 1], [4, 1], [1, 1], [2, 2]]][vb];
  fl.forEach(([k, o]) => c.p(tx - 1 - k, 12 + o, k < 2 ? "W" : "l"));
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
