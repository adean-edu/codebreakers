/* Concept for scene-r5-fa: "The pickup at Motyl", 25-26 July 1944 (Operation Most III).
   Written in src/art.js style: S.motyl(p) returns a 160x70 Cv; CH.motyl lists the channels.
   Loop: pr 3x1, fl 4x2, tw 2x6, ld 2x12 -> every period divides 24 ticks (2 s). State 0 = the still. */
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
const S = {}, CH = {}, HOLD = { pr: 1, fl: 2, tw: 6, ld: 12 };

// ---- The pickup at Motyl, 25-26 July 1944: an RAF Dakota on a Home Army field at night, loading the V-2 parts
CH.motyl = { pr: 3, fl: 4, tw: 2, ld: 2 };
S.motyl = (p) => {
  const c = Cv(160, 70, "K"), pr = p.pr || 0, fl = p.fl || 0, tw = p.tw || 0, ld = p.ld || 0;
  c.sky(0, 36, [["K", 10], ["D", 26], ["E", 37]]); stars(c, 24, 77);
  if (tw) [[23, 5], [71, 9], [131, 4], [104, 15]].forEach(([x, y]) => { c.p(x, y, "g"); c.p(x - 1, y, "E"); c.p(x + 1, y, "E"); });   // a few stars dim
  // distant treeline: rounded crowns, a little uneven
  for (let x = 0; x < 160; x++) { const top = 30 + Math.round(2.5 * Math.sin(x / 7) + 1.5 * Math.sin(x / 2.3) + hs(x, 1, 5) * 1.5); c.r(x, top, x, 39, "K"); }
  // the field: dark grass, flattened ruts, mud under the wheels
  c.r(0, 40, 159, 69, (x, y) => (hs(x, y, 9) > .955 ? "O" : hs(x, y, 3) > .78 ? "E" : "D"));
  for (let x = 0; x < 160; x += 1) { if ((x + 3) % 5) c.p(x, 58 + Math.round(Math.sin(x / 11)), "E"); }
  // landing lamps along the strip (Home Army lanterns); each flickers on its own phase
  const LAMPS = [[6, 47], [26, 49], [46, 51], [138, 49], [154, 47]];
  LAMPS.forEach(([x, y], i) => { const ph = (fl + i) % 4; c.r(x - 1, y, x + 1, y + 1, "s");
    c.p(x, y - 1, ph === 1 ? "m" : "A"); c.p(x, y - 2, ph === 2 ? "K" : ph === 3 ? "A" : "R"); if (ph === 0) c.p(x + 1, y - 2, "R");
    for (let dx = -6; dx <= 6; dx++) for (let dy = 0; dy <= 4; dy++) if ((dx * dx) / 36 + (dy * dy) / 16 <= 1 && (x + dx + y + dy) % 2 === 0) { const q = c.c[y + dy] && c.c[y + dy][x + dx]; if (q && lighter[q]) c.p(x + dx, y + dy, lighter[q]); } });
  // ---- the Dakota, side view facing left, tail down on the grass
  const F = "C", Fh = "H";
  c.poly([[54, 37], [60, 34.5], [112, 37.5], [122, 41], [122, 43], [112, 45], [60, 46], [54, 44]], F);      // fuselage, nose up
  c.poly([[50, 39.5], [54, 37], [54, 44], [51, 43]], F); c.p(50, 40, Fh);                                      // rounded nose
  c.l(58, 35, 110, 37.6, Fh); c.l(54, 37, 58, 35, Fh);                                                         // light along the spine
  c.r(56, 37, 58, 38, "N"); c.r(59, 36.5, 61, 38, "N"); c.p(57, 37, "B");                                       // cockpit glass
  for (let x = 66; x < 96; x += 5) c.r(x, 38, x + 1, 39, "E");                                                  // cabin windows (blacked out)
  c.poly([[108, 37.5], [113, 25], [119, 24], [122, 26], [121, 41], [112, 40]], F); c.l(113, 25, 108, 37, Fh);   // fin and rudder
  c.l(117, 25, 117, 40, "E");
  c.poly([[110, 40], [126, 39], [127, 40.5], [111, 42]], Fh);                                                    // tailplane
  c.e(98, 41, 2.2, 2.2, "Q"); c.e(98, 41, 1.3, 1.3, "W"); c.p(98, 41, "R");                                     // RAF roundel
  c.poly([[60, 44.5], [94, 44], [96, 46], [60, 47]], "E");                                                      // wing root
  // engine nacelle, wheel leg and main wheel; tail wheel
  c.poly([[57, 43.5], [70, 43], [72, 46], [58, 48]], F); c.l(57, 43.5, 70, 43, Fh); c.r(55, 44, 57, 47, "E");
  c.l(66, 47, 66, 52, "E"); c.l(68, 47, 68, 52, "E"); c.e(67, 54, 3.2, 3.2, "K"); c.e(67, 54, 1.4, 1.4, "C");
  c.l(119, 43, 119, 47, "E"); c.e(119, 48, 1.4, 1.4, "K");
  for (let x = 60; x <= 75; x++) if (x % 2 || x % 5 === 0) c.p(x, 57, x % 3 ? "s" : "E");                                             // mud ruts
  // propeller: a pale disc with a moving blade
  const PX = 54, PY = 45.5;
  for (let y = -6; y <= 6; y++) if (((y + pr) % 3) !== 0) c.p(PX, PY + y, y % 2 ? "H" : "C");
  const blades = [[-6, -2], [-3, 3], [2, 6]][pr]; c.l(PX, PY + blades[0], PX, PY + blades[1], "g");
  c.p(PX - 1, PY, "H");
  // exhaust glow under the nacelle
  if (fl % 2 === 0) { c.p(63, 48, "R"); c.p(64, 48, "A"); } else { c.p(63, 48, "r"); c.p(64, 48, "R"); }
  // cargo door, open and lit from inside, light spilling onto the grass
  c.r(100, 37, 105, 43, "A"); c.r(100, 37, 100, 43, "m"); c.r(105, 37, 105, 43, "m");
  for (let y = 46; y < 60; y++) for (let x = 92; x < 116; x++) { const t = (y - 45) / 14, half = 3 + t * 9, cx = 102.5; if (Math.abs(x - cx) <= half && (x + y) % 2 === 0) { const q = c.c[y][x]; if (q === "D" || q === "E" || q === "O") c.p(x, y, t < .5 ? "H" : "C"); } }
  // a crewman in the doorway reaching down; a Home Army man lifting a sack up to him; another waits with the next one
  const man = (x, yb, col) => { c.r(x - 1, yb - 10, x + 1, yb - 8, col); c.poly([[x - 2, yb - 7], [x + 2, yb - 7], [x + 2, yb - 2], [x - 2, yb - 2]], col); c.l(x - 1, yb - 1, x - 1, yb, col); c.l(x + 1, yb - 1, x + 1, yb, col); };
  c.r(101, 38, 103, 39, "K"); c.r(101, 40, 104, 43, "K");                                                       // crewman (silhouette against the light)
  const up = ld === 0;                                                                                             // state 0: the sack is at the door
  c.l(101, 42, up ? 99 : 100, up ? 45 : 44, "K");                                                                 // his arm
  man(97, 56, "K"); c.l(98, 47, up ? 99 : 98, up ? 44 : 47, "K");                                                // lifter, arms up
  if (up) { c.r(97, 43, 101, 45, "m"); c.r(97, 43, 101, 43, "l"); } else { c.r(95, 47, 99, 49, "m"); c.r(95, 47, 99, 47, "l"); }   // the sack
  man(86, 57, "K"); c.r(82, 49, 85, 52, "s"); c.r(82, 49, 85, 49, "m");                                            // next man with a long wrapped part
  c.r(88, 51, 92, 52, "s");                                                                                        // (a crate at his feet)
  // a lookout with a rifle at the edge of the field, back to us
  man(140, 60, "K"); c.l(142, 47, 143, 58, "E");
  return c;
};

if (typeof module !== "undefined") module.exports = { PAL, S, CH, HOLD };
