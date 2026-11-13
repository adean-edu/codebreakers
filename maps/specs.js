const S = {};
S["r3-fa"] = {
  title: "THE CHANNEL DASH", date: "February 1942", footer: "The Channel Dash, February 1942",
  view: { lon0: 2.0, lat0: 51.3, k: 122 }, land: ["britain", "ireland", "europe", "scandinavia", "zealand", "funen", "lolland"],
  titleBox: { w: 600 },
  borders: [[[2.55, 51.08], [2.9, 50.75], [3.6, 50.5], [4.2, 50.3], [4.85, 50.15], [4.85, 49.8], [5.8, 49.55]], [[3.45, 51.38], [4.25, 51.37], [4.8, 51.45], [5.8, 51.15], [5.85, 50.75], [6.0, 50.75]], [[6.0, 50.75], [6.2, 51.4], [6.05, 51.85], [6.8, 52.0], [7.05, 52.3], [7.05, 52.65], [7.2, 53.3]], [[5.8, 49.55], [6.4, 49.45], [7.0, 49.15], [8.2, 48.98]], [[9.43, 54.79], [8.7, 54.9]]],
  labels: [{ t: "ENGLAND", lon: -0.9, lat: 52.75, kind: "country", size: 50, rot: -6 }, { t: "FRANCE", lon: 3.0, lat: 49.05, kind: "country", size: 54, rot: -4 }, { t: "(occupied)", lon: 3.0, lat: 48.7, kind: "note", size: 24 },
    { t: "BELGIUM", lon: 4.4, lat: 50.3, kind: "region", size: 26, rot: -4 }, { t: "NETHERLANDS", lon: 5.9, lat: 52.45, kind: "region", size: 24, rot: -10 }, { t: "GERMANY", lon: 9.7, lat: 51.75, kind: "country", size: 40, rot: -4 },
    { t: "WALES", lon: -3.75, lat: 52.0, kind: "region", size: 22 }, { t: "DENMARK", lon: 9.2, lat: 55.95, kind: "region", size: 22 },
    { t: "N O R T H\nS E A", lon: 3.2, lat: 54.35, kind: "sea", size: 44, ls: 4 }, { t: "ENGLISH CHANNEL", lon: -2.6, lat: 50.12, kind: "sea", size: 30, ls: 8, rot: 8 }, { t: "ATLANTIC\nOCEAN", lon: -6.6, lat: 49.4, kind: "sea", size: 30, ls: 6 }],
  routes: [{ pts: [[-4.55, 48.35], [-5.05, 48.5], [-5.0, 48.95], [-3.6, 49.55], [-1.5, 50.1], [0.6, 50.55], [1.55, 51.0], [2.4, 51.45], [3.3, 51.95], [4.2, 52.75], [5.6, 53.6], [7.4, 53.95], [8.05, 53.68]] }],
  icons: [{ type: "ship", lon: -3.4, lat: 49.92, s: .85, rot: -14, color: "red" }, { type: "ship", lon: 0.25, lat: 50.68, s: .85, rot: -12, color: "red" }, { type: "ship", lon: 3.85, lat: 52.55, s: .85, rot: -36, color: "red" }],
  dots: [{ lon: -4.49, lat: 48.38, label: "BREST", lx: 16, ly: 30, labelRed: true }, { lon: 1.32, lat: 51.13, color: "navy", label: "DOVER", lx: -16, ly: -14, la: "end" }, { lon: 8.1, lat: 53.53, label: "WILHELMSHAVEN", lx: 2, ly: 38, la: "middle", labelRed: true }, { lon: -0.13, lat: 51.51, color: "navy", label: "LONDON", lx: -16, ly: 8, la: "end" }],
  callouts: [{ x: 330, y: 730, w: 350, lines: ["NIGHT OF 11 FEBRUARY", "the ships slip out of Brest"], italic: true, to: [-4.42, 48.4] },
    { x: 800, y: 395, w: 370, lines: ["MIDDAY, 12 FEBRUARY", "through the Strait of Dover"], italic: true, to: [1.62, 51.05], ax: 40 }],
  info: { x: 1025, y: 560, w: 470, title: "OPERATION CERBERUS", items: [["SHIPS", "Scharnhorst, Gneisenau,\nPrinz Eugen"], ["FROM", "Brest, occupied France"], ["TO", "German ports"], ["DATE", "11-13 February 1942"]] },
  scale: { x: 1070, y: 868, miles: 150, km: 200, n: 3, nk: 2 }
};
S["r3-ul"] = {
  title: "ROMMEL STRIKES BACK", date: "January 1942", footer: "Rommel strikes back, January 1942",
  view: { lon0: 21.2, lat0: 31.6, k: 100, dy: 20 }, land: ["africa", "europe", "crete", "sicily", "malta"], titleBox: { w: 640 },
  borders: [[[25.16, 31.55], [24.9, 30.6], [24.95, 29.5], [25.0, 25.0]]],
  labels: [{ t: "L I B Y A", lon: 19.2, lat: 28.25, kind: "country", size: 56, ls: 14 }, { t: "(Italian colony)", lon: 19.2, lat: 27.8, kind: "note", size: 22 },
    { t: "EGYPT", lon: 27.6, lat: 29.2, kind: "country", size: 48 }, { t: "(British forces)", lon: 27.6, lat: 28.8, kind: "note", size: 22 },
    { t: "CYRENAICA", lon: 21.9, lat: 31.1, kind: "region", size: 26 }, { t: "MEDITERRANEAN  SEA", lon: 18.6, lat: 34.4, kind: "sea", size: 36, ls: 8 },
    { t: "Gulf of Sirte", lon: 18.0, lat: 31.85, kind: "note", size: 22 }, { t: "CRETE", lon: 24.9, lat: 35.75, kind: "region", size: 20 }, { t: "DESERT", lon: 22.1, lat: 29.0, kind: "region", size: 20, ls: 10 }],
  routes: [{ pts: [[19.35, 30.3], [20.05, 30.65], [20.5, 31.2], [20.25, 31.85]] }, { pts: [[20.6, 30.9], [21.6, 31.45], [22.6, 31.8], [23.0, 32.0]], dash: "16 10" },
    { pts: [[21.1, 32.42], [22.0, 32.48], [22.9, 32.3]], color: "navy" }],
  icons: [{ type: "tank", lon: 19.7, lat: 30.32, s: .9, rot: -30, color: "red" }, { type: "tank", lon: 21.9, lat: 31.55, s: .9, rot: -18, color: "red" }],
  dots: [{ lon: 19.23, lat: 30.27, label: "EL AGHEILA", lx: -18, ly: 36, la: "end", labelRed: true }, { lon: 20.07, lat: 32.12, color: "navy", label: "BENGHAZI", lx: 18, ly: 34 },
    { lon: 23.1, lat: 32.15, color: "navy", label: "GAZALA", lx: -4, ly: -20, la: "middle" }, { lon: 23.96, lat: 32.08, color: "navy", label: "TOBRUK", lx: 16, ly: -12 },
    { lon: 13.18, lat: 32.9, color: "navy", label: "TRIPOLI", lx: 0, ly: -20, la: "middle" }, { lon: 27.24, lat: 31.35, color: "navy", label: "MERSA MATRUH", lx: 0, ly: -20, la: "middle" }],
  callouts: [{ x: 110, y: 690, w: 330, lines: ["21 JANUARY 1942", "Rommel attacks"], italic: true, to: [19.15, 30.28] },
    { x: 250, y: 430, w: 320, lines: ["29 JANUARY", "Benghazi retaken"], italic: true, to: [19.98, 32.1] },
    { x: 900, y: 600, w: 380, lines: ["EARLY FEBRUARY", "British fall back to Gazala"], italic: true, to: [23.0, 32.0] }],
  info: { x: 980, y: 210, w: 510, title: "ROMMEL'S COUNTERATTACK", items: [["START", "El Agheila, 21 Jan 1942"], ["TAKEN", "Benghazi, 29 Jan 1942"], ["STOPPED", "the Gazala line, Feb 1942"], ["SUPPLY", "a convoy landed new tanks\nat Tripoli on 5 Jan 1942"]] },
  scale: { x: 60, y: 870, miles: 150, km: 200, n: 3, nk: 2 }
};
S["r4-fa"] = {
  title: "THE LEAK TEST", date: "1942", footer: "Finding a leak, 1942",
  view: { lon0: 1.0, lat0: 50.0, k: 147 }, land: ["britain", "europe"], titleBox: { w: 560 },
  borders: [[[2.55, 51.08], [2.9, 50.75], [3.6, 50.5], [4.2, 50.3], [4.85, 50.15], [4.85, 49.8], [5.8, 49.55]]],
  rivers: [[[-0.25, 49.29], [0.4, 49.35], [1.1, 49.3], [1.7, 49.05], [2.2, 48.92], [2.35, 48.86], [2.6, 48.82], [3.0, 48.6]]],
  labels: [{ t: "ENGLAND", lon: -2.0, lat: 51.6, kind: "country", size: 46, rot: -4 }, { t: "F R A N C E", lon: 0.3, lat: 47.75, kind: "country", size: 54, ls: 14 }, { t: "(occupied)", lon: 0.3, lat: 47.4, kind: "note", size: 24 },
    { t: "ENGLISH CHANNEL", lon: -1.9, lat: 50.25, kind: "sea", size: 28, ls: 7, rot: 2 }, { t: "Seine", lon: 1.85, lat: 49.2, kind: "note", size: 20, rot: -14 }],
  routes: [{ pts: [[-0.1, 51.45], [0.3, 50.6], [0.9, 49.75], [1.05, 49.5]], color: "navy" }, { pts: [[0.05, 51.45], [0.9, 50.6], [1.9, 49.5], [2.3, 48.95]] }],
  icons: [{ type: "tower", lon: -0.13, lat: 51.51, s: .8, xy: null }, { type: "burst", lon: 2.42, lat: 48.86, s: .9 }],
  dots: [{ lon: -0.13, lat: 51.51, color: "navy", label: "LONDON", lx: -22, ly: 10, la: "end" }, { lon: 1.1, lat: 49.44, color: "navy", label: "ROUEN · CONTACT A", lx: 0, ly: 40, la: "middle" }, { lon: 2.35, lat: 48.86, label: "PARIS · CONTACT B", lx: 28, ly: 9, labelRed: true }],
  callouts: [{ x: 230, y: 630, w: 350, lines: ["VERSION A", "\"The meeting is Tuesday\""], navy: true, italic: true, to: [1.03, 49.45] },
    { x: 1010, y: 440, w: 370, lines: ["VERSION B", "\"The meeting is Thursday\""], italic: true, to: [1.75, 49.75] },
    { x: 1000, y: 690, w: 370, lines: ["GERMAN RAID: THURSDAY", "the leak runs through B"], italic: true, to: [2.5, 48.82] }],
  info: { x: 1015, y: 165, w: 480, title: "HOW THE TEST WORKS", redDots: 0, items: [["1", "London tells each contact\na slightly different story"], ["2", "Wait and watch what\nthe Germans do"], ["3", "The version they act on\nshows where the leak is"]] },
  scale: { x: 1080, y: 870, miles: 60, km: 100, n: 3, nk: 2 }
};
S["r4-mi"] = {
  title: "AGENT GARBO'S NETWORK", date: "1942", footer: "Garbo's imaginary spies, 1942", titleSize: 36,
  view: { lon0: -1.5, lat0: 47.6, k: 40 }, land: ["britain", "ireland", "europe", "scandinavia", "zealand", "funen", "lolland", "corsica", "sardinia", "africa", "mallorca", "menorca", "ibiza"], titleBox: { w: 560 },
  borders: [[[-1.78, 43.36], [-0.7, 42.85], [0.7, 42.75], [1.7, 42.5], [3.17, 42.43]], [[-8.87, 41.87], [-8.2, 42.1], [-6.5, 41.95], [-6.8, 41.0], [-6.9, 40.0], [-7.0, 39.0], [-7.4, 38.4], [-7.45, 37.2]], [[2.55, 51.08], [3.6, 50.5], [4.85, 50.15], [5.8, 49.55], [7.6, 47.6], [6.1, 46.2], [7.0, 45.6], [7.5, 43.78]]],
  labels: [{ t: "BRITAIN", lon: -1.6, lat: 54.4, kind: "region", size: 26, ls: 6 }, { t: "IRELAND", lon: -8.1, lat: 53.1, kind: "region", size: 18, ls: 3 }, { t: "F R A N C E", lon: 2.6, lat: 46.6, kind: "country", size: 40, ls: 8 }, { t: "(occupied)", lon: 2.6, lat: 46.0, kind: "note", size: 20 },
    { t: "S P A I N", lon: -4.6, lat: 38.4, kind: "country", size: 40, ls: 8 }, { t: "(neutral)", lon: -4.6, lat: 37.85, kind: "note", size: 20 }, { t: "PORT.", lon: -8.35, lat: 40.6, kind: "region", size: 15, ls: 1, rot: -84 },
    { t: "A T L A N T I C\nO C E A N", lon: -17.5, lat: 51.2, kind: "sea", size: 38, ls: 6 }, { t: "NORTH SEA", lon: 3.4, lat: 56.0, kind: "region", size: 22, ls: 5 }, { t: "Bay of Biscay", lon: -5.4, lat: 45.4, kind: "note", size: 20 }, { t: "MEDITERRANEAN SEA", lon: 7.0, lat: 37.6, kind: "region", size: 20, ls: 4 }],
  routes: [{ pts: [[-0.4, 51.15], [-1.8, 46.5], [-3.45, 41.05]] }],
  icons: [{ type: "tower", lon: -0.13, lat: 51.51, s: .7 }],
  dots: [{ lon: -3.7, lat: 40.42, r: 0.1, label: "MADRID", lx: 20, ly: 24, labelRed: true }, { lon: -0.13, lat: 51.51, color: "navy", label: "GARBO · LONDON", lx: 20, ly: 12 }, { lon: -3.7, lat: 40.42, label: "GERMAN HANDLERS", lx: 20, ly: -4, labelRed: true },
    { lon: -4.25, lat: 55.86, r: 6 }, { lon: -2.98, lat: 53.41, r: 6 }, { lon: -3.94, lat: 51.62, r: 6 }, { lon: -4.14, lat: 50.37, r: 6 }, { lon: -1.4, lat: 50.9, r: 6 }, { lon: 1.3, lat: 52.63, r: 6 }, { lon: -3.0, lat: 56.46, r: 6 }],
  callouts: [{ x: 1000, y: 170, w: 360, lines: ["IMAGINARY AGENTS", "invented by Garbo and MI5"], italic: true, to: [-2.4, 53.6], ax: 30 },
    { x: 300, y: 450, w: 360, lines: ["REPORTS TO GERMANY", "letters and radio messages"], italic: true, to: [-1.9, 47.6] }],
  info: { x: 40, y: 600, w: 500, title: "AGENT GARBO", items: [["REAL NAME", "Juan Pujol Garcia"], ["RUN BY", "MI5, London"], ["HANDLERS", "German intelligence,\nMadrid"], ["NETWORK", "27 imaginary agents"]] },
  scale: { x: 1150, y: 450, miles: 300, km: 500, n: 3, nk: 2 }
};
S["r4-ul"] = {
  title: "CONVOYS TO AFRICA", date: "1942", footer: "Convoys to North Africa, 1942",
  view: { lon0: 13.6, lat0: 37.0, k: 92 }, land: ["africa", "europe", "sicily", "sardinia", "corsica", "malta", "gozo", "djerba", "crete", "kefalonia", "corfu"], titleBox: { w: 560 },
  borders: [[[8.6, 36.94], [8.4, 36.4], [8.3, 35.4], [7.5, 34.2], [8.2, 32.0]], [[11.55, 33.17], [10.3, 31.5], [10.0, 30.0]]],
  labels: [{ t: "ITALY", lon: 16.3, lat: 40.75, kind: "country", size: 38, ls: 8, rot: -40 }, { t: "SICILY", lon: 14.2, lat: 37.55, kind: "region", size: 24 }, { t: "SARDINIA", lon: 9.0, lat: 40.0, kind: "region", size: 18, rot: -80 },
    { t: "TUNISIA", lon: 9.2, lat: 33.9, kind: "region", size: 28, ls: 6 }, { t: "ALGERIA", lon: 5.6, lat: 34.6, kind: "region", size: 24, ls: 6 },
    { t: "MEDITERRANEAN  SEA", lon: 17.6, lat: 33.45, kind: "sea", size: 32, ls: 6 }, { t: "Tyrrhenian Sea", lon: 12.4, lat: 39.6, kind: "note", size: 22 }],
  routes: [{ pts: [[14.1, 40.7], [12.9, 39.5], [11.85, 38.2], [11.75, 36.9], [12.1, 35.3], [12.75, 33.6], [13.1, 33.05]], color: "ink" },
    { pts: [[14.2, 35.8], [13.5, 35.55], [12.6, 35.35]] }],
  icons: [{ type: "ship", lon: 11.78, lat: 36.55, s: .8, rot: 0 }, { type: "ship", lon: 12.05, lat: 35.15, s: .8, rot: 0 }, { type: "plane", lon: 13.25, lat: 35.5, s: 1, rot: -105, color: "red" }],
  dots: [{ lon: 14.25, lat: 40.84, color: "navy", label: "NAPLES", lx: 18, ly: 9 }, { lon: 13.18, lat: 32.9, color: "navy", label: "TRIPOLI", lx: 18, ly: 12 }, { lon: 14.45, lat: 35.9, label: "MALTA", lx: 18, ly: 8, labelRed: true },
    { lon: 10.18, lat: 36.8, color: "navy", label: "TUNIS", lx: -16, ly: 8, la: "end", r: 7 }, { lon: 13.36, lat: 38.12, color: "navy", label: "PALERMO", lx: 0, ly: -16, la: "middle", r: 7 }],
  callouts: [{ x: 300, y: 370, w: 330, lines: ["AXIS SUPPLY ROUTE", "Italy to Tripoli"], navy: true, italic: true, to: [11.82, 37.7] },
    { x: 960, y: 560, w: 400, lines: ["1. A SPOTTER PLANE", "'finds' the convoy first"], italic: true, to: [13.0, 35.45], ax: 30 },
    { x: 960, y: 700, w: 400, lines: ["2. THEN THE STRIKE", "from Malta's planes and subs"], italic: true, to: [14.45, 35.85], ax: 30 }],
  info: { x: 1000, y: 170, w: 495, title: "MALTA, 1942", items: [["ROUTE", "Naples to Tripoli"], ["ULTRA", "sailing times and\nroutes of the convoys"], ["COVER", "a spotter plane"], ["STRIKE", "planes and submarines\nbased on Malta"]] },
  scale: { x: 60, y: 870, miles: 150, km: 200, n: 3, nk: 2 }
};
const mince = (label) => ({
  title: "OPERATION MINCEMEAT", date: "April 1943", footer: label,
  view: { lon0: 8.5, lat0: 38.6, k: 46 }, land: ["europe", "africa", "corsica", "sardinia", "sicily", "malta", "crete", "euboea", "mallorca", "menorca", "ibiza", "kefalonia", "corfu"], titleBox: { w: 640 },
  borders: [[[-1.78, 43.36], [-0.7, 42.85], [0.7, 42.75], [1.7, 42.5], [3.17, 42.43]], [[-8.87, 41.87], [-8.2, 42.1], [-6.5, 41.95], [-6.8, 41.0], [-6.9, 40.0], [-7.0, 39.0], [-7.4, 38.4], [-7.45, 37.2]], [[7.5, 43.78], [7.0, 45.6], [6.1, 46.2]]],
  labels: [{ t: "S P A I N", lon: -3.8, lat: 40.6, kind: "country", size: 40, ls: 8 }, { t: "(neutral)", lon: -3.8, lat: 40.05, kind: "note", size: 20 }, { t: "FRANCE", lon: 2.6, lat: 46.0, kind: "country", size: 32, ls: 8 },
    { t: "ITALY", lon: 13.0, lat: 42.9, kind: "country", size: 30, ls: 6, rot: -36 }, { t: "GREECE", lon: 23.4, lat: 40.0, kind: "region", size: 22, ls: 3, rot: -30 }, { t: "NORTH AFRICA", lon: 3.4, lat: 33.6, kind: "country", size: 32, ls: 6 }, { t: "(held by the Allies)", lon: 3.4, lat: 33.0, kind: "note", size: 20 },
    { t: "MEDITERRANEAN SEA", lon: 18.6, lat: 35.2, kind: "sea", size: 28, ls: 5 }, { t: "SICILY", lon: 14.1, lat: 37.55, kind: "region", size: 16 }, { t: "PORT.", lon: -8.1, lat: 39.5, kind: "region", size: 15, ls: 1, rot: -84 }],
  routes: [{ pts: [[-6.6, 37.3], [0.0, 39.2], [5.5, 39.85], [7.85, 40.1]] }, { pts: [[-6.6, 37.45], [2.0, 41.0], [12.0, 41.2], [18.5, 39.6], [21.0, 38.85]] }, { pts: [[10.3, 35.6], [12.2, 36.3], [13.8, 36.85]], color: "navy", dash: false, w: 6 }],
  icons: [{ type: "case", lon: -7.55, lat: 36.75, s: 1 }],
  dots: [{ lon: -6.95, lat: 37.25, label: "HUELVA", lx: -18, ly: -12, la: "end", labelRed: true }],
  callouts: [{ x: 40, y: 630, w: 380, lines: ["30 APRIL 1943", "the body comes ashore"], italic: true, to: [-7.4, 36.95] },
    { x: 480, y: 200, w: 300, lines: ["FAKE TARGET", "Sardinia"], italic: true, to: [8.7, 40.6] },
    { x: 1140, y: 250, w: 300, lines: ["FAKE TARGET", "Greece"], italic: true, to: [21.4, 39.1] },
    { x: 760, y: 690, w: 360, lines: ["REAL TARGET: SICILY", "landings on 10 July 1943"], navy: true, italic: true, to: [13.7, 36.75] }],
  info: { x: 1135, y: 690, w: 362, title: "THE PLANTED PAPERS", hang: false, items: [["BODY", "'Major William\nMartin'"], ["FOUND", "off Huelva"], ["FAKE", "Greece, Sardinia"], ["REAL", "Sicily"]] },
  scale: { x: 470, y: 880, miles: 300, km: 500, n: 3, nk: 2 }
});
S["r5-bp"] = mince("Operation Mincemeat, April 1943"); S["r5-mi"] = mince("Operation Mincemeat, April 1943");
S["r5-fa"] = {
  title: "THE ROCKET SECRET", date: "1943 to 1944", footer: "The rocket secret, 1943 to 1944",
  view: { lon0: 17.5, lat0: 52.6, k: 118, dy: 20 }, land: ["europe", "scandinavia", "zealand", "funen", "lolland", "bornholm", "rugen", "gotland", "oland"], titleBox: { w: 600 },
  rivers: [[[18.65, 54.4], [18.8, 53.9], [18.4, 53.2], [19.1, 52.6], [20.2, 52.4], [21.0, 52.25], [21.4, 51.8], [21.8, 51.3], [21.6, 50.8], [21.9, 50.4], [22.5, 50.2]], [[21.2, 52.55], [22.2, 52.6], [22.9, 52.35], [23.6, 52.0], [24.0, 51.4]]],
  labels: [{ t: "BALTIC  SEA", lon: 17.4, lat: 55.2, kind: "sea", size: 38, ls: 12 }, { t: "G E R M A N Y", lon: 11.9, lat: 51.4, kind: "country", size: 42, ls: 6 }, { t: "P O L A N D", lon: 18.6, lat: 51.15, kind: "country", size: 46, ls: 8 }, { t: "(occupied by Germany)", lon: 18.6, lat: 50.75, kind: "note", size: 22 },
    { t: "Vistula", lon: 18.7, lat: 53.25, kind: "note", size: 20, rot: -70 }, { t: "Bug", lon: 23.75, lat: 51.75, kind: "note", size: 20, rot: -60 }],
  routes: [{ pts: [[21.35, 50.05], [19.6, 49.55], [17.9, 49.15]] }],
  icons: [{ type: "rocket", lon: 13.78, lat: 54.5, s: .9 }, { type: "plane", lon: 18.3, lat: 49.27, s: 1, rot: -112, color: "red" }],
  dots: [{ lon: 13.78, lat: 54.14, label: "PEENEMÜNDE", lx: 18, ly: 26, labelRed: true }, { lon: 21.0, lat: 52.23, color: "navy", label: "WARSAW", lx: -16, ly: -6, la: "end" }, { lon: 21.6, lat: 50.17, label: "BLIZNA", lx: 20, ly: 10, labelRed: true },
    { lon: 22.85, lat: 52.32, color: "navy", label: "SARNAKI", lx: 18, ly: 26, r: 8 }],
  callouts: [{ x: 40, y: 420, w: 400, lines: ["ROCKET TEST BASE", "bombed by the RAF, Aug 1943"], italic: true, to: [13.7, 54.08] },
    { x: 1100, y: 400, w: 390, lines: ["MAY 1944", "a test rocket lands by the Bug"], navy: true, italic: true, to: [22.85, 52.37], ax: 40 },
    { x: 1110, y: 830, w: 380, lines: ["Germany's rocket test range", "in occupied Poland"], italic: true, to: [21.7, 50.1], ax: 30 },
    { x: 200, y: 740, w: 440, lines: ["25-26 JULY 1944", "rocket parts flown out to Italy,", "then on to London"], italic: true, to: [18.05, 49.2] }],
  info: { x: 1050, y: 165, w: 445, title: "THE V-2 SECRET", items: [["WEAPON", "the V-2 rocket"], ["BASE", "Peenemunde, Germany"], ["PROOF", "pieces of a test rocket\nfound near Sarnaki"]] }
};
module.exports = S;
