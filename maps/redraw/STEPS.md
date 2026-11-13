# How the map images were redrawn (r5-fa, r5-bp/r5-mi, r1-nv, r3, r4)

These are the steps used for the redrawn Real History maps. Follow them for the remaining
redraws (`r1`, `r1-mi`, `r2`, `r3-fa`, `r4-mi`, `r4-ul`, `r5`). `r4-fa` is done: the teacher chose
a clean flowchart, not a map, drawn by `maps/r4fa-flowchart.js` (SVG in Playwright, no map data).
It uses the older `render.js` palette and Lora, not the colours and Georgia below, so it may need a
restyle to match. The scripts that drew the maps are not in this repo. Write your own equivalent
from these steps. Python with Pillow, NumPy and SciPy is enough.

`assets/paper_1.png` to `paper_3.png` are blank aged-parchment textures, made once with Stable
Diffusion. They are optional. The maps look right without them.

## The core rule: draw geography from data, never from an image model

Image models invent coastlines, misplace cities and garble text. Every error in the audit
came from that. Retouching a generated map (img2img) doesn't fix it either: a light pass
barely changes it, and a stronger one redraws the coastlines wrong. So:

- **Coastlines, rivers and borders** come from real datasets.
- **Every label, arrow, box and icon** is drawn in code, at real coordinates.
- **The paper look** is the only texture: grain, faint blotches, darker edges and an optional
  paper multiply.

## Data (download it, don't commit it: about 45 MB)

| What | Source |
|---|---|
| Land / coastlines | Natural Earth `ne_10m_land.geojson`, from `github.com/nvkelso/natural-earth-vector` (`geojson/`) |
| Rivers | Natural Earth `ne_10m_rivers_lake_centerlines.geojson`, same repo |
| Modern land borders (only for a line that matches a period border, e.g. the Czech–Slovak line) | Natural Earth `ne_10m_admin_0_boundary_lines_land.geojson`, same repo |
| **Period borders** | **CShapes 2.0**, `https://icr.ethz.ch/data/cshapes/CShapes-2.0.geojson` (ETH Zürich) |

CShapes notes:
- Pick the borders for a date: keep the features where
  `(gwsyear, gwsmonth, gwsday) <= date <= (gweyear, gwemonth, gweday)`.
- It follows the convention that occupied states keep their pre-war borders. Poland 1921–1945
  stays pre-war Poland, and Czechoslovakia stays post-Munich until 1945. For an occupation-era
  map, label the land "OCCUPIED POLAND" and put "Borders as in 1939" in small print.
