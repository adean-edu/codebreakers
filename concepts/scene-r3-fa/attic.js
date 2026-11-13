/* "The Channel Dash" concept B for scene-r3-fa: radio operator in a Brest attic, 11 Feb 1942. Loop 24 ticks: qa 3x8, qb 4x6, qc 4x3, qd 2x12. State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { qa: 8, qb: 6, qc: 3, qd: 12 };

// ---- Brest attic, night of 11 Feb 1942: a Resistance radio operator sends the warning in Morse
CH.attic = { qa: 3, qb: 4, qc: 4, qd: 2 };
S.attic = (p) => {
  const c = Cv(160, 70, "K"), qa = p.qa || 0, qb = p.qb || 0, qc = p.qc || 0, qd = p.qd || 0;
  // walls: plaster lit warmly from the right (candle), darker to the left; sloping roof at the top
  c.r(0, 0, 159, 49, (x, y) => (x > 100 ? (y > 30 ? "H" : "C") : x > 55 ? "C" : "E"));
  for (let y = 0; y < 50; y += 5) for (let x = 0; x < 160; x++) if ((x + y) % 3 === 0) c.p(x, y + 3, x > 100 ? "C" : "E");
  c.poly([[0, 0], [160, 0], [160, 5], [105, 8], [50, 5], [0, 10]], "D");
  c.l(0, 10, 50, 5, "C"); c.l(50, 5, 105, 8, "C"); c.l(105, 8, 160, 5, "C");
  c.r(0, 20, 6, 49, "D"); c.r(7, 20, 7, 49, "E");                                                                     // dark corner post
  // map of the coast pinned to the wall
  c.r(62, 11, 92, 25, "l"); c.r(62, 11, 92, 11, "W"); c.r(62, 25, 92, 25, "m"); c.r(62, 11, 62, 25, "W"); c.r(92, 11, 92, 25, "m");
  c.poly([[62, 18], [72, 15], [80, 19], [76, 22], [86, 24], [92, 25], [62, 25]], "N"); c.l(72, 15, 80, 19, "Q"); c.r(76, 20, 78, 21, "r");
  c.p(66, 12, "R"); c.p(88, 12, "R");
  // the blacked-out window: black paper with a slit onto the harbour
  c.r(122, 7, 150, 38, "s"); c.r(124, 9, 148, 36, "K"); c.r(122, 7, 150, 7, "m"); c.r(122, 38, 150, 38, "m");
  // narrow vertical gap where the blackout paper is pulled back: sky, two ships, water and rain show only here
  c.r(134, 10, 138, 35, "D"); c.r(134, 10, 138, 17, "E"); c.r(134, 18, 138, 21, "C"); c.r(134, 22, 138, 22, "H"); c.r(134, 23, 138, 35, "Q");
  c.r(134, 25, 138, 25, "N"); c.r(134, 28, 138, 28, "B"); c.r(134, 31, 138, 31, "N");
  c.r(134, 19, 138, 19, "K"); c.r(135, 20, 137, 21, "K"); c.r(134, 21, 138, 22, "K"); c.r(136, 17, 136, 18, "K");
  c.r(134, 29, 138, 29, "K"); c.r(134, 30, 138, 30, "K");
  c.l(133, 9, 133, 36, "C"); c.l(139, 9, 139, 36, "E"); c.p(133, 36, "H"); c.p(139, 9, "C");                           // curled paper edges
  for (let i = 0; i < 4; i++) { const x = 134 + (i * 2 + i % 2) % 5, y = 11 + ((i * 7 + qb * 6) % 24); c.p(x, y, "B"); c.p(x, y + 1, "g"); }          // rain streaks on the glass
  // floor
  c.r(0, 50, 159, 69, (x, y) => (y % 5 === 0 ? "E" : y < 58 ? "s" : "C"));
  c.r(0, 50, 159, 50, "K");
  for (let y = 51; y < 70; y += 5) for (let x = (y * 7) % 23; x < 160; x += 23) c.p(x, y, "D");
  // the table: scrubbed top, dark front, legs
  c.r(28, 44, 150, 46, "m"); c.r(28, 44, 150, 44, "l"); c.r(28, 47, 150, 48, "s"); c.r(30, 49, 31, 63, "E"); c.r(146, 49, 147, 63, "E");
  c.r(28, 47, 150, 47, "r");
  // the suitcase set: open lid standing up, dials, tube glow, key in front
  c.r(74, 27, 108, 43, "E"); c.r(75, 28, 107, 42, "O"); c.r(75, 28, 107, 28, "V"); c.r(75, 28, 75, 42, "V"); c.r(107, 28, 107, 42, "N");
  c.r(77, 30, 105, 32, "C"); for (let i = 0; i < 6; i++) c.p(79 + i * 5, 31, i % 2 ? "g" : "W");                                       // frequency scale
  [[83, 37], [91, 37], [99, 37]].forEach(([x, y]) => { c.e(x, y, 3, 3, "K"); c.e(x, y, 2, 2, "g"); c.p(x + 1, y - 1, "W"); c.p(x, y, "K"); });
  c.r(74, 43, 108, 43, "K"); c.r(76, 41, 80, 42, "C"); c.r(100, 41, 104, 42, "C");
  c.r(112, 42, 118, 43, "H"); c.r(112, 43, 118, 43, "g");                                                               // set is on the left; candle block below
  // candle at the right of the table
  c.r(121, 38, 123, 43, "W"); c.r(121, 38, 121, 43, "l"); c.r(123, 38, 123, 43, "g"); c.r(119, 43, 125, 43, "H"); c.p(122, 37, "K");
  const fl = [[[122, 36], [122, 35]], [[122, 36], [123, 35]], [[122, 36]]][qa];
  fl.forEach(([x, y]) => c.p(x, y, "A")); c.p(122, 36, "A"); if (qa === 0) c.p(122, 34, "l");
  if (qa === 0) { [[120, 36], [124, 36], [120, 38]].forEach(([x, y]) => c.p(x, y, "s")); } else if (qa === 1) { c.p(124, 36, "s"); } else { c.p(120, 36, "s"); }
  // tapped Morse key: a small light dot on the set flickers with the tapping
  c.r(61, 42, 67, 43, "K"); c.r(62, 41, 66, 41, "g"); c.l(62, 40 - (qc === 1 ? 1 : 0), 68, 41 - (qc === 1 ? 1 : 0), "A");
  c.p(80, 34, qd === 0 ? "A" : "E"); c.p(78, 34, qd === 0 ? "A" : "E");                                                // pilot lamps
  // the operator, seated, facing right; flat cap, headphones, lit on the right by the candle and the set
  const x = 46;
  c.r(x - 6, 34, x - 5, 49, "C"); c.r(x - 6, 34, x - 5, 34, "H"); c.r(x - 7, 49, x + 3, 49, "C");                                      // chair back and seat
  c.r(x - 3, 21, x + 1, 21, "K"); c.r(x - 4, 22, x + 3, 22, "K"); c.r(x + 2, 23, x + 5, 23, "K"); c.p(x - 3, 22, "C");                    // cap and peak
  c.r(x - 3, 23, x + 3, 28, "m"); c.r(x + 1, 23, x + 3, 28, "l"); c.r(x - 3, 23, x - 3, 28, "s"); c.p(x + 3, 26, "m"); c.p(x + 2, 27, "E");   // face, lit right
  c.p(x + 4, 25, "l"); c.r(x - 3, 29, x + 2, 29, "s");
  c.l(x - 4, 22, x + 3, 21, "K"); c.r(x - 3, 25, x - 1, 27, "K"); c.r(x - 2, 26, x - 1, 26, "g");                                       // headphone band and ear cup
  c.l(x - 4, 27, x - 6, 33, "K"); c.l(x - 6, 33, x - 6, 44, "K");                                                                    // cord down the chair
                                                                       // along the floor edge of the table to the set
  c.r(x - 4, 30, x + 3, 48, "G"); c.r(x + 2, 30, x + 3, 48, "V"); c.r(x - 4, 30, x - 4, 48, "O"); c.r(x - 3, 30, x + 2, 30, "R");          // green coat, red scarf
  c.r(x - 3, 29, x + 2, 29, "R");
  c.l(x + 3, 33, x + 8, 38, "V"); c.l(x + 8, 38, 59, 41, "V"); c.r(58, 41, 61, 41 + (qc === 1 ? -1 : 0), "l");                         // arm to the key, lit hand on it
  c.l(x - 3, 35, x - 1, 41, "O"); c.r(x - 1, 42, x + 4, 43, "m");                                                                    // other hand resting on the table edge
  c.r(x - 7, 52, x + 3, 52, "C"); c.r(x - 7, 53, x - 6, 62, "C");                                                        // chair seat and back legs
  c.r(x - 3, 49, x + 10, 51, "N"); c.r(x - 3, 49, x + 10, 49, "B"); c.r(x + 8, 52, x + 10, 62, "N"); c.r(x + 10, 52, x + 10, 62, "B");   // thighs horizontal, knee bent, shin down
  c.r(x + 8, 63, x + 13, 64, "K");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
