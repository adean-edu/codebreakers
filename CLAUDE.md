# Codebreakers: The Silent Service — project handoff

A single-page WWII codebreaking game for a high school World History class. Students play one of five intelligence roles across six rounds (1939–1944), crack a Caesar cipher each round, make a decision, and see consequences tied to real history. They then use Padlet to swap "Signal IDs" with classmates, decode each other, and reassemble six secret messages they submit privately to the teacher.

Owner: a high school World History teacher (GitHub `adean-edu`). Not a developer, so explain changes in plain language and always say how to see or undo them.

## Where it lives

- **Live game:** GitHub Pages from repo `adean-edu/codebreakers` (earlier `adean-edu/silent-service`). The site is just `index.html` at the repo root, plus an optional `images/` folder (see "Swapping images").
- **Built output:** `dist/test.html` is the standalone page. Copy it to the repo root as `index.html` to deploy.
- `dist/index.html` is an HTML fragment used for a claude.ai artifact version. Ignore it unless you're publishing there.
- `dist/studio.html` and `dist/studio-test.html` are the **Asset Studio**: a teacher-facing gallery of every image and animation slot, with file names and style-matched prompts.

## Build and test

```
node build.js                  # src/* -> dist/index.html, dist/test.html, dist/studio*.html
python3 mkimg.py               # img/* -> src/recimages.js (resizes to 1500px, WebP, base64)
node t.js desktop NV ABCABC    # Playwright: plays a full game as role NV with picks A,B,C,A,B,C; screenshots in shots/
```

Roles: `BP` (Bletchley Park Analyst), `NV` (Navy Cryptanalyst), `FA` (Resistance Courier), `MI` (MI5 Case Officer), `UL` (Ultra Liaison Officer). Before shipping, run `t.js` only for the roles whose route the change affects, and it must print `no errors`. A scenario image or animation affects only its role (`r4-fa` → `FA`, `r5-bp` → `BP`, `r5-mi` → `MI`). A headline slot (`r1`–`r6`) affects every role that doesn't have its own scenario in that round. Shared code (`app.js`, `logic.js`, `style.css`, `build.js`) or shared data affects all five. A change to notes only (like this file) needs no test.

- **Effects in tests:** under Playwright (`navigator.webdriver`), the title cards and typewriter effect are skipped unless the URL has `#fx`, so the tests stay fast. Use `dist/test.html#fx` to exercise them.
- **Dependencies:** Playwright and Chromium are needed for `t.js`. Pillow is needed for `mkimg.py`. The game itself has no dependencies.

## Source layout (`src/`, concatenated in this order by `build.js`)

