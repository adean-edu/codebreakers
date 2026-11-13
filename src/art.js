/* Pixel art: 16-colour palette, 4x pixel scale, no smoothing, animated "on twos" (12 drawings per second). */
const ART = (function () {
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
  const lighter = { E: "C", C: "H", B: "g", D: "E", H: "g", N: "B", Q: "N" };
  const waves = (c, y0, y1, sh, ph) => { for (let y = y0; y <= y1; y++) if (y % 3 === (ph || 0)) for (let x = 0; x < c.w; x++) if ((x + y * 5 + sh * 2) % 8 < 3) { const b = c.c[y][x]; if (lighter[b]) c.c[y][x] = lighter[b]; } };
  const S = {}, CH = {};
  // ---- 1. Enigma on a night desk
  CH.enigma = { k: 6, ro: 3, wh: 8 };
  S.enigma = (p) => {
    const c = Cv(160, 70, "D"), k = p.k || 0, ro = p.ro || 0, wh = p.wh || 0;
    c.r(0, 0, 159, 69, (x) => (x % 10 < 2 ? "E" : "D")); c.r(0, 58, 159, 69, "E"); c.r(0, 58, 159, 58, "H"); c.r(0, 59, 159, 59, "C");
    c.r(34, 10, 125, 66, "s"); c.r(34, 10, 125, 10, "m"); c.r(34, 10, 34, 66, "m"); c.r(125, 10, 125, 66, "K"); c.r(34, 66, 125, 66, "K");
    c.r(38, 22, 121, 63, "D"); c.r(38, 22, 121, 22, "K"); c.r(38, 22, 38, 63, "K");
    for (let i = 0; i < 3; i++) { const x = 66 + i * 10; c.r(x, 6, x + 7, 13, (X) => ((X + ro + i) % 3 === 0 ? "g" : "H")); c.r(x, 13, x + 7, 13, "K"); c.r(x + 1, 16, x + 6, 20, "W"); c.r(x + 2, 17, x + 4 + ((ro + i) % 2), 19, "K"); c.r(x, 16, x, 20, "K"); c.r(x + 7, 16, x + 7, 20, "K"); }
    const rows = [[9, 46, 26, 42], [8, 50, 31, 48], [9, 46, 36, 54]], seq = [[0, 3], [1, 4], [2, 1], [0, 6], [1, 2], [2, 7]], [lr, lc] = seq[k];
    rows.forEach(([n, x0, ly, ky], ri) => { for (let j = 0; j < n; j++) { const x = x0 + j * 8, on = ri === lr && j === lc;
      c.r(x, ly, x + 2, ly + 2, on ? "A" : "C"); if (on) { c.p(x - 1, ly + 1, "r"); c.p(x + 3, ly + 1, "r"); c.p(x + 1, ly - 1, "r"); c.p(x + 1, ly + 3, "r"); } else c.p(x + 1, ly + 1, "H");
      const yy = ky + (on ? 1 : 0); c.r(x, yy, x + 4, yy + 3, "C"); c.r(x + 1, yy, x + 3, yy + 3, on ? "H" : "g"); c.p(x + 2, yy + 1, "K"); } });
    c.r(44, 60, 115, 64, "E"); for (let x = 46; x < 114; x += 4) c.r(x, 62, x + 1, 62, "K"); c.l(50, 62, 58, 63, "R"); c.l(70, 62, 84, 63, "A"); c.l(92, 62, 104, 63, "g");
    c.r(6, 34, 28, 60, "W"); c.r(6, 34, 6, 60, "g"); for (let y = 38; y < 58; y += 4) c.r(9, y, 8 + 6 + ((y * 3) % 9), y, y % 8 ? "H" : "K"); c.l(20, 52, 33, 62, "A"); c.p(34, 63, "K"); c.p(19, 51, "R");
    c.e(140, 44, 15, 15, "K"); c.e(140, 44, 14, 14, "H"); for (let i = 0; i < 26; i++) { const a = Math.PI * 2 * (i + wh / 8) / 26; c.p(140 + Math.cos(a) * 11.5, 44 + Math.sin(a) * 11.5, "W"); }
    c.e(140, 44, 8, 8, "C"); for (let i = 0; i < 26; i++) { const a = Math.PI * 2 * (i - wh / 8) / 26; c.p(140 + Math.cos(a) * 6, 44 + Math.sin(a) * 6, "g"); } c.e(140, 44, 2, 2, "A");
    return c;
  };
  // ---- 2. Atlantic convoy at night
  CH.convoy = { w: 4, sm: 4, wk: 2 };
  S.convoy = (p) => {
    const c = Cv(160, 70, "D"), w = p.w || 0, sm = p.sm || 0, wk = p.wk || 0;
    c.sky(0, 34, [["D", 12], ["E", 22], ["C", 30], ["H", 35]]); for (let y = 0; y < 18; y++) for (let x = 0; x < 160; x++) if (hs(x, y, 3) > .985) c.p(x, y, "W");
    c.e(124, 13, 6, 6, "g"); c.e(126, 12, 5, 5, "W");
    c.r(0, 35, 159, 69, (x, y) => { const d = y - 35; return d < 6 ? "C" : d < 18 ? "E" : "D"; }); waves(c, 36, 69, w, 0);
    [[10, 33], [50, 33], [92, 34]].forEach(([x, y], i) => { c.r(x, y, x + 20, y + 1, "K"); c.r(x + 6, y - 3, x + 10, y - 1, "K"); c.r(x + 12, y - 4, x + 13, y - 1, "K"); c.l(x + 8, y - 8, x + 8, y - 3, "K"); for (let j = 0; j < 4; j++) c.p(x + 14 + j * 3 + ((sm + i) % 2), y - 5 - (j >> 1) - ((sm + j) % 2), "H"); });
    c.poly([[18, 43], [74, 43], [80, 41], [72, 47], [22, 47]], "K"); c.r(40, 38, 50, 42, "K"); c.r(34, 35, 36, 42, "K"); c.r(54, 36, 56, 42, "K"); c.r(62, 39, 66, 42, "K"); c.l(45, 38, 45, 29, "K"); c.l(40, 32, 50, 32, "K"); c.p(43, 40, "A"); c.p(47, 40, "A");
    c.r(18, 43, 74, 43, "H"); for (let i = 0; i < 16; i++) c.p(17 - i + wk, 47 + ((i + wk) % 3 === 0 ? 1 : 0), i < 6 ? "W" : "g"); c.p(80 + wk, 47, "W"); c.p(78, 48, "g");
    c.r(134, 50, 135, 57, "H"); c.r(132, 49, 136, 50, "H"); c.p(131, 49, "K"); for (let i = 1; i < 9; i++) { c.p(134 - i * 1 - wk, 58 + (i >> 1), "g"); c.p(135 + i + wk, 58 + (i >> 1), "g"); }
    return c;
  };
  // ---- 3. Radio room: silence on the wire
  CH.silence = { nd: 12, sw: 10, kb: 6, lp: 4, tp: 4 };
  S.silence = (p) => {
    const c = Cv(160, 70, "D"), nd = p.nd || 0, sw = p.sw || 0, kb = p.kb || 0, lp = p.lp || 0, tp = p.tp || 0;
    c.r(0, 0, 159, 69, (x) => (x % 10 < 2 ? "E" : "D")); c.r(0, 60, 159, 69, "E"); c.r(0, 60, 159, 60, "H");
    c.r(26, 6, 134, 62, "E"); c.r(26, 6, 134, 6, "H"); c.r(26, 6, 26, 62, "H"); c.r(134, 6, 134, 62, "K"); c.r(26, 62, 134, 62, "K"); c.r(30, 10, 130, 58, "C");
    c.e(54, 34, 19, 19, "K"); c.e(54, 34, 18, 18, "D"); c.r(34, 16, 74, 52, (x, y) => ((x + 54 - 54) % 3 === 0 && y % 3 === 0 && (x - 54) ** 2 + (y - 34) ** 2 < 17 * 17 ? "H" : null) || (c.c[y][x]));
    c.r(80, 13, 124, 27, "K"); c.r(81, 14, 123, 26, "D"); for (let x = 84; x <= 120; x += 4) c.r(x, 15, x, 17, "g"); const pos = 84 + Math.abs(((nd * 6) % 72) - 36); c.r(pos, 14, pos, 26, "A");
    [[90, 42], [114, 42]].forEach(([x, y], i) => { c.e(x, y, 6, 6, "K"); c.e(x, y, 5, 5, "H"); c.e(x, y, 3, 3, "g"); const a = (i ? 1 : -1) * kb * .35; c.l(x, y, x + Math.cos(a) * 4, y + Math.sin(a) * 4, "K"); });
    c.r(80, 50, 124, 57, "K"); c.r(81, 51, 123, 56, "D"); c.r(82, 54, 122, 54, "G"); c.p(82 + sw * 4, 54, "W"); c.p(83 + sw * 4, 54, "g");
    c.r(125, 10, 129, 14, "K"); c.r(126, 11, 128, 13, lp < 2 ? "R" : "r");
    c.e(8, 55, 4, 4, "H"); c.e(26, 55, 4, 4, "H"); c.e(8, 55, 2, 2, "K"); c.e(26, 55, 2, 2, "K"); for (let a = Math.PI; a <= Math.PI * 2; a += .12) c.p(17 + Math.cos(a) * 9, 55 + Math.sin(a) * 12, "H");
    c.r(138, 62, 154, 65, "C"); c.l(140, 61, 152, 59, "A"); c.r(139, 58, 141, 60, "K");
    c.r(140, 2, 152, 52, "W"); c.r(140, 2, 140, 52, "g"); for (let y = 2; y < 24; y++) if ((y + tp) % 4 === 0) c.r(142 + (hs(y + tp * 0, 1, 5) > .5 ? 0 : 3), y, 144 + (hs(y, 1, 5) > .5 ? 1 : 6), y, "K");
    c.r(140, 50, 152, 52, "g");
    return c;
  };
  // ---- 4. Midway at dusk
  CH.midway = { w: 4, pm: 2 };
  S.midway = (p) => {
    const c = Cv(160, 70, "D"), w = p.w || 0, pm = p.pm || 0;
    c.sky(0, 35, [["D", 6], ["E", 14], ["C", 22], ["H", 28], ["r", 32], ["R", 36]]); c.e(112, 35, 8, 8, "A");
    c.r(0, 36, 159, 69, (x, y) => { const d = y - 36; return d < 6 ? "B" : d < 16 ? "N" : "Q"; }); for (let y = 37; y < 70; y += 2) { const hw = Math.max(0, 7 - ((y - 36) >> 2)); for (let x = 112 - hw; x <= 112 + hw; x++) if ((x + y) % 2 === 0) c.p(x, y, "A"); } waves(c, 38, 69, w, 1);
    // irregular island: a lumpy coast with a cove and a sand spit, a sandy rim, and grass inland
    c.poly([[-6, 47], [0, 42], [5, 38], [12, 36], [22, 34], [30, 35], [40, 33], [56, 34], [70, 33], [84, 35], [94, 38], [101, 41], [110, 45], [104, 48], [96, 50], [90, 53], [78, 52], [70, 49], [58, 54], [44, 53], [34, 50], [24, 52], [14, 50], [6, 52], [-2, 50]], "l");
    const sandAt = (x, y) => !!c.c[y] && c.c[y][x] === "l", grass = [];
    for (let y = 33; y <= 55; y++) for (let x = 0; x <= 112; x++) { if (!sandAt(x, y)) continue; let ok = true; for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dy) <= 3 && !sandAt(x + dx, y + dy)) { ok = false; break; } if (ok) grass.push([x, y]); }
    grass.forEach(([x, y]) => c.p(x, y, hs(x, y, 11) < .1 ? "O" : "G"));
    [[12, 37, 4], [21, 36, 3], [46, 36, 3], [77, 35, 4], [89, 37, 3], [66, 51, 3], [30, 51, 3], [10, 50, 2]].forEach(([x, y, r]) => { c.e(x, y, r, 2, "O"); c.e(x - 1, y - 1, r - 1, 1, "G"); });
    // 1942 Pacific airfield: dirt strip, Quonset huts, wooden watchtower, radar, AA gun, revetted fighters
    c.r(6, 41, 94, 42, "m");   // dirt apron
    c.poly([[8, 43], [92, 43], [95, 48], [5, 48]], (X, Y) => (hs(X, Y, 8) < .18 ? "m" : "s")); c.r(8, 43, 92, 43, "m"); for (let x = 12; x < 90; x += 6) c.r(x, 45, x + 2, 45, "m");
    // Quonset huts: corrugated half-barrels
    const hut = (cx, r, hgt) => { for (let y = 42 - hgt; y <= 42; y++) for (let x = cx - r; x <= cx + r; x++) { const u = (x - cx) / (r + .5), q = (y - 42) / (hgt + .5); if (u * u + q * q <= 1) c.p(x, y, y < 42 - hgt + 1 ? "g" : (x - cx) % 3 === 0 ? "C" : "H"); } c.r(cx - 1, 40, cx + 1, 42, "D"); };
    hut(47, 7, 6); hut(62, 7, 6); hut(76, 5, 4);
    // wooden watchtower on stilts
    c.l(26, 42, 28, 36, "s"); c.l(32, 42, 30, 36, "s"); c.r(25, 35, 33, 35, "s"); c.r(26, 32, 32, 34, "m"); c.r(27, 33, 31, 33, "g"); c.r(25, 31, 33, 31, "E"); c.l(29, 31, 29, 28, "K");
    // SCR-270 radar: a big lattice "bedspring" on a mast
    c.r(11, 37, 11, 42, "C"); c.r(8, 32, 14, 36, "C"); c.r(9, 33, 13, 35, "D"); for (let x = 9; x <= 13; x += 2) c.l(x, 33, x, 35, "g"); c.r(9, 34, 13, 34, "g");
    // anti-aircraft gun in a sandbag ring
    c.e(92, 41, 3.5, 1.6, "m"); c.e(92, 40.6, 2, .9, "s"); c.l(92, 40, 94, 37, "K"); c.r(90, 40, 94, 40, "H");
    // fuel drums
    [[38, 40], [40, 40], [39, 38], [36, 41]].forEach(([x, y]) => { c.r(x, y, x + 1, y + 1, "r"); c.p(x, y, "R"); });
    // revetted fighters (F4F Wildcats) with sand berms
    [[17, 41], [84, 42]].forEach(([x, y]) => { c.r(x - 3, y + 1, x + 11, y + 2, "m"); c.r(x - 3, y - 2, x - 2, y + 1, "m"); c.r(x + 10, y - 2, x + 11, y + 1, "m"); c.r(x - 3, y + 2, x + 11, y + 2, "s");
      c.r(x, y, x + 7, y + 1, "H"); c.r(x + 8, y, x + 8, y + 1, "K"); c.p(x + 9, y - 1, "W"); c.p(x + 9, y + 1, "W"); c.r(x + 3, y - 1, x + 5, y + 2, "g"); c.r(x, y - 2, x + 1, y - 1, "H"); c.p(x + 4, y - 1, "B"); c.p(x + 2, y, "W"); });
    [[3, 44, 0], [97, 44, 1]].forEach(([x, y, i]) => { c.l(x, y, x + 1, y - 5, "s"); const t = x + 1, u = y - 5; [[-3, 0], [-2, -2], [3, 0], [2, -2], [0, -3]].forEach(([dx, dy], j) => c.l(t, u, t + dx, u + dy + 2, j % 2 ? "G" : "O")); });
    c.r(124, 33, 158, 35, "K"); c.r(122, 32, 158, 32, "E"); c.r(140, 26, 144, 32, "K"); c.l(142, 20, 142, 26, "K"); c.r(128, 31, 129, 31, "g"); c.r(134, 31, 135, 31, "g"); for (let i = 0; i < 6; i++) c.p(158 - i * 3 - (w % 2), 36, "W");
    return c;
  };
  // ---- 5. Intercepting Yamamoto: a Japanese bomber over the islands, a P-38 closes in
  CH.intercept = { t: 16 };
  const intBG = () => {
    const W = 400, c = Cv(W, 70, "B");
    c.r(0, 0, W - 1, 33, "B"); c.r(0, 27, W - 1, 30, "g"); c.r(0, 31, W - 1, 33, "W");
    [[20, 9, 14, 3], [78, 17, 18, 4], [128, 6, 12, 3], [190, 21, 16, 3], [250, 8, 15, 3], [310, 18, 18, 4], [370, 7, 12, 3], [45, 25, 10, 2], [225, 26, 12, 2], [340, 27, 11, 2]].forEach(([X, y, rx, ry]) => { c.e(X, y + 1, rx, ry, "g"); c.e(X - 1, y, rx - 1, ry, "W"); });
    c.r(0, 34, W - 1, 69, "B");
    for (let y = 34; y < 70; y++) for (let x = 0; x < W; x++) if ((x + y * 5) % 8 < 2 && y % 3 === 0) c.p(x, y, y > 46 ? "g" : "H");
    const xc = (y) => 142 + (y - 34) * .32 + 4 * Math.sin(y * .45) + 2.5 * Math.sin(y * 1.1 + 1);
    const hh = (x) => { const k = Math.min(1, Math.max(0, (x - 150) / 80)); return Math.round(k * .5 * (12 + 8 * Math.sin(x * .045) + 4 * Math.sin(x * .11 + 1) + 12 * Math.max(0, Math.sin(x * .02 - .4)) ** 2)); };
    const sw0 = (y) => 9 + 1.5 * Math.sin(y * .8);
    // distant hills: two clean, solid ridges
    for (let x = 140; x < W; x++) { const h = hh(x); for (let y = 33 - h; y <= 33; y++) c.p(x, y, y === 33 - h ? "g" : "H"); }
    for (let x = 140; x < W; x++) { const h = Math.round(hh(x) * .55); for (let y = 33 - h; y <= 34; y++) c.p(x, y, y === 33 - h ? "H" : "C"); }
    // water edge, foam, sand: smooth bands that follow the coast
    for (let y = 34; y < 70; y++) for (let x = 0; x < W; x++) {
      const d = x - xc(y), sw = sw0(y); let ch = null;
      if (d > -6 && d < -3) ch = (y % 3 === 0) ? "g" : null;
      else if (d >= -3 && d < 0) ch = "W";
      else if (d >= 0 && d < 2) ch = "m";
      else if (d >= 2 && d < sw) ch = "l";
      else if (d >= sw) ch = "E";
      if (ch) c.p(x, y, ch);
    }
    for (let y = 34; y < 70; y++) for (let x = 0; x < W; x++) if (x - xc(y) >= sw0(y)) c.p(x, y, (x * 3 + y * 5) % 9 === 0 ? "l" : "m");
    // jungle canopy: round crowns in rows, but every tree differs in size, height, shade and spacing
    for (let row = 0; row < 10; row++) {
      const yb = 37 + row * row * .5 + row * 2.2, rb = 2 + row * .5, step = Math.round(rb * 1.5);
      for (let x0 = 148 - ((row * 7) % 5); x0 < W + 8; x0 += step) {
        const h1 = hs(row, Math.round(x0), 3), h2 = hs(row, Math.round(x0), 4), h3 = hs(row, Math.round(x0), 5);
        if (h3 < .12) continue;                                                        // small clearings
        const r = rb * (.7 + h1 * .75), tx = Math.round(x0 + (h2 - .5) * step * .9), ty = Math.round(yb + (h1 - .5) * 2.4), tall = h2 > .8 ? 1.35 : .8 + h3 * .35;
        if (tx - xc(ty) < sw0(ty) + r * .5) continue;
        if (h1 > .8) {                                                                   // occasional broadleaf tree
          c.e(tx, ty + 1, r * 1.0, r * .85 * tall, "O"); c.e(tx, ty, r * 1.05, r * .9 * tall, "V");
          if (h3 > .5) c.e(tx + r * .35, ty + r * .35 * tall, r * .6, r * .45 * tall, "O");
          continue;
        }
        const pr = Math.max(3, r * 1.25), lean = Math.round((h2 - .5) * pr * .8), topx = tx + lean, topy = Math.round(ty - pr * 1.1);
        c.l(tx, Math.round(ty + pr * .5), topx, topy, "s");                               // trunk
        if (h3 < .06) continue;                                                           // thin the palms out so crowns stay distinct
        const cr = Math.max(2, pr * .9);
        c.e(topx, topy + 2, cr * 1.1, cr * .6, "E");                                   // shaded underside
        [[-1, .5], [-.6, .9], [0, 1], [.6, .9], [1, .5]].forEach(([fx, fy]) => c.l(topx, topy, Math.round(topx + fx * cr * 1.25), Math.round(topy + fy * cr * .5), "O"));
        c.e(topx, topy, cr, cr * .5, "V");                                               // bright crown
        [[-1.1, .1], [-.55, -.55], [.55, -.55], [1.1, .1], [0, -.7]].forEach(([fx, fy]) => c.l(topx, topy, Math.round(topx + fx * cr * 1.1), Math.round(topy + fy * cr * .8), "V"));
      }
    }
    c.r(0, 33, 139, 33, "g");
    return c;
  };
  S.intercept = (p) => {
    const t = p.t || 0, c = Cv(160, 70, ".");
    const bomber = (ox, oy) => {
      const q = (x, y, ch) => c.p(ox + x, oy + y, ch), P = (pts, a) => c.poly(pts.map(([x, y]) => [ox + x, oy + y]), a);
      P([[3, 4], [0, -6], [7, -6], [12, 2]], "O"); c.r(ox - 2, oy + 6, ox + 11, oy + 6, "E");
      P([[0, 5], [8, 3], [22, 1], [38, 0], [48, 2], [55, 5], [57, 7], [52, 10], [38, 12], [20, 12], [8, 9], [0, 7]], (X, Y) => (Y - oy >= 8 ? "g" : "O"));
      c.r(ox + 18, oy + 8, ox + 48, oy + 9, "E"); c.r(ox + 18, oy + 8, ox + 48, oy + 8, "H");
      c.e(ox + 38, oy + 8, 7, 2.8, "C"); c.r(ox + 43, oy + 6, ox + 45, oy + 10, "H");
      for (let y = 2; y <= 14; y++) if ((y + t) % 2) q(47, y, "W"); q(47, 8, "K");
      c.r(ox + 45, oy + 2, ox + 50, oy + 4, "K"); q(46, 3, "W"); c.e(ox + 30, oy, 3, 2, "H");
    };
    const lightning = (ox, oy) => {
      const q = (x, y, ch) => c.p(ox + x, oy + y, ch), R = (x0, y0, x1, y1, ch) => c.r(ox + x0, oy + y0, ox + x1, oy + y1, ch), P = (pts, a) => c.poly(pts.map(([x, y]) => [ox + x, oy + y]), a);
      P([[4, 5], [3, -5], [8, -5], [11, 5]], "H"); R(2, -5, 9, -5, "E");              // far fin
      R(2, 7, 17, 8, "H");                                                                // far boom
      P([[2, 6], [0, -4], [6, -4], [10, 5]], "g"); R(0, -4, 6, -4, "W"); R(1, -3, 1, 2, "H"); // near fin
      R(0, 5, 17, 7, "g"); R(0, 7, 17, 7, "H");                                           // near boom
      P([[14, 4], [22, 3], [32, 4], [37, 6], [37, 9], [32, 11], [22, 11], [14, 8]], (X, Y) => (Y - oy >= 8 ? "H" : "g")); // engine nacelle
      c.e(ox + 20, oy + 3, 3, 1.6, "C"); q(19, 2, "g");                                    // turbo bulge
      R(12, 10, 33, 11, "E");                                                             // wing edge
      P([[22, 1], [34, 0], [39, 3], [38, 5], [22, 5]], "g"); R(23, 1, 36, 1, "W"); R(22, 4, 38, 5, "H");        // central pod
      c.e(ox + 27, oy + 1, 3.6, 2.4, "K"); c.e(ox + 28, oy + .5, 2.2, 1.2, "H"); q(27, 0, "W"); // bubble canopy
      R(38, 3, 43, 3, "E"); R(38, 4, 42, 4, "H");                                         // nose guns
      c.e(ox + 8, oy + 5.5, 2.6, 2.2, "W"); c.e(ox + 8, oy + 5.5, 1.5, 1.3, "B");         // roundel
      for (let y = 0; y <= 14; y++) if ((y + t) % 2) { q(38, y + 1, "W"); q(39, y + 1, "g"); } q(38, 7, "A");
    };
    const bob = (t >> 3) & 1;
    bomber(62, 12 + bob);
    const k = 1.0, ky = .8, dy = 28, d = Cv(160, 70, ".");
    for (let y = 0; y < 70; y++) for (let x = 0; x < 160; x++) { const sx = Math.floor(62 + (x - 62) / k), sy = Math.floor(12 + (y - 12 - dy) / ky); if (sx >= 0 && sx < 160 && sy >= 0 && sy < 70) d.c[y][x] = c.c[sy][sx]; }
    d.e(76, 45 + Math.round(bob * .8), 2.6, 2.6, "W"); d.e(76, 45 + Math.round(bob * .8), 1.6, 1.6, "R");
    const o = d.c.map((r) => r.slice()); for (let y = 0; y < 70; y++) for (let x = 0; x < 160; x++) if (d.c[y][x] === "." && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => (d.c[y + b] || [])[x + a] && d.c[y + b][x + a] !== ".")) o[y][x] = "K";
    d.c = o; return d;
  };
  // ---- 6. The decoy army: a lie for D-Day
  CH.decoy = { ib: 6, rw: 4, pm: 2, wv: 7 };
  S.decoy = (p) => {
    const c = Cv(160, 70, "B"), ib = p.ib || 0, rw = p.rw || 0, pm = p.pm || 0, wv = p.wv || 0;
    c.r(0, 0, 159, 27, "B"); c.r(0, 24, 159, 26, "g"); c.r(0, 27, 159, 27, "W");
    [[28, 7, 11, 2], [92, 10, 13, 2], [60, 19, 9, 2]].forEach(([x, y, rx, ry]) => { c.e(x, y + 1, rx, ry, "g"); c.e(x - 1, y, rx - 1, ry, "W"); });
    // the Channel and the white cliffs of Dover
    c.r(0, 28, 159, 37, "B"); for (let y = 29; y < 37; y += 2) for (let x = 0; x < 160; x++) { if ((x + y * 3 + wv) % 7 < 2) c.p(x, y, "H"); else if ((x * 3 + y + wv * 2) % 19 === 0) c.p(x, y, "g"); }
    for (let y = 30; y < 37; y += 2) for (let x = 0; x < 160; x++) if ((x - y * 2 + wv * 3) % 23 === 0) c.p(x, y, "W");
    c.poly([[104, 37], [108, 22], [122, 14], [160, 12], [160, 37]], "W"); c.poly([[104, 37], [108, 22], [114, 24], [112, 37]], "g"); for (let y = 18; y < 37; y += 3) c.r(114 + (y % 7), y, 118 + (y % 11), y, "g");
    c.poly([[108, 22], [122, 14], [160, 12], [160, 16], [124, 19], [110, 25]], "G");
    // the field
    c.r(0, 37, 159, 69, "G"); for (let y = 38; y < 70; y += 3) for (let x = (y * 7) % 9; x < 160; x += 9) c.p(x, y, "O");
    const TK = [
      "...........GGGGGGG..........",
      "..........GOOOOOOOG.........",
      "..........OOOOOOEOOEEEEEEEEE",
      "...GGGGGGGGOOOOOOOOGGGG.....",
      "..OOOOOOOOOOOOOOOOOOOOOOG...",
      "..OWOWOOOOOOOOOOOOOOOOOOOG..",
      "..OOWOOOOOOOOOOOOOOOOOOOOOG.",
      ".EEEEEEEEEEEEEEEEEEEEEEEEEE.",
      "EHCHEHCHEHCHEHCHEHCHEHCHEHCE",
      ".EEEEEEEEEEEEEEEEEEEEEEEEEE.",
      "..DDDDDDDDDDDDDDDDDDDDDDDD.."];
    const DROP = [[], [1, 5], [0, 1, 5, 6], [0, 1, 4, 5, 6]];
    const tank = (x, y, f, sc) => { // a hand-drawn tank; f 0..3 = how inflated; sc = pixel scale
      const rows = TK.filter((r, i) => DROP[3 - f].indexOf(i) < 0).map((r) => r.split(""));
      if (f < 3) rows.forEach((r, j) => r.forEach((ch, i) => { if ((ch === "O" || ch === "G") && (i * 3 + j * 5) % 11 === 0) r[i] = "E"; }));
      rows.forEach((r, j) => r.forEach((ch, i) => { if (ch !== ".") for (let a = 0; a < sc; a++) for (let b = 0; b < sc; b++) c.p(x + i * sc + a, y + (j + (11 - rows.length)) * sc + b, ch); }));
    };
    [[44, 36], [76, 36], [108, 36]].forEach(([x, y]) => tank(x, y, 3, 1));
    tank(126, 50, 3, 1);
    tank(58, 46, Math.min(3, ib), 2);
    // radio truck and mast: false radio traffic
    c.r(10, 49, 28, 56, "O"); c.r(10, 49, 28, 49, "G"); c.r(12, 51, 17, 54, "C"); c.r(28, 50, 32, 56, "O"); c.r(29, 51, 31, 53, "C"); c.e(15, 57, 2.4, 2.4, "K"); c.e(29, 57, 2.4, 2.4, "K"); c.r(19, 51, 26, 54, "H");
    c.l(22, 49, 22, 22, "K"); c.l(18, 38, 26, 38, "K"); c.l(19, 30, 25, 30, "K"); c.p(22, 21, "A");
    for (let k = 1; k <= 3; k++) { const rr = 3 + ((k * 5 + rw * 5) % 15); for (let a = -1.2; a <= 1.2; a += .07) { c.p(22 + Math.cos(a) * rr * 1.2, 22 + Math.sin(a) * rr * .7 + 1, "W"); c.p(22 + Math.cos(a) * rr * 1.2, 23 + Math.sin(a) * rr * .7 + 1, rr < 9 ? "W" : "g"); } }
    // soldier working a foot pump: hose runs to the valve on the tank
    const sx = 47, sy = 66;
    c.r(sx, sy - 10, sx + 3, sy - 3, "O"); c.r(sx, sy - 10, sx + 3, sy - 10, "G"); c.r(sx, sy - 2, sx + 1, sy + 2, "E"); c.r(sx + 2, sy - 2, sx + 3 + pm, sy + 2, "E");
    c.e(sx + 1.5, sy - 13, 2.4, 2.4, "l"); c.r(sx - 1, sy - 16, sx + 4, sy - 15, "O"); c.r(sx, sy - 14, sx + 3, sy - 14, "O");
    c.r(sx + 4, sy - 8, sx + 7, sy - 7 + pm, "O");                                              // arm
    c.r(sx + 5, sy + 1 - pm * 2, sx + 12, sy + 2, "R"); c.r(sx + 5, sy + 2, sx + 12, sy + 2, "r"); c.r(sx + 4, sy + 2, sx + 13, sy + 3, "E"); // bellows pump
    c.l(sx + 12, sy, sx + 17, sy - 2, "K"); c.l(sx + 17, sy - 2, 66, 61, "K"); c.p(66, 60, "A");  // hose to valve
    return c;
  };
  // ======== Scenes for the individual role scenarios (same 160x70 grid, palette and "on twos" animation as the six above) ========
  const stars = (c, y1, seed) => { for (let y = 0; y < y1; y++) for (let x = 0; x < c.w; x++) if (hs(x, y, seed) > .985) c.p(x, y, "W"); };
  const panel = (c) => { c.r(0, 0, 159, 69, (x) => (x % 10 < 2 ? "E" : "D")); c.r(0, 58, 159, 69, "E"); c.r(0, 58, 159, 58, "H"); c.r(0, 59, 159, 59, "C"); };
  // ---- Navy code office, Washington, 1939: a card sorter, stacks of code books, a board of five-digit groups
  CH.codeoffice = { cd: 8, lb: 4, dg: 6 };
  S.codeoffice = (p) => {
    const c = Cv(160, 70, "D"), cd = p.cd || 0, lb = p.lb || 0, dg = p.dg || 0; panel(c);
    // window: night over Washington, the Capitol dome
    c.r(120, 6, 152, 36, "H"); c.r(122, 8, 150, 34, (x, y) => (y < 18 ? "Q" : "N")); for (let y = 8; y < 30; y++) for (let x = 122; x < 151; x++) if (hs(x, y, 21) > .97) c.p(x, y, "W");
    c.r(124, 28, 148, 34, "K"); c.e(136, 26, 6, 5, "K"); c.r(135, 17, 137, 21, "K"); c.p(136, 16, "K"); for (let x = 125; x < 148; x += 3) c.p(x, 31, "A");
    c.r(136, 8, 136, 34, "H"); c.r(122, 21, 150, 21, "H");
    // blackboard of five-digit code groups
    c.r(54, 6, 112, 32, "s"); c.r(56, 8, 110, 30, "O");
    for (let row = 0; row < 4; row++) for (let g = 0; g < 4; g++) { const idx = row * 4 + g; if (idx > 9 + dg) continue; const x = 59 + g * 13, y = 11 + row * 5; for (let k = 0; k < 5; k++) { c.p(x + k * 2, y, "W"); if (hs(x + k, y, 7) > .5) c.p(x + k * 2, y + 1, "W"); } }
    c.r(56, 30, 110, 31, "m");
    // card sorter
    c.r(6, 34, 48, 57, "C"); c.r(6, 34, 48, 34, "H"); c.r(6, 34, 6, 57, "H"); c.r(48, 34, 48, 57, "K"); c.r(8, 40, 46, 41, "E");
    c.r(9, 28, 17, 34, "E"); c.r(10, 26, 16, 28, "W"); c.r(10, 27, 16, 27, "g");             // card hopper
    for (let i = 0; i < 9; i++) { const x = 9 + i * 4; c.r(x, 46, x + 2, 55, "E"); if (hs(i, 3, 9) > .4) c.r(x, 50 + (i % 3), x + 2, 55, "W"); }   // pockets with sorted cards
    for (let i = 0; i < 4; i++) c.r(20 + i * 6, 36, 21 + i * 6, 37, i === lb ? "A" : "r");  // indicator lamps
    const cx = 16 + cd * 4; c.r(cx, 42, cx + 4, 43, "W"); c.p(cx + 1, 42, "g");                // a punched card running through
    // desk, lamp and code books
    c.r(52, 44, 118, 46, "m"); c.r(52, 47, 118, 57, "s"); c.r(56, 47, 57, 57, "K"); c.r(113, 47, 114, 57, "K");
    [[56, 36, 3], [98, 34, 4]].forEach(([x, y, n]) => { for (let b = 0; b < n; b++) { const yy = 43 - b * 3; c.r(x - (b % 2), yy, x + 13 - (b % 2), yy + 2, b % 2 ? "r" : "R"); c.r(x + 1 - (b % 2), yy + 1, x + 12 - (b % 2), yy + 1, "W"); } });
    c.r(74, 40, 92, 43, "W"); for (let y = 41; y < 43; y++) for (let x = 75; x < 92; x += 2) if (hs(x, y, 4) > .3) c.p(x, y, "K");
    c.l(84, 43, 84, 30, "K"); c.r(80, 27, 88, 30, "C"); c.r(81, 31, 87, 31, "A");
    return c;
  };
  // ---- A double agent's radio, London, 1939: the suitcase set, the Morse key, rain on the window
  CH.spyradio = { kp: 2, rn: 4 };
  S.spyradio = (p) => {
    const c = Cv(160, 70, "D"), kp = p.kp || 0, rn = p.rn || 0; panel(c);
    c.r(108, 6, 152, 38, "H"); c.r(110, 8, 150, 36, (x, y) => (y < 20 ? "D" : "Q"));
    c.r(110, 28, 150, 36, "K"); [[114, 24, 6], [124, 22, 5], [132, 26, 4]].forEach(([x, y, w]) => { c.r(x, y, x + w, 28, "K"); c.r(x + 1, y - 3, x + 2, y, "K"); });
    c.r(140, 12, 145, 36, "K"); c.r(141, 8, 144, 12, "K"); c.p(142, 6, "K"); c.p(143, 6, "K"); c.r(142, 7, 143, 7, "K"); c.e(142.5, 15, 1.6, 1.6, "A");   // the clock tower
    for (let x = 111; x < 151; x += 5) { const y0 = 8 + ((x * 7 + rn * 6) % 28); for (let k = 0; k < 4; k++) if (y0 + k < 37) c.p(x - (k >> 1), y0 + k, "g"); }     // rain streaks on the glass
    c.r(129, 8, 129, 36, "H"); c.r(110, 21, 150, 21, "H");
    c.l(60, 0, 60, 6, "K"); c.r(58, 6, 62, 7, "C"); c.e(60, 9.5, 2, 2, "A");               // bare bulb
    c.r(4, 48, 104, 50, "m"); c.r(4, 51, 104, 57, "s"); c.r(8, 51, 9, 57, "K"); c.r(99, 51, 100, 57, "K");   // table
    c.r(22, 16, 70, 34, "m"); c.r(24, 18, 68, 33, "D");                                    // open lid
    c.r(22, 34, 70, 47, "s"); c.r(24, 35, 68, 46, "C"); c.r(22, 34, 70, 34, "m");          // case body
    c.e(32, 40, 3.4, 3.4, "K"); c.e(32, 40, 2.4, 2.4, "g"); c.l(32, 40, 34, 38, "K"); c.e(44, 40, 3.4, 3.4, "K"); c.e(44, 40, 2.4, 2.4, "g"); c.l(44, 40, 42, 38, "K");
    c.r(52, 37, 64, 42, "W"); c.l(53, 41, 58, 38 + kp, "R"); c.r(55, 44, 57, 45, kp ? "R" : "r");   // meter needle and lamp jump on each keypress
    for (let x = 26; x < 67; x += 4) c.p(x, 21, "H"); c.r(26, 24, 66, 24, "H"); c.r(26, 28, 50, 28, "E");
    c.r(78, 45, 94, 47, "C"); c.r(80, 43 + kp, 90, 44 + kp, "H"); c.r(90, 42 + kp, 92, 44 + kp, "K");   // Morse key
    c.r(84, 37 + kp, 92, 41 + kp, "l"); c.r(92, 39 + kp, 94, 41 + kp, "l"); c.r(80, 39 + kp, 84, 42 + kp, "s");   // the operator's hand
    for (let a = Math.PI; a <= Math.PI * 2; a += .15) c.p(100 + Math.cos(a) * 5, 46 + Math.sin(a) * 6, "H"); c.e(95, 46, 2, 2, "C"); c.e(105, 46, 2, 2, "C");   // headphones
    c.l(70, 30, 78, 45, "K");
    return c;
  };
  // ---- Garbo's desk, London, 1942: a wall map of imaginary agents, a typewriter at work
  CH.garbo = { ty: 6, pn: 4 };
  S.garbo = (p) => {
    const c = Cv(160, 70, "D"), ty = p.ty || 0, pn = p.pn || 0; panel(c);
    c.r(98, 4, 152, 46, "m"); c.r(100, 6, 150, 44, "g");                                   // wall map: sea
    c.poly([[118, 9], [124, 8], [128, 12], [126, 18], [130, 22], [134, 28], [138, 34], [134, 40], [124, 41], [116, 40], [122, 36], [120, 30], [116, 26], [118, 20], [114, 14]], "W");   // Great Britain (sketch)
    c.poly([[104, 22], [110, 20], [112, 26], [110, 32], [104, 31], [102, 26]], "W");      // Ireland (sketch)
    const pins = [[121, 14], [123, 24], [126, 31], [131, 36], [120, 38], [128, 20]];
    pins.forEach(([x, y], i) => { c.r(x, y, x + 1, y + 1, i % 4 === pn ? "A" : "R"); if (i % 4 === pn) { c.p(x - 1, y, "A"); c.p(x + 2, y + 1, "A"); c.p(x, y - 1, "A"); c.p(x + 1, y + 2, "A"); } });
    for (let x = 102; x < 149; x += 3) c.p(x, 42, "m");
    c.r(4, 46, 96, 48, "m"); c.r(4, 49, 96, 57, "s"); c.r(8, 49, 9, 57, "K"); c.r(91, 49, 92, 57, "K");
    c.r(10, 38, 24, 45, "W"); c.r(11, 37, 25, 44, "W"); c.r(11, 37, 25, 37, "g"); c.r(18, 40, 22, 42, "R");   // letters with a red seal
    const sh = ty % 3; c.r(34 - sh, 20, 64 - sh, 34, "W");                                 // paper in the carriage
    for (let row = 0; row < 4; row++) { const len = row < 3 ? 26 : 2 + ty * 4; for (let x = 0; x < len; x += 2) if (hs(x, row, 5) > .25) c.p(36 - sh + x, 23 + row * 3, "K"); }
    c.r(30 - sh, 33, 68 - sh, 35, "C"); c.r(28 - sh, 33, 29 - sh, 35, "H"); c.r(69 - sh, 33, 70 - sh, 35, "H");   // carriage
    c.r(30, 36, 68, 45, "E"); c.r(30, 36, 68, 36, "H");
    for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const x = 33 + k * 4 + r, y = 38 + r * 2; c.p(x, y, "g"); }
    if (ty % 2) c.l(49, 37, 49, 33, "K");                                                  // a type bar strikes the paper
    c.l(80, 46, 80, 30, "K"); c.r(76, 26, 84, 29, "C"); c.r(77, 30, 83, 30, "A");
    return c;
  };
  // ---- Brest harbor at night, February 1942: three warships under a sweeping searchlight
  CH.brest = { sl: 8, w: 4, sm: 4 };
  S.brest = (p) => {
    const c = Cv(160, 70, "D"), sl = p.sl || 0, w = p.w || 0, sm = p.sm || 0;
    c.sky(0, 33, [["K", 10], ["D", 20], ["E", 28], ["C", 34]]); stars(c, 16, 31);
    const a = -2.6 + sl * .13; for (let t = 0; t < 140; t++) for (let s = -1; s <= 1; s++) { const x = 152 + Math.cos(a) * t + s * Math.sin(a) * (t / 22), y = 34 + Math.sin(a) * t * .6; if (y > 0 && y < 33) c.p(x, y, t < 70 ? "g" : "H"); }   // searchlight beam
    c.r(146, 30, 158, 34, "K"); c.r(150, 32, 152, 34, "A");
    c.poly([[0, 34], [0, 26], [8, 24], [14, 27], [22, 25], [30, 28], [36, 34]], "K");     // shore and cranes
    c.l(10, 24, 10, 12, "K"); c.l(10, 12, 24, 12, "K"); c.l(24, 12, 24, 16, "K"); c.l(18, 25, 18, 16, "K"); c.l(18, 16, 30, 16, "K");
    c.r(0, 34, 159, 69, (x, y) => (y < 41 ? "C" : y < 50 ? "E" : "D")); waves(c, 36, 69, w, 0);
    const ship = (x0, len, y0) => { c.poly([[x0, y0], [x0 + len, y0], [x0 + len - 4, y0 + 4], [x0 + 4, y0 + 4]], "K"); c.r(x0 + len * .3, y0 - 4, x0 + len * .55, y0 - 1, "K"); c.r(x0 + len * .38, y0 - 8, x0 + len * .46, y0 - 4, "K"); c.r(x0 + len * .12, y0 - 2, x0 + len * .2, y0, "K"); c.r(x0 + len * .65, y0 - 2, x0 + len * .75, y0, "K"); c.l(x0 + len * .42, y0 - 13, x0 + len * .42, y0 - 8, "K"); };
    ship(30, 70, 39); ship(106, 44, 42); ship(4, 24, 44);
    [[59, 28], [124, 33]].forEach(([x, y], i) => { for (let j = 0; j < 5; j++) c.p(x - 2 - j * 2 - ((sm + i) % 2), y - 1 - (j >> 1) - ((sm + j) % 2), "H"); });
    for (let x = 0; x < 160; x++) for (let y = 44; y < 48; y++) if ((x + y) % 2 && hs(x, y, 2) > .45) c.p(x, y, "C");   // fog on the water
    return c;
  };
  // ---- Desert night, January 1942: a command tent, tanks resting, sand on the wind
  CH.desert = { lp: 4, sd: 6 };
  S.desert = (p) => {
    const c = Cv(160, 70, "D"), lp = p.lp || 0, sd = p.sd || 0;
    c.sky(0, 40, [["K", 10], ["D", 22], ["E", 34], ["C", 41]]); stars(c, 28, 41); c.e(132, 12, 5, 5, "W"); c.e(134, 11, 4, 4, "K");
    c.poly([[0, 42], [30, 38], [64, 41], [96, 36], [130, 40], [160, 37], [160, 70], [0, 70]], "s");
    c.poly([[0, 52], [40, 47], [80, 52], [120, 46], [160, 51], [160, 70], [0, 70]], "m");
    for (let y = 47; y < 70; y++) for (let x = 0; x < 160; x++) if (c.c[y][x] === "m" && hs(x, y, 3) > .9) c.p(x, y, "s");
    c.poly([[18, 52], [40, 30], [62, 52]], "O"); c.l(40, 30, 40, 26, "K"); c.poly([[36, 52], [40, 40], [44, 52]], lp % 2 ? "A" : "m"); c.e(40, 50, 2, 1, "W");   // tent with a lamp inside
    c.l(18, 52, 40, 30, "K"); c.l(40, 30, 62, 52, "K"); c.l(54, 30, 54, 50, "K"); c.l(52, 32, 56, 32, "K");   // tent poles and radio aerial
    const tank = (x, y) => { c.r(x, y, x + 22, y + 4, "K"); c.r(x + 1, y + 5, x + 21, y + 6, "E"); for (let i = 0; i < 6; i++) c.p(x + 2 + i * 4, y + 6, "C"); c.r(x + 7, y - 4, x + 15, y, "K"); c.l(x + 15, y - 2, x + 26, y - 2, "K"); };
    tank(92, 42); tank(124, 45);
    for (let i = 0; i < 14; i++) { const x = (i * 23 + sd * 9) % 170 - 5, y = 50 + (i * 7) % 18; c.p(x, y, "l"); c.p(x + 1, y, "m"); }   // drifting sand
    return c;
  };
  // ---- A Paris street at night, 1942: rain, a lamp, someone waiting
  CH.leak = { rn: 4, wn: 4 };
  S.leak = (p) => {
    const c = Cv(160, 70, "D"), rn = p.rn || 0, wn = p.wn || 0;
    c.r(0, 0, 159, 69, "K"); c.sky(0, 20, [["K", 8], ["D", 21]]);
    [[0, 34, 12], [34, 30, 6], [64, 40, 10], [104, 30, 4], [134, 26, 9]].forEach(([x, w, top], b) => {
      c.r(x, top + 6, x + w - 1, 56, "E"); c.poly([[x - 1, top + 6], [x + 3, top], [x + w - 4, top], [x + w, top + 6]], "C");   // mansard roof
      for (let r = 0; r < 4; r++) for (let k = 0; k < Math.floor(w / 7); k++) { const wx = x + 3 + k * 7, wy = top + 9 + r * 10; const lit = hs(wx, wy, 6) > .7 || (b * 4 + k) % 7 === wn; c.r(wx, wy, wx + 3, wy + 5, lit ? "A" : "D"); if (lit) c.r(wx, wy + 5, wx + 3, wy + 5, "m"); } });
    c.r(0, 56, 159, 69, "E"); for (let y = 57; y < 70; y += 2) for (let x = (y % 4); x < 160; x += 4) c.p(x, y, "C");
    c.r(56, 30, 64, 42, "W"); c.r(57, 31, 63, 33, "R"); c.r(58, 35, 62, 40, "g");          // a poster on the wall
    c.r(112, 18, 113, 60, "K"); c.r(109, 16, 116, 18, "K"); c.r(110, 19, 115, 20, "A");    // street lamp
    c.poly([[110, 21], [115, 21], [124, 62], [101, 62]], (x, y) => ((x + y) % 2 || hs(x, y, 12) > .55 ? c.c[y][x] : (c.c[y][x] === "K" || c.c[y][x] === "D" || c.c[y][x] === "E" ? "C" : c.c[y][x])));
    c.e(112.5, 62, 12, 2, (x, y) => ((x + y) % 2 ? "H" : "C"));
    const fx = 100; c.r(fx, 44, fx + 6, 60, "s"); c.r(fx, 44, fx + 6, 45, "m"); c.r(fx + 1, 60, fx + 2, 63, "K"); c.r(fx + 4, 60, fx + 5, 63, "K");   // figure in a coat
    c.e(fx + 3, 41, 2.2, 2.4, "l"); c.r(fx - 1, 38, fx + 7, 39, "K"); c.r(fx + 1, 36, fx + 5, 38, "K");   // face and hat
    for (let x = 2; x < 160; x += 7) { const y0 = (x * 11 + rn * 9) % 66; for (let k = 0; k < 3; k++) c.p(x - (k >> 1), y0 + k, "C"); }   // rain
    return c;
  };
  // ---- The Mediterranean by day, 1942: a supply convoy, and a spotter plane that gives the strike its cover story
  CH.medconvoy = { pl: 10, w: 4, sm: 4 };
  S.medconvoy = (p) => {
    const c = Cv(160, 70, "B"), pl = p.pl || 0, w = p.w || 0, sm = p.sm || 0;
    c.sky(0, 32, [["N", 8], ["B", 20], ["g", 33]]); c.e(30, 12, 5, 5, "W"); c.e(30, 12, 4, 4, "A");
    [[70, 8, 12], [122, 14, 9]].forEach(([x, y, rx]) => { c.e(x, y, rx, 2, "g"); c.e(x - 2, y - 1, rx - 3, 2, "W"); });
    c.poly([[96, 33], [112, 31], [130, 32], [160, 30], [160, 34], [96, 34]], "m");         // a far coast
    c.r(0, 34, 159, 69, (x, y) => (y < 44 ? "B" : y < 56 ? "N" : "Q")); waves(c, 35, 69, w, 2);
    const ship = (x, y, len, col) => { c.poly([[x, y], [x + len, y], [x + len - 3, y + 3], [x + 2, y + 3]], col); c.r(x + len * .55, y - 4, x + len * .75, y - 1, col); c.r(x + len * .62, y - 7, x + len * .68, y - 4, "K"); c.r(x + 3, y - 2, x + len * .4, y - 1, col); };
    ship(20, 40, 34, "C"); ship(70, 44, 40, "E"); ship(124, 41, 26, "C");
    [[43, 33], [96, 37], [140, 34]].forEach(([x, y], i) => { for (let j = 0; j < 5; j++) c.p(x - 2 - j * 2 - ((sm + i) % 2), y - 1 - (j >> 1) - ((sm + j) % 2), "W"); });
    const px = 8 + pl * 15, py = 20 - (pl % 3);                                              // spotter plane crossing the sky
    c.r(px, py, px + 8, py + 1, "K"); c.r(px + 2, py - 2, px + 4, py + 3, "K"); c.r(px + 7, py - 1, px + 8, py, "K"); c.p(px + 9, py, "K"); c.p(px + 3, py + 4, "E");
    return c;
  };
  // ---- A beach in Spain at dawn, April 1943: a briefcase in the surf, gulls overhead
  CH.mincemeat = { w: 4, fm: 4, gl: 6 };
  S.mincemeat = (p) => {
    const c = Cv(160, 70, "B"), w = p.w || 0, fm = p.fm || 0, gl = p.gl || 0;
    c.sky(0, 32, [["E", 6], ["C", 12], ["r", 20], ["R", 27], ["A", 33]]); c.e(112, 33, 9, 6, "A"); c.e(112, 33, 6, 4, "W");
    c.r(0, 33, 159, 50, (x, y) => (y < 38 ? "N" : "Q")); waves(c, 34, 50, w, 0);
    for (let y = 34; y < 50; y += 2) { const hw = Math.max(0, 6 - ((y - 33) >> 2)); for (let x = 112 - hw; x <= 112 + hw; x++) if ((x + y) % 2 === 0) c.p(x, y, "A"); }
    c.poly([[134, 38], [150, 38], [148, 41], [136, 41]], "K"); c.l(141, 38, 141, 28, "K"); c.l(141, 29, 147, 36, "K");   // fishing boat
    c.r(0, 51, 159, 69, (x, y) => (hs(x, y, 9) > .85 ? "m" : "l"));
    for (let x = 0; x < 160; x++) { const y = 50 + Math.round(Math.sin((x + fm * 6) / 9) * 1.4 + fm * .5); c.p(x, y, "W"); c.p(x, y + 1, (x + fm) % 3 ? "g" : "W"); }   // foam line
    c.r(66, 57, 84, 64, "s"); c.r(66, 57, 84, 57, "m"); c.r(66, 64, 84, 64, "K"); c.r(73, 54, 77, 56, "K"); c.r(74, 55, 76, 55, "s"); c.p(69, 60, "A"); c.p(81, 60, "A");   // the briefcase
    for (let i = 0; i < 8; i++) c.p(65 - i * 2, 61 + (i % 2), "g");                         // its chain trails into the sand
    [[30, 14], [52, 20]].forEach(([x, y], i) => { const gx = x + gl * 4 + i * 2, f = (gl + i) % 2; c.p(gx, y, "W"); c.p(gx - 1, y - f, "W"); c.p(gx - 2, y - 1 + f, "W"); c.p(gx + 1, y - f, "W"); c.p(gx + 2, y - 1 + f, "W"); });
    return c;
  };
  // ---- A Polish forest at night, 1943: pieces of a crashed rocket under a flashlight
  CH.rocket = { fl: 6 };
  S.rocket = (p) => {
    const c = Cv(160, 70, "D"), fl = p.fl || 0;
    c.sky(0, 40, [["K", 12], ["D", 30], ["E", 41]]); stars(c, 22, 51); c.e(28, 10, 4, 4, "W");
    const pine = (x, y, h, col) => { for (let k = 0; k < h; k++) { const hw = Math.floor(k / 2.2) + 1; c.r(x - hw, y + k, x + hw, y + k, col); } c.r(x, y + h, x, y + h + 3, col); };
    for (let i = 0; i < 16; i++) pine(i * 11 + 3, 14 + (i * 7) % 9, 22 + (i * 5) % 8, "E");
    c.r(0, 46, 159, 69, (x, y) => (hs(x, y, 4) > .8 ? "E" : "D")); c.e(90, 56, 26, 5, "K"); c.e(90, 55, 22, 3.5, "E");   // clearing and crater
    [[2, 18, 30], [148, 16, 32], [20, 22, 28], [134, 24, 26]].forEach(([x, y, h]) => pine(x, y, h, "K"));
    c.poly([[80, 56], [86, 38], [92, 36], [96, 56]], "H"); c.poly([[86, 38], [92, 36], [91, 40]], "g"); c.l(84, 48, 94, 47, "C"); c.r(98, 52, 108, 56, "C"); c.r(99, 53, 107, 53, "H");   // a tail fin and a twisted panel
    c.r(70, 54, 76, 58, "m"); c.r(71, 53, 75, 53, "s");                                     // a sack for the pieces
    const hx = 48, hy = 50; c.r(hx, hy - 10, hx + 4, hy + 6, "C"); c.e(hx + 2, hy - 13, 2, 2.2, "l"); c.r(hx, hy - 16, hx + 4, hy - 15, "E"); c.r(hx + 5, hy - 6, hx + 8, hy - 5, "C");   // the courier
    const a = -.15 + fl * .05; for (let t = 4; t < 44; t++) for (let s = -t / 6; s <= t / 6; s += 1) { const x = hx + 8 + Math.cos(a) * t - Math.sin(a) * s, y = hy - 5 + Math.sin(a) * t + Math.cos(a) * s * .6; if ((Math.round(x) + Math.round(y)) % 2 === 0) { const q = c.c[Math.round(y)] && c.c[Math.round(y)][Math.round(x)]; c.p(x, y, q === "H" ? "W" : q === "C" ? "g" : t < 24 ? "g" : "H"); } }   // flashlight beam
    return c;
  };
  const HOLD = { wv: 9, ib: 8, w: 5, sm: 3, wk: 5, k: 6, ro: 4, wh: 2, nd: 2, sw: 2, kb: 6, lp: 6, tp: 3, pm: 8, fl: 2, sp: 3, cl: 4, rw: 3, cd: 2, lb: 3, dg: 5, kp: 3, rn: 1, ty: 2, pn: 4, sl: 3, sd: 2, wn: 6, pl: 3, fm: 3, gl: 2 }, cacheS = {};
  // the panning background is rasterised once so the browser can slide a single image smoothly
  function intPan() {
    const g = intBG().c, H = g.length, W = g[0].length;
    try {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d");
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) { x.fillStyle = PAL[g[y][i]] || "#000"; x.fillRect(i, y, 1, 1); }
      return `<g class="pan"><image href="${cv.toDataURL("image/png")}" x="0" y="0" width="${W * 4}" height="${H * 4}" preserveAspectRatio="none" style="image-rendering:pixelated"/></g>`;
    } catch (e) { return `<g class="pan"><g transform="scale(4)" shape-rendering="crispEdges">${paths(g)}</g></g>`; }
  }
  function sceneSVG(id) {
    if (cacheS[id]) return cacheS[id];
    if (id === "intercept") {
      const N = 16; let o = `${intPan()}<g transform="scale(4)" shape-rendering="crispEdges">`;
      for (let st = 0; st < N; st++) { const g = S.intercept({ t: st }).c, m = g.map((r) => r.map((q) => q !== ".")); o += `<g class="pxa" data-s="t" data-n="${N}" data-h="2" data-p="${st}"${st ? ' display="none"' : ""}>${paths(g, m)}</g>`; }
      return (cacheS[id] = o + "</g>");
    }
    const draw = S[id] || S.enigma, ch = CH[id] || CH.enigma, base = draw({});
    let s = `<g transform="scale(4)" shape-rendering="crispEdges">${paths(base.c)}`;
    for (const k in ch) for (let st = 1; st < ch[k]; st++) { const g = draw({ [k]: st }).c; const m = g.map((r, y) => r.map((q, x) => q !== base.c[y][x])); const d = paths(g, m); if (d) s += `<g class="pxa" data-s="${k}" data-n="${ch[k]}" data-h="${HOLD[k] || 1}" data-p="${st}" display="none">${d}</g>`; }
    return (cacheS[id] = s + "</g>");
  }
  const frame = (id) => `<svg class="scene" viewBox="0 0 640 280" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">${sceneSVG(id)}</svg>`;
  // ---- Pixel-art portraits: 30x35 grid, drawn at 4x, 14-colour palette, crisp edges, animated "on twos" (12 drawings/sec) ----
  const GW = 30, GH = 35;
  const FONT = { A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110", E: "111100110100111", F: "111100110100100", G: "011100101101011", H: "101101111101101", I: "111010010010111", J: "001001001101010", K: "101101110101101", L: "100100100100111", M: "101111111101101", N: "111101101101101", O: "010101101101010", P: "110101110100100", Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010", U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101", Y: "101101010010010", Z: "111001010100111" };
  function px(rid, st) {
    const c = Array.from({ length: GH }, (_, y) => Array.from({ length: GW }, (_, x) => (x % 8 < 2 ? "E" : "D"))), f = Array.from({ length: GH }, () => Array(GW).fill(0));
    const put = (x, y, ch) => { if (x >= 0 && y >= 0 && x < GW && y < GH) { c[y][x] = ch; f[y][x] = 1; } };
    const col = (v, x, y) => (typeof v === "function" ? v(x, y) : v);
    const rect = (x0, y0, x1, y1, v) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, col(v, x, y)); };
    const ell = (cx, cy, rx, ry, v) => { for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const a = (x + .5 - cx) / rx, b = (y + .5 - cy) / ry; if (a * a + b * b <= 1) put(x, y, col(v, x, y)); } };
    const dt = (x, y) => (x + y) & 1, dy = st.breath ? 1 : 0;
    const SK = { BP: ["m", "l", "l"], NV: ["s", "s", "m"], FA: ["s", "m", "l"], MI: ["m", "l", "l"], UL: ["s", "m", "l"] }[rid], [sd, sm, sl] = SK;
    const CL = { BP: ["D", "s", "m"], NV: ["K", "E", "C"], FA: ["E", "C", "H"], MI: ["E", "H", "g"], UL: ["E", "O", "g"] }[rid], [cd, cm, cl] = CL;
    const HD = { BP: [7, 9.8], NV: [8.2, 9], FA: [6.6, 9.3], MI: [7.2, 10.2], UL: [8, 9.2] }[rid];
    // neck (thicker for NV, slimmer for FA)
    const nw = { NV: [11, 18], FA: [13, 16] }[rid] || [12, 17]; rect(nw[0], 20, nw[1], 27, (x, y) => (x >= nw[1] - 1 && y > 22 ? sm : sd));
    // shoulders
    const sp = rid === "FA" ? { 26: [10, 19], 27: [8, 21], 28: [6, 23], 29: [4, 25] } : rid === "NV" ? { 26: [7, 22], 27: [4, 25], 28: [2, 27], 29: [1, 28] } : { 26: [9, 20], 27: [7, 22], 28: [5, 24], 29: [3, 26] };
    for (let y = 26; y <= 36; y++) { const [a, b] = sp[y] || [sp[29][0] - (rid === "NV" ? 1 : 0), sp[29][1]]; for (let x = a; x <= b; x++) put(x, y + dy, x <= 9 ? cd : x <= 11 ? (dt(x, y) ? cd : cm) : x >= 24 ? cl : x >= 22 ? (dt(x, y) ? cm : cl) : cm); }
    const V = { 26: [11, 18], 27: [11, 18], 28: [12, 17], 29: [12, 17], 30: [13, 16], 31: [13, 16], 32: [14, 15] };
    if (rid !== "FA") for (const y in V) for (let x = V[y][0]; x <= V[y][1]; x++) put(x, +y + dy, "W");
    if (rid === "BP") { for (const [x, y] of [[12, 27], [13, 27], [12, 28], [13, 28], [16, 27], [17, 27], [16, 28], [17, 28]]) put(x, y + dy, "R"); rect(14, 27 + dy, 15, 28 + dy, "r"); [[14, 31], [14, 34]].forEach(([x, y]) => put(x, y + dy, "W")); rect(8, 33 + dy, 10, 35 + dy, "m"); }
    if (rid === "MI") { [[10, 26], [9, 27], [9, 28], [10, 29], [19, 26], [20, 27], [20, 28], [19, 29]].forEach(([x, y]) => put(x, y + dy, "C")); rect(7, 22, 10, 26, "C"); rect(19, 22, 22, 26, "H"); rect(13, 28 + dy, 15, 33 + dy, "r"); }
    if (rid === "NV") { [[9, 30], [20, 30], [9, 33], [20, 33]].forEach(([x, y]) => put(x, y + dy, "A")); rect(4, 27 + dy, 8, 28 + dy, "A"); rect(21, 27 + dy, 25, 28 + dy, "A"); }
    if (rid === "UL") { rect(22, 29 + dy, 25, 30 + dy, "A"); rect(5, 29 + dy, 8, 30 + dy, "A"); rect(10, 27 + dy, 11, 28 + dy, "R"); rect(18, 27 + dy, 19, 28 + dy, "R"); }
    if (rid === "FA") { rect(9, 24 + dy, 20, 27 + dy, (x, y) => (x <= 11 ? "r" : x >= 17 ? "R" : dt(x, y) ? "r" : "R")); rect(13, 28 + dy, 16, 31 + dy, (x) => (x < 15 ? "r" : "R")); rect(12, 32 + dy, 13, 34 + dy, "r"); rect(16, 32 + dy, 17, 34 + dy, "R"); }
    // hair behind/around the face (long hair for FA)
    if (rid === "FA") { rect(6, 9, 9, 27 + dy, (x, y) => (x <= 7 ? "D" : "E")); rect(20, 9, 23, 27 + dy, (x) => (x >= 22 ? "E" : "H")); }
    // head
    const [hrx, hry] = HD; ell(15, 12.5, hrx, hry, (x, y) => (x <= 10 ? sd : x === 11 ? (dt(x, y) ? sd : sm) : x >= 19 ? sl : x === 18 ? (dt(x, y) ? sl : sm) : sm));
    if (rid === "NV") { rect(8, 17, 21, 20, (x, y) => (x <= 10 ? sd : x >= 19 ? sl : sm)); put(14, 21, "s"); put(15, 21, "s"); rect(9, 21, 20, 21, (x) => (x === 14 || x === 15 ? "s" : x < 14 ? sd : sm)); }
    rect(6, 12, 6, 14, sd); rect(23, 12, 23, 14, sm); if (rid === "FA") { put(23, 15, "A"); }
    for (let x = 13; x <= 16; x++) put(x, 19, sd);
    // face
    if (rid !== "BP") rect(7, 9, 22, 11, (x, y) => (x >= 19 && y === 11 ? sm : sd));
    const by = rid === "BP" ? 10 : 11;
    if (rid === "FA") { [11, 12, 17, 18].forEach((x) => put(x, by, "E")); put(10, 12, "K"); put(19, 12, "K"); }
    else if (rid === "NV") { [10, 11, 12, 17, 18, 19].forEach((x) => { put(x, by, "K"); put(x, by - 1, "K"); }); }
    else [10, 11, 12, 17, 18, 19].forEach((x) => put(x, by, "K"));
    if (st.blink) { put(11, 12, "K"); put(12, 12, "K"); put(17, 12, "K"); put(18, 12, "K"); } else { put(11, 12, "W"); put(12, 12, "K"); put(17, 12, "W"); put(18, 12, "K"); }
    put(14, 13, sd); put(14, 14, sd); put(14, 15, sd); put(14, 16, sd); put(15, 16, "K");
    if (rid === "FA") { [13, 14, 15, 16].forEach((x) => put(x, 18, "R")); [14, 15].forEach((x) => put(x, 19, "r")); put(9, 15, "l"); put(20, 15, "l"); }
    else if (rid === "UL") { [13, 14, 15, 16].forEach((x) => put(x, 18, "K")); rect(10, 16, 19, 17, "r"); put(9, 17, "r"); put(20, 17, "r"); put(14, 16, "r"); put(15, 16, "r"); rect(7, 10, 8, 15, "r"); rect(21, 10, 22, 15, "r"); put(9, 14, "R"); put(20, 14, "R"); }
    else if (rid === "MI") { [13, 14, 15, 16].forEach((x) => put(x, 18, "K")); rect(11, 16, 18, 16, "K"); put(10, 17, "K"); put(19, 17, "K"); for (let y = 17; y <= 21; y++) for (let x = 9; x <= 20; x++) if (dt(x, y) && c[y][x] !== "K" && f[y][x]) c[y][x] = x < 14 ? "s" : "m"; }
    else { [13, 14, 15, 16].forEach((x) => put(x, 18, "K")); put(12, 18, sd); put(17, 18, sd); }
    // headwear / hair
    if (rid === "BP") {
      const hair = { 1: [11, 13], 2: [9, 19], 3: [7, 21], 4: [7, 22], 5: [7, 22], 6: [7, 22], 7: [7, 9], 8: [7, 8], 9: [7, 7] }; for (const y in hair) for (let x = hair[y][0]; x <= hair[y][1]; x++) put(x, +y, x >= 17 && y <= 4 ? "m" : (x * 3 + +y * 2) % 5 === 0 ? "D" : "s");
      put(16, 1, "D"); put(17, 0 + 1, "D"); put(19, 1, "s"); put(14, 2, "m"); for (const y of [7, 8, 9]) put(22, y, "D"); put(21, 7, "D"); rect(15, 6, 18, 7, "D");
      for (let x = 10; x <= 13; x++) { put(x, 11, "g"); put(x, 13, "g"); } put(10, 12, "g"); put(13, 12, "g"); for (let x = 16; x <= 19; x++) { put(x, 11, "g"); put(x, 13, "g"); } put(16, 12, "g"); put(19, 12, "g"); put(14, 11, "g"); put(15, 11, "g");
      put(23, 9, "A"); put(24, 8, "A"); put(25, 7, "A"); put(23, 10, "A");
    }
    if (rid === "NV") {
      const cr = { 1: [10, 19], 2: [8, 21], 3: [6, 23], 4: [6, 23], 5: [6, 23], 6: [6, 23] }; for (const y in cr) for (let x = cr[y][0]; x <= cr[y][1]; x++) put(x, +y, x <= 9 ? "H" : "W");
      rect(6, 7, 23, 8, "K"); rect(7, 9, 22, 9, "K"); rect(5, 10, 24, 10, "K"); put(20, 9, "E"); put(21, 9, "E"); rect(14, 3, 15, 5, "A"); rect(13, 4, 16, 4, "A");
    }
    if (rid === "FA") {
      ell(14, 6, 9.2, 3.8, (x, y) => (y <= 4 && x >= 14 ? "H" : "E")); put(14, 1, "K"); put(14, 2, "E"); rect(9, 8, 10, 9, "E");
      [[8, 7], [9, 7], [20, 7], [21, 8]].forEach(([x, y]) => put(x, y, "E")); rect(10, 9, 14, 9, "E"); rect(18, 9, 21, 10, "H");
    }
    if (rid === "MI") {
      const cr = { 1: [10, 19], 2: [9, 20], 3: [8, 21], 4: [8, 21], 5: [8, 21], 6: [8, 21] }; for (const y in cr) for (let x = cr[y][0]; x <= cr[y][1]; x++) put(x, +y, x >= 18 ? "C" : "E");
      rect(13, 1, 16, 2, "K"); rect(8, 7, 21, 8, "A"); rect(2, 9, 27, 9, (x) => (x >= 20 ? "C" : "E")); rect(4, 10, 25, 10, "K");
    }
    if (rid === "UL") {
      const cr = { 2: [9, 20], 3: [8, 21], 4: [8, 21], 5: [7, 22], 6: [7, 22], 7: [7, 22], 8: [7, 22] }; for (const y in cr) for (let x = cr[y][0]; x <= cr[y][1]; x++) put(x, +y, x <= 9 ? (dt(x, +y) ? "E" : "O") : x >= 20 ? "g" : "O");
      rect(14, 3, 15, 8, "E"); rect(7, 8, 22, 8, "E"); rect(11, 6, 12, 7, "A"); rect(8, 9, 21, 9, "K"); rect(9, 10, 20, 10, sd);
    }
    const out = c.map((r) => r.slice());
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!f[y][x] && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => f[y + b] && f[y + b][x + a])) out[y][x] = "K";
    for (let y = 26; y <= 34; y++) for (let x = 0; x <= 12; x++) out[y][x] = "K";
    for (let y = 27; y <= 33; y++) for (let x = 1; x <= 11; x++) out[y][x] = "A";
    let tx = 3; rid.split("").forEach((ch) => { const M = ch === "M", g = M ? "1000111011101011000110001" : FONT[ch], w = M ? 5 : 3; for (let k = 0; k < 5 * w; k++) if (g[k] === "1") out[28 + ((k / w) | 0)][tx + (k % w)] = "K"; tx += w + 1; });
    for (let i = 0; i < GW; i++) { out[0][i] = "K"; out[GH - 1][i] = "K"; } for (let i = 0; i < GH; i++) { out[i][0] = "K"; out[i][GW - 1] = "K"; }
    return out;
  }
  const paths = (g, only) => { const by = {}, GH = g.length, GW = g[0].length; for (let y = 0; y < GH; y++) { let x = 0; while (x < GW) { if (only && !only[y][x]) { x++; continue; } const ch = g[y][x]; let e = x; while (e + 1 < GW && g[y][e + 1] === ch && (!only || only[y][e + 1])) e++; (by[ch] = by[ch] || []).push(`M${x} ${y}h${e - x + 1}v1h-${e - x + 1}z`); x = e + 1; } } return Object.entries(by).map(([ch, d]) => `<path fill="${PAL[ch]}" d="${d.join("")}"/>`).join(""); };
  const cache = {};
  function portraitInner(rid, u, anim) {
    const key = rid + (anim ? "a" : "s");
    if (!cache[key]) {
      const base = px(rid, { blink: 0, breath: 0, smoke: -1 }); let s = `<g transform="scale(4)" shape-rendering="crispEdges">${paths(base)}`;
      if (anim) {
        const diff = (g) => { const m = g.map((r, y) => r.map((ch, x) => ch !== base[y][x])); return paths(g, m); };
        const sets = [["b", 0, { blink: 1, breath: 0, smoke: -1 }], ["r", 0, { blink: 0, breath: 1, smoke: -1 }]]; 
        sets.forEach(([n, p, st]) => { s += `<g class="pxa" data-s="${n}" data-p="${p}" display="none">${diff(px(rid, st))}</g>`; });
      }
      cache[key] = s + "</g>";
    }
    return cache[key];
  }
  const portrait = (rid, u) => `<svg viewBox="0 0 120 140" role="img" aria-hidden="true" class="portrait" data-o="${(rid.charCodeAt(0) * 7 + rid.charCodeAt(1) * 3) % 40}">${portraitInner(rid, u || rid, true)}</svg>`;
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function wheel(v) {
    const c = Cv(71, 71, "D"), cx = 35.5, cy = 35.5, glyph = (ch, x, y, col) => { const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.p(Math.round(x - 1) + (k % 3), Math.round(y - 2) + ((k / 3) | 0), col); };
    c.e(cx, cy, 35.5, 35.5, "A"); c.e(cx, cy, 33.5, 33.5, "E"); c.e(cx, cy, 25, 25, "H"); c.e(cx, cy, 24, 24, "C"); c.e(cx, cy, 14.5, 14.5, "D"); c.e(cx, cy, 2.2, 2.2, "A");
    for (let i = 0; i < 26; i++) { const a = Math.PI * 2 * i / 26; glyph(ALPHA[i], cx + 29.5 * Math.sin(a), cy - 29.5 * Math.cos(a), "W"); }
    for (let i = 0; i < 26; i++) { const a = Math.PI * 2 * (i + v) / 26; glyph(ALPHA[i], cx + 20.5 * Math.sin(a), cy - 20.5 * Math.cos(a), "G"); }
    c.r(32, 0, 38, 0, "R"); c.r(33, 1, 37, 1, "R"); c.r(34, 2, 36, 2, "R"); c.r(35, 3, 35, 3, "R");
    return `<g transform="scale(4)" shape-rendering="crispEdges">${paths(c.c)}</g>`;
  }

  /* Schematic, hand-drawn maps for the Real History box. Not to scale; they show who was where. */
  const MAPS = (function () {
    const INK = "#4a3920", LAND = "#d9c58f", SEA = "#c3cfc4", RED = "#b3261e", GRN = "#2f6b3f", BLU = "#2b4a77";
    const pt = (x, y, label, o) => { o = o || {}; const col = o.c || INK, dx = o.dx === undefined ? 7 : o.dx, dy = o.dy === undefined ? 4 : o.dy, anc = o.a || "start"; return `<circle cx="${x}" cy="${y}" r="${o.r || 3.5}" fill="${col}" stroke="#fff6dc" stroke-width="1.2"/><text x="${x + dx}" y="${y + dy}" font-size="${o.s || 8.5}" fill="${col}" font-weight="700" text-anchor="${anc}" letter-spacing=".3">${label}</text>`; };
    const lab = (x, y, t, o) => { o = o || {}; return `<text x="${x}" y="${y}" font-size="${o.s || 8}" fill="${o.c || INK}" text-anchor="${o.a || "start"}" letter-spacing="${o.l || 1.2}" ${o.i ? 'font-style="italic"' : ""} opacity="${o.o || 0.75}">${t}</text>`; };
    const land = (d) => `<path d="${d}" fill="${LAND}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`;
    const arrow = (d, c, dash) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.2" ${dash ? 'stroke-dasharray="5 4"' : ""} marker-end="url(#ah${c.slice(1)})"/>`;
    const defs = [RED, GRN, BLU, INK].map((c) => `<marker id="ah${c.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join("");
    const wrap = (inner) => `<svg viewBox="0 0 300 200" role="img" aria-hidden="true" class="rmap" font-family="Courier New, monospace"><defs>${defs}<pattern id="wv" width="14" height="8" patternUnits="userSpaceOnUse"><path d="M0 4q3.5-3 7 0t7 0" fill="none" stroke="#9fb3a6" stroke-width=".8"/></pattern></defs><rect width="300" height="200" fill="${SEA}"/><rect width="300" height="200" fill="url(#wv)" opacity=".6"/>${inner}<rect x="1.5" y="1.5" width="297" height="197" fill="none" stroke="${INK}" stroke-width="3"/><g transform="translate(268 30)" fill="${INK}"><path d="M0-17L4 0L0-4L-4 0z"/><text y="9" font-size="9" text-anchor="middle" font-weight="700">N</text></g></svg>`;
    return [
      /* 0: Poland to Britain */
      wrap(land("M105 38L150 30L205 34L262 40L284 70L278 120L250 150L190 170L140 160L112 138L100 100L112 78Z") + land("M38 38L64 34L78 54L72 82L86 100L70 116L46 112L34 90L46 70Z") + land("M140 160L176 168L190 188L120 190Z") +
        arrow("M231 78C190 82 150 92 118 106", RED, true) + arrow("M112 104C100 100 88 96 80 92", RED, true) +
        pt(231, 78, "WARSAW", { dy: -7, dx: -4, a: "middle", c: RED }) + pt(118, 108, "PARIS", { dx: 2, dy: 14, a: "middle" }) + pt(58, 76, "BLETCHLEY", { dx: 0, dy: -8, a: "middle", c: BLU }) + lab(252, 112, "POLAND", { a: "middle" }) + lab(150, 142, "FRANCE", { a: "middle" }) + lab(50, 128, "BRITAIN", { a: "middle" }) + lab(210, 124, "replicas + methods", { a: "middle", i: 1, s: 7.4, l: 0, c: RED, o: 1 })),
      /* 1: Atlantic convoys */
      wrap(land("M0 40L34 34L56 62L48 104L66 130L40 170L0 180Z") + land("M262 30L300 26L300 150L272 140L258 108L270 78Z") +
        arrow("M52 112C110 74 190 78 258 98", GRN, true) +
        [[112, 92], [140, 82], [172, 84], [196, 94]].map(([x, y]) => `<path d="M${x - 5} ${y + 4}L${x} ${y - 5}L${x + 5} ${y + 4}z" fill="${RED}" stroke="#fff6dc" stroke-width="1"/>`).join("") +
        pt(52, 112, "HALIFAX", { dy: 16, dx: 0, a: "middle" }) + pt(260, 98, "BRITAIN", { dy: 16, dx: -4, a: "end", c: BLU }) + pt(150, 36, "U-110 CAPTURED", { dx: 0, dy: -8, a: "middle", c: BLU }) + lab(154, 118, "CONVOY ROUTE", { a: "middle", c: GRN, o: 1 }) + lab(154, 64, "U-boat wolf packs", { a: "middle", c: RED, o: 1, i: 1, l: 0 })),
      /* 2: Pacific, carriers missing */
      wrap(land("M0 20L40 14L66 40L58 78L28 96L0 90Z") + land("M232 132L252 126L268 136L258 150L240 150Z") + land("M270 148L286 146L290 156L274 160Z") +
        `<circle cx="150" cy="86" r="42" fill="none" stroke="${RED}" stroke-width="2" stroke-dasharray="5 5"/><text x="150" y="98" font-size="38" fill="${RED}" text-anchor="middle" font-weight="700" opacity=".85">?</text>` +
        pt(30, 62, "JAPAN", { dx: 0, dy: 20, a: "middle" }) + pt(256, 140, "PEARL HARBOR", { dx: -4, dy: -10, a: "end", c: BLU }) + lab(140, 148, "JAPANESE CARRIERS", { a: "middle", c: RED, o: 1 }) + lab(140, 160, "location unknown", { a: "middle", c: RED, o: 1, i: 1, l: 0 }) + lab(150, 30, "radio silence", { a: "middle", i: 1, l: 0, s: 8 })),
      /* 3: Midway */
      wrap(land("M0 18L38 14L58 38L52 70L22 88L0 82Z") + land("M250 164L270 158L290 168L276 184L256 182Z") +
        `<circle cx="150" cy="102" r="4.5" fill="${INK}" stroke="#fff6dc" stroke-width="1.4"/><circle cx="150" cy="102" r="26" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="2 3"/>` +
        arrow("M72 42C96 52 122 70 140 90", RED, true) + arrow("M232 50C204 56 176 70 160 90", BLU, true) +
        lab(156, 116, "MIDWAY", { c: INK, o: 1, s: 9 }) + lab(156, 127, "(code name: AF)", { i: 1, l: 0, s: 7.4 }) + lab(90, 36, "JAPANESE CARRIERS", { c: RED, o: 1, s: 7.6, a: "middle" }) + lab(206, 40, "US CARRIERS WAIT", { c: BLU, o: 1, s: 7.6, a: "middle" }) + lab(30, 56, "JAPAN", { a: "middle" }) + lab(262, 152, "HAWAII", { a: "middle" })),
      /* 4: Solomon Islands */
      wrap(land("M24 42L74 30L100 50L84 72L46 76Z") + land("M148 96L184 86L204 98L196 118L160 122Z") + land("M214 128L254 120L276 134L262 156L226 160Z") +
        arrow("M70 56C96 66 120 82 150 100", RED, true) + arrow("M250 130C226 110 196 100 172 100", BLU, true) +
        pt(70, 56, "RABAUL", { dy: -8, dx: 0, a: "middle" }) + pt(172, 100, "BOUGAINVILLE", { dy: 24, dx: 0, a: "middle", c: RED, s: 7.4 }) + pt(250, 130, "HENDERSON FIELD", { dy: 50, dx: 0, a: "middle", c: BLU, s: 7.4 }) + lab(34, 112, "Yamamoto's flight", { c: RED, o: 1, i: 1, l: 0, s: 7.6 }) + lab(222, 104, "US fighters", { c: BLU, o: 1, i: 1, l: 0, s: 7.6, a: "middle" })),
      /* 5: Channel, the fake army */
      wrap(land("M0 60L40 52L96 58L150 46L214 52L248 44L300 50L300 0L0 0Z") + land("M0 146L60 140L110 150L140 138L190 120L246 112L300 118L300 200L0 200Z") +
        arrow("M214 50C226 70 236 90 226 112", RED, true) + arrow("M72 140C74 120 78 104 82 94", GRN, false) +
        pt(222, 112, "CALAIS", { dy: 14, dx: 0, a: "middle", c: RED }) + pt(78, 142, "NORMANDY", { dy: 14, dx: 0, a: "middle", c: GRN }) + lab(214, 38, "DOVER", { a: "middle", c: RED, o: 1 }) + lab(148, 20, "ENGLAND", { a: "middle", s: 9 }) + lab(150, 176, "FRANCE", { a: "middle", s: 9 }) + lab(292, 84, "invented army", { c: RED, o: 1, i: 1, l: 0, s: 7.6, a: "end" }) + lab(100, 92, "real landings", { c: GRN, o: 1, i: 1, l: 0, s: 7.6 }))
    ];
  })();
  return { scene: (id) => frame(id), portrait, portraitInner, wheel, map: (i) => MAPS[i] };
})();
