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

Roles: `BP` (Bletchley Park Analyst), `NV` (Navy Cryptanalyst), `FA` (Resistance Courier), `MI` (MI5 Case Officer), `UL` (Ultra Liaison Officer). Run `t.js` for all five before shipping. It must print `no errors`.

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
- **Size:** the built page is about 4.4 MB, mostly images. If it needs to load faster, lower `mkimg.py` to around 1100px and quality 65.

## Padlet and assessment rules (teacher's decisions, keep them)

- Students **choose** their own role. Roles are never assigned.
- On Padlet, students post **only** their finished card (an image plus short post text with a Signal ID and a question). They reply to classmates they decode using premade questions, and replies start with `DECODED <ID>`. No per-round posts. Keep the Padlet clean and simple.
- The fully decoded six messages are a **private submission** to the teacher for credit, and are **never** posted on Padlet.
- Rejected features (don't bring them back): the Intel Pass mechanic ("too complicated"), and a "Compare calls" card.
- Signal ID format is `XX-ABCABC-YY`, with a 2-character checksum. It isn't tamper-proof. That's a known, accepted limit.

## Teacher preferences

- **Sounds:** quiet and pleasant, never harsh, bright or loud. The teacher supplies real sound files when synthesized ones fall short. Volumes have been tuned by ear, so don't raise them.
- **Accuracy:** real history matters. Flag factual or geographic errors (wrong locations, wrong scale bars) and don't silently invent facts. The teacher proofreads history text before class.
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

## Known open items

- **History to proofread:** all `SCEN` sitreps, `ROLE_HIST`, `ECHO`, `REALCALL` and `REC` text. Flagged earlier: the "about five weeks" Pyry timing; HYPO's "June 4, ~175 miles"; Nimitz approving the Yamamoto mission; Patton as paper commander of FUSAG.
- **Teacher images with known inaccuracies, left as is at the teacher's choice:**
  - `r1`: Pyry is placed west of Warsaw, and the scale bar is wrong.
  - `r1-mi`: London sits in the Midlands, and the scale bar is wrong.
  - `r2`: the HX-84 labels are wrong, and the U-110 capture is placed off Spain.
  - `r3-fa`: the route runs through the Bristol Channel, Calais and Dunkirk are drawn inside Belgium, and the scale bar is wrong.
  - `r4-fa`: the raid is shown as bombers rather than a safe-house raid.
  - `r4-mi`: the scale bar is wrong, there are ~40 dots versus 27 agents, and the Lisbon 1941 period is skipped.
  - `r4-ul`: the strike planes fly from Tunisia, not Malta.
  - `r5`: the US fighters should come from Guadalcanal (southeast).
- **To fix: `r5-fa` "The Rocket Secret" map** (teacher's new image, added 2026-11-12 as `img/r5-fa.webp`). These errors are flagged and still need fixing, either by editing the image or by asking the teacher for a corrected one:
  1. "RUSSIA" is labelled north of Poland. In 1943–44 that land was East Prussia, part of Germany. It only became Russian (Kaliningrad) after 1945.
  2. The scale bar is wrong. It aligns 100 miles with 250 km (should be ~160 km), and the map is drawn about 2.5× too large: Peenemünde to the Bug River crash site (near Sarnaki) is ~400 miles / ~650 km, but the bar reads it as ~1,000 miles.
  3. The "V-2 parts flown to Britain, July 1944" arrow goes straight west. In Operation Most III (Wildhorn III, 25–26 July 1944), an RAF Dakota picked up the parts at a field near Tarnów and flew them to Brindisi, Italy. They went on to London from there.
  - The other facts check out: Peenemünde bombed August 1943 (Operation Hydra), testing moved to Blizna, rocket recovered from the Bug River in May 1944.
  - To swap in a corrected image: replace `img/r5-fa.webp` (keep only one `img/r5-fa.*` file, since `mkimg.py` takes the first match), then run `python mkimg.py`, `node build.js`, copy `dist/test.html` → `index.html` and `dist/studio-test.html` → `studio.html`, and run `t.js` for all five roles.
- **Plain-text pieces on the Padlet card image:** they still appear. Removing them was offered, but the teacher never answered.
- **Padlet welcome post:** may need updating to match the current flow.
