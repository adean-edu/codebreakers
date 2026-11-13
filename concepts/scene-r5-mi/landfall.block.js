  // ---- "Landfall", Huelva, 30 April 1943: one scene, one day. Night: HMS Seraph surfaces far out, the canister goes over the
  //      side, the submarine slips away. Before dawn: a shape in a life jacket drifts in. Dawn: a Spanish fisherman hooks it and
  //      brings it to the beach. Morning: Major Martin's briefcase lies on the sand on its chain; a Spanish officer picks it up
  //      while a man in a trilby watches from the dunes through binoculars, then turns away. Dusk, and round again.
  //      Everything changes with the light, so it all runs on one channel (zt): 36 states x 6 = 216 ticks (18 s).
  //      State 0 = morning: the officer bending to the briefcase, the watcher on the dune. HOLD: zt: 6
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
    const boat = (bx, by, held) => { c.poly([[bx, by], [bx + 20, by], [bx + 17, by + 3], [bx + 3, by + 3]], "s"); c.l(bx, by, bx + 20, by, "m");
      c.r(bx + 9, by - 9, bx + 9, by - 1, "s"); c.poly([[bx + 10, by - 8], [bx + 15, by - 2], [bx + 10, by - 2]], "W");
      c.r(bx + 4, by - 4, bx + 5, by - 1, "E"); c.r(bx + 3, by - 5, bx + 6, by - 5, "W"); c.p(bx + 4, by - 6, "m");          // the fisherman
      c.r(bx + 15, by - 3, bx + 16, by - 1, "C"); c.r(bx + 14, by - 4, bx + 17, by - 4, "s");                              // his mate
      if (held) c.e(bx + 11, by - 1, 2, 1, "A"); };
    if (s >= 28 && s <= 31) { const bx = [150, 124, 100, 92][s - 28]; boat(bx, 40, false); if (s === 31) c.l(bx + 5, 37, bx - 2, 39, "s"); }   // comes alongside; the boathook
    if (s >= 32 && s <= 35) { const k = s - 32; boat([86, 80, 74, 70][k], [41, 43, 45, 47][k], true); }                 // brings it to the beach
    // ---- morning: the boat drawn up, the briefcase on the sand, the Spanish officer, the watcher on the dune
    if (s <= 7) {
      boat(70, 47, true);
      const caseOnSand = s <= 2;
      const brief = (x, y) => { c.r(x, y, x + 6, y + 3, "K"); c.r(x, y, x + 6, y, "H"); c.r(x + 2, y - 1, x + 4, y - 1, "H"); c.p(x + 3, y + 1, "A"); c.r(x + 1, y - 2, x + 3, y - 1, "W"); c.p(x + 2, y - 2, "R"); };   // briefcase, a sealed letter showing
      if (caseOnSand) { brief(83, 59); for (let k = 0; k < 6; k++) c.p(91 + k, 60 + (k % 2), "g"); }                // on the sand, on its chain
      // the officer of the Guardia Civil: black tricorn hat, green uniform with a white cross-strap; kneels for the case, then carries it off
      const ox = s <= 5 ? 98 : s === 6 ? 92 : 86, kneel = s <= 2, d = kneel ? 4 : 0;
      c.r(ox - 4, 46 + d, ox + 4, 47 + d, "K"); c.r(ox - 2, 44 + d, ox + 2, 45 + d, "K"); c.p(ox + 4, 45 + d, "K"); c.p(ox - 4, 45 + d, "K");   // tricorn hat
      c.r(ox - 2, 48 + d, ox + 1, 51 + d, "m"); c.r(ox - 2, 48 + d, ox - 1, 51 + d, "l"); c.p(ox - 2, 49 + d, "K");                          // face, lit side, eye
      c.r(ox - 3, 52 + d, ox + 3, 59 + d, "O"); c.r(ox + 3, 52 + d, ox + 3, 59 + d, "E"); c.l(ox - 3, 52 + d, ox + 2, 57 + d, "W"); c.r(ox - 3, 58 + d, ox + 3, 58 + d, "K");   // tunic, shade, cross-strap, belt
      if (kneel) { c.r(ox - 7, 61, ox - 1, 62, "E"); c.r(ox - 7, 63, ox - 6, 64, "E"); c.r(ox + 1, 62, ox + 4, 64, "E"); c.r(ox - 8, 64, ox - 6, 64, "K"); c.r(ox + 4, 64, ox + 5, 64, "K");   // one knee down
        c.l(ox - 3, 56, ox - 7, 59, "O"); c.r(ox - 8, 59, ox - 7, 60, "l"); }                                                                  // reaching for the case
      else { c.r(ox - 2, 60, ox - 1, 63, "E"); c.r(ox + 1, 60, ox + 2, 63, "E"); c.r(ox - 3, 64, ox - 1, 64, "K"); c.r(ox + 1, 64, ox + 3, 64, "K");
        brief(ox - 10, 57); c.l(ox - 3, 54, ox - 4, 57, "O"); c.p(ox - 4, 57, "l"); }                                                         // standing, the case in his hand
      // the watcher on the dune: trilby, light suit; binoculars up, then lowered as he turns away
      const wx = 142, wy = 43, up = s <= 5;
      c.r(wx - 2, wy - 12, wx + 2, wy - 1, "g"); c.r(wx - 2, wy - 12, wx - 2, wy - 1, "H"); c.r(wx - 1, wy, wx - 1, wy + 1, "E"); c.r(wx + 1, wy, wx + 1, wy + 1, "E");   // light suit, legs
      c.r(wx - 1, wy - 16, wx + 1, wy - 13, "m"); c.r(wx - 3, wy - 17, wx + 3, wy - 17, "s"); c.r(wx - 1, wy - 19, wx + 1, wy - 18, "s");   // face, trilby
      if (up) { c.r(wx - 5, wy - 16, wx - 2, wy - 15, "K"); c.p(wx - 6, wy - 16, s % 2 ? "W" : "C"); c.l(wx - 2, wy - 11, wx - 4, wy - 15, "g"); }   // binoculars on the beach below
      else { c.l(wx + 2, wy - 11, wx + 3, wy - 6, "g"); c.r(wx + 3, wy - 6, wx + 4, wy - 5, "K"); }                       // lowered; he turns to go
    }
    return c;
  };