- Colonies are separate entities: `Korea`, `Taiwan`, `Southern Sakhalin Island`, `Algeria`,
  `Tunisia`, `Libya`, `Malta`, `Hawaii`. Use them for shading (e.g. "Japan and its territories,
  1939").
- Known gaps: Memel is still Lithuanian through 1939, so the old Neman line was masked out for
  1943 maps. Danzig ends in 1938.
- **Don't use** `aourednik/historical-basemaps` `world_1938.geojson`. Its Poland/East Prussia
  border is about 1° too far north.

## Projection and scale (the part the old maps got wrong)

- **Mercator.** `y = ln(tan(π/4 + lat/2))` in degrees. Choose `lon0`, `lon1` and a top
  latitude. Then `S = 1536 / (lon1 - lon0)` px per degree, `x = (lon - lon0)·S`,
  `y = (merc(top) - merc(lat))·S`. Draw at 2× (3072×2048) and downsample with Lanczos.
- **Scale bar:** `px_per_mile = S / (69.17 · cos(lat))` at a stated latitude near the action.
  Put "Scale true at NN°N" in small print, because Mercator scale changes with latitude. Km tick
  spacing is `px_per_mile / 1.609`. Label both rows with values that actually line up:
  100 mi = 161 km, not 250.
- **Distances and bearings** (e.g. "175 miles at bearing 325°", "Point Luck ~325 miles NE"):
  `dlat = miles·cos(bearing)/69.17`, `dlon = miles·sin(bearing)/(69.17·cos(lat))`. This flat
  approximation is fine under about 500 miles.
- **Pacific maps cross the 180° line.** Add 360 to negative longitudes so the ocean is
  continuous. Draw each data ring twice, as-is and shifted +360. Don't wrap per point: that
  breaks the big Eurasia polygon and China disappears.
- **Check before shipping:** pick two known places, measure their pixel distance and convert it
  with the scale bar. Compare that with the real distance. The audit in `CLAUDE.md` lists
  reference distances (Peenemünde–Bug River ~400 mi, Huelva–Sicily ~1,200 mi, Tokyo–Hawaii
  ~3,900 mi, Kauai–Big Island ~300 mi).

## Drawing order

1. Rasterise the land polygons into a mask.
2. **Sea:** base colour, lighter within ~26 px of the coast (distance transform), plus thin
   sine-wave lines (`sin((y + 2.6·sin(x/13))/4.6·π) > 0.86`).
3. **Land:** flat colour. For territory shading, fill the CShapes polygons and AND them with the
   land mask.
4. **Texture:** add Gaussian-blurred noise (fine grain and big soft blotches), darken toward the
   edges, and optionally multiply a paper asset at about 20%.
5. **Coastline:** a navy stroke around every land ring.
6. **Borders:** stroke the CShapes outlines into their own mask, then keep only pixels more than
   ~2.5 px inland. Period coastlines don't match Natural Earth's, so this stops borders doubling
   the coast. Watch for lagoons and inland seas.
7. **Rivers:** filter by name (e.g. Vistula, Bug, Oder), thicker for the ones the story uses.
8. Country and sea labels, then story arrows, markers, callouts, title, legend, scale bar,
   compass, footer and frame. The story layers always come last.

## House style (match the teacher's maps)

- **Canvas:** 1536×1024. The footer band runs y 948–1008: cream, with double red rules each
  side, and the text "FROM THE RECORD • <subject>" centred. Frame: a 4 px navy line at 5 px
  inset and a 1.4 px line at 14 px.
- **Briefing style** (most maps). Colours:
  - navy `#16264A`, red `#A01E18`, Allied blue `#1E3C82`
  - rivers `#346096`, cream boxes `#F6E8C8`, land `#E8D0A0`
  - sea `#80A0A8` (coast tint `#AAC4C4`), borders `#46382A`

  Text and boxes:
  - **Fonts:** Georgia Bold for labels, Georgia Bold Italic letter-spaced for country and sea
    names, with a 3 px halo of the background colour.
  - **Title box:** top-left, double navy border. Title in bold, date in red italic between two
    red rules.
  - **Callouts:** red-bordered cream boxes with a red leader line.
  - **"THE OPERATION" box:** bullet facts in Georgia Regular.
- **Intelligence-plot style** (`r3`, `r4`): flat teal sea `#96B0B0` with sparse waves, sand land
  `#D8BA84`, Courier New Bold for all text. The footer has a left-aligned "FROM THE RECORD · …"
  and a two-line tag on the right.
- **Arrows:** dashed shafts with solid heads, plus one or two chevrons along long routes.
  - red = Axis or fake
  - navy = real Allied route
  - blue = air route
  - dotted = secret or overland movement
- **Icons are drawn in code.** Examples: carriers with a flat deck and island, escorts, a
  twin-engine Dakota, a V-2, a submarine. Draw the right type: P-38s are twin-boom, and convoys
  are merchant ships, not submarines.
- **Layout pass:** render, look at it and fix collisions, then repeat (usually 3–5 rounds).
  Keep labels off coastlines, keep callouts off routes, and keep everything inside the frame and
  above the footer. Labels hidden under boxes are a common miss.

## History hygiene

- Only state what the audit or a source confirms. When something new is added (an extra route,
  a date or a name), list it in the review note so the teacher can check it.
- When the real route leaves the map, stop the arrow at the edge and label the destination
  ("to Brindisi, Italy, then on to Britain") rather than shrinking the map.

## Swapping a redraw into the game

1. Move the old image into `img/old/` (`git mv img/<slot>.<ext> img/old/`). **Never delete the
   teacher's originals.** `mkimg.py` only reads `img/` itself, so `img/old/` is ignored.
2. Save the new image as `img/<slot>.png`, keeping only one `img/<slot>.*`.
3. Run `python3 mkimg.py && node build.js`, then copy `dist/test.html` to `index.html` and
   `dist/studio-test.html` to `studio.html`.
4. Check that only the intended slots changed in `src/recimages.js`.
5. Run `t.js` for the roles that see the slot (a headline `r1`–`r6` affects all five). It must
   print `no errors`.
6. In `CLAUDE.md`, change the slot's audit entry to **NEEDS TEACHER REVIEW**. Say what to check
   and how to undo it (move the original back from `img/old/` and rebuild). Never mark it
   "fixed": the teacher signs off.
7. Pull with rebase before pushing, since more than one Claude commits to this repo.
