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
