/* Sketch maps for the individual role scenarios, drawn in the same style as the teacher's Real History maps:
   aged paper, muted teal sea, tan land, navy ink, red accents, typewriter lettering, title box, compass and footer.
   Each entry is an SVG string, keyed by image slot. A file with the same slot name in the images/ folder replaces it (see the Asset Studio). */
const RECMAPS = (function () {
  const NAVY = "#1d3557", RED = "#b3261e", LAND = "#ecd9a6", SEA = "#b9cbc5", INK = "#2d2a22", PAPER = "#f3e6c4";
  const T = (x, y, s, o) => { o = o || {}; return `<text x="${x}" y="${y}" font-family="Courier New, monospace" font-size="${o.size || 15}" font-weight="${o.w || 700}" fill="${o.c || NAVY}" text-anchor="${o.a || "middle"}" letter-spacing="${o.ls === undefined ? 1 : o.ls}"${o.i ? ' font-style="italic"' : ""}>${s}</text>`; };
  const BIG = (x, y, s, o) => T(x, y, s, Object.assign({ size: 30, ls: 9, i: 1, w: 700 }, o || {}));
  const land = (pts) => `<path d="M${pts.map((p) => p.join(" ")).join("L")}Z" fill="${LAND}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const dot = (x, y, c) => `<circle cx="${x}" cy="${y}" r="6" fill="${c || NAVY}" stroke="${PAPER}" stroke-width="2"/>`;
  const route = (d, c, dash) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="4" ${dash ? 'stroke-dasharray="12 9"' : ""} marker-end="url(#a${c === RED ? "r" : "n"})"/>`;
  const box = (x, y, w, h, lines) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}" stroke="${NAVY}" stroke-width="2.5"/>` + lines.map((l, i) => T(x + w / 2, y + 26 + i * 21, l[0], { size: l[1] || 15, c: l[2] || NAVY, i: l[3] })).join("");
  const frame = (title, date, label, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="1350" height="900">
    <defs><marker id="ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${RED}"/></marker><marker id="an" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${NAVY}"/></marker>
    <pattern id="wv" width="28" height="14" patternUnits="userSpaceOnUse"><path d="M0 7q7-5 14 0t14 0" fill="none" stroke="#a3b9b2" stroke-width="1.2"/></pattern><clipPath id="cl"><rect x="20" y="20" width="860" height="520"/></clipPath></defs>
    <rect width="900" height="600" fill="${PAPER}"/><rect x="8" y="8" width="884" height="584" fill="none" stroke="${INK}" stroke-width="4"/>
    <g clip-path="url(#cl)"><rect x="20" y="20" width="860" height="520" fill="${SEA}"/><rect x="20" y="20" width="860" height="520" fill="url(#wv)"/>${inner}</g>
    <rect x="20" y="20" width="860" height="520" fill="none" stroke="${INK}" stroke-width="3"/>
    <rect x="34" y="34" width="330" height="92" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/>
    <text x="199" y="72" font-family="Georgia, serif" font-size="25" font-weight="700" fill="${NAVY}" text-anchor="middle">${title}</text>
    <line x1="56" y1="86" x2="342" y2="86" stroke="${RED}" stroke-width="2"/><text x="199" y="112" font-family="Georgia, serif" font-size="21" font-style="italic" fill="${RED}" text-anchor="middle">${date}</text>
    <g transform="translate(852 52)" fill="${INK}"><path d="M0 -26L8 4L0 -4L-8 4z"/><text y="26" font-family="Georgia, serif" font-size="20" font-weight="700" text-anchor="middle">N</text></g>
    <rect x="20" y="548" width="860" height="36" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
    ${T(36, 572, `FROM THE RECORD · <tspan font-style="italic" font-weight="400">${label}</tspan>`, { a: "start", size: 15, c: INK, ls: 1 })}${T(866, 572, "SKETCH MAP, NOT TO SCALE", { a: "end", size: 13, c: INK, ls: 1, w: 400 })}</svg>`;
  const britain = (dx, dy, s) => land([[250, 70], [290, 60], [300, 100], [282, 140], [310, 172], [330, 230], [352, 300], [372, 352], [392, 400], [362, 428], [302, 440], [250, 446], [272, 410], [240, 382], [262, 340], [238, 300], [252, 250], [226, 200], [242, 150], [220, 110]].map(([x, y]) => [dx + x * s, dy + y * s]));
  const ireland = (dx, dy, s) => land([[130, 250], [186, 230], [200, 282], [186, 340], [130, 352], [114, 300]].map(([x, y]) => [dx + x * s, dy + y * s]));
  const M = {};
  M["r1-nv"] = frame("A NEW JAPANESE CODE", "June 1939", "JN-25, 1939",
    land([[20, 140], [120, 150], [150, 220], [118, 300], [140, 380], [100, 470], [20, 500]]) +
    land([[250, 150], [272, 140], [282, 162], [262, 178]]) + land([[212, 196], [248, 186], [258, 214], [236, 252], [198, 284], [168, 296], [172, 272], [200, 246]]) + land([[150, 300], [172, 294], [176, 320], [154, 324]]) +
    land([[140, 440], [168, 430], [184, 470], [176, 520], [150, 510]]) +
    land([[810, 150], [880, 140], [880, 540], [850, 540], [836, 420], [818, 300]]) +
    [[610, 330, 9], [632, 344, 7], [650, 352, 6], [672, 372, 12]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .7}" fill="${LAND}" stroke="${INK}" stroke-width="2"/>`).join("") +
    [60, 100, 140].map((r) => `<path d="M${226 + r * .7} ${230 - r * .7} A ${r} ${r} 0 0 1 ${226 + r * .7} ${230 + r * .7}" fill="none" stroke="${RED}" stroke-width="3" stroke-dasharray="8 7"/>`).join("") +
    T(190, 340, "JAPAN", { size: 20 }) + T(430, 200, "NEW NAVY CODE", { c: RED }) + T(430, 220, "on the air", { c: RED, w: 400, i: 1 }) +
    dot(176, 476) + T(176, 504, "US NAVY LISTENING", { size: 13, a: "middle" }) + T(176, 520, "POST · PHILIPPINES", { size: 13 }) +
    dot(650, 352) + T(650, 396, "US NAVY LISTENING", { size: 13 }) + T(650, 412, "POST · HAWAII", { size: 13 }) +
    route("M700 300 C 760 260 790 230 836 230", NAVY, true) + T(752, 290, "to WASHINGTON", { size: 13, a: "start" }) +
    box(420, 420, 300, 92, [["A five-digit code", 15], ["37291  80455  16384", 15, RED], ["hidden under a second layer", 13, NAVY, 1]]) +
    BIG(590, 92, "P A C I F I C   O C E A N", { size: 20, ls: 5 }));
  M["r1-mi"] = frame("AGENT SNOW", "September 1939", "Agent SNOW, 1939",
    ireland(-20, 40, 1) + britain(30, 40, 1) +
    land([[880, 30], [880, 540], [470, 540], [500, 480], [560, 440], [610, 410], [650, 380], [668, 330], [700, 300], [690, 250], [722, 214], [760, 206], [784, 150], [772, 92], [800, 40]]) +
    dot(400, 410, RED) + T(400, 446, "SNOW'S RADIO · LONDON", { size: 14, c: RED }) +
    dot(742, 300) + T(742, 340, "GERMAN INTELLIGENCE", { size: 14 }) + T(742, 358, "HAMBURG", { size: 14 }) +
    route("M420 396 C 520 300 620 270 724 296", RED, true) + T(560, 262, "messages now written by MI5", { size: 14, c: RED, i: 1, w: 400 }) +
    BIG(330, 520, "B R I T A I N", { size: 22 }) + BIG(560, 160, "N O R T H   S E A", { size: 24 }) + BIG(760, 470, "G E R M A N Y", { size: 18, ls: 5 }));
  M["r3-fa"] = frame("THE CHANNEL DASH", "11–12 February 1942", "The Channel Dash, February 1942",
    land([[20, 20], [700, 20], [690, 80], [672, 112], [640, 140], [600, 168], [520, 182], [420, 192], [320, 202], [220, 214], [120, 192], [20, 200]]) +
    land([[20, 330], [62, 322], [92, 300], [140, 312], [200, 332], [240, 322], [300, 302], [380, 292], [440, 282], [520, 262], [600, 232], [660, 204], [702, 168], [740, 128], [780, 72], [806, 20], [880, 20], [880, 540], [20, 540]]) +
    dot(66, 324, RED) + T(70, 356, "BREST", { size: 16, c: RED, a: "start" }) +
    route("M66 318 C 70 270 140 252 260 250 S 520 220 640 170 S 720 110 800 60", RED, true) +
    T(240, 284, "Night of Feb 11: the ships slip out", { size: 13, c: RED, i: 1, w: 400 }) + T(640, 300, "Midday Feb 12:", { size: 13, c: RED }) + T(640, 316, "through the Strait of Dover", { size: 13, c: RED, i: 1, w: 400 }) +
    T(790, 120, "to Germany", { size: 13, c: RED, a: "start" }) + BIG(520, 90, "E N G L A N D", { size: 26 }) + BIG(420, 430, "F R A N C E", { size: 26 }) + T(420, 460, "(occupied)", { size: 14, w: 400, i: 1 }) + T(380, 250, "ENGLISH CHANNEL", { size: 15, ls: 4 }) + T(820, 40, "NORTH SEA", { size: 13, a: "end" }));
  M["r3-ul"] = frame("ROMMEL STRIKES BACK", "January 1942", "Rommel strikes back, January 1942",
    land([[20, 330], [100, 342], [180, 380], [260, 420], [320, 432], [380, 402], [420, 342], [450, 282], [482, 252], [540, 240], [600, 250], [640, 270], [700, 282], [760, 292], [820, 300], [880, 310], [880, 540], [20, 540]]) +
    `<line x1="836" y1="300" x2="836" y2="540" stroke="${INK}" stroke-width="2" stroke-dasharray="6 6"/>` +
    dot(330, 428, RED) + T(330, 462, "EL AGHEILA", { size: 14, c: RED }) + dot(456, 284) + T(440, 316, "BENGHAZI", { size: 14, a: "end" }) + dot(694, 286) + T(694, 318, "GAZALA", { size: 14 }) + dot(732, 290) + T(760, 270, "TOBRUK", { size: 14 }) +
    route("M346 418 C 400 380 430 330 450 300", RED, true) + route("M470 282 C 560 300 620 300 676 290", RED, true) +
    T(470, 400, "Jan 21: Rommel attacks", { size: 13, c: RED, a: "start" }) + T(560, 330, "Jan 29: Benghazi retaken", { size: 13, c: RED, a: "start" }) + T(694, 360, "British fall back", { size: 13 }) + T(694, 376, "to the Gazala line", { size: 13 }) +
    BIG(300, 510, "L I B Y A", { size: 26 }) + BIG(860, 500, "E G Y P T", { size: 18, a: "end" }) + BIG(560, 170, "M E D I T E R R A N E A N   S E A", { size: 20, ls: 5 }));
  M["r4-fa"] = frame("THE LEAK TEST", "1942", "Finding a leak, 1942",
    `<rect x="20" y="20" width="860" height="520" fill="${LAND}"/>` + Array.from({ length: 12 }, (_, i) => `<line x1="${20 + i * 78}" y1="20" x2="${20 + i * 78 + 40}" y2="540" stroke="#d8c48f" stroke-width="10"/>`).join("") +
    box(330, 150, 260, 92, [["LONDON", 18], ["one story, two versions", 14, NAVY, 1]]) +
    route("M370 242 C 330 280 270 300 240 330", NAVY, false) + route("M550 242 C 590 280 640 300 666 330", NAVY, false) +
    box(90, 334, 300, 92, [["CONTACT A", 17], ["\"The meeting is", 14], ["on Tuesday\"", 14]]) + box(520, 334, 300, 92, [["CONTACT B", 17], ["\"The meeting is", 14], ["on Thursday\"", 14]]) +
    route("M760 426 C 760 470 740 480 700 486", RED, true) + `<rect x="430" y="456" width="270" height="62" fill="${PAPER}" stroke="${RED}" stroke-width="3"/>` + T(565, 482, "GERMAN RAID: THURSDAY", { size: 15, c: RED }) + T(565, 504, "the leak runs through B", { size: 14, c: RED, i: 1, w: 400 }));
  M["r4-mi"] = frame("GARBO'S NETWORK", "1942", "Garbo's imaginary spies, 1942",
    ireland(30, 10, .9) + britain(90, 10, .9) +
    land([[380, 360], [470, 330], [560, 330], [640, 300], [720, 280], [880, 260], [880, 540], [600, 540], [560, 500], [470, 470], [420, 420]]) +
    land([[160, 470], [300, 452], [420, 462], [470, 500], [480, 540], [140, 540]]) +
    [[300, 120], [282, 220], [264, 300], [330, 330], [262, 380], [320, 256]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${RED}" stroke="${PAPER}" stroke-width="2"/>`).join("") +
    T(410, 150, "imaginary agents", { size: 14, c: RED, a: "start", i: 1, w: 400 }) + `<line x1="404" y1="146" x2="312" y2="122" stroke="${RED}" stroke-width="1.5"/>` +
    dot(370, 380) + T(388, 384, "GARBO · LONDON", { size: 15, a: "start" }) + dot(320, 512) + T(338, 520, "GERMAN HANDLERS · MADRID", { size: 14, a: "start" }) +
    route("M366 394 C 420 440 380 480 330 500", RED, true) + T(520, 430, "letters and radio reports,", { size: 13, c: RED, i: 1, w: 400 }) + T(520, 446, "all made up by MI5", { size: 13, c: RED, i: 1, w: 400 }) +
    BIG(700, 360, "F R A N C E", { size: 22 }) + BIG(260, 534, "S P A I N", { size: 18 }));
  M["r4-ul"] = frame("CONVOYS TO AFRICA", "1942", "Convoys to North Africa, 1942",
    land([[400, 20], [500, 20], [530, 70], [570, 130], [620, 190], [680, 240], [750, 270], [765, 290], [730, 300], [690, 290], [668, 320], [652, 346], [632, 336], [626, 300], [596, 260], [546, 215], [496, 170], [446, 120], [410, 70]]) +
    land([[520, 362], [580, 352], [640, 347], [620, 402], [580, 412], [530, 392]]) + land([[330, 170], [370, 165], [376, 250], [336, 256]]) +
    `<ellipse cx="596" cy="446" rx="8" ry="5" fill="${LAND}" stroke="${INK}" stroke-width="2"/>` +
    land([[20, 460], [160, 440], [300, 410], [344, 382], [372, 402], [382, 452], [420, 480], [500, 500], [560, 515], [640, 520], [740, 500], [880, 480], [880, 540], [20, 540]]) +
    dot(510, 196) + T(492, 200, "NAPLES", { size: 14, a: "end" }) + dot(500, 504) + T(500, 534, "TRIPOLI", { size: 14 }) + dot(596, 446, RED) + T(616, 452, "MALTA", { size: 14, c: RED, a: "start" }) +
    route("M500 210 C 470 270 440 320 440 380 S 470 470 494 492", INK, true) + T(380, 300, "Axis supply route", { size: 13, a: "end", i: 1, w: 400 }) +
    route("M590 440 C 560 410 520 400 456 410", RED, true) + `<g transform="translate(520 404) scale(1.3)" fill="${NAVY}"><rect x="-12" y="-1.5" width="24" height="3"/><rect x="-2" y="-8" width="4" height="14"/><rect x="-6" y="5" width="12" height="2"/></g>` +
    T(690, 410, "1. A spotter plane", { size: 13, c: RED, a: "start" }) + T(690, 426, "'finds' the convoy", { size: 13, c: RED, a: "start", i: 1, w: 400 }) + T(690, 452, "2. The strike follows", { size: 13, c: RED, a: "start" }) +
    BIG(560, 100, "I T A L Y", { size: 22 }) + T(586, 386, "SICILY", { size: 14 }) + BIG(200, 520, "T U N I S I A", { size: 16 }) + BIG(760, 532, "L I B Y A", { size: 16 }));
  const mince = (label) => frame("OPERATION MINCEMEAT", "April 1943", label,
    land([[20, 130], [140, 100], [260, 110], [300, 150], [312, 210], [292, 262], [252, 302], [202, 322], [152, 332], [112, 322], [82, 302], [42, 292], [20, 260]]) +
    land([[20, 390], [200, 365], [400, 385], [600, 405], [880, 425], [880, 540], [20, 540]]) +
    land([[380, 170], [412, 168], [418, 250], [384, 254]]) + land([[560, 300], [610, 292], [650, 300], [630, 336], [582, 340]]) +
    land([[480, 20], [560, 20], [600, 100], [640, 170], [680, 230], [700, 270], [668, 280], [640, 250], [600, 200], [540, 120], [500, 60]]) +
    land([[740, 120], [820, 110], [860, 160], [850, 220], [820, 260], [790, 250], [800, 210], [770, 180], [750, 160]]) +
    dot(96, 304, RED) + T(60, 348, "BODY WASHES ASHORE", { size: 13, c: RED, a: "start" }) + T(60, 368, "HUELVA, SPAIN", { size: 13, c: RED, a: "start" }) +
    route("M110 296 C 220 220 300 200 370 206", RED, true) + route("M110 290 C 360 150 600 120 760 170", RED, true) +
    T(400, 150, "FAKE TARGET: SARDINIA", { size: 13, c: RED }) + T(640, 92, "FAKE TARGET: GREECE", { size: 13, c: RED }) +
    `<path d="M560 470 C 590 420 600 380 600 352" fill="none" stroke="${NAVY}" stroke-width="5" marker-end="url(#an)"/>` + T(600, 496, "REAL TARGET: SICILY", { size: 15 }) + T(600, 514, "July 1943", { size: 13, w: 400, i: 1 }) +
    BIG(170, 190, "S P A I N", { size: 20 }) + BIG(820, 300, "GREECE", { size: 14, ls: 4, a: "end" }));
  M["r5-bp"] = mince("Operation Mincemeat, April 1943"); M["r5-mi"] = mince("Operation Mincemeat, April 1943");
  M["r5-fa"] = frame("THE ROCKET SECRET", "1943–1944", "The rocket secret, 1943 to 1944",
    land([[20, 150], [120, 172], [220, 162], [300, 178], [380, 162], [460, 152], [540, 132], [620, 122], [700, 142], [780, 122], [880, 112], [880, 540], [20, 540]]) +
    `<path d="M470 152 C 480 260 450 380 470 540" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="7 6"/>` +
    dot(300, 182, RED) + T(300, 214, "PEENEMÜNDE", { size: 14, c: RED }) + T(300, 232, "rocket base, bombed Aug 1943", { size: 12, c: RED, i: 1, w: 400 }) +
    dot(620, 300) + T(640, 306, "WARSAW", { size: 14, a: "start" }) + dot(700, 452, RED) + T(700, 484, "BLIZNA", { size: 14, c: RED }) + T(700, 500, "rocket test range", { size: 12, c: RED, i: 1, w: 400 }) +
    route("M686 444 C 560 400 300 420 40 380", NAVY, true) + T(300, 392, "July 1944: rocket parts flown to Britain", { size: 13, i: 1, w: 400 }) + T(60, 360, "to LONDON", { size: 13, a: "start" }) +
    BIG(560, 80, "B A L T I C   S E A", { size: 22 }) + BIG(260, 300, "G E R M A N Y", { size: 20 }) + BIG(720, 240, "P O L A N D", { size: 22 }) + T(720, 266, "(occupied)", { size: 13, w: 400, i: 1 }));
  return M;
})();
