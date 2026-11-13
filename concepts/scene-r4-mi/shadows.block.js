  // ---- "One Man, Many Shadows", London, 1942: Garbo under a street lamp; on the brick wall behind him his shadow is joined,
  //      one by one, by the shadows of his imaginary agents (a sailor, a soldier, a woman, a waiter, a workman), each with a small
  //      move of its own, and last by a German officer looking back at them all: the Germans believed every one. A chalk tally
  //      on the wall counts the network up to 27, then they all fade back into the one man who invented them.
  //      A 1942 "KEEP MUM" poster, rain, a barrage balloon.
  //      Loop: sh 16x6, ra 8x1, lf 4x6, ce 2x12, sb 8x6 -> every period divides 96 ticks (8 s). State 0 = everyone on the wall.
  //      HOLD: sh: 6, ra: 1, lf: 6, ce: 12, sb: 6
  CH.shadows = { sh: 16, ra: 8, lf: 4, ce: 2, sb: 8 };
  const SHADE = { l: "m", m: "s", s: "r", r: "E", A: "m", W: "g", g: "H", H: "C", C: "E", E: "D", D: "K", K: "K", R: "r", B: "N", N: "Q", Q: "K", O: "E", V: "O", G: "O" };
  S.shadows = (p) => {
    const c = Cv(160, 70, "K"), sh = p.sh || 0, ra = p.ra || 0, lf = p.lf || 0, ce = p.ce || 0, sb = p.sb || 0;
    const LX = 27, LY = 10;                                                                                        // the lamp
    // night sky over the rooftops: a barrage balloon, a searchlight
    c.sky(0, 13, [["K", 4], ["D", 9], ["E", 14]]); stars(c, 6, 91);
    const ang = [-.6, -.4, -.2, 0, .2, 0, -.2, -.4][sb]; for (let t = 0; t < 16; t++) { const x = 92 + Math.round(Math.sin(ang) * t * 2.2), y = 13 - t; if (y >= 0) { c.p(x, y, "C"); c.p(x + 1, y, "C"); } }
    c.e(128, 4, 7, 2.4, "H"); c.r(122, 3, 133, 3, "g"); c.poly([[134, 3], [138, 1], [138, 6], [134, 5]], "C"); c.l(127, 7, 125, 13, "C");   // barrage balloon on its cable
    // brick wall, lit from the lamp
    const lvl = (x, y) => { const d = Math.hypot((x - LX) * .62, (y - LY) * 1.1); return d < 40 ? 2 : d < 82 ? 1 : 0; };   // the light reaches along the wall, where the shadows fall
    for (let y = 14; y <= 58; y++) for (let x = 0; x < 160; x++) {
      const row = (y - 14) >> 2, mortar = (y - 14) % 4 === 3 || (x + (row % 2) * 4) % 8 === 7, L = lvl(x, y);
      c.p(x, y, mortar ? ["D", "s", "m"][L] : (y - 14) % 4 === 0 && L === 2 ? "m" : ["E", "r", "s"][L]); }
    // a 1942 KEEP MUM poster on the wall
    c.r(134, 20, 156, 44, "R"); c.r(135, 21, 155, 43, "g"); c.r(135, 21, 155, 21, "W");
    const word = (t, x, y, col) => t.split("").forEach((ch, i) => { const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.p(x + i * 4 + (k % 3), y + ((k / 3) | 0), col); });
    word("KEEP", 138, 24, "R"); word("MUM", 140, 31, "K"); c.e(145, 40, 3, 2, "s"); c.r(143, 38, 147, 38, "K");      // the words, a small figure
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
    // the chalk tally: each agent adds marks, five agents make 27, the size of Garbo's invented network
    const marks = [0, 5, 10, 16, 21, 27][Math.min(vis, 5)];
    for (let m = 0; m < marks; m++) { const g = (m / 5) | 0, j = m % 5, gx0 = 56 + g * 10;
      if (j < 4) c.r(gx0 + j * 2, 17, gx0 + j * 2, 21, "W"); else c.l(gx0 - 1, 21, gx0 + 7, 17, "W"); }
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
