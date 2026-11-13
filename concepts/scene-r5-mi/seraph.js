/* Concept B for scene-r5-mi: "Delivery off Huelva" - HMS Seraph surfaced before dawn, crew with a steel canister on deck.
   Loop 24 ticks (2 s): za 3x8, zb 2x12, zc 4x6, zd 3x8. State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { za: 8, zb: 12, zc: 6, zd: 8 };

CH.seraph = { za: 3, zb: 2, zc: 4, zd: 3 };
S.seraph = (p) => {
  const c = Cv(160, 70, "K"), za = p.za || 0, zb = p.zb || 0, zc = p.zc || 0, zd = p.zd || 0;
  const HZ = 30;
  // dawn sky, a grey-gold band at the horizon
  c.sky(0, HZ, [["D", 6], ["E", 13], ["C", 20], ["H", 25], ["g", 28], ["m", 31]]); stars(c, 9, 17);
  c.r(0, 25, 159, 25, "H");
  // sea: pale dawn reflection at the horizon, then deepening blue
  c.r(0, HZ + 1, 159, 69, (x, y) => (y < 34 ? "H" : y < 40 ? "B" : y < 56 ? "N" : "Q"));
  c.r(0, HZ + 1, 159, HZ + 1, "g");
  // distant Spanish coast, low and dark, with a few lights
  c.poly([[0, 21], [10, 23], [22, 25], [34, 26], [46, 28], [58, 29], [66, 30], [66, 31], [0, 31]], "K");
  c.poly([[0, 31], [66, 31], [66, 32], [0, 32]], "E");
  const lights = [[4, 27], [9, 28], [15, 28], [21, 29], [28, 29], [36, 29], [43, 30], [52, 30]];
  lights.forEach(([x, y], i) => { const on = zb ? i % 2 === 0 || i === 3 : i % 2 === 1 || i === 3; if (i % 3 !== 2 || !zb) c.p(x, y, on || i === 1 ? "A" : "m"); });
  // sea glints: broken dashes (moving gently), kept clear of the hull rows
  for (let y = 33; y <= 69; y++) { if (y >= 52 && y <= 60) continue; for (let x = 0; x < 160; x++) {
      const k = (x + y * 5 + za * 5) % 16; if (y % 2 === 0 && k < 3) c.p(x, y, y < 40 ? "g" : y < 56 ? "B" : "N"); } }
  // ---- HMS Seraph: surfaced, low in the water
  c.poly([[14, 58], [20, 52], [30, 51], [128, 51], [142, 54], [148, 57], [140, 60], [22, 60]], "C");
  c.poly([[20, 52], [30, 51], [128, 51], [142, 54], [138, 54], [30, 54]], "H");                      // wet deck catching the dawn
  c.l(30, 51, 128, 51, "g"); c.r(22, 58, 142, 60, "E");                                              // hull below the line
  c.r(16, 56, 28, 57, "C"); for (let x = 36; x < 130; x += 9) c.p(x, 55, "E");                       // casing slots
  c.r(130, 52, 136, 52, "g");                                                                        // bow rail
  // conning tower, periscope standards and bridge
  c.r(68, 38, 88, 52, "C"); c.r(68, 38, 69, 52, "g"); c.r(87, 38, 88, 52, "E"); c.r(66, 36, 90, 38, "H"); c.l(66, 36, 90, 36, "g");
  c.r(66, 33, 66, 36, "H"); c.r(90, 33, 90, 36, "H"); c.r(70, 41, 73, 43, "K"); c.r(80, 41, 83, 43, "K");   // bridge rail, hatches
  c.r(78, 24, 79, 36, "H"); c.r(77, 22, 80, 23, "g"); c.r(80, 22, 83, 22, "g");                      // periscope and a mast
  c.r(75, 14, 75, 36, "H"); c.r(70, 18, 80, 18, "g"); c.l(75, 14, 75, 10, "g");                      // radio mast with yard
  // two lookouts on the bridge: caps, lit faces, one with binoculars
  [[72, "m"], [83, "A"]].forEach(([x, coat], i) => {
    c.r(x - 2, 31, x + 2, 32, "K"); c.r(x - 1, 33, x + 1, 35, "l"); c.p(x + 1, 34, "m"); c.r(x - 2, 36, x + 2, 37, coat);
    if (i === 0) { c.r(x - 3, 33, x - 2, 34, "K"); c.p(x - 3, 35, "g"); } });
  // ---- the canister on deck (two men carrying, one watching), no more than that
  const cx0 = 96, cx1 = 126;
  c.r(cx0, 46, cx1, 50, "g"); c.r(cx0 + 1, 45, cx1 - 1, 45, "g"); c.r(cx0 + 1, 46, cx1 - 1, 46, "W"); c.r(cx0, 49, cx1, 50, "H"); c.r(cx0 + 1, 51, cx1 - 1, 51, "E");
  c.p(cx0 - 1, 47, "g"); c.p(cx0 - 1, 48, "H"); c.p(cx1 + 1, 47, "g"); c.p(cx1 + 1, 48, "H");
  [100, 108, 117, 124].forEach((x) => c.r(x, 45, x, 50, "E"));                                        // clamp bands
  c.p(110, 47, "A"); c.p(111, 47, "A");                                                              // stencil mark, a dab of paint
  const man = (x, dy, scarf) => {
    const y0 = 35 + dy;
    c.r(x - 2, y0, x + 2, y0, "W"); c.r(x - 3, y0 + 1, x + 3, y0 + 1, "K"); c.r(x - 1, y0 + 2, x + 1, y0 + 4, "l"); c.p(x + 1, y0 + 3, "m"); c.p(x + 1, y0 + 4, "m");
    c.r(x - 3, y0 + 5, x + 3, 44, "B"); c.r(x - 3, y0 + 5, x - 3, 44, "g"); c.r(x + 3, y0 + 5, x + 3, 44, "H"); c.r(x - 1, y0 + 5, x - 1, y0 + 6, "W");
    if (scarf) c.r(x - 2, y0 + 5, x + 2, y0 + 5, "W"); c.p(x, y0 + 8, "K"); c.p(x, y0 + 10, "K"); };
  man(101, zc === 2 ? 1 : 0, false); man(107, 0, true);
  man(117, zc === 2 ? 1 : 0, false); man(124, 0, false);
  c.r(128, 43, 128, 45, "A"); c.r(127, 43, 129, 43, "W"); c.r(127, 44, 129, 45, "A"); c.p(128, 44, "W");    // hand lamp held at the canister end
  // hands on the canister
  [[99, 45], [103, 45], [105, 45], [109, 45], [115, 45], [119, 45], [122, 45], [126, 45]].forEach(([x, y]) => c.p(x, y + (zc === 2 && (x === 105 || x === 109 || x === 115 || x === 119) ? 0 : 0), "l"));
  // the officer by the bow, in a dark-blue coat and a white-topped cap, watching
  { const x = 135, dy = zc === 1 ? 1 : 0, y0 = 39 + dy;
    c.r(x - 2, y0, x + 2, y0, "W"); c.r(x - 3, y0 + 1, x + 3, y0 + 1, "K"); c.r(x - 1, y0 + 2, x + 1, y0 + 4, "l"); c.p(x + 1, y0 + 3, "m");
    c.r(x - 3, y0 + 5, x + 3, 47, "B"); c.r(x - 3, y0 + 5, x - 3, 47, "g"); c.r(x + 3, y0 + 5, x + 3, 47, "H"); c.r(x - 1, y0 + 5, x - 1, y0 + 6, "W");
    c.r(x - 2, 48, x - 1, 51, "C"); c.r(x + 1, 48, x + 2, 51, "C"); c.r(x - 3, 52, x - 1, 52, "K"); c.r(x + 1, 52, x + 3, 52, "K"); c.r(x - 3, 47, x + 3, 47, "K"); }
  // water washing over the deck and round the hull (foam dashes that creep along)
  for (let x = 20; x < 146; x++) { const k = (x + zd * 5) % 15; if (k < 4) c.p(x, 59, "W"); if ((x + zd * 5 + 7) % 15 < 3) c.p(x, 58, "g"); }
  for (let x = 116; x < 142; x++) if ((x + zd * 3) % 9 < 2) c.p(x, 53, "g");
  // foreground swell: low dark bands
  for (let y = 62; y <= 69; y++) for (let x = 0; x < 160; x++) { const k = (x + y * 4 + za * 5) % 19; if (y % 2 === 0 && k < 5) c.p(x, y, "N"); else if (y % 3 === 1 && k < 2) c.p(x, y, "B"); }
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
