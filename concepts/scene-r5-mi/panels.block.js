  // ---- "Mincemeat in Four Panels", 1943: the whole operation as a four-panel strip, a gold frame lighting each in turn.
  //      1 LONDON: Major Martin's battledress, his briefcase, love letters and ID; a hand slips the secret letter in.
  //      2 AT SEA: HMS Seraph surfaced at night; the canister slides over the side.
  //      3 SPAIN: dawn; a fisherman leans from his boat toward a shape in a life jacket.
  //      4 SICILY: German tank markers slide from Sicily to Greece and Sardinia; then the Allied arrow lands on Sicily.
  //      Loop: qh 5x24 (which frame is lit; 0 = all), qa/qb/qc 4x6 (each panel's small motion), qd 8x15 (the map)
  //      -> every period divides 120 ticks (10 s). State 0 = all four panels lit, the map showing the outcome.
  //      HOLD: qh: 24, qa: 6, qb: 6, qc: 6, qd: 15
  CH.panels = { qh: 5, qa: 4, qb: 4, qc: 4, qd: 8 };
  S.panels = (p) => {
    const c = Cv(160, 70, "K"), qh = p.qh || 0, qa = p.qa || 0, qb = p.qb || 0, qc = p.qc || 0, qd = p.qd || 0;
    const P = [[2, 2], [81, 2], [2, 37], [81, 37]];                                                                // each panel's top-left, inside size 77x32
    const word = (t, x, y, col) => { let i = 0; t.split("").forEach((ch) => { if (ch !== " ") { const g = FONT[ch]; for (let k = 0; k < 15; k++) if (g[k] === "1") c.p(x + i * 4 + (k % 3), y + ((k / 3) | 0), col); } i++; }); };
    const at = (n) => { const [ox, oy] = P[n]; return { r: (a, b, x, y, v) => c.r(ox + a, oy + b, ox + x, oy + y, v), p: (a, b, v) => c.p(ox + a, oy + b, v), l: (a, b, x, y, v) => c.l(ox + a, oy + b, ox + x, oy + y, v), e: (a, b, rx, ry, v) => c.e(ox + a, oy + b, rx, ry, v), poly: (pts, v) => c.poly(pts.map(([a, b]) => [ox + a, oy + b]), v), word: (t, a, b, v) => word(t, ox + a, oy + b, v) }; };

    // ---------- 1 LONDON: the persona
    { const q = at(0);
      q.r(0, 0, 76, 31, "E"); q.e(38, 0, 18, 6, "C"); q.r(0, 23, 76, 31, "s"); q.r(0, 23, 76, 23, "m");          // wall, a pool of lamplight, the table
      q.l(14, 1, 14, 3, "g"); q.l(8, 4, 20, 4, "g");                                                                   // hanger
      q.poly([[7, 5], [21, 5], [24, 7], [23, 9], [21, 9], [21, 19], [7, 19], [7, 9], [5, 9], [4, 7]], "s");            // battledress blouse: shoulders, body
      q.r(3, 8, 5, 20, "s"); q.r(23, 8, 25, 20, "s"); q.r(3, 20, 5, 21, "r"); q.r(23, 20, 25, 21, "r"); q.l(5, 8, 5, 20, "E"); q.l(23, 8, 23, 20, "E");   // sleeves hanging down, cuffs
      q.poly([[11, 5], [14, 9], [17, 5]], "E"); q.r(12, 5, 16, 5, "r");                                              // open collar
      q.l(14, 9, 14, 18, "E"); q.r(8, 10, 12, 12, "r"); q.r(16, 10, 20, 12, "r"); q.r(8, 10, 12, 10, "E"); q.r(16, 10, 20, 10, "E");   // front opening, breast pockets with flaps
      q.r(7, 17, 21, 19, "r"); q.r(7, 17, 21, 17, "E"); q.p(14, 18, "A"); [11, 14].forEach((y) => q.p(15, y, "A")); q.l(7, 5, 4, 7, "m"); q.l(21, 5, 24, 7, "m");   // waistband and buckle, buttons, lit shoulders
      q.r(30, 17, 46, 23, "K"); q.r(30, 17, 46, 18, "H"); q.r(30, 17, 46, 17, "g"); q.r(36, 15, 40, 16, "H"); q.r(37, 16, 39, 16, "K"); q.r(37, 19, 39, 20, "A");   // the official black briefcase, flap and handle catching the lamp, brass lock
      for (let k = 0; k < 6; k++) q.p(47 + k, 21 + (k % 2), "g");                                                       // its chain
      q.r(54, 19, 63, 22, "g"); q.r(55, 18, 64, 21, "W"); q.p(59, 19, "R"); q.r(56, 20, 62, 20, "H");                  // love letters, sealed
      q.r(66, 18, 74, 22, "W"); q.r(67, 19, 69, 21, "E"); q.r(70, 19, 73, 19, "H"); q.r(70, 21, 72, 21, "H");          // his identity card
      const lx = [34, 38, 42, 46][qa], ly = qa === 0 ? 14 : 12;                                                         // the secret letter going into the case
      q.r(lx, ly, lx + 6, ly + 2, "W"); q.p(lx + 1, ly + 1, "R"); q.r(lx + 7, ly, lx + 9, ly + 2, "l"); q.r(lx + 10, ly, lx + 14, ly + 2, "C");
      q.word("LONDON", 52, 2, "l"); }

    // ---------- 2 AT SEA: the delivery
    { const q = at(1);
      q.r(0, 0, 76, 19, (a, b) => (b < 6 ? "D" : "Q")); q.e(62, 6, 3, 3, "W"); [[8, 3], [22, 7], [48, 2], [70, 12]].forEach(([a, b]) => q.p(a, b, "g"));
      q.r(0, 20, 76, 31, "N"); for (let b = 21; b < 32; b += 3) for (let a = 0; a < 77; a++) if ((a + b * 3 + qb * 3) % 12 < 3) q.p(a, b, "B");
      q.poly([[6, 20], [66, 20], [62, 24], [10, 24]], "C"); q.r(8, 20, 64, 20, "H");                                    // HMS Seraph's hull, surfaced
      q.r(30, 12, 40, 20, "C"); q.r(31, 11, 39, 11, "H"); q.l(37, 5, 37, 11, "C"); q.l(34, 7, 34, 11, "C");              // conning tower, periscopes
      [44, 48, 52].forEach((a) => { q.r(a, 16, a + 1, 19, "K"); q.p(a, 15, "E"); q.p(a + 1, 15, "E"); });               // officers on deck
      const cx = [54, 57, 60, 63][qb], cy = qb === 3 ? 21 : 18; q.r(cx, cy, cx + 10, cy + 1, "g"); q.r(cx, cy, cx + 10, cy, "W");   // the canister going over the side
      q.word("AT SEA", 2, 2, "l"); }

    // ---------- 3 SPAIN: the find at dawn
    { const q = at(2);
      q.r(0, 0, 76, 13, (a, b) => (b < 4 ? "C" : b < 8 ? "s" : b < 11 ? "r" : "m")); q.e(60, 13, 4, 3, "A");          // dawn
      q.poly([[0, 13], [14, 10], [30, 12], [46, 9], [76, 12], [76, 14], [0, 14]], "s");                               // the Spanish coast
      q.r(0, 14, 76, 31, (a, b) => (b < 20 ? "B" : "N")); for (let b = 15; b < 32; b += 3) for (let a = 0; a < 77; a++) if ((a + b * 5 + qc * 4) % 14 < 2) q.p(a, b, Math.abs(a - 60) < 6 ? "A" : "g");
      const r = [0, 1, 0, -1][qc];
      q.poly([[14, 20 + r], [38, 20 - r], [34, 24 - r], [18, 24 + r]], "s"); q.l(14, 20 + r, 38, 20 - r, "m");       // the fishing boat, rocking
      q.l(24, 9, 24, 20, "s"); q.poly([[25, 10], [32, 18], [25, 18]], "W");                                          // mast and sail
      q.r(34, 15 - r, 35, 19 - r, "E"); q.r(33, 13 - r, 36, 13 - r, "W"); q.p(34, 14 - r, "m"); q.p(35, 14 - r, "m");  // the fisherman in his cap
      q.l(36, 16 - r, 43, 21, "s");                                                                                     // reaching over the side with a boathook
      const fb = qc % 2; q.e(46, 22 + fb, 3, 1.4, "A"); q.r(43, 22 + fb, 44, 22 + fb, "E");                            // a shape in a life jacket, floating
      q.word("SPAIN", 2, 25, "W"); }

    // ---------- 4 SICILY: the Germans take the bait
    { const q = at(3);
      q.r(0, 0, 76, 31, "B"); q.r(0, 28, 76, 31, "m");                                                                  // the Mediterranean, North Africa along the bottom
      q.poly([[18, 0], [27, 0], [34, 7], [41, 13], [45, 17], [43, 20], [39, 17], [34, 16], [29, 11], [22, 5]], "l");  // Italy
      q.poly([[29, 21], [41, 20], [36, 26]], "l"); q.poly([[8, 9], [13, 9], [13, 19], [8, 19]], "l");                 // Sicily, Sardinia
      q.poly([[57, 11], [66, 9], [71, 15], [67, 24], [60, 22], [62, 17]], "l");                                       // Greece
      const t = qd < 2 ? 1 : (qd - 2) / 5, ease = t * t * (3 - 2 * t), lerp = (a, b) => Math.round(a + (b - a) * ease);
      [[33, 22, 61, 15], [36, 22, 64, 19], [35, 24, 11, 13]].forEach(([x0, y0, x1, y1]) => { const x = lerp(x0, x1), y = lerp(y0, y1); q.r(x, y, x + 1, y + 1, "R"); q.p(x, y, "A"); });   // German tank markers
      if (qd < 2) { for (let b = 27; b >= 23; b--) q.p(35, b, "W"); q.l(33, 25, 35, 23, "W"); q.l(37, 25, 35, 23, "W"); if (qd === 1) { q.p(33, 22, "A"); q.p(37, 22, "A"); q.p(35, 21, "A"); } }   // the Allied landing arrow
      q.word("SICILY", 54, 25, "K"); }

    // ---------- the frames: gold around the lit panel (or all of them), dark around the rest
    P.forEach(([ox, oy], i) => { const lit = qh === 0 || qh === i + 1, col = lit ? "A" : "C";
      c.r(ox - 1, oy - 1, ox + 77, oy - 1, col); c.r(ox - 1, oy + 32, ox + 77, oy + 32, col); c.r(ox - 1, oy - 1, ox - 1, oy + 32, col); c.r(ox + 77, oy - 1, ox + 77, oy + 32, col); });
    return c;
  };
