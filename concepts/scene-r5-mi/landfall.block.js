  // ---- "Landfall", off Huelva, 30 April 1943: one scene, one day, all at sea. Night: HMS Seraph surfaces far out, the canister goes
  //      over the side, the submarine dives. Before dawn: a shape in a life jacket drifts in. Dawn: a 1940s Spanish fishing boat comes
  //      alongside and the fisherman hooks it aboard. Morning: the boat heads slowly for port. Dusk, and round again.
  //      Two layers, so the file stays small and the boat moves smoothly:
  //        zl (light): 12 states x 18 ticks. Sky, sea, sand and stars for each stretch of the day. Changes only 12 times.
  //        zm (motion): 108 states x 2 ticks. Only the moving things: submarine, canister, life jacket, boat. Its state 0 draws
  //        nothing, so no step ever has to paint background colours over another light (no ghost patches).
  //      Both run 216 ticks (18 s). Story time s = zm / 3, 0..36. State 0 (the still) = dusk, empty sea. HOLD: zl: 18, zm: 2
  CH.landfall = { zl: 12, zm: 108 };
  const LF_LIGHT = [2, 1, 0, 0, 0, 1, 2, 2, 2, 3, 3, 3];                                                            // dusk, dark, night x3, before dawn, dawn x3, morning x3
  S.landfall = (p) => {
    const c = Cv(160, 70, "K"), zl = p.zl || 0, zm = p.zm || 0, s = zm / 3;
    // ---------- the light layer
    const L = LF_LIGHT[zl];
    c.sky(0, 33, [[["K", 8], ["D", 20], ["E", 34]], [["D", 8], ["E", 17], ["C", 27], ["H", 34]], [["E", 6], ["C", 12], ["s", 20], ["r", 27], ["m", 34]], [["N", 8], ["B", 18], ["g", 28], ["l", 34]]][L]);
    if (L <= 1) { for (let y = 0; y < 18; y++) for (let x = 0; x < 160; x++) if (hs(x, y, 27) > (L ? .992 : .985)) c.p(x, y, L ? "H" : "W"); c.e(28, 8, 3, 3, L ? "g" : "W"); }   // stars, moon
    if (L === 2) { c.e(120, 33, 6, 5, "A"); c.e(120, 33, 3, 2, "W"); } if (L === 3) { c.e(120, 13, 4, 4, "A"); c.e(120, 13, 2, 2, "W"); }   // the sun
    const SEA = [["Q", "D"], ["Q", "N"], ["N", "B"], ["B", "N"]][L];
    c.r(0, 34, 159, 66, (x, y) => (y < 40 ? SEA[1] : SEA[0]));
    for (let y = 35; y <= 65; y += 2) for (let x = 0; x < 160; x++) if ((x + y * 7) % 12 < 2) c.p(x, y, L === 0 ? "N" : L === 1 ? "B" : L === 2 && Math.abs(x - 120) < 3 + (y - 34) ? "A" : "g");   // wave crests, sun path
    const SAND = [["C", "E"], ["H", "C"], ["m", "s"], ["l", "m"]][L];
    c.r(0, 67, 159, 69, (x, y) => (hs(x, y, 41) > .9 ? SAND[1] : SAND[0]));                                             // a sliver of sand
    for (let x = 0; x < 160; x++) { const y = 66 + (x % 9 < 3 ? 0 : 1); if (x % 4) c.p(x, y, L === 0 ? "H" : "W"); }   // the surf
    if (zm === 0) return c;
    // ---------- the motion layer (colours that read in any light)
    // night: HMS Seraph surfaces far out, the canister goes over the side, a splash, she dives
    if (s >= 7 && s < 15) {
      const dive = s >= 14 ? 4 : s >= 13 ? 2 : 0;
      if (s < 14) { c.r(36, 32 + (dive ? 1 : 0), 62, 33, "K"); c.r(38, 32, 60, 32, "C"); }
      if (dive < 4) { c.r(47, 27 + dive, 51, 33, "K"); c.p(49, 25 + dive, "K"); c.p(49, 26 + dive, "K"); }
      if (s >= 8 && s < 11.5) { [53, 56].forEach((x) => { c.r(x, 30, x, 31, "K"); c.p(x, 29, "C"); }); const cx = Math.round(53 + (s - 8) * 2.5); c.r(cx, 31, cx + 5, 31, "g"); }   // two officers, the canister
      if (s >= 11.5 && s < 12.5) { c.p(63, 33, "W"); c.p(64, 32, "W"); c.p(62, 32, "W"); c.p(63, 31, "g"); }                // the splash
    }
    // before dawn and dawn: the shape in its life jacket drifting in, until the boat takes it aboard
    if (s >= 15 && s < 23.5) { const k = Math.min(s, 21) - 15; c.e(60 + Math.round(k * 4.7), 36 + Math.round(k * .67), 2, 1, "A"); c.p(58 + Math.round(k * 4.7), 36 + Math.round(k * .67), "s"); }
    // the fishing boat: drawn rigid, bobbing as a whole now and then
    const bob = (zm >> 3) % 2;
    const boat = (bx, by, held, hook) => {   // a 1940s inshore fishing boat: tarred hull, high bow, white strake, red waterline, wheelhouse, lateen yard, nets
      bx = Math.round(bx); by = Math.round(by) + bob;
      c.poly([[bx, by - 4], [bx + 3, by - 1], [bx + 29, by - 1], [bx + 30, by - 3], [bx + 30, by + 1], [bx + 27, by + 3], [bx + 4, by + 3]], "E");   // hull
      c.l(bx, by - 4, bx + 3, by - 1, "W"); c.l(bx + 3, by - 1, bx + 29, by - 1, "W"); c.l(bx + 4, by + 2, bx + 27, by + 2, "R");                 // strake, waterline
      c.r(bx + 18, by - 8, bx + 24, by - 2, "W"); c.r(bx + 17, by - 9, bx + 25, by - 9, "r"); c.r(bx + 19, by - 7, bx + 21, by - 6, "E");         // wheelhouse
      c.l(bx + 11, by - 15, bx + 11, by - 2, "s"); c.l(bx + 4, by - 11, bx + 17, by - 16, "s"); c.l(bx + 5, by - 12, bx + 16, by - 16, "m");     // mast, lateen yard with the sail furled
      c.r(bx + 26, by - 3, bx + 29, by - 2, "C"); c.p(bx + 27, by - 4, "C");                                                                    // nets piled at the stern
      c.r(bx + 5, by - 6, bx + 6, by - 2, "N"); c.r(bx + 5, by - 8, bx + 6, by - 7, "m"); c.r(bx + 4, by - 9, bx + 7, by - 9, "E");               // fisherman at the bow, flat cap
      c.r(bx + 15, by - 6, bx + 16, by - 2, "W"); c.r(bx + 15, by - 8, bx + 16, by - 7, "m"); c.r(bx + 14, by - 9, bx + 17, by - 9, "E");         // his mate by the wheelhouse
      if (hook) c.l(bx + 4, by - 5, bx - 4, by - 1, "s");                                                                                        // the boathook
      if (held) { c.e(bx + 10, by - 2, 2, 1, "A"); c.p(bx + 8, by - 2, "s"); } };                                                           // the find, aboard
    if (s >= 14 && s < 22.5) boat(160 - (s - 14) * 8, 40, false, false);                                                   // comes in slowly from the right, out fishing before dawn
    else if (s >= 22.5 && s < 24) boat(92, 40, s >= 23.5, s < 23.5);                                                         // alongside; the boathook; aboard
    else if (s >= 24) boat(92 - (s - 24) * 4, 40 + (s - 24) / 2, true, false);                                             // heads slowly for port, until dusk
    return c;
  };
