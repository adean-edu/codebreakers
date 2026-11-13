  // ---- "The Letter Between the Lines", London, 1942: Garbo writes a harmless-looking letter while his MI5 case officer,
  //      Tomás Harris, holds another page up to the lamp, and the report in secret ink appears between the lines.
  //      Loop: gp 12x8, gw 4x3, gs 6x4, gx 8x6, gr 4x2 -> every period divides 96 ticks (8 s). State 0 = page up, secret lines showing.
  //      HOLD: gp: 8, gw: 3, gs: 4, gx: 6, gr: 2
  CH.letter = { gp: 12, gw: 4, gs: 6, gx: 8, gr: 4 };
  S.letter = (p) => {
    const c = Cv(160, 70, "D"), gp = p.gp || 0, gw = p.gw || 0, gs = p.gs || 0, gx = p.gx || 0, gr = p.gr || 0;
    // wall: dark striped wallpaper, a picture rail
    c.r(0, 0, 159, 43, (x) => (x % 9 < 1 ? "E" : "D")); c.r(0, 9, 159, 9, "C");
    // window with the blackout curtains drawn, a gap showing the night: rain, and a searchlight sweeping
    c.r(118, 4, 156, 38, "s"); c.r(120, 6, 154, 36, "Q");
    const ang = [-.9, -.7, -.5, -.3, -.15, -.3, -.5, -.7][gx];
    for (let t = 0; t < 40; t++) for (let w = -1; w <= 1; w++) { const x = 137 + Math.round(Math.sin(ang) * t + w), y = 36 - Math.round(Math.cos(ang) * t); if (x >= 132 && x <= 141 && y >= 6) c.p(x, y, t < 20 ? "B" : "N"); }
    for (let i = 0; i < 6; i++) { const x = 132 + (i * 3) % 10, y = 6 + ((i * 11 + gr * 8) % 30); c.p(x, y, "g"); c.p(x, y + 1, "B"); }
    const fold = (x0, x1) => { for (let x = x0; x <= x1; x++) for (let y = 5; y <= 39; y++) c.p(x, y, (x % 4 === 0) ? "K" : (x % 4 === 1 ? "R" : "r")); };
    fold(116, 131); fold(142, 158);
    // the desk, lamp light pooling on it
    c.r(0, 44, 159, 69, "s"); c.r(0, 44, 159, 44, "m");
    [[8, 52], [56, 104], [112, 152]].forEach(([a, b]) => { c.r(a, 50, b, 62, "r"); c.r(a + 1, 51, b - 1, 61, "s"); c.r(a + 1, 51, b - 1, 51, "m"); const m = (a + b) >> 1; c.r(m - 2, 56, m + 2, 56, "A"); c.p(m - 2, 57, "m"); c.p(m + 2, 57, "m"); });   // drawers with brass pulls
    for (let x = 44; x < 116; x++) { const u = Math.abs(x - 80) / 36; c.p(x, 44, u < .55 ? "l" : (x % 2 ? "l" : "m")); if (u < .7 && x % 2) c.p(x, 45, "m"); }
    // green banker's lamp
    c.poly([[70, 34], [73, 29], [87, 29], [90, 34]], "V"); c.poly([[70, 34], [73, 29], [76, 29], [74, 34]], "G"); c.r(72, 35, 88, 35, "A");
    c.r(79, 36, 80, 42, "m"); c.r(75, 42, 85, 43, "m"); c.r(75, 42, 85, 42, "l");
    for (let y = 36; y < 44; y++) for (let x = 66; x < 95; x++) if ((x + y) % 3 === 0 && Math.abs(x - 80) < (y - 34) * 1.8 && c.c[y][x] === "D") c.p(x, y, "E");   // soft light under the shade
    // ashtray, cigarette, curling smoke
    c.r(62, 42, 68, 43, "H"); c.r(63, 41, 67, 41, "C"); c.r(66, 40, 70, 40, "W"); c.p(70, 40, "A");
    for (let k = 0; k < 3; k++) { const ph = (gs + k * 2) % 6, y = 38 - ph * 3, x = 70 + Math.round(Math.sin(ph * 1.1 + k) * 1.5); if (ph < 5) { c.p(x, y, "g"); if (ph < 3) c.p(x + 1, y - 1, "H"); } }
    // the index cards of imaginary agents, the top one ticked
    c.r(124, 41, 136, 43, "W"); c.r(125, 40, 137, 40, "g"); c.r(124, 43, 136, 43, "g"); c.l(128, 42, 129, 43, "R"); c.l(129, 43, 131, 41, "R");
    // Garbo, seated on the left: slicked dark hair, a small moustache, dark suit, writing
    c.r(14, 30, 40, 44, "C"); c.r(14, 30, 16, 44, "E"); c.r(38, 30, 40, 44, "H");                               // suit
    c.r(25, 30, 29, 34, "W"); c.r(26, 31, 28, 36, "r");                                                          // collar and tie
    c.r(22, 19, 31, 28, "m"); c.r(27, 20, 31, 27, "l"); c.r(21, 16, 31, 19, "K"); c.r(21, 16, 22, 24, "K");          // face lit from the lamp, slicked hair
    c.r(29, 25, 31, 25, "s"); c.p(29, 22, "K"); c.p(31, 23, "m"); c.r(23, 29, 30, 29, "s");                       // small moustache, eye, nose, jaw
    // his letter: airmail paper with the harmless visible lines, the last one growing as he writes
    c.r(44, 39, 64, 43, "W"); for (let r = 0; r < 2; r++) c.r(46, 40 + r * 2, 62, 40 + r * 2, "H"); c.r(46, 43, 46 + 3 + gw * 3, 43, "E");
    const hx = 49 + gw * 3; c.l(37, 33, hx - 3, 40, "C"); c.l(37, 34, hx - 3, 41, "C"); c.l(38, 32, hx - 2, 39, "H"); c.r(hx - 2, 39, hx, 41, "l"); c.l(hx + 1, 41, hx + 3, 36, "K");   // sleeve, hand, pen
    // Harris, standing on the right, holding a page up toward the lamp
    c.r(104, 22, 116, 44, "E"); c.r(114, 22, 116, 44, "C"); c.r(108, 22, 111, 26, "W"); c.r(109, 23, 110, 28, "Q");  // suit, collar, tie
    c.r(105, 11, 113, 20, "m"); c.r(105, 12, 107, 19, "l"); c.r(104, 8, 113, 11, "s"); c.r(112, 8, 113, 14, "s");     // face lit from the lamp, dark hair
    c.p(106, 15, "K"); c.r(105, 21, 112, 21, "s");
    // the page: up by the lamp with the secret writing showing, or lowered to the desk
    const POS = [2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2][gp], INK = [3, 3, 2, 1, 0, 0, 0, 0, 0, 1, 2, 3][gp];
    if (POS === 2) { if (INK) for (let y = 7; y <= 30; y++) for (let x = 83; x <= 103; x++) { const d = Math.max(86 - x, x - 100, 10 - y, y - 27); if (d >= 1 && d <= 3 && (x * 3 + y * 5) % (d + 2 - Math.min(INK, 2)) === 0) c.p(x, y, d === 1 && INK === 3 ? "m" : "s"); }   // a soft warm halo from the lamp behind the page
      c.r(86, 10, 100, 27, "W"); c.r(86, 10, 100, 10, "l");
      for (let r = 0; r < 5; r++) c.r(88, 12 + r * 3, 98, 12 + r * 3, "H");                                        // the visible, harmless lines
      if (INK) for (let r = 0; r < 5; r++) for (let x = 88; x <= 98; x++) if (INK === 3 || (INK === 2 && x % 3) || (INK === 1 && x % 3 === 0)) c.p(x, 13 + r * 3, INK === 3 ? "s" : "m");   // secret ink rising between them
      c.l(103, 26, 100, 20, "E"); c.r(99, 19, 101, 21, "l"); }                                                      // his arm and hand holding it up
    else if (POS === 1) { c.r(90, 28, 102, 38, "W"); for (let r = 0; r < 3; r++) c.r(92, 30 + r * 3, 100, 30 + r * 3, "H"); c.l(104, 30, 102, 34, "E"); c.r(101, 33, 103, 35, "l"); }
    else { c.r(90, 40, 104, 43, "W"); c.r(92, 41, 102, 41, "H"); c.l(104, 32, 103, 40, "E"); c.r(102, 39, 104, 41, "l"); }
    return c;
  };
