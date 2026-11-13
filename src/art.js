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
  // ---- The bait test, Paris, 1942: from a dark room across the street, someone watches two safe-house doors chalked
  //      A and B. Contact A was told one story, Contact B another. Every time, the black car slows at A, drives on and
  //      raids B, so the leak runs through B. Shadows in a lit window (wn), the car and door B (cr), rain (rn).
  // The car's whole visit as one seamless loop of [car x, door B opening]: door B open on a man in a hat (the still),
  // door closes, the car pulls away to the left, empty street, a car arrives from the right, pauses at A, parks at B, door opens.
  // 72 states x 2 frames = 144 frames, a multiple of the rain (8) and window (36) loops, so the whole scene repeats every 12 s.
  const LEAK_CAR = [].concat(
    Array(16).fill([60, 9]), [[60, 6], [60, 3]], Array(2).fill([60, 0]),
    [59, 57, 54, 50, 45, 39, 32, 24, 15, 5, -6, -18, -31, -45].map((x) => [x, 0]),
    Array(7).fill([null, 0]),
    [160, 150, 141, 133, 126, 120, 115, 111, 109, 108, 108, 108, 106, 102, 96, 90, 84, 78, 73, 68, 64, 62, 61, 60].map((x) => [x, 0]),
    Array(3).fill([60, 0]), [[60, 2], [60, 4], [60, 6], [60, 8]]);
  CH.leak = { rn: 8, wn: 6, cr: LEAK_CAR.length };
  // The truck's four soldiers, state by state: how many are still in the back, where the others stand in the street (x),
  // and whether one is in the lit doorway. They jump down on the far side, come round the truck's nose to guard door B,
  // then file into the house one by one. They never get back on: the truck leaves empty and a new load arrives next time.
  const LEAK_TROOPS = LEAK_CAR.map((s, i) => {
    const T = (bed, ground, inDoor) => ({ bed, ground, inDoor: !!inDoor });
    if (i <= 7) return T(0, [40, 45, 58], 1);
    if (i <= 9) return T(0, [40, 45, 56]);
    if (i <= 11) return T(0, [40, 48]);
    if (i <= 13) return T(0, [44]);
    if (i <= 40) return T(0, []);
    if (i <= 65) return T(4, []);
    return [T(2, []), T(0, [58]), T(0, [52, 58]), T(0, [46, 52, 58]), T(0, [40, 47, 58], 1), T(0, [40, 45, 58], 1)][i - 66];
  });
  S.leak = (p) => {
    const c = Cv(160, 70, "K"), rn = p.rn || 0, wn = p.wn || 0, cr = p.cr || 0;
    c.sky(0, 12, [["K", 6], ["D", 13]]); stars(c, 6, 61);
    // neighbouring buildings, darker, a few dim windows
    [[0, 38, 9], [120, 40, 7]].forEach(([x, w, top]) => { c.r(x, top, x + w - 1, 53, "E"); c.poly([[x - 1, top], [x + 3, top - 5], [x + w - 4, top - 5], [x + w, top]], "D");
      for (let r = 0; r < 3; r++) for (let k = 0; k < Math.floor(w / 9); k++) { const wx = x + 4 + k * 9, wy = top + 5 + r * 12; c.r(wx, wy, wx + 4, wy + 7, hs(wx, wy, 8) > .8 ? "m" : "D"); } });
    // the safe-house building: mansard roof with dormers, two floors of tall windows with shutters and balconies
    c.poly([[37, 14], [42, 5], [116, 5], [121, 14]], "C"); c.r(42, 5, 116, 5, "H"); c.r(98, 1, 102, 5, "C"); c.r(97, 1, 103, 1, "H");
    [52, 76, 100].forEach((x) => { c.r(x, 7, x + 5, 13, "E"); c.r(x + 1, 9, x + 4, 13, "D"); c.poly([[x - 1, 8], [x + 2.5, 5], [x + 6, 8]], "H"); });
    c.r(38, 14, 120, 53, (x, y) => ((y - 14) % 6 === 5 && (x + (((y / 6) | 0) % 2) * 6) % 12 ? "E" : "C"));   // stone courses
    const WX = [44, 58, 72, 86, 100];
    [16, 28].forEach((wy, f) => WX.forEach((wx, i) => {
      c.r(wx - 2, wy, wx - 1, wy + 8, "E"); c.r(wx + 7, wy, wx + 8, wy + 8, "E"); for (let y = wy + 1; y < wy + 8; y += 2) { c.p(wx - 2, y, "D"); c.p(wx + 8, y, "D"); }   // shutters
      const lit = f === 0 && i === 2, dim = f === 1 && i === 4;
      c.r(wx, wy, wx + 6, wy + 8, lit ? "A" : dim ? "m" : "D"); if (lit) { c.r(wx, wy, wx, wy + 8, "m"); c.r(wx + 6, wy, wx + 6, wy + 8, "m"); }
      if (!lit && !dim) c.r(wx + 3, wy, wx + 3, wy + 8, "E"); }));
    [25, 37].forEach((y) => { c.r(40, y, 118, y, "H"); for (let x = 40; x <= 118; x += 2) c.p(x, y + 1, "E"); });   // iron balconies
    // ground floor: shuttered shops around two blue doors, chalked A (right) and B (left)
    [[40, 44], [60, 96], [112, 118]].forEach(([x0, x1]) => { c.r(x0, 41, x1, 53, "H"); for (let y = 42; y < 53; y += 2) c.r(x0, y, x1, y, "C"); c.r(x0, 40, x1, 40, "E"); });
    const DB = 52, DA = 104;
    [[DB, "B"], [DA, "A"]].forEach(([dx, ch]) => {
      c.r(dx - 6, 42, dx + 6, 53, "N"); c.e(dx, 42, 6.5, 3.5, "N"); c.r(dx - 5, 43, dx + 5, 53, "Q"); c.e(dx, 43, 5, 2.5, "Q"); c.r(dx, 47, dx, 53, "N"); c.p(dx - 2, 50, "A"); c.p(dx + 2, 50, "A");
      const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.p(dx - 1 + (k % 3), 40 + ((k / 3) | 0), "W");   // chalk letter
      c.r(dx - 1, 38, dx + 1, 38, "A"); });                                                  // lamp over each door
    // pavement, kerb, cobbled street
    c.r(0, 54, 159, 55, "H"); c.r(0, 55, 159, 55, "g"); c.r(0, 56, 159, 62, "E"); for (let y = 57; y < 63; y += 2) for (let x = (y % 4); x < 160; x += 4) c.p(x, y, "C");
    // street lamp and its pool of light
    c.r(134, 22, 134, 54, "K"); c.r(131, 17, 137, 18, "K"); c.r(132, 19, 136, 21, "A"); c.r(133, 15, 135, 16, "K");
    for (let y = 53; y < 62; y++) for (let x = 118; x < 151; x++) { const u = (x - 134) / 16, q = (y - 57) / 4.5; if (u * u + q * q <= 1 && (x + y) % 2 === 0 && lighter[c.c[y][x]]) c.c[y][x] = lighter[c.c[y][x]]; }
    // the meeting window: shadows behind the curtain
    const inWin = (x, y) => (x >= 73 && x <= 77 ? "s" : c.c[y][x]);
    const shadow = (x) => { c.r(x, 19, x, 20, inWin); c.r(x - 1, 21, x + 1, 24, inWin); };
    [[75], [74], [74, 77], [75, 77], [76, 77], [76]][wn].forEach(shadow);   // each step moves one pixel, and the last flows into the first
    // the car's visit (state 0, door B open on the raid, is the moment that matters, so it is the still)
    const [cx, door] = LEAK_CAR[cr], raid = cx === 60 && door >= 3, troops = LEAK_TROOPS[cr];
    // raiders: plain-clothes police in long coats and hats, and a soldier in a steel helmet with a rifle; feet at yb
    const man = (x, yb, rim) => { c.r(x - 1, yb - 10, x + 1, yb - 10, "K"); c.r(x - 2, yb - 9, x + 2, yb - 9, "K"); c.r(x - 1, yb - 8, x + 1, yb - 7, "K");
      c.poly([[x - 1.5, yb - 6], [x + 2.5, yb - 6], [x + 3, yb - 1], [x - 2, yb - 1]], "K"); c.p(x - 1, yb, "K"); c.p(x + 1, yb, "K"); if (rim) { c.r(x + 2, yb - 5, x + 2, yb - 2, "C"); c.p(x + 2, yb - 9, "C"); } };
    const soldier = (x, yb) => { c.r(x - 1, yb - 10, x + 1, yb - 10, "K"); c.r(x - 2, yb - 9, x + 2, yb - 9, "K"); c.p(x - 2, yb - 8, "K"); c.p(x + 2, yb - 8, "K"); c.r(x - 1, yb - 8, x + 1, yb - 7, "K");
      c.r(x - 1, yb - 6, x + 1, yb - 2, "K"); c.r(x - 1, yb - 1, x - 1, yb, "K"); c.r(x + 1, yb - 1, x + 1, yb, "K"); c.l(x + 2, yb - 11, x + 2, yb - 3, "D"); c.p(x + 2, yb - 12, "E"); c.r(x + 2, yb - 9, x + 2, yb - 4, (xx, yy) => (yy % 2 ? "E" : "D")); };
    if (door) { const r = DB + 5; c.r(r - door + 1, 45, r, 53, "A"); c.poly([[r - door, 54], [r + 1, 54], [r + 4, 56], [r - door - 2, 56]], "m");
      if (door > 5) { const x = 50;                                                          // a man in a hat pushing in through the doorway, dark against the light
        c.r(x - 1, 45, x + 1, 45, "K"); c.r(x - 2, 46, x + 2, 46, "K"); c.r(x - 1, 47, x + 1, 48, "K"); c.poly([[x - 1.5, 49], [x + 2.5, 49], [x + 2.5, 53], [x - 1.5, 53]], "K"); }
      if (door > 5 && troops.inDoor) { const x = 55;                                          // a soldier going in beside him: grey helmet and tunic
        c.r(x - 1, 45, x + 1, 45, "C"); c.r(x - 2, 46, x + 2, 46, "E"); c.r(x - 1, 47, x + 1, 47, "s"); c.r(x - 2, 48, x + 2, 52, "H"); c.r(x - 2, 50, x + 2, 50, "K"); c.p(x - 1, 53, "K"); c.p(x + 1, 53, "K"); } }
    // (the guard at door B is now one of the truck's soldiers, drawn after the truck)
    if (cx !== null) {   // a German Opel Blitz truck in field grey: upright grille, bonnet, square cab with the cross on the door, slatted cargo bed of soldiers
      const x0 = cx, q = (pts, a) => c.poly(pts.map(([x, y]) => [x0 + x, y]), a), beam = (x, y) => { const v = c.c[y] && c.c[y][x]; if (v && (x + y) % 2 === 0 && lighter[v]) c.c[y][x] = lighter[v]; };
      for (let t = 1; t < 34; t++) for (let s = -Math.floor(t / 5); s <= Math.floor(t / 4); s++) beam(x0 + 1 - t, 49 + s);   // dimmed headlight on the street
      // soldiers in steel helmets sitting in the back, rifles upright, drawn first so the bed's side hides their bodies
      [21, 26, 31, 36].forEach((x, i) => { const X = x0 + x, y = 42; if (i < 4 - troops.bed) return;   // those who have jumped down
        c.r(X - 1, y - 6, X + 1, y - 6, "H"); c.r(X - 2, y - 5, X + 2, y - 5, "C"); c.r(X - 3, y - 4, X + 3, y - 4, "E"); c.p(X + 1, y - 6, "g");   // grey steel helmet, flared rim, a glint of lamp light
        c.r(X - 1, y - 3, X + 1, y - 2, "m"); c.p(X - 1, y - 3, "l");                                                                  // face under the helmet
        c.r(X - 2, y - 1, X + 2, y, "H"); c.p(X + 2, y - 1, "g"); });                                                                // field-grey shoulders
      q([[1, 54], [2, 50], [5, 48.5], [10, 48.5], [13, 51], [13, 54]], "C"); c.r(x0 + 4, 48, x0 + 10, 48, "H");                    // front wing over the wheel
      c.r(x0 + 2, 45, x0 + 10, 51, "H"); c.r(x0 + 2, 45, x0 + 10, 45, "g"); for (let x = 4; x < 10; x += 2) c.r(x0 + x, 47, x0 + x, 50, "C");   // bonnet with side vents
      c.r(x0, 44, x0 + 2, 52, "C"); for (let y = 45; y < 52; y += 2) c.r(x0, y, x0 + 1, y, "K"); c.r(x0, 44, x0 + 2, 44, "g");     // tall upright grille
      c.r(x0 + 10, 38, x0 + 18, 52, "H"); c.r(x0 + 10, 38, x0 + 18, 38, "g"); c.r(x0 + 10, 39, x0 + 10, 44, "C");                     // square cab, roof catching the lamp
      c.r(x0 + 11, 39, x0 + 17, 43, "E"); c.p(x0 + 16, 40, "g"); c.r(x0 + 11, 44, x0 + 17, 44, "C");                                  // side window
      { const X = x0 + 14, Y = 47; [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => c.p(X + a, Y + b, "W")); c.r(X - 1, Y, X + 1, Y, "K"); c.r(X, Y - 1, X, Y + 1, "K"); }   // small Balkenkreuz: black cross edged in white
      c.r(x0 + 19, 43, x0 + 38, 52, "H"); c.r(x0 + 19, 43, x0 + 38, 43, "g"); [46, 49].forEach((y) => c.r(x0 + 19, y, x0 + 38, y, "C"));   // slatted cargo bed
      [19, 26, 32, 38].forEach((x) => c.r(x0 + x, 43, x0 + x, 52, "C"));                                                               // stakes
      c.r(x0 + 1, 52, x0 + 38, 53, "K"); c.r(x0 + 14, 53, x0 + 18, 53, "C");                                                           // chassis and step
      q([[22, 54], [24, 50.5], [27, 49.5], [32, 49.5], [35, 50.5], [37, 54]], "C");                                                    // rear wing
      [7, 29].forEach((w) => { const X = x0 + w; c.e(X, 53.5, 4.2, 4.2, "K"); c.e(X, 53.5, 2.4, 2.4, "C"); c.p(X, 53, "H"); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => c.p(X + a, 53 + b, "E")); });   // big wheels, steel hubs
      c.p(x0 + 3, 47, "A"); c.p(x0 + 4, 47, "A"); c.r(x0 - 1, 52, x0, 52, "g");                                                        // masked headlamp, bumper
    }
    if (cx === 60 && troops.ground.length) {   // soldiers in the street, WWII German field grey: grey steel helmet, grey tunic, black belt and boots, rifle
      const trooper = (x, yb) => { c.r(x - 1, yb - 12, x + 1, yb - 12, "H"); c.r(x - 2, yb - 11, x + 2, yb - 11, "C"); c.r(x - 3, yb - 10, x + 3, yb - 10, "E"); c.p(x + 1, yb - 12, "g");   // helmet
        c.r(x - 1, yb - 9, x + 1, yb - 8, "m"); c.p(x - 1, yb - 9, "l");                                                                          // face
        c.r(x - 1, yb - 7, x + 1, yb - 7, "H"); c.r(x - 2, yb - 6, x + 2, yb - 3, "H"); c.r(x - 2, yb - 6, x - 2, yb - 3, "C"); c.r(x + 2, yb - 6, x + 2, yb - 3, "g"); c.r(x - 2, yb - 4, x + 2, yb - 4, "K");   // tunic: shaded and lit edges, belt
        c.r(x - 1, yb - 2, x + 1, yb - 1, "C"); c.p(x - 1, yb, "K"); c.p(x + 1, yb, "K"); c.l(x + 3, yb - 12, x + 3, yb - 3, "K"); };       // trousers, jackboots, rifle
      troops.ground.forEach((x) => trooper(x, 61));
    }
    for (let x = 3; x < 160; x += 6) { const y0 = (x * 13 + rn * 8) % 64; for (let k = 0; k < 3; k++) if (y0 + k < 63)   /* 8 steps of 8 = 64, so the rain wraps without a jump */ c.p(x - (k >> 1), y0 + k, "H"); }   // rain beyond the glass
    // our side of the glass: curtains, the sill, and the watcher's head and shoulders
    c.r(0, 0, 159, 2, "r"); for (let x = 0; x < 160; x += 4) c.p(x, 2, "K");
    const curtain = (x0, x1, edge) => { for (let x = x0; x <= x1; x++) for (let y = 0; y < 70; y++) { const sway = Math.round(Math.sin(y / 9) * 1); c.p(x, y, (x + sway) % 3 === 0 ? "K" : x === edge ? "R" : "r"); } };
    curtain(0, 9, 9); curtain(150, 159, 150);
    c.r(0, 63, 159, 69, "s"); c.r(0, 63, 159, 63, "m"); c.r(0, 64, 159, 64, "l");
    c.e(28, 71, 25, 12, "K"); c.r(23, 55, 32, 60, "K");                                                     // the watcher's shoulders and neck, from behind
    c.e(27.5, 51.5, 5.8, 6.8, "K");                                                                         // head, from behind
    c.poly([[21, 45], [22, 40.5], [24, 38.5], [26.5, 38.5], [27.5, 39.5], [28.5, 38.5], [31, 38.5], [33, 40.5], [34, 45]], "K");   // fedora crown, tapered, with the pinch in the top
    c.r(21, 43, 34, 43, "E");                                                                                // hat band
    c.e(27.5, 45.6, 11.5, 1.7, "K"); c.p(16, 45, "K"); c.p(39, 45, "K");                                    // brim, its edges turned up a little
    for (let y = 47; y < 57; y++) c.p(33 - Math.abs(y - 51.5) * .45, y, "C");                              // rim light from the street lamp: neck,
    c.p(33, 41, "C"); c.p(33, 42, "C"); c.p(34, 44, "C"); c.r(35, 45, 38, 45, "C"); c.p(39, 44, "C");       // crown and brim
    for (let a = -1.4; a < -.2; a += .04) c.p(28 + Math.cos(a) * 25, 71 + Math.sin(a) * 12, "C");
    return c;
  };
  // ---- The Bug River near Sarnaki, May 1944: the Home Army finds a V-2 that came down almost intact
  CH.bug = { rv: 3, rd: 2, lt: 4 };
  S.bug = (p) => {
    const c = Cv(160, 70, "K"), rv = p.rv || 0, rd = p.rd || 0, lt = p.lt || 0;
    c.sky(0, 30, [["D", 5], ["E", 12], ["C", 20], ["H", 25], ["s", 28], ["m", 31]]); stars(c, 7, 41); 
    for (let x = 0; x < 160; x++) if ((x * 7) % 11 < 4) c.p(x, 22, "g");                                        // a thin cloud bank in the afterglow
    // far bank: low trees and a few willows
    for (let x = 0; x < 160; x++) { const top = 26 + Math.round(1.8 * Math.sin(x / 5) + 1.4 * Math.sin(x / 1.7) + hs(x, 2, 7) * 1.2); c.r(x, top, x, 32, "K"); }
    [[18, 20], [63, 21], [121, 19]].forEach(([x, top]) => c.e(x, top + 5, 5, 6, "K"));
    // the river: dark water, the afterglow reflected in broken streaks
    c.r(0, 33, 159, 45, (x, y) => (y < 37 ? "B" : y < 41 ? "N" : "Q"));
    for (let y = 33; y <= 45; y++) for (let x = 0; x < 160; x++) { const k = (x + y * 7 + rv * 3) % 13; if (y % 2 === 0 && k < 3) c.p(x, y, y < 37 ? "l" : y < 41 ? "m" : "B"); if (y % 3 === 1 && (x * 3 + y + rv * 5) % 17 === 0) c.p(x, y, "N"); }
    // near bank: grass and mud
    c.poly([[0, 46], [40, 44], [100, 45], [160, 44], [160, 69], [0, 69]], (x, y) => { const n = hs(x >> 2, y >> 1, 4); return hs(x, y, 13) > .97 ? "V" : n > .78 ? "E" : (n > .62 && (x + y) % 2) ? "E" : "O"; });
    c.l(0, 46, 40, 44, "s"); c.l(40, 44, 100, 45, "s"); c.l(100, 45, 159, 44, "s");                              // mud line at the water
    // reeds along the edge, leaning with the breeze
    for (let i = 0; i < 27; i++) { const x = 2 + i * 6 + (i % 3), h = 6 + (i * 5) % 6, lean = rd ? 1 : 0; if (x > 30 && x < 48) continue;
      for (let k = 0; k < h; k++) c.p(x + (k > h / 2 ? lean : 0), 46 - k, k > h - 2 ? "m" : i % 4 ? "V" : "G"); }
    // ---- the V-2, lying on the bank, nose in the mud by the reeds, black-and-white test paint
    const RY = 52, X0 = 34, X1 = 98;                                                                               // nose tip .. tail end
    const radius = (x) => { const t = (x - X0) / (X1 - X0); return t < .18 ? 3.6 * Math.sqrt(t / .18) : t > .9 ? 3.6 - (t - .9) * 8 : 3.6; };
    for (let x = X0; x <= X1; x++) { const r = radius(x); for (let y = Math.round(RY - r); y <= Math.round(RY + r); y++) {
        const seg = Math.floor((x - X0) / 8), top = y < RY; let col = (seg + (top ? 0 : 1)) % 2 ? "K" : "W";
        if (col === "W" && y > RY + 1) col = "g"; if (col === "K" && y < RY - 1) col = "C"; c.p(x, y, col); } }
    c.l(X0 + 10, RY - 3, X1 - 6, RY - 3, "W");                                                                      // highlight along the top
    // tail fins: one up, one down (half buried), with the jet vane ring
    c.poly([[86, 49], [96, 41], [99, 41], [99, 49]], "C"); c.l(86, 49, 96, 41, "H"); c.l(96, 41, 99, 41, "g"); c.poly([[88, 55], [97, 61], [99, 61], [99, 55]], "C");
    c.r(98, 50, 100, 54, "H"); c.p(101, 52, "K");
    // damage: a dented panel and a split near the middle, the nose pushed into the mud
    c.r(60, 49, 63, 50, "H"); c.p(61, 50, "K"); c.l(70, 49, 72, 55, "K");
    c.e(34, 54, 5, 2.4, "s"); c.r(30, 55, 40, 56, "E"); c.p(29, 53, "s"); c.p(39, 57, "s");
    // furrow it ploughed in the bank
    for (let x = 100; x < 124; x++) c.p(x, 54 + ((x * 3) % 2), x % 3 ? "s" : "E");
    // three Home Army men, lit from the lantern on their left: caps, faces, olive and brown coats
    const person = (x, yb, coat, armL, armR) => {
      c.r(x - 1, yb - 13, x + 1, yb - 13, "K"); c.r(x - 2, yb - 12, x + 1, yb - 12, "K");                          // cap and peak (peak to the left)
      c.r(x - 1, yb - 11, x + 1, yb - 10, "m"); c.p(x - 1, yb - 11, "l"); c.p(x - 1, yb - 10, "l"); c.p(x + 1, yb - 10, "s");   // face, lit side left
      c.r(x - 2, yb - 9, x + 2, yb - 5, coat); c.r(x + 2, yb - 9, x + 2, yb - 5, "E"); c.r(x - 2, yb - 9, x - 2, yb - 5, coat === "H" ? "g" : "m");   // coat with lit and shaded edges
      c.r(x - 2, yb - 4, x + 2, yb - 4, "K");                                                                        // belt
      c.r(x - 2, yb - 3, x - 1, yb - 1, "E"); c.r(x + 1, yb - 3, x + 2, yb - 1, "E"); c.r(x - 2, yb, x - 1, yb, "K"); c.r(x + 1, yb, x + 2, yb, "K");   // legs, boots
      if (armL) armL(x, yb); if (armR) armR(x, yb); };
    // kneeling man by the tail, reaching toward the lantern
    { const x = 106, yb = 58;
      c.r(x - 1, yb - 12, x + 1, yb - 12, "K"); c.r(x - 2, yb - 11, x + 1, yb - 11, "K");
      c.r(x - 1, yb - 10, x + 1, yb - 9, "m"); c.p(x - 1, yb - 10, "l"); c.p(x - 1, yb - 9, "l");
      c.r(x - 2, yb - 8, x + 2, yb - 4, "s"); c.r(x - 2, yb - 8, x - 2, yb - 4, "m"); c.r(x + 2, yb - 8, x + 2, yb - 4, "E");
      c.r(x - 5, yb - 3, x + 1, yb - 2, "E"); c.r(x - 5, yb - 1, x - 4, yb, "E");                                     // thigh forward, shin down to the ground
      c.r(x + 1, yb - 3, x + 3, yb, "E"); c.r(x + 2, yb, x + 5, yb, "K");                                              // other knee down, boot behind
      c.l(x - 2, yb - 7, x - 6, yb - 3, "s"); c.p(x - 7, yb - 2, "l"); }                                                // arm to the lantern, lit hand
    // standing man pointing at the rocket
    person(118, 59, "H", (x, yb) => { c.l(x - 3, yb - 8, x - 8, yb - 10, "g"); c.p(x - 9, yb - 10, "l"); }, (x, yb) => c.r(x + 3, yb - 8, x + 3, yb - 5, "E"));
    // man arriving with a coil of rope over his shoulder
    person(138, 62, "s", (x, yb) => c.r(x - 3, yb - 8, x - 3, yb - 5, "m"), (x, yb) => c.r(x + 3, yb - 8, x + 3, yb - 5, "E"));
    c.e(141, 55, 2.4, 2.2, "m"); c.e(141, 55, 1.2, 1, "s"); c.p(141, 55, "E");
    return c;
  };
  // ---- (built in from concepts/scene-r3-fa/dash.js, teacher's choice 2026-11-13)
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
  // ---- (built in from concepts/scene-r3-ul/advance.js, teacher's choice 2026-11-13)
  // ---- January 1942: an Afrika Korps post idles and watches the panzers roll out of a dust storm (truck and uniforms changed to German, 2026-11-13)
  CH.advance = { va: 36, vb: 4, vc: 8, vd: 4, ve: 2 };
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
    // panzers in Afrika Korps sand with grey-green patches, like the truck; columns -6..12 from x, rows y..y+5; gun pointing the way they roll
    const TANK = [
      "         sssss       ",
      "   EEEEEsmlOmms      ",
      "        smmmOOs      ",
      "     smmmOOOmmmmlmmms",
      "     sssssssssOOssss ",
      "      EKEKEKEKEKEKE  "];
    const tank = (x, y) => TANK.forEach((row, r) => { for (let i = 0; i < row.length; i++) if (row[i] !== " ") fade(x + i - 6, y + r, row[i]); });
    for (let k = -1; k < 6; k++) { tank(36 * k + 10 - va, 34); tank(36 * k + 28 - va, 29); }   // 36 px apart, rows staggered by 18
    // the dust wall: thin on the left, solid on the right, billowing on top
    for (let y = 0; y <= 40; y++) for (let x = 0; x < 160; x++) {
      const a = Math.max(0, Math.min(1, (x - 92) / 44)); let top = 12 + (1 - a) * 18; if (top < 26) top += Math.round(1.6 * Math.sin(x / 6 + vd * Math.PI / 2));
      if (y < top) continue; const d = a * Math.max(0, Math.min(1, .45 + (y - top) * .09));
      if (BAY[y & 3][x & 3] / 16 < d) c.p(x, y, y < top + 4 ? "s" : y < top + 9 ? "m" : "l"); }
    // a German Opel Blitz parked beyond the post, in Afrika Korps colours: sand-brown with grey-green patches, small cross on the door
    c.r(74, 58, 126, 61, "s");                                                                                       // its shadow
    c.poly([[96, 47], [97, 42], [100, 40], [119, 40], [122, 42], [123, 47]], "l"); for (let x = 101; x < 121; x += 5) c.r(x, 41, x, 47, "m");   // canvas tilt over the cargo bed, hoops showing
    c.l(97, 42, 100, 40, "E"); c.r(100, 40, 119, 40, "E"); c.l(119, 40, 122, 42, "E");
    c.r(96, 47, 123, 55, "l"); [50, 53].forEach((y) => c.r(96, y, 123, y, "m")); c.r(104, 48, 111, 51, "O"); c.r(115, 52, 121, 54, "O");   // slatted bed, grey-green patches
    c.r(96, 47, 123, 47, "E"); c.r(96, 47, 96, 55, "E"); c.r(123, 47, 123, 55, "E");
    c.r(86, 42, 95, 55, "l"); c.r(88, 43, 94, 46, "E"); c.p(93, 44, "g"); c.r(86, 52, 95, 54, "m"); c.r(87, 51, 89, 54, "O");               // square cab with its window
    c.r(86, 41, 95, 41, "E"); c.r(86, 41, 86, 55, "E"); c.r(95, 41, 95, 47, "E");
    { const X = 91, Y = 49; [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => c.p(X + a, Y + b, "W")); c.r(X - 1, Y, X + 1, Y, "K"); c.r(X, Y - 1, X, Y + 1, "K"); }   // Balkenkreuz
    c.r(77, 47, 86, 54, "l"); c.r(77, 46, 86, 46, "E"); for (let x = 79; x < 86; x += 2) c.r(x, 49, x, 52, "m"); c.r(80, 48, 83, 49, "O"); c.r(77, 53, 86, 54, "m");   // bonnet with side vents
    c.r(74, 46, 76, 55, "s"); for (let y = 47; y < 55; y += 2) c.r(74, y, 75, y, "E"); c.r(74, 46, 76, 46, "m");                           // tall upright grille
    c.poly([[75, 57], [76, 53], [79, 51.5], [85, 51.5], [88, 54], [88, 57]], "m"); c.poly([[106, 57], [108, 53.5], [111, 52.5], [117, 52.5], [120, 53.5], [122, 57]], "m"); c.l(76, 53, 79, 51, "E"); c.r(79, 51, 85, 51, "E"); c.l(108, 53, 111, 52, "E"); c.r(111, 52, 117, 52, "E");   // wings over the wheels
    c.r(74, 55, 123, 56, "E"); c.p(77, 49, "A"); c.r(73, 55, 74, 55, "m");                                                                    // chassis, masked headlamp, bumper
    [81, 114].forEach((x) => { c.e(x, 57, 4.2, 4.2, "K"); c.e(x, 57, 2.4, 2.4, "C"); c.p(x, 57, "H"); });                               // big wheels
    // Afrika Korps soldiers behind the sandbags, lit from the right: long-peaked olive field caps with goggles on the brim, sun-faded olive tropical tunics
    const man = (x, ty) => { c.r(x - 2, ty, x + 2, ty, "O"); c.r(x - 2, ty + 1, x + 2, ty + 1, "O"); c.r(x + 1, ty, x + 2, ty, "V");                    // field cap, lit side
      c.r(x + 2, ty + 2, x + 3, ty + 2, "E");                                                                                                // the cap's peak, toward the light
      c.p(x - 1, ty, "g"); c.p(x, ty, "B"); c.p(x - 2, ty, "B");                                                                             // goggles pushed up on the cap
      c.r(x - 2, ty + 2, x + 1, ty + 4, "m"); c.r(x + 1, ty + 3, x + 2, ty + 4, "l"); c.p(x + 1, ty + 3, "E"); c.p(x - 2, ty + 4, "s");     // face in the shade of the peak, lit cheek
      c.r(x - 3, ty + 5, x + 3, ty + 16, "O"); c.r(x + 2, ty + 5, x + 3, ty + 16, "m"); c.r(x - 4, ty + 5, x - 4, ty + 16, "E");            // olive tunic, faded lit edge, shadow side
      c.r(x - 3, ty + 12, x + 3, ty + 12, "s"); c.r(x - 3, ty + 5, x + 3, ty + 5, "V"); c.p(x - 1, ty + 7, "s"); c.p(x + 1, ty + 7, "s"); };   // webbing belt, open collar, pocket flaps
    // three men waiting and watching the column go by
    man(11, 43); c.r(7, 49, 16, 50, "O"); c.r(8, 49, 15, 49, "s"); c.r(15, 49, 16, 50, "m");                       // leaning on the sandbags, forearms on top
    c.l(21, 50, 24, 37, "E"); c.p(24, 36, "H"); c.p(22, 45, "s");                                                  // his rifle propped against the wall
    man(28, 40); c.r(25, 47, 31, 48, "O"); c.r(25, 49, 31, 49, "s"); c.p(26, 47, "m"); c.p(30, 48, "m"); c.r(31, 47, 31, 48, "m");   // arms folded
    man(46, 37);                                                                                                    // smoking, now and then lifting his cigarette
    if (ve) { c.l(48, 45, 48, 43, "O"); c.p(48, 42, "m"); c.p(49, 41, "W"); c.p(50, 41, "A"); c.p(51, 39, "g"); c.p(52, 37, "g"); }
    else { c.l(48, 44, 49, 47, "O"); c.p(49, 48, "m"); c.p(50, 48, "W"); c.p(51, 48, "R"); c.p(52, 46, "g"); c.p(52, 44, "g"); c.p(53, 42, "g"); }
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
  // ---- (built in from concepts/scene-r4-ul/maltadawn.js, teacher's choice 2026-11-13)
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
    // mechanic left of the nose, arms at his sides (no wave, at the teacher's request)
    man(30, 66, "W", "m", (x, yb) => { c.r(x + 3, yb - 8, x + 3, yb - 5, "s"); c.r(x - 3, yb - 8, x - 3, yb - 5, "l"); });
    // man in blue overalls by the tail with a clipboard
    man(128, 67, "Q", "N", (x, yb) => { c.r(x - 3, yb - 8, x - 3, yb - 6, "B"); c.r(x - 6, yb - 8 - md, x - 4, yb - 6 - md, "W"); c.p(x - 5, yb - 7 - md, "K"); c.r(x + 3, yb - 8, x + 3, yb - 5, "C"); });
    // man in a red shirt hauling the wheel chock rope under the nose
    man(46, 68, "A", "R", (x, yb) => { c.l(x + 3, yb - 7, x + 7, yb - 2, "l"); c.r(x - 3, yb - 8, x - 3, yb - 5, "E"); });
    c.l(53, 66, 56, 66, "g"); c.r(56, 65, 59, 66, "H");
    return c;
  };
  // ---- (built in from concepts/scene-r5-bp/hutdecrypt.js, teacher's choice 2026-11-13)
  // ---- Bletchley Park, a hut at night, April 1943: an analyst reads a decrypt while the wall map shows
  // German forces moving toward Greece and Sardinia.
  // ba: teleprinter paper creeps up 4x6, bb: lamp flicker 3x8, bc: steam 4x6, bd: marching arrows 3x8,
  // be: pencil moves 4x6, bf: pin glow 2x12. All divide 24 ticks.
  CH.hutdecrypt = { ba: 4, bb: 3, bc: 4, bd: 3, be: 4, bf: 2 };
  const LT = Object.assign({}, lighter, { O: "V" }, { s: "m", m: "l", r: "s", K: "D", G: "V" });
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
  // ---- (built in from concepts/scene-r5-mi/mincedesk.js, teacher's choice 2026-11-13)
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
  // ---- (built in from concepts/scene-r4-mi/madrid.block.js, teacher's choice 2026-11-13)
  // ---- "Madrid Believes It", 1942: a split screen. Left, London at night: Garbo seals a letter and slides it away. Right, Madrid:
  //      the same letter arrives on a German officer's desk; he reads it, stamps it, files it under ARABEL (Garbo's German code
  //      name), and another pin lights on his map of Britain.
  //      Loop: mt 24x4 (the letter's journey), lw 8x6 (London searchlight), mf 4x6 (Madrid lamp glow) -> all divide 96 ticks (8 s).
  //      State 0 = the stamp coming down in Madrid. HOLD: mt: 4, lw: 6, mf: 6
  CH.madrid = { mt: 24, lw: 8, mf: 4 };
  S.madrid = (p) => {
    const c = Cv(160, 70, "D"), mt = p.mt || 0, lw = p.lw || 0, mf = p.mf || 0;
    const word = (t, x, y, col) => { t.split("").forEach((ch, i) => { const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.p(x + i * 4 + (k % 3), y + ((k / 3) | 0), col); }); };
    // ---------- LONDON (left), night
    c.r(0, 0, 76, 43, (x) => (x % 9 < 1 ? "E" : "D"));
    c.r(4, 8, 28, 30, "s"); c.r(6, 10, 26, 28, "Q"); c.e(22, 14, 2, 2, "W");                                          // window, moon
    const ang = [-.8, -.55, -.3, -.1, .1, -.1, -.3, -.55][lw];
    for (let t = 0; t < 30; t++) { const x = 12 + Math.round(Math.sin(ang) * t), y = 28 - Math.round(Math.cos(ang) * t); if (x >= 6 && x <= 26 && y >= 10) c.p(x, y, t < 14 ? "B" : "N"); }   // searchlight
    c.r(13, 15, 15, 28, "K"); c.r(12, 14, 16, 15, "K"); c.poly([[12, 14], [14, 9], [16, 14]], "K"); c.p(14, 18, "A");   // the clock tower
    c.r(6, 24, 26, 28, "K"); c.r(16, 19, 16, 28, "s"); c.r(6, 19, 26, 19, "s");                                      // rooftops, window bars
    word("LONDON", 33, 3, "g");
    c.r(0, 44, 76, 69, "s"); c.r(0, 44, 76, 44, "m"); c.r(6, 50, 70, 62, "r"); c.r(7, 51, 69, 61, "s"); c.r(36, 56, 40, 56, "A");   // desk and drawer
    c.poly([[56, 34], [59, 30], [67, 30], [70, 34]], "V"); c.r(62, 35, 63, 42, "m"); c.r(59, 42, 66, 43, "m"); c.r(57, 35, 69, 35, "A");   // desk lamp
    c.r(14, 30, 34, 44, "C"); c.r(14, 30, 15, 44, "E"); c.r(32, 30, 34, 44, "H"); c.r(22, 30, 26, 33, "W"); c.r(23, 31, 25, 35, "r");   // Garbo: suit, collar, tie
    c.r(19, 19, 28, 28, "m"); c.r(24, 20, 28, 27, "l"); c.r(18, 16, 28, 19, "K"); c.r(18, 16, 19, 24, "K"); c.r(26, 25, 28, 25, "s"); c.p(26, 22, "K");   // face, hair, moustache, eye
    // ---------- the divider between the two cities
    c.r(77, 0, 82, 69, "K"); c.r(78, 0, 78, 69, "C"); c.r(81, 0, 81, 69, "E");
    // ---------- MADRID (right), warm evening
    c.r(83, 0, 159, 43, (x) => ((x - 83) % 12 < 1 ? "r" : "s"));
    c.r(83, 9, 159, 9, "m"); c.r(83, 10, 159, 10, "r");                                                               // picture rail on the panelled wall
    word("MADRID", 98, 3, "l");
    // the officer's map of Britain, pins for every imaginary agent
    c.r(88, 9, 126, 37, "m"); c.r(90, 11, 124, 35, "B");
    c.poly([[107, 13], [111, 12], [114, 15], [113, 19], [116, 23], [119, 28], [117, 33], [109, 34], [104, 33], [108, 29], [106, 25], [103, 21], [105, 17]], "l");   // Great Britain (sketch)
    c.poly([[94, 22], [99, 20], [101, 25], [99, 30], [94, 29]], "l");                                                // Ireland (sketch)
    const PINS = [[108, 16], [111, 21], [113, 26], [110, 30], [116, 31], [106, 27]], lit = mt >= 4 && mt <= 7;
    PINS.forEach(([x, y], i) => { if (i < 5 || mt <= 7) c.p(x, y, i === 5 && lit ? (mt % 2 ? "W" : "A") : "R"); });  // a new pin goes in once the letter is filed
    if (lit) { c.p(105, 27, "A"); c.p(107, 27, "A"); c.p(106, 26, "A"); c.p(106, 28, "A"); }
    // desk, lamp glow, the ARABEL file
    c.r(83, 44, 159, 69, "r"); c.r(83, 44, 159, 44, "m"); c.r(90, 50, 152, 62, "s"); c.r(91, 51, 151, 61, "r"); c.r(119, 56, 123, 56, "A");
    c.poly([[121, 30], [124, 26], [130, 26], [133, 30]], "A"); c.r(124, 26, 130, 26, "l"); c.r(122, 31, 132, 31, mf % 2 ? "A" : "W");   // brass desk lamp, its glow breathing
    c.r(127, 32, 127, 42, "m"); c.r(124, 42, 130, 43, "A"); c.r(124, 42, 130, 42, "l");
    c.r(92, 38, 120, 43, "A"); c.r(92, 38, 120, 38, "l"); c.r(92, 43, 120, 43, "m"); word("ARABEL", 95, 39, "E");      // manila file labelled ARABEL
    // the officer: grey suit, fair hair, seated on the right, facing the letters
    c.r(136, 31, 154, 44, "H"); c.r(152, 31, 154, 44, "C"); c.r(136, 31, 137, 44, "g"); c.r(141, 31, 145, 34, "W"); c.r(142, 32, 144, 36, "E");   // suit, collar, tie
    c.r(139, 20, 148, 29, "m"); c.r(139, 21, 142, 28, "l"); c.r(139, 17, 149, 20, "l"); c.r(147, 17, 149, 25, "l"); c.p(141, 23, "K"); c.r(139, 26, 141, 26, "s");   // face lit by the lamp, fair hair
    // ---------- the letter's journey, one channel so it is never in two places at once
    const env = (x, y) => { c.r(x, y, x + 8, y + 4, "W"); c.l(x, y, x + 4, y + 2, "g"); c.l(x + 8, y, x + 4, y + 2, "g"); };
    const sheet = (x, y, stamped) => { c.r(x, y, x + 8, y + 4, "W"); c.r(x + 1, y + 1, x + 7, y + 1, "H"); c.r(x + 1, y + 3, x + 6, y + 3, "H"); if (stamped) { c.r(x + 4, y + 1, x + 7, y + 3, "R"); c.r(x + 5, y + 2, x + 6, y + 2, "W"); } };
    const stamp = (x, y) => { c.r(x, y, x + 3, y + 1, "K"); c.r(x + 1, y - 3, x + 2, y - 1, "s"); c.r(x, y - 5, x + 3, y - 4, "s"); };
    const hand = (x, y) => { c.r(x, y, x + 2, y + 1, "l"); };
    if (mt <= 1) { sheet(126, 39, true); stamp(130, mt === 0 ? 37 : 32); c.l(137, 34, 133, mt === 0 ? 34 : 29, "H"); }  // the stamp comes down on the letter
    else if (mt <= 3) { sheet(mt === 2 ? 118 : 108, 39, true); c.l(137, 36, mt === 2 ? 127 : 117, 41, "H"); hand(mt === 2 ? 126 : 116, 40); }   // filed under ARABEL
    else if (mt <= 7) { c.l(137, 36, 134, 40, "H"); hand(132, 40); }                                                  // he looks up at the map
    // London: Garbo seals the envelope, then slides it across his desk and out of the frame
    if (mt >= 8 && mt <= 11) { env(40, 40); hand(mt % 2 ? 44 : 42, mt % 2 ? 38 : 39); c.l(34, 34, mt % 2 ? 43 : 41, 39, "C"); }
    else if (mt >= 12 && mt <= 15) { const x = [46, 54, 62, 70][mt - 12]; env(x, 40); if (mt < 14) { hand(x - 2, 41); c.l(34, 35, x - 2, 41, "C"); } }
    else { c.l(34, 34, 44, 41, "C"); hand(44, 40); c.r(42, 41, 52, 43, "W"); c.r(43, 42, 51, 42, "H"); }              // otherwise he is writing the next one
    // Madrid: the letter slides in from the divider, is opened and read
    if (mt >= 16 && mt <= 19) env([83, 93, 103, 112][mt - 16], 40);
    else if (mt === 20 || mt === 21) { c.r(128, 26, 136, 34, "W"); for (let r = 0; r < 3; r++) c.r(129, 28 + r * 2, 135, 28 + r * 2, "H"); c.l(138, 34, 136, 32, "H"); hand(135, 31); }   // held up and read
    else if (mt >= 22) { sheet(126, 39, false); stamp(130, 32); c.l(137, 34, 133, 29, "H"); }                         // laid down, the stamp raised
    return c;
  };
  // ---- (built in from concepts/scene-r4-mi/shadows.block.js, teacher's choice 2026-11-13)
  // ---- "One Man, Many Shadows", London, 1942: Garbo under a street lamp; on the brick wall behind him his shadow is joined,
  //      one by one, by the shadows of his imaginary agents (a sailor, a soldier, a woman, a waiter, a workman), each with a small
  //      move of its own, and last by a German officer looking back at them all: the Germans believed every one. Then they all
  //      fade back into the one man who invented them. Rain, a barrage balloon, a searchlight.
  //      Loop: sh 16x6, ra 8x1, lf 4x6, ce 2x12, sb 8x6 -> every period divides 96 ticks (8 s). State 0 = everyone on the wall.
  //      HOLD: sh: 6, ra: 1, lf: 6, ce: 12, sb: 6
  CH.shadows = { sh: 16, ra: 8, lf: 4, ce: 2, sb: 8 };
  const SHADE = { l: "m", m: "s", s: "r", r: "E", A: "m", W: "g", g: "H", H: "C", C: "E", E: "D", D: "K", K: "K", R: "r", B: "N", N: "Q", Q: "K", O: "E", V: "O", G: "O" };
  S.shadows = (p) => {
    const c = Cv(160, 70, "K"), sh = p.sh || 0, ra = p.ra || 0, lf = p.lf || 0, ce = p.ce || 0, sb = p.sb || 0;
    const LX = 27, LY = 10;                                                                                        // the lamp
    // night sky over the rooftops: a barrage balloon, a searchlight
    c.sky(0, 13, [["D", 3], ["Q", 8], ["N", 14]]);   // deep night blue, so the blacked-out rooftops show against it stars(c, 6, 91);
    const ang = [-.6, -.4, -.2, 0, .2, 0, -.2, -.4][sb]; for (let t = 0; t < 16; t++) { const x = 92 + Math.round(Math.sin(ang) * t * 2.2), y = 13 - t, w = 1 + (t >> 2); if (y < 0) continue;   // a bright searchlight, widening as it climbs
      for (let k = -w; k <= w + 1; k++) { const edge = k === -w || k === w + 1, core = Math.abs(k - .5) < 1.5; c.p(x + k, y, core ? (t < 9 ? "W" : "g") : edge ? ((x + k + y) % 2 ? "B" : "N") : "g"); } }
    c.e(128, 4, 7, 2.4, "H"); c.r(122, 3, 133, 3, "g"); c.poly([[134, 3], [138, 1], [138, 6], [134, 5]], "C"); c.l(127, 7, 125, 13, "C");   // barrage balloon on its cable
    // London beyond the wall, blacked out: terrace roofs with chimney pots, an office block, a church spire, a pitched roof
    const roofs = [[0, 15, 8], [34, 52, 4], [60, 75, 9], [142, 159, 7]];
    roofs.forEach(([a, b, top]) => c.r(a, top, b, 13, "K"));
    [[3, 5], [10, 6], [146, 4], [153, 4]].forEach(([x, top]) => { c.r(x, top, x + 2, 8, "K"); c.p(x, top - 1, "K"); c.p(x + 2, top - 1, "K"); });   // chimney stacks and pots
    c.r(34, 3, 52, 3, "D"); c.r(41, 1, 44, 3, "K"); [37, 42, 47].forEach((x) => c.r(x, 6, x + 2, 8, "D")); c.p(48, 10, "C");   // office block: parapet, lift housing, dark windows, one chink of light
    c.poly([[60, 9], [67.5, 4], [75, 9]], "K"); c.r(66, 3, 68, 5, "K");                                                    // pitched roof with a chimney
    c.r(99, 5, 105, 13, "K"); c.poly([[99, 5], [102, 0], [105, 5]], "K"); c.p(102, 0, "D"); c.r(101, 8, 103, 10, "D");      // church tower and spire, a dark louvre
    c.r(106, 9, 118, 13, "K"); c.r(110, 7, 111, 9, "K");                                                                  // the church roof running back
    // brick wall, lit from the lamp
    const lvl = (x, y) => { const d = Math.hypot((x - LX) * .62, (y - LY) * 1.1); return d < 40 ? 2 : d < 82 ? 1 : 0; };   // the light reaches along the wall, where the shadows fall
    for (let y = 14; y <= 58; y++) for (let x = 0; x < 160; x++) {
      const row = (y - 14) >> 2, mortar = (y - 14) % 4 === 3 || (x + (row % 2) * 4) % 8 === 7, L = lvl(x, y);
      c.p(x, y, mortar ? ["D", "s", "m"][L] : (y - 14) % 4 === 0 && L === 2 ? "m" : ["E", "r", "s"][L]); }
    // pavement and kerb, the pool of lamp light
    c.r(0, 59, 159, 69, (x, y) => (Math.abs(x - LX) < 22 - (y - 59) && (x + y) % 2 === 0 ? "H" : "C")); c.r(0, 59, 159, 59, "H");
    for (let x = 6; x < 160; x += 14) c.r(x, 60, x, 69, "E"); c.r(0, 65, 159, 65, "E");
    // the shadows on the wall: Garbo's own, then his imaginary agents, appearing one by one and fading back
    const dk = (x, y) => { const v = c.c[y] && c.c[y][x]; if (v) c.c[y][x] = SHADE[SHADE[v]] || "K"; };
    const R = (x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) dk(x, y); };
    const yb = 58, KINDS = {
      man: (x) => { R(x - 3, yb - 27, x + 3, yb - 27); R(x - 2, yb - 29, x + 2, yb - 28); R(x - 2, yb - 26, x + 1, yb - 23); R(x - 3, yb - 22, x + 3, yb - 6); R(x - 4, yb - 12, x + 4, yb - 6); R(x - 2, yb - 5, x - 1, yb); R(x + 1, yb - 5, x + 2, yb); },   // hat and overcoat
      sailor: (x, q) => { R(x - 3, yb - 28, x + 3, yb - 27); R(x - 2, yb - 26, x + 1, yb - 23); R(x - 4, yb - 22, x + 4, yb - 20); R(x - 3, yb - 19, x + 3, yb - 11); R(x - 3, yb - 10, x - 1, yb); R(x + 1, yb - 10, x + 3, yb); R(x - 4, yb - 2, x - 1, yb); R(x + 1, yb - 2, x + 4, yb);
        if (q) { R(x + 4, yb - 27, x + 5, yb - 21); dk(x + 3, yb - 28); } },                                          // flat cap, collar, bell-bottoms; touches his cap
      soldier: (x, q) => { R(x - 4, yb - 26, x + 4, yb - 26); R(x - 2, yb - 28, x + 2, yb - 27); R(x - 2, yb - 25, x + 1, yb - 22); R(x - 3, yb - 21, x + 3, yb - 8); R(x - 2, yb - 7, x - 1, yb); R(x + 1, yb - 7, x + 2, yb);
        for (let k = 0; k < 12; k++) dk(x + 4 + (q ? k >> 3 : k >> 2), yb - 19 - k); },                              // tin hat; shifts the rifle on his shoulder
      woman: (x, q) => { R(x - 4, yb - 26, x + 4, yb - 26); R(x - 2, yb - 28, x + 2, yb - 27); R(x - 2, yb - 25, x + 1, yb - 22); R(x - 2, yb - 21, x + 2, yb - 14); R(x - 3, yb - 13, x + 3, yb - 8); R(x - 4, yb - 7, x + 4, yb - 5);
        for (let y = yb - 4; y <= yb; y++) { dk(x - 1, y); dk(x + 1, y); } R(x + 4, yb - 14, x + 6, yb - 11); if (q) R(x - 6, yb - 18, x - 3, yb - 17); else R(x - 3, yb - 20, x - 3, yb - 14); },   // wide-brimmed hat, skirt, handbag; checks her watch
      waiter: (x, q) => { const t = q ? 2 : 0; R(x - 2, yb - 27, x + 1, yb - 22); R(x - 3, yb - 21, x + 3, yb - 11); R(x - 2, yb - 10, x - 1, yb); R(x + 1, yb - 10, x + 2, yb); R(x + 4, yb - 26 - t, x + 4, yb - 19); R(x + 2, yb - 27 - t, x + 8, yb - 27 - t); dk(x + 5, yb - 29 - t); dk(x + 6, yb - 29 - t); dk(x + 5, yb - 28 - t); },   // lifts his tray
      worker: (x, q) => { R(x - 2, yb - 27, x + 2, yb - 26); R(x - 4, yb - 26, x - 3, yb - 26); R(x - 2, yb - 25, x + 1, yb - 22); R(x - 3, yb - 21, x + 3, yb - 9); R(x - 2, yb - 8, x - 1, yb); R(x + 1, yb - 8, x + 2, yb);
        if (q) { R(x + 5, yb - 21, x + 8, yb - 18); dk(x + 4, yb - 21); dk(x + 4, yb - 20); } else { R(x + 4, yb - 18, x + 7, yb - 15); dk(x + 4, yb - 19); } },   // flat cap with peak; swings his tool bag
      officer: (x) => { R(x - 3, yb - 29, x + 2, yb - 28); dk(x - 3, yb - 30); dk(x - 2, yb - 30); R(x - 3, yb - 27, x + 2, yb - 27); R(x - 6, yb - 26, x - 3, yb - 26); R(x - 2, yb - 26, x + 1, yb - 22);   // peaked cap, visor toward the others
        R(x - 3, yb - 21, x + 3, yb - 8); R(x - 4, yb - 7, x + 4, yb - 3); R(x + 3, yb - 17, x + 4, yb - 13); R(x - 2, yb - 2, x - 1, yb); R(x + 1, yb - 2, x + 2, yb); } };   // long greatcoat, hands behind his back, boots
    const PEOPLE = [["man", 55], ["sailor", 66], ["soldier", 77], ["woman", 89], ["waiter", 99], ["worker", 111], ["officer", 126]];
    const vis = [6, 6, 6, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5][sh];                                        // up one at a time, all of them together, then down
    PEOPLE.forEach(([k, x], i) => { if (i <= vis) KINDS[k](x, (sh + i) % 2); });
    // the lamp post and its lantern, flickering a little
    c.r(26, 14, 28, 62, "K"); c.r(27, 14, 27, 62, "E"); c.r(24, 60, 30, 63, "K"); c.r(22, 13, 32, 13, "K");
    c.poly([[23, 5], [31, 5], [30, 12], [24, 12]], "K"); c.r(25, 6, 29, 11, lf === 2 ? "m" : "A"); c.r(26, 7, 28, 10, lf === 1 ? "A" : "W"); c.r(24, 3, 30, 4, "K"); c.p(27, 2, "K");
    // Garbo, under the lamp: hat, overcoat with the collar up, smoking; lit from the left
    const gx = 42, gy = 66;
    c.r(gx - 4, gy - 25, gx + 4, gy - 25, "K"); c.r(gx - 2, gy - 28, gx + 2, gy - 26, "K"); c.r(gx - 2, gy - 26, gx + 2, gy - 26, "E");   // fedora with its band
    c.r(gx - 2, gy - 24, gx + 2, gy - 20, "m"); c.r(gx - 2, gy - 24, gx - 1, gy - 20, "l"); c.p(gx + 1, gy - 22, "K"); c.r(gx - 1, gy - 20, gx + 1, gy - 20, "s");   // face, lit side, eye, moustache
    c.r(gx - 4, gy - 19, gx + 4, gy - 4, "C"); c.r(gx - 4, gy - 19, gx - 3, gy - 4, "H"); c.r(gx + 3, gy - 19, gx + 4, gy - 4, "E");   // overcoat, lit and shaded edges
    c.r(gx - 3, gy - 19, gx - 2, gy - 17, "E"); c.r(gx + 2, gy - 19, gx + 3, gy - 17, "E"); c.r(gx - 4, gy - 11, gx + 4, gy - 11, "E");   // turned-up collar, belt
    c.r(gx - 2, gy - 3, gx - 1, gy, "E"); c.r(gx + 1, gy - 3, gx + 2, gy, "E"); c.r(gx - 3, gy, gx - 1, gy, "K"); c.r(gx + 1, gy, gx + 3, gy, "K");   // legs, shoes
    c.r(gx + 3, gy - 21, gx + 5, gy - 21, "W"); c.p(gx + 6, gy - 21, ce ? "A" : "R"); if (ce) { c.p(gx + 7, gy - 23, "H"); c.p(gx + 8, gy - 25, "C"); }   // cigarette, ember glowing on each draw
    // rain over everything
    for (let x = 3; x < 160; x += 6) { const y0 = (x * 13 + ra * 8) % 64; for (let k = 0; k < 3; k++) if (y0 + k < 69) c.p(x - (k >> 1), y0 + k, lvl(x, y0) === 2 ? "g" : "H"); }
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
  const HOLD = { wv: 9, ib: 8, w: 5, sm: 3, wk: 5, k: 6, ro: 4, wh: 2, nd: 2, sw: 2, kb: 6, lp: 6, tp: 3, pm: 8, fl: 2, sp: 3, cl: 4, rw: 3, cd: 2, lb: 3, dg: 5, kp: 3, rn: 1, ty: 2, pn: 4, sl: 3, sd: 2, wn: 6, cr: 2, rv: 4, rd: 6, lt: 2, pl: 3, fm: 3, gl: 2, sk: 6, ws: 8, ll: 12, pa: 12, st: 8, va: 4, vb: 6, vc: 6, vd: 12, ve: 24, ma: 2, mb: 4, mc: 12, md: 12, ba: 6, bb: 8, bc: 6, bd: 8, be: 6, bf: 12, xa: 12, xb: 6, xc: 8, mt: 4, lw: 6, mf: 6, sh: 6, ra: 1, lf: 6, ce: 12, sb: 6 }, cacheS = {};
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
