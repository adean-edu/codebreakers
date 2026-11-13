/* "The Channel Dash" for scene-r3-fa: courier above the Rade de Brest, 11 Feb 1942. Loop 24 ticks: sk 4x6, ws 3x8, ll 2x12, pa 2x12, st 3x8. State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { sk: 6, ws: 8, ll: 12, pa: 12, st: 8 };

// ---- The Channel Dash, 11 Feb 1942: from a lane above the Rade de Brest a courier watches the dark ships slip out under a smoke screen
CH.dash = { sk: 4, ws: 3, ll: 2, pa: 2, st: 3 };
S.dash = (p) => {
  const c = Cv(160, 70, "K"), sk = p.sk || 0, ws = p.ws || 0, ll = p.ll || 0, pa = p.pa || 0, st = p.st || 0;
  c.sky(0, 27, [["D", 5], ["E", 11], ["C", 17], ["H", 23], ["g", 28]]); stars(c, 9, 41);
  for (let i = 0; i < 6; i++) { const x = 6 + ((i * 53) % 150), y = 2 + (i * 7) % 9; if (st === i % 3 && st > 0) c.p(x, y, "g"); }   // star twinkle (state 0 = plain sky)
  // thin cloud strips; no moon (the breakout was timed for a dark night)
  for (let x = 0; x < 160; x++) { if ((x * 5) % 17 < 9) c.p(x, 14 + (x > 80 ? 0 : 1), "C"); if ((x * 3) % 13 < 6) c.p(x, 19, "H"); }
  c.r(112, 8, 150, 9, "C"); c.r(116, 10, 146, 11, "E"); c.r(108, 12, 154, 12, "C");   // moonless night (Cerberus was timed for the dark): a cloud bank where the moon was
  // far shore: hills across the Rade, a lighthouse-less headland
  for (let x = 0; x < 160; x++) { const top = 25 + Math.round(2.2 * Math.sin(x / 9 + 1) + 1.2 * Math.sin(x / 3.1)); c.r(x, top, x, 27, "E"); if (hs(x, 3, 5) > .9) c.p(x, top, "C"); }
  c.r(0, 27, 159, 27, "D");
  // the water, moonlit toward the right
  c.r(0, 28, 159, 48, (x, y) => (y < 32 ? "B" : y < 40 ? "N" : "Q"));
  const glint = [[104, 29], [112, 30], [120, 29], [128, 31], [136, 30], [146, 32], [108, 34], [118, 35], [132, 34], [142, 36], [124, 38], [150, 38], [136, 41], [114, 42]];
  glint.forEach(([x, y], i) => { const dx = (i + ws) % 3 - 1; c.r(x + dx, y, x + dx + 2, y, ws === i % 3 ? "B" : "g"); });
  for (let y = 29; y < 48; y += 3) for (let x = 0; x < 100; x++) if (hs(x >> 2, y, 6) > .8 && (x % 4) < 3) c.p(x, y, y < 36 ? "N" : "Q");
  // a lamp on the far shore, signalling in and out (state 0 = lit)
  c.p(22, 26, ll === 0 ? "A" : "E"); if (ll === 0) { c.p(21, 26, "m"); c.p(23, 26, "m"); c.p(22, 27, "s"); }
  // ---- the three ships, black against the pale water, bows to the left, no lights
  const ship = (x, y, len, big) => {
    const t = (u) => Math.round(u * len);
    c.poly([[x, y - 3], [x + t(.1), y], [x + len, y], [x + len, y - 3], [x + t(.1), y - 3]], "K");
    c.l(x, y - 3, x + t(.1), y, "K"); c.l(x + 1, y - 4, x + len, y - 4, "C"); c.r(x + t(.1), y - 3, x + len, y - 3, "K");
    c.r(x + t(.1), y - 4, x + len, y - 4, "E"); c.l(x + 1, y - 4, x + t(.1), y - 4, "E");
    const sx = x + t(.45);                                                                                              // bridge tower, funnel, masts
    c.r(sx, y - 8, sx + t(.12), y - 5, "K"); c.r(sx + 1, y - 10, sx + t(.12) - 1, y - 9, "K"); c.r(sx - 1, y - 8, sx - 1, y - 8, "E");
    c.r(sx + t(.2), y - 9, sx + t(.2) + 2, y - 5, "K"); c.r(sx + t(.2), y - 10, sx + t(.2) + 1, y - 10, "C");
    c.l(sx + 3, y - 10, sx + 3, y - (big ? 18 : 15), "C"); c.l(sx + 1, y - 14, sx + 5, y - 14, "C");
    c.r(x + t(.2), y - 6, x + t(.2) + 3, y - 5, "K"); c.l(x + t(.2) + 3, y - 6, x + t(.2) + 8, y - 7, "C");             // forward turret with barrels
    c.r(x + t(.82), y - 6, x + t(.82) + 3, y - 5, "K"); c.l(x + t(.82) - 1, y - 6, x + t(.82) - 6, y - 7, "C");
    c.p(x + t(.3), y - 4, "H"); c.p(x + t(.65), y - 4, "H");
  };
  ship(8, 38, 42, true); ship(54, 36, 40, true); ship(100, 34, 30, false);
  // bow waves, a thin white line at the stem
  [[8, 38], [54, 36], [100, 34]].forEach(([x, y]) => { c.r(x - 2, y, x + 3, y, "g"); c.p(x - 3, y, "W"); c.r(x + 4, y + 1, x + 14, y + 1, "B"); });
  // the smoke screen: a low band of drifting, ragged smoke over the sterns and between the ships (period 8 px, moves 2 px per state)
  const sm = (x, y, a, b, thick) => { for (let yy = y; yy < y + thick; yy++) for (let xx = a; xx <= b; xx++) { const u = ((xx - 2 * sk) % 8 + 8) % 8, h = hs(u, yy, 3); if (h > (yy === y || yy === y + thick - 1 ? .45 : .12)) c.p(xx, yy, hs(u, yy, 9) > .5 ? "g" : "H"); } };
  sm(0, 40, 0, 159, 2); sm(0, 33, 40, 62, 3); sm(0, 31, 92, 110, 3); sm(0, 30, 20, 54, 2); sm(0, 28, 140, 159, 2);
  // ---- near shore: hillside with a stone wall and a dirt lane
  c.poly([[0, 49], [60, 47], [110, 48], [160, 46], [160, 69], [0, 69]], (x, y) => y < 52 ? "O" : (y > 60 ? "E" : "s"));
  c.r(0, 49, 159, 52, (x, y) => (y === 49 ? "C" : (Math.floor(x / 7) + y) % 3 === 0 ? "g" : "H"));                      // low stone wall
  c.r(0, 53, 159, 53, "D");
  c.r(0, 54, 159, 60, (x, y) => (y < 56 ? "m" : y < 58 ? "s" : "E"));                                                 // the lane
  c.r(0, 61, 159, 69, "O"); c.r(0, 62, 159, 62, "V");
  for (let x = 4; x < 160; x += 11) { c.l(x, 61, x - 1, 58, "V"); c.l(x + 2, 61, x + 3, 59, "G"); }
  // ---- the courier's bicycle, leaning on the wall
  const bx = 88, by = 61;
  c.e(bx, by - 4, 5, 5, "g"); c.e(bx, by - 4, 4, 4, "E"); c.e(bx + 22, by - 4, 5, 5, "g"); c.e(bx + 22, by - 4, 4, 4, "E");
  c.l(bx, by - 4, bx + 8, by - 9, "g"); c.l(bx + 8, by - 9, bx + 20, by - 9, "g"); c.l(bx + 22, by - 4, bx + 18, by - 9, "g"); c.l(bx + 8, by - 9, bx + 11, by - 4, "g"); c.l(bx + 11, by - 4, bx + 22, by - 4, "g");
  c.r(bx + 6, by - 11, bx + 9, by - 11, "A"); c.l(bx + 19, by - 9, bx + 21, by - 12, "g"); c.r(bx + 20, by - 13, bx + 23, by - 13, "g"); c.p(bx, by - 4, "W"); c.p(bx + 22, by - 4, "W");
  // ---- the courier, lit from the moon on his right: flat cap, scarf, blue coat, separate legs, a folded note in his hand
  const x = 52, yb = 62;
  c.r(x - 2, yb - 17, x + 1, yb - 17, "K"); c.r(x - 3, yb - 16, x + 2, yb - 16, "K"); c.r(x + 2, yb - 15, x + 4, yb - 15, "H"); c.p(x + 1, yb - 17, "H");   // cap and peak
  c.r(x - 2, yb - 15, x + 2, yb - 12, "s"); c.r(x + 1, yb - 15, x + 3, yb - 12, "l"); c.r(x + 3, yb - 14, x + 3, yb - 14, "l"); c.p(x + 2, yb - 13, "E");    // head, lit side right
  c.r(x - 3, yb - 11, x + 3, yb - 11, "R"); c.r(x - 3, yb - 10, x - 2, yb - 9, "r");                                                                        // red scarf
  c.r(x - 3, yb - 10, x + 3, yb - 5, "N"); c.r(x + 1, yb - 10, x + 3, yb - 5, "B"); c.r(x - 3, yb - 10, x - 3, yb - 5, "Q"); c.r(x - 3, yb - 4, x + 3, yb - 4, "K");
  c.r(x - 3, yb - 3, x - 1, yb - 1, "C"); c.r(x + 1, yb - 3, x + 3, yb - 1, "H"); c.r(x - 3, yb, x - 1, yb, "K"); c.r(x + 1, yb, x + 4, yb, "K");              // legs and boots
  c.l(x - 3, yb - 9, x - 5, yb - 5, "Q");                                                                                                                   // far arm hanging
  c.l(x + 3, yb - 9, x + 6, yb - 8 - (pa ? 1 : 0), "B"); c.r(x + 6, yb - 9 - (pa ? 1 : 0), x + 8, yb - 8 - (pa ? 1 : 0), "W"); c.p(x + 7, yb - 9 - (pa ? 1 : 0), "l");   // arm out with the note
  c.p(x - 4, yb - 11, pa ? "R" : "r"); c.p(x - 5, yb - 10 + (pa ? 0 : 1), "R");                                                                            // scarf end flutters
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