| File | What it holds |
|---|---|
| `data.js` | **All content.** `ROUNDS` (6 headline rounds: title, date, sitrep, terms, essential question, real-history text, secret message pieces), `ROLES` (5 roles × 6 rounds of private briefings and A/B/C choices), `KINDS`/`ORDER` (scoring per choice type), `ENDINGS`, `RANKS`, `TIMELINE`, `REC` (Real History box text), `ECHO`/`ECHO_GENERIC` (the "Your war so far" carry-forward lines), `REALCALL` (what really happened per round), `ROLE_HIST` (role-specific "On your front" history and real calls), `SCEN` (10 individual scenarios), `MEANWHILE`, `PLACES`, `HEAD_IMG`. |
| `logic.js` | Pure rules: cipher shifts, choice application, gauges (Secrecy/Impact/Trust), endings, ranks, badges, Signal ID encode/parse. |
| `art.js` | Pixel-art engine (160×70 grid, 16-colour `PAL`, 4× scale, animated "on twos"): `S[...]` scenes, `CH[...]` animation channels, portraits, cipher wheel, the older SVG sketch maps (`ART.map`). |
| `typesound.js` | `TYPE_SND`: a base64 MP3 typewriter loop (teacher's file). |
| `dialsound.js` | `DIAL_SND` (2 ratchet clicks) and `SOLVE_SND` (door-open clip), from teacher-supplied files. |
| `recimages.js` | **Generated** by `mkimg.py`: `REC_IMG[0..5]` (headline images) and `SLOT_IMG` (scenario images). Don't hand-edit. |
| `recmaps.js` | `RECMAPS`: SVG fallback maps for scenario slots. These are used only when `SLOT_IMG` has no image for that slot. |
| `app.js` | UI and screens: title, role pick, round (brief → decrypt → decide → debrief), end screen, Decoder board, Padlet card and post text, sounds, title cards, typewriter, stamps, image zoom, image-swap loader. |
| `style.css` | All styles. It's layered, and later rules override earlier ones. The current theme is the original dark look ("Stable 3" style). Desktop only: students play on computers, and mobile layout no longer matters. |
| `studio.js`, `studio.css` | Asset Studio page. |

**Redrawing a map image:** follow `maps/redraw/STEPS.md` (method, data sources, projection and scale math, house style, swap-in steps). `maps/redraw/assets/` has optional parchment textures.

`maps/` holds a Node + Playwright renderer (`render.js`, `specs.js`, hand-traced `coast.js`) that drew the scenario maps in the teacher's vintage style. Run `node maps/go.js r3-fa` to render to `maps/out/`. Most scenario slots now use the teacher's own images instead.

## How a round works

1. **Title card:** a black newsreel screen with date, title and place. Faint static plus the round's key word in Morse (`CARD_WORDS`, or `SCEN.word`). Click to skip.
2. **Briefing:** "Your war so far" box (from round 2), pixel scene, timeline strip, sitrep with typewriter reveal, Real History box (gold) with image (click to enlarge), essential question.
3. **Decrypt:** the private briefing ("EYES ONLY"), then a cipher wheel. Shift = `logic.shiftFor(role, round)`. Hints come in 3 graduated steps and never give the key. Ratchet clicks play while turning, and the door sound plays when solved.
4. **Decide:** choose A, B or C. The option order is shuffled per role (`logic.order`).
5. **Debrief:** outcome with a stamp (APPROVED, HIGH RISK, …), gauge chips, "In history", "The real call" (✓ same / ✗ different), and the message-so-far slots.

**Individual scenarios:** when `SCEN["ROLE-roundIndex"]` exists, that role sees its own title, date, place, scene, sitrep, timeline entry, image slot and Real History text instead of the headline. A "Meanwhile…" line keeps the headline visible. The 10 scenario keys are `NV-0`, `MI-0`, `FA-2`, `UL-2`, `FA-3`, `MI-3`, `UL-3`, `BP-4`, `MI-4`, `FA-4`.

## Images and animations (slots)

- **Headline slots:** `r1`–`r6`. **Scenario slots:** `r1-nv`, `r1-mi`, `r3-fa`, `r3-ul`, `r4-fa`, `r4-mi`, `r4-ul`, `r5-bp`, `r5-mi`, `r5-fa`.
- **Replacing an image:** to replace one in the build, put the file in `img/` named after its slot (e.g. `img/r4-ul.png`), then run `python3 mkimg.py && node build.js`.
- **Hosted override, no rebuild:** a file in the repo's `images/` folder named `<slot>.png` or `<slot>.jpg` replaces the built-in image on the live site. A file named `scene-<slot>.gif` or `scene-<slot>.png` replaces that round's pixel animation, and `scene-title.gif` replaces the one on the title screen. This only works over http(s), not file://.
- **Style:** teacher-supplied images are vintage WWII briefing maps: aged cream paper, teal-grey sea with wave lines, tan land, navy serif labels, red accents, title box top-left, compass top-right, a "FROM THE RECORD • …" footer. New art should match this style. Pixel scenes must match the existing palette and grid.
- **Size:** the built page is about 4.9 MB (up from 4.4 MB after the November 2026 r5 maps), mostly images. If it needs to load faster, lower `mkimg.py` to around 1100px and quality 65.

## Padlet and assessment rules (teacher's decisions, keep them)

- Students **choose** their own role. Roles are never assigned.
- On Padlet, students post **only** their finished card (an image plus short post text with a Signal ID and a question). They reply to classmates they decode using premade questions, and replies start with `DECODED <ID>`. No per-round posts. Keep the Padlet clean and simple.
- The fully decoded six messages are a **private submission** to the teacher for credit, and are **never** posted on Padlet.
- Rejected features (don't bring them back): the Intel Pass mechanic ("too complicated"), and a "Compare calls" card.
- Signal ID format is `XX-ABCABC-YY`, with a 2-character checksum. It isn't tamper-proof. That's a known, accepted limit.

## Teacher preferences

- **Sounds:** quiet and pleasant, never harsh, bright or loud. The teacher supplies real sound files when synthesized ones fall short. Volumes have been tuned by ear, so don't raise them.
- **Accuracy:** real history matters. Flag factual or geographic errors (wrong locations, wrong scale bars) and don't silently invent facts. The teacher proofreads history text before class.
- **Pushing:** the teacher has said changes can be pushed to `main` (which updates the live game) without asking each time. First run `t.js` for the affected roles only (see "Build and test"), then say what was pushed and how to undo it.
- **Restore points:** when the teacher asks to "save this version", make a named restore point. In git, that's a tag (e.g. `stable-7`).
- **Visuals:** keep the dark theme. Light themes (War Room, Wartime Poster) were tried and rejected.
- **Communication:** explain changes plainly, keep replies short, and always mention how to undo a change.

## Restore points (history before this repo)

Earlier versions were tracked as claude.ai artifact versions, now up to v132:
- **Stable 1** = v64
- **Stable 3** = v76: timeline plus Real History box
- **Stable 6** = v117: teacher images, title cards, typewriter, stamps, badges, real sound files
- **Consequences** = v118–119: carry-forward plus real call, image zoom
- **Role history** = v120–122
- **Scenarios** = v123 onward: the 10 individual scenarios, Asset Studio, and the current images

Going forward, use git tags for restore points.

## To-do

- **Replace six scenario animations (teacher, 2026-11-13: "I do not like these and would like to see other options").** These are the built-in pixel scenes in `src/art.js`. The file names are the Asset Studio's slot names: a GIF at `images/scene-<slot>.gif` would override them, but there's no `images/` folder yet. For each one, show the teacher **two or three different concepts** (a still or a short GIF preview of each) before building one in. Keep the house rules for animations: the 160×70 grid, the `PAL` palette, the dark theme, quiet motion, a seamless loop (all channel loop lengths divide one shared period), and state 0 as the strongest still. Test only the role that sees each slot.
  - [ ] `scene-r3-fa`: Channel Dash, FA round 3. Scene `brest` (Brest harbour at night, three warships under a searchlight).
  - [ ] `scene-r3-ul`: Rommel Strikes Back, UL round 3. Scene `desert` (command tent and tanks at night).
  - [ ] `scene-r4-ul`: Convoys to Africa, UL round 4. Scene `medconvoy` (a convoy by day, a spotter plane).
  - [ ] `scene-r5-bp`: Operation Mincemeat, BP round 5. Scene `mincemeat` (a briefcase on a beach at dawn), **shared with `r5-mi`**. Consider giving BP and MI different scenes: BP sees the story through German messages at Bletchley, MI built the deception.
  - [ ] `scene-r5-mi`: Operation Mincemeat, MI round 5. Same `mincemeat` scene as `r5-bp`.
  - [x] `scene-r5-fa`: **DONE 2026-11-13: the teacher chose concept B ("use bug.gif for r5-fa"). It's built into `src/art.js` as `S.bug` / `CH.bug`, `SCEN["FA-4"].scene` is `"bug"`, and `HOLD` has `rv: 4, rd: 6, lt: 2`.** It matches `concepts/scene-r5-fa/bug.gif` on all 24 ticks, loops seamlessly every 2 s, and FA was tested. The old `S.rocket` is still in `art.js` (unused); to undo, set the FA-4 scene back to `"rocket"`. Note: channel `lt` (the lantern) has no drawing in the concept, so no lantern shows, the same as in the GIF. History below, for reference. "The pickup at Motyl": an RAF Dakota on the Home Army landing field at night, 25–26 July 1944 (Operation Most III). Lanterns flicker along the strip, the propeller turns, and a sack of V-2 parts is passed up into the lit cargo door while a lookout watches the trees. See `concepts/scene-r5-fa/motyl.gif` (live at https://adean-edu.github.io/codebreakers/concepts/scene-r5-fa/motyl.gif) and the still `motyl-still.png`. The source `motyl.js` is written as `S.motyl` / `CH.motyl` in `src/art.js` style: 2-second seamless loop (channels pr 3×1, fl 4×2, tw 2×6, ld 2×12; add `pr: 1, tw: 6, ld: 12` to `HOLD`), state 0 is the still. To build it in: paste `S.motyl`/`CH.motyl` into `art.js`, point `SCEN["FA-4"].scene` at `"motyl"`, rebuild, and test FA. **CONCEPT B (2026-11-13), not built in:** "The find on the Bug River": dusk on the riverbank near Sarnaki, May 1944. The test V-2 lies almost intact in the reeds in its black-and-white paint, nose pushed into the mud, with the furrow it ploughed behind it. One Home Army man kneels by the fins with a lantern, one points, one arrives with a rope. The river glints, the reeds sway, the lantern flickers. See `concepts/scene-r5-fa/bug.gif` (live at https://adean-edu.github.io/codebreakers/concepts/scene-r5-fa/bug.gif), `bug-still.png`, and source `bug.js` (`S.bug` / `CH.bug`; 2-second loop, channels rv 3×4, rd 2×6, lt 4×2; add `rv: 4, rd: 6, lt: 2` to `HOLD`; point `SCEN["FA-4"].scene` at `"bug"`). Teacher to pick A, B, or ask for another. Current scene, for reference: The Rocket Secret, FA round 5. Scene `rocket` (a courier's flashlight on a crashed rocket in a forest).
  - Done for reference: `scene-r4-fa` (`leak`) was rebuilt on 2026-11-13 as the A/B bait-test scene. Use it as the quality bar.

## Known open items

- **History to proofread:** all `SCEN` sitreps, `ROLE_HIST`, `ECHO`, `REALCALL` and `REC` text. Flagged earlier: the "about five weeks" Pyry timing; HYPO's "June 4, ~175 miles"; Nimitz approving the Yamamoto mission; Patton as paper commander of FUSAG.
- **Real History image audit (all 16 slots, checked 2026-11-12).** Items marked *(earlier)* were flagged in claude.ai chat and left as is at the teacher's choice. Everything else is newly found and still needs a decision or a fix. Scale checks compare a known real distance with what the map's own scale bar gives.
  - `r1` Pyry Forest meeting: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude from Natural Earth + CShapes data at true scale; live; original kept at `img/old/r1.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: Pyry (star) just south of Warsaw in the Kabaty woods; July 1939 borders with the Polish Corridor, Danzig as a Free City, East Prussia labelled "part of Germany"; the added "meeting 26–27 July 1939" date; the added red arrow "Enigma replicas sent on to Paris and London, August 1939"; the new "THE MEETING" box. Brief it was drawn to: (teacher: "redraw all"). Fix every error below, including the ones earlier left as is: Pyry in the Kabaty woods just south of Warsaw, a true scale bar, and Poland's July 1939 borders (narrow corridor to the sea, German Pomerania and East Prussia).
    - *(earlier)* Pyry is drawn ~90 miles west of Warsaw. It is in the Kabaty woods, just south of Warsaw (~10 miles).
    - *(earlier)* The scale bar is wrong: 100 miles is aligned with 250 km (should be ~160 km).
    - Poland is drawn with its post-1945 borders: a wide Baltic coast across Pomerania. In July 1939 Poland had only the narrow "Polish Corridor" to the sea (around Gdynia), and Pomerania was German. East Prussia (top right, around the lagoon) is unlabelled and shaded like Poland, but it was German.
  - `r1-nv` Japanese naval code (JN-25): **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 to true scale, live; original kept at `img/old/r1-nv.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: Korea, Taiwan and southern Sakhalin (Karafuto) now shaded as Japanese territory with a key; the Significance line now reads "harder to decrypt and translate"; the listening posts are labelled CAST (near Manila) and HYPO (Pearl Harbor). Errors it fixed:
    - The scale bar is wrong: 1,000 miles is aligned with 2,000 km (should be ~1,600 km), and the map reads ~2× too large. Tokyo to Hawaii is ~3,900 miles, but the bar reads it as ~8,000.
    - The text box says the new code increased "the difficulty of interception". Interception (picking up the radio signal) wasn't harder. Decryption was.
    - Minor: only the home islands are shaded as Japan. In 1939 Korea and Taiwan were also Japanese territory.
    - The facts check out: JN-25 introduced June 1939, five-digit groups, US Navy units at Pearl Harbor (HYPO) and near Manila (CAST).
  - `r1-mi` Agent SNOW: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude from Natural Earth + CShapes data at true scale; live; original kept at `img/old/r1-mi.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: London in its real place; the radio line London to Hamburg; the "RADIO COMMUNICATION" box now says "German intelligence (Abwehr, Hamburg)" and "from September 1939"; the new "THE DOUBLE AGENT" box (Arthur Owens, run by MI5 from September 1939). Brief it was drawn to: (teacher: "redraw all"). Put London in the right place and use a true scale bar.
    - *(earlier)* London is drawn in the Midlands, and the scale bar is wrong (100 miles aligned with 250 km).
    - The facts check out: Owens sent messages to the Abwehr in Hamburg, and MI5 ran him from September 1939.
  - `r2` The Atlantic (different style from the rest: no title box, date, footer or scale bar): **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude, live; original kept at `img/old/r2.jpg`; to undo, move it back to `img/`, delete `img/r2.png`, and rebuild). Points the teacher reviewed and approved: the HX route (Halifax, south of Newfoundland, south of Iceland, North Channel, Liverpool); the wolf-pack area south of Iceland; the U-110 ✕ at about 60.4°N 33.2°W; the added dotted "Ultra lets convoys be steered around waiting packs" route (evasive routing began in earnest from June 1941); the U-boat bases at Brest and Lorient; "Iceland (British-occupied)", "Ireland (neutral)", "Greenland (Danish)". Brief it was drawn to: Redraw in the same vintage briefing-map style as the others (title box, date, compass, true scale bar, "FROM THE RECORD" footer). Content, as suggested to the teacher: the U-110 capture south of Iceland (9 May 1941) and the HX convoy route from Halifax into Liverpool through the North Channel, with U-boat wolf-pack areas. Drop HX-84 and the meaningless symbols (evade paths into Norway, broken periscope, red cross). Draw convoys as merchant ships, not submarines.
    - *(earlier)* The HX-84 labels are wrong, and the U-110 capture is placed off Spain. U-110 was captured on 9 May 1941 south of Iceland, between Greenland and Iceland.
    - HX-84 was a November 1940 convoy, sunk in part by the warship *Admiral Scheer*, not U-boats. It doesn't fit a spring 1941 U-boat round.
    - The convoys are drawn as submarine silhouettes.
    - The blue route goes around the north of Scotland. HX convoys from Halifax ran into Liverpool through the North Channel.
    - The "evade path" arrows into Norway and the Baltic, the "broken periscope" off Spain, and the red cross have no real-history meaning.
  - `r3` When the Signals Stop (Pearl Harbor): **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 to true scale, live; original kept at `img/old/r3.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: the "location unknown" circle is now north of Oahu, and a new ✕ marks where the carriers really were (planes launched ~230 miles north, 7 Dec 1941); the footer now reads "FROM THE RECORD · Japanese fleet under radio silence" instead of "Sketch map, not to scale". Errors it fixed:
    - The footer says "Sketch map, not to scale", but the map has a scale bar. The bar makes the Hawaiian chain ~2× too long: Kauai to the Big Island is ~300 miles, but it reads ~570.
    - The "possible Japanese fleet" circle sits west of Hawaii. The real carrier force came from the north and launched about 230 miles north of Oahu. The "location unknown" label is fine, but the placement could mislead students.
  - `r3-fa` Channel Dash: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude from Natural Earth + CShapes data at true scale; live; original kept at `img/old/r3-fa.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: the route up the English Channel and through the Strait of Dover; Calais and Dunkirk in France; the split ending (Scharnhorst to Wilhelmshaven; Gneisenau and Prinz Eugen into the Elbe at Brunsbüttel; Gneisenau on to Kiel); the added Allied attack marks (Dover guns, MTBs and the Swordfish attack in the Strait; destroyers off the Dutch coast) and the mine-hit stars (off the Scheldt and off Terschelling). Brief it was drawn to: (teacher: "redraw all"). Full redraw: the route up the English Channel (not the Bristol Channel), Calais and Dunkirk in France, a true scale bar, and the right arrival ports (Scharnhorst to Wilhelmshaven, Gneisenau and Prinz Eugen into the Elbe at Brunsbüttel).
    - *(earlier)* The route runs through the Bristol Channel, Calais and Dunkirk are drawn inside Belgium (they are in France), and the scale bar is wrong.
    - Only Scharnhorst arrived at Wilhelmshaven. Gneisenau and Prinz Eugen went into the Elbe (Brunsbüttel), and Gneisenau continued to Kiel.
  - `r3-ul` Rommel strikes back: **no errors found.** The dates (21 Jan attack, Benghazi 29 Jan, Gazala line early Feb, 5 Jan Tripoli tank convoy), the places and the scale bar all check out.
  - `r4` Midway: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 to true scale, live; original kept at `img/old/r4.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: four carriers plus escorts; the fleet sits at the predicted spot (175 miles from Midway, bearing 325°) with an approach arrow from the northwest; US carriers at "Point Luck" ~325 miles northeast, with their arrow aimed at the Japanese force's flank. Errors it fixed:
    - Five carriers are drawn in the Japanese force. The Kido Butai had four (Akagi, Kaga, Soryu, Hiryu).
    - The "~175 miles from Midway" arrow is drawn ~800 miles long by the map's own scale bar. The US carriers (Point Luck) were ~325 miles northeast of Midway. The map shows them due east and farther out.
    - The "175 miles, June 4" estimate itself is historically right: Layton (Nimitz's intelligence officer) predicted contact at bearing 325°, 175 miles, early on June 4, based on HYPO's work.
  - `r4-fa` Finding a leak: **TEACHER'S IMAGE, LIVE 2026-11-13** (`img/r4-fa.webp`). The teacher supplied their own version of the clean bait-test flowchart, based on Claude's redraw, and asked for it to replace it. It shows London → Story A/B → Contact A/B → Safe house A/B → no raid at A / German raid at B the next day → "the leak runs through Contact B". No north arrow, and the footer reads "HOW A BAIT TEST WORKS • Finding a leak, 1942". Flagged on swap-in, left for the teacher to decide:
    - The raid vehicle is a military truck with a white panel and a cross that reads like a Red Cross ambulance marking. Using an ambulance for a raid could mislead students. If it's meant to be the German cross (Balkenkreuz), that is drawn as a black cross with white edges.
    - It no longer matches the r4-fa animation, which shows a black Citroën Traction Avant and men in hats (plain-clothes police). The image shows a truck and uniformed men. Both are plausible for 1942 Paris.
    - Minor: a stray mark after "the next day".
    - Earlier versions: the teacher's first diagram is at `img/old/r4-fa.png`. Claude's flowchart is at `img/old/r4-fa-redraw.png` (and can be regenerated with `node maps/r4fa-flowchart.js`). To switch back, keep only one `img/r4-fa.*`, then `python mkimg.py && node build.js`, copy the built pages, and test `FA`. Errors the flowchart fixed:
    - *(earlier)* The raid is shown as bombers rather than a safe-house raid.
    - It is a flowchart rather than a map, but it has a north arrow. The "From the record" footer suggests one documented case, but the scene shows a general technique rather than a specific event.
  - `r4-mi` Garbo: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude from Natural Earth + CShapes data at true scale; live; original kept at `img/old/r4-mi.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: 27 agent dots (placed at real British towns for illustration, since Garbo's agents were invented); the 1941 Lisbon period (dotted line and box: reports invented using guidebooks and newsreels); "GARBO in London, from April 1942"; GARBO = British code name, ARABEL = German; France labelled "north occupied, Vichy south". Brief it was drawn to: (teacher: "redraw all"). Full redraw: a true, self-consistent scale bar; 27 agent dots; the 1941 Lisbon period shown; GARBO as the British code name and ARABEL as the German one.
    - *(earlier)* The scale bar is wrong, there are ~40 agent dots versus Garbo's 27 invented agents, and his 1941 Lisbon period is skipped.
    - The scale bar also disagrees with itself: 1,000 miles lines up with 2,000 km (should be ~1,600 km). London to Madrid is ~785 miles, but the bar reads it as ~2,300.
    - Minor: ARABEL was his German (Abwehr) code name. GARBO was the British one.
  - `r4-ul` Convoys to Africa: **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 by Logan's Claude from Natural Earth + CShapes data at true scale; live; original kept at `img/old/r4-ul.png`; to undo, move it back to `img/` and rebuild). Points the teacher reviewed and approved: the Axis route Naples, west of Sicily, past Pantelleria, down the Tunisian coast to Tripoli; the spotter plane and the strike (planes and submarines) both from Malta; Tunisia and Algeria labelled "Vichy French", Libya "Italian"; the "MALTA, 1942" box (route, Ultra, cover, strike). Brief it was drawn to: (teacher: "redraw all"). Redraw with the strikes coming from Malta (planes and submarines). Tunisia was Vichy French until November 1942. Keep the spotter-plane cover story.
    - *(earlier)* The strike planes fly from Tunisia, not Malta. Tunisia was Vichy French and neutral until November 1942, so British planes could not fly from there.
    - Minor: the north–south distances are short. Naples to Tripoli is ~550 miles, but it reads ~410. The scale bar itself is consistent.
  - `r5` Yamamoto (Operation Vengeance): **APPROVED by the teacher 2026-11-13** (redrawn 2026-11-13 from Natural Earth coastlines, Mercator, true scale; live; original kept at `img/old/r5.png`; to undo, move it back to `img/`, `python mkimg.py && node build.js`, copy the built pages, and test `NV` and `UL`, the roles without their own round-5 scenario). Drawn by `maps/r5-vengeance.js <ne_10m_land.geojson> img/r5.png` (renders `img/r5@2x.png`; downsample to 1536×1024 with Lanczos). Scale check: Rabaul–Ballale measures 314 mi (real ~313), Henderson Field–Buin 353 mi (real ~352). Points the teacher reviewed and approved: the P-38 route is **approximate** (drawn as a long, low dog-leg out at sea, southwest of New Georgia, to Bougainville's southwest coast); the shootdown marker near Buin is approximate (the crash was in the jungle inland of the coast); "16 P-38 Lightnings" (18 took off and 2 turned back); the Operation Vengeance info box wording; the title "Spending a Secret" with date April 1943. Errors it fixed:
    - *(earlier)* The US fighters should come from Guadalcanal (southeast). They flew from Henderson Field.
    - The fighters are drawn as single-engine planes. The P-38 Lightning was a twin-engine, twin-boom fighter.
    - The scale bar is wrong: 250 miles is aligned with 500 km (should be ~400 km), and Bougainville reads ~800 miles long (it is ~125 miles).
    - Minor: the intercept is marked mid-island. The shootdown was over southern Bougainville, near Buin.
  - `r5-fa`, `r5-bp`, `r5-mi`: see the separate "To fix" entries below.
  - `r6` Operation Fortitude: **no errors found.** The beach order, the towns, Patton as FUSAG's (notional) commander, and the scale (Portsmouth to the beaches ~100 miles, Normandy to Calais ~160) all check out.
- **APPROVED by the teacher 2026-11-13: `r5-fa` "The Rocket Secret" map** (redrawn 2026-11-12, live). Points the teacher reviewed and approved: the new Home Army path (crash site → Warsaw → landing field), the "Motyl" landing field and 25–26 July 1944 date, "RAF (Operation Hydra)" in the Operation box, the 1939 borders, and that the flight arrow stops at the map edge with "to Brindisi, then on to Britain". Redrawn as `img/r5-fa.png` on real coastlines, rivers and 1939 borders (CShapes 2.0), with a true scale bar and the real Most III route (landing field "Motyl" near Tarnów → Brindisi → Britain). It also adds the Home Army path (crash site → Warsaw → landing field) and says the RAF (Operation Hydra) bombed Peenemünde. The teacher's original is kept at `img/old/r5-fa.webp` (a subfolder, so `mkimg.py` ignores it). To undo: move it back to `img/r5-fa.webp`, delete `img/r5-fa.png`, and rebuild. The errors it fixed, for the record:
  1. "RUSSIA" is labelled north of Poland. In 1943–44 that land was East Prussia, part of Germany. It only became Russian (Kaliningrad) after 1945.
  2. The scale bar is wrong. It aligns 100 miles with 250 km (should be ~160 km), and the map is drawn about 2.5× too large: Peenemünde to the Bug River crash site (near Sarnaki) is ~400 miles / ~650 km, but the bar reads it as ~1,000 miles.
  3. The "V-2 parts flown to Britain, July 1944" arrow goes straight west. In Operation Most III (Wildhorn III, 25–26 July 1944), an RAF Dakota picked up the parts at a field near Tarnów and flew them to Brindisi, Italy. They went on to London from there.
  - The other facts check out: Peenemünde bombed August 1943 (Operation Hydra), testing moved to Blizna, rocket recovered from the Bug River in May 1944.
  - To swap in a different image: replace `img/r5-fa.png` (keep only one `img/r5-fa.*` file, since `mkimg.py` takes the first match), then run `python mkimg.py`, `node build.js`, copy `dist/test.html` → `index.html` and `dist/studio-test.html` → `studio.html`, and run `t.js` for `FA`.
- **APPROVED by the teacher 2026-11-13: `r5-bp` and `r5-mi` "Operation Mincemeat" map** (redrawn 2026-11-13, live). Points the teacher reviewed and approved: the invasion ports (Algiers, Bizerte, Sousse, Malta) and beach marks, the fake-target arrows starting from North Africa and Egypt, the new HMS Seraph line, "30 April 1943", and "Spain (neutral)". Redrawn as `img/r5-bp.png` and `img/r5-mi.png` (the same file in both slots) on real coastlines and April 1943 borders (CShapes 2.0), with a true scale bar. The real invasion now sails from Algiers, Bizerte, Sousse and Malta to landing beaches on Sicily's south and southeast coasts. The fake-target arrows show where the planted letters said the attacks would come from (Sardinia from North Africa, Greece from Egypt), and a dotted line shows the submarine HMS Seraph bringing the body to Huelva. The teacher's originals are kept at `img/old/r5-bp.webp` and `img/old/r5-mi.webp`. To undo: move them back to `img/`, delete the two `.png` files, and rebuild. The errors it fixed, for the record:
  1. The navy "real target" arrow starts at Huelva, which suggests the Sicily invasion sailed from Spain. It actually sailed mainly from North Africa (Tunisia, Algeria) and Malta, with some convoys from Britain and the US. The arrow should start in North Africa.
  2. The scale bar is wrong. It aligns 250 miles with 500 km (should be ~400 km), and the map reads about 1.7× too large: Huelva to Sicily is ~1,200 miles / ~1,900 km, but the bar reads it as ~2,000 miles.
  3. Minor: the Sicily dot sits mid-island. The July 1943 landings were on the south and southeast coasts (Gela, Licata, near Syracuse).
  - The other facts check out: the body was found off Huelva on 30 April 1943, the fake targets were Greece and Sardinia, and Sicily was invaded on 10 July 1943.
  - To swap in a different image: replace both files (keep only one `img/<slot>.*` per slot), then rebuild as described for `r5-fa`.
- **Plain-text pieces on the Padlet card image:** they still appear. Removing them was offered, but the teacher never answered.
- **Padlet welcome post:** may need updating to match the current flow.
