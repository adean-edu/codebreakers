  // ---- "Landfall", off Huelva, 30 April 1943: one scene, one day, all at sea. Night: HMS Seraph surfaces far out, the canister goes
  //      over the side, the submarine slips away. Before dawn: a shape in a life jacket drifts in. Dawn: a Spanish fishing boat of the
  //      1940s comes alongside and the fisherman hooks it aboard. Morning: the boat sails off along the coast toward Huelva. Dusk.
  //      Everything changes with the light, so it all runs on one channel (zt): 36 states x 6 = 216 ticks (18 s).
  //      State 0 = morning: the fishing boat heading for port with the find aboard. HOLD: zt: 6
  CH.landfall = { zt: 36 };
  S.landfall = (p) => {
    const c = Cv(160, 70, "K"), s = p.zt || 0;
    // light: 0 night, 1 before dawn, 2 dawn, 3 morning
    const L = s <= 7 ? 3 : s === 8 ? 2 : s === 9 ? 1 : s <= 19 ? 0 : s <= 23 ? 1 : s <= 31 ? 2 : 3;
    const SKY = [[["K", 8], ["D", 20], ["E", 34]], [["D", 8], ["E", 17], ["C", 27], ["H", 34]], [["E", 6], ["C", 12], ["s", 20], ["r", 27], ["m", 34]], [["N", 8], ["B", 18], ["g", 28], ["l", 34]]][L];
    c.sky(0, 33, SKY);
    if (L <= 1) { for (let y = 0; y < 18; y++) for (let x = 0; x < 160; x++) if (hs(x, y, 27) > (L ? .992 : .985)) c.p(x, y, L ? "H" : "W"); c.e(28, 8, 3, 3, L ? "g" : "W"); }   // stars, moon
    if (L === 2) { c.e(120, 33, 6, 5, "A"); c.e(120, 33, 3, 2, "W"); }                                                   // the sun rising
    if (L === 3) { c.e(120, 13, 4, 4, "A"); c.e(120, 13, 2, 2, "W"); }
    // the sea, with waves moving on every state
    const SEA = [["Q", "D"], ["Q", "N"], ["N", "B"], ["B", "N"]][L];
    c.r(0, 34, 159, 49, (x, y) => (y < 40 ? SEA[1] : SEA[0]));
    for (let y = 35; y <= 49; y += 2) for (let x = 0; x < 160; x++) if ((x + y * 7 + s * 3) % 13 < 2) c.p(x, y, L === 0 ? "N" : L === 1 ? "B" : L === 2 && Math.abs(x - 120) < 3 + (y - 34) ? "A" : "g");
    // the beach, the surf, the dunes
    const SAND = [["C", "E"], ["H", "C"], ["m", "s"], ["l", "m"]][L];
    c.r(0, 50, 159, 69, (x, y) => (hs(x, y, 41) > .9 ? SAND[1] : SAND[0]));
    for (let x = 0; x < 160; x++) { const y = 49 + ((x + s * 4) % 9 < 3 ? 0 : 1); if ((x + s) % 4) c.p(x, y, L === 0 ? "H" : "W"); }
    c.poly([[112, 69], [120, 52], [132, 45], [146, 43], [159, 46], [159, 69]], SAND[1]); c.l(120, 52, 132, 45, SAND[0]); c.l(132, 45, 146, 43, SAND[0]);
    for (let x = 122; x < 160; x += 5) { const y = 46 + Math.round(Math.abs(x - 146) / 6); c.p(x, y - 1, L ? "O" : "E"); c.p(x + 1, y - 2, L ? "V" : "E"); c.p(x - 1, y - 2, L ? "O" : "E"); }   // marram grass on the dunes
    // ---- night: HMS Seraph far out, the canister over the side, then she dives
    if (s >= 12 && s <= 19) {
      const dive = s === 18 ? 2 : s === 19 ? 4 : 0;
      if (s <= 18) { c.r(36, 32 + (s === 18 ? 1 : 0), 62, 33, "K"); c.r(38, 32, 60, 32, "C"); }
      if (dive < 4) { c.r(47, 27 + dive, 51, 33, "K"); c.p(49, 25 + dive, "K"); c.p(49, 26 + dive, "K"); }
      if (s <= 16) { [53, 56].forEach((x) => { c.r(x, 30, x, 31, "K"); c.p(x, 29, "C"); }); const cx = [53, 55, 57, 59, 61][s - 12]; c.r(cx, 31, cx + 5, 31, "g"); }   // two officers, the canister
      if (s === 17) { c.p(63, 33, "W"); c.p(64, 32, "W"); c.p(62, 32, "W"); c.p(63, 31, "g"); }                        // the splash
    }
    // ---- before dawn and dawn: the shape in its life jacket drifting in; the fishing boat
    const jacket = (x, y) => { c.e(x, y, 2, 1, L >= 2 ? "A" : "m"); c.p(x - 2, y, L >= 2 ? "s" : "r"); };
    if (s >= 20 && s <= 30) { const k = Math.min(s, 28) - 20; jacket(60 + Math.round(k * 3.5), 36 + (k >> 1)); }
    const boat = (bx, by, held, hook) => {   // a 1940s inshore fishing boat: tarred hull, high bow, white strake, red waterline, wheelhouse, lateen yard, nets
      const r = s % 2;
      c.poly([[bx, by - 4 + r], [bx + 3, by - 1 + r], [bx + 29, by - 1 - r], [bx + 30, by - 3 - r], [bx + 30, by + 1 - r], [bx + 27, by + 3 - r], [bx + 4, by + 3 + r]], "E");   // hull
      c.l(bx, by - 4 + r, bx + 3, by - 1 + r, "W"); c.l(bx + 3, by - 1 + r, bx + 29, by - 1 - r, "W"); c.l(bx + 4, by + 2 + r, bx + 27, by + 2 - r, "R");   // strake, waterline
      c.r(bx + 18, by - 8 - r, bx + 24, by - 2 - r, "W"); c.r(bx + 17, by - 9 - r, bx + 25, by - 9 - r, "r"); c.r(bx + 19, by - 7 - r, bx + 21, by - 6 - r, "E");   // wheelhouse
      c.l(bx + 11, by - 15, bx + 11, by - 2, "s"); c.l(bx + 4, by - 11, bx + 17, by - 16, "s"); c.l(bx + 5, by - 12, bx + 16, by - 16, "m");   // mast, lateen yard with the sail furled
      c.r(bx + 26, by - 3 - r, bx + 29, by - 2 - r, "C"); c.p(bx + 27, by - 4 - r, "C");                                    // nets piled at the stern
      c.r(bx + 5, by - 6 + r, bx + 6, by - 2 + r, "N"); c.r(bx + 5, by - 8 + r, bx + 6, by - 7 + r, "m"); c.r(bx + 4, by - 9 + r, bx + 7, by - 9 + r, "E");   // fisherman at the bow, flat cap
      c.r(bx + 15, by - 6 - r, bx + 16, by - 2 - r, "W"); c.r(bx + 15, by - 8 - r, bx + 16, by - 7 - r, "m"); c.r(bx + 14, by - 9 - r, bx + 17, by - 9 - r, "E");   // his mate by the wheelhouse
      if (hook) c.l(bx + 4, by - 5, bx - 4, by - 1, "s");                                                                    // the boathook
      if (held) { c.e(bx + 10, by - 2, 2, 1, "A"); c.p(bx + 8, by - 2, "s"); } };                                       // the find, aboard
    if (s >= 28 && s <= 31) { const bx = [150, 124, 100, 92][s - 28]; boat(bx, 40, false, s === 31); }                // comes alongside; the boathook
    if (s >= 32 && s <= 35) { const k = s - 32; boat([84, 76, 68, 60][k], [41, 42, 43, 44][k], true, false); }          // the find aboard, turning for port
    // ---- morning: the boat sails off along the coast toward Huelva and out of the picture
    if (s <= 7) boat(54 - s * 12, 44, true, false);
    return c;
  };
