  // ---- "The Watcher in Huelva", 30 April 1943: dawn on a balcony right above the beach at Huelva. A German agent in a light
  //      suit watches the shore through binoculars as a fishing boat comes in. The plan needed the Germans' man here to see.
  //      Loop: hw 4x6 (sea and surf), hb 4x12 (the boat rocking), hg 2x24 (glint on the binoculars), hq 8x6 (gulls)
  //      -> every period divides 48 ticks (4 s). State 0 = the still. HOLD: hw: 6, hb: 12, hg: 24, hq: 6
  CH.huelva = { hw: 4, hb: 4, hg: 2, hq: 8 };
  S.huelva = (p) => {
    const c = Cv(160, 70, "K"), hw = p.hw || 0, hb = p.hb || 0, hg = p.hg || 0, hq = p.hq || 0;
    // dawn sky and the sun coming up over the sea
    c.sky(0, 30, [["D", 4], ["E", 9], ["C", 15], ["s", 21], ["r", 26], ["m", 31]]); c.e(126, 30, 5, 4, "A"); c.e(126, 30, 3, 2, "W");
    // the sea, the sun's path glittering on it
    c.r(0, 31, 159, 42, (x, y) => (y < 34 ? "B" : y < 38 ? "N" : "Q"));
    for (let y = 31; y <= 42; y++) for (let x = 0; x < 160; x++) { const k = (x + y * 5 + hw * 3) % 11; if (y % 2 === 1 && k < 2) c.p(x, y, Math.abs(x - 126) < 4 + (y - 31) ? "A" : "B"); }
    for (let y = 31; y <= 42; y += 2) for (let x = 122 - (y - 31); x <= 130 + (y - 31); x++) if ((x + hw + y) % 3 === 0) c.p(x, y, "W");
    // the beach right below the balcony: wet sand at the waterline, dry sand toward the house, a beached rowing boat and nets
    c.r(30, 43, 159, 69, (x, y) => (y < 47 ? ((x + y) % 2 ? "s" : "m") : hs(x, y, 31) > .9 ? "m" : "l"));
    for (let x = 30; x < 160; x++) { const y = 43 + ((x + hw * 4) % 8 < 3 ? 0 : 1); if ((x + hw) % 5) c.p(x, y, "W"); if ((x * 3 + hw * 5) % 13 === 0) c.p(x, y + 2, "W"); }   // surf running up the sand
    c.poly([[96, 58], [118, 58], [115, 62], [99, 62]], "Q"); c.l(96, 58, 118, 58, "B"); c.r(106, 55, 107, 58, "s"); c.r(100, 60, 113, 60, "N");   // a rowing boat drawn up on the sand
    for (let x = 122; x < 146; x++) if ((x + (x >> 2)) % 3 === 0) { c.p(x, 60 + (x % 2), "s"); c.p(x + 1, 61, "s"); }   // fishing nets drying
    // a fishing boat just off the beach, rocking, two fishermen
    { const r = [0, 1, 0, -1][hb], bx = 104, by = 40;
      c.poly([[bx, by + r], [bx + 22, by - r], [bx + 18, by + 4 - r], [bx + 4, by + 4 + r]], "s"); c.l(bx, by + r, bx + 22, by - r, "m"); c.l(bx + 4, by + 3 + r, bx + 18, by + 3 - r, "r");
      c.r(bx + 9, by - 10, bx + 9, by - 1, "s"); c.poly([[bx + 10, by - 9], [bx + 15, by - 3], [bx + 10, by - 3]], "W"); c.l(bx + 10, by - 9, bx + 10, by - 3, "g");
      [[bx + 5, "E", "m"], [bx + 16, "C", "l"]].forEach(([x, col, cap]) => { c.r(x, by - 5, x + 1, by - 1, col); c.r(x, by - 7, x + 1, by - 6, "m"); c.r(x - 1, by - 8, x + 2, by - 8, cap); }); }
    // gulls
    for (let i = 0; i < 2; i++) { const gx = (60 + hq * 14 + i * 40) % 110 + 50, gy = 10 + i * 6, f = (hq + i) % 2;
      c.p(gx, gy, "W"); c.p(gx - 1, gy - f, "W"); c.p(gx - 2, gy - 1 + f, "W"); c.p(gx + 1, gy - f, "W"); c.p(gx + 2, gy - 1 + f, "W"); }
    // the house: pale stucco, an arched doorway with green shutters
    c.r(0, 0, 30, 69, "m"); c.r(26, 0, 30, 69, "l"); c.r(0, 0, 30, 0, "s");
    c.r(6, 18, 22, 52, "E"); c.e(14, 18, 8, 7, "E"); c.r(6, 18, 8, 52, "O"); c.r(20, 18, 22, 52, "O"); for (let y = 20; y < 52; y += 3) { c.p(7, y, "V"); c.p(21, y, "V"); }
    // the balcony: a stone slab, a wrought-iron railing, a pot of geraniums
    c.r(0, 53, 70, 55, "s"); c.r(0, 53, 70, 53, "l"); c.r(0, 56, 70, 57, "E");
    // the watcher: trilby, light linen suit, binoculars to his eyes, the glass catching the sun now and then
    const wx = 40;
    c.poly([[wx - 5, 29], [wx + 5, 29], [wx + 6, 52], [wx - 6, 52]], "g"); c.l(wx + 5, 29, wx + 6, 52, "W"); c.l(wx - 5, 29, wx - 6, 52, "H");   // light linen jacket, sunlit front, shaded back
    c.l(wx - 1, 29, wx + 1, 36, "H"); c.l(wx + 3, 29, wx + 1, 36, "H"); c.r(wx, 29, wx + 2, 30, "W"); c.r(wx + 1, 31, wx + 1, 34, "r");   // lapels, shirt collar, tie
    c.r(wx - 3, 20, wx + 2, 28, "m"); c.r(wx + 1, 21, wx + 3, 27, "l"); c.p(wx + 4, 24, "l"); c.p(wx - 3, 24, "s"); c.r(wx - 3, 26, wx - 1, 28, "s");   // head in profile: face, nose, ear, hair at the nape
    c.r(wx - 6, 19, wx + 5, 19, "s"); c.r(wx - 3, 15, wx + 2, 18, "s"); c.r(wx - 3, 18, wx + 2, 18, "E"); c.p(wx - 1, 15, "m");   // trilby: brim, crown, band
    c.r(wx + 3, 21, wx + 8, 23, "K"); c.r(wx + 3, 24, wx + 8, 25, "E"); c.r(wx + 9, 21, wx + 9, 25, "C"); c.p(wx + 9, 22, hg ? "W" : "B");   // binoculars to his eyes; the lens catches the sun
    c.l(wx + 2, 31, wx + 5, 26, "g"); c.l(wx + 3, 31, wx + 6, 26, "g"); c.r(wx + 4, 25, wx + 7, 27, "l");                  // arm raised, hand on the binoculars
    for (let x = 0; x <= 70; x++) { if (x % 4 === 0) c.r(x, 41, x, 52, "K"); } c.r(0, 40, 70, 41, "K"); c.r(0, 46, 70, 46, "K");   // railing in front of him
    for (let x = 2; x < 70; x += 8) { c.p(x + 2, 44, "K"); c.p(x + 1, 43, "K"); c.p(x + 3, 43, "K"); }
    c.r(54, 47, 62, 52, "r"); c.r(54, 47, 62, 47, "s"); [[55, 44], [58, 42], [61, 44], [57, 45]].forEach(([x, y]) => { c.r(x, y, x + 1, y + 1, "R"); c.p(x, y + 2, "V"); });   // geraniums
    return c;
  };
