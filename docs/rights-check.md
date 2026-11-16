# Rights check before sharing with other teachers

This is a checklist of every sound and picture built into the game, and who needs to confirm it can be shared. Only the teacher can do the items marked **YOU**, because only the teacher knows where those files came from.

## How to check one file

1. **Find where it came from.** Look in your downloads, your bookmarks, or the site you used (for example Pixabay, Freesound, Zapsplat, an AI image tool, or your own recording or drawing).
2. **Find its licence.** It's usually on the download page, or in a "license" or "terms" link on that site.
3. **Match it against this table:**

| What the licence says | Can you share the game? | What to do |
|---|---|---|
| You made it yourself (drawn, recorded, or typed into an AI tool you're allowed to use) | Yes | Nothing |
| Public domain, CC0, or the "Pixabay Content License" | Yes | Nothing (a credit is optional) |
| CC BY ("Attribution") | Yes, with a credit | Send Claude the credit line, and it goes on the For Teachers page |
| CC BY-NC ("NonCommercial") | Yes, for free classroom use, with a credit | Same as CC BY. Never sell the game. |
| "Personal use only", "no redistribution", a paid or "Pro" licence, or you can't find out | **No** | Replace the file (see below) |

4. **Tell Claude the result for each file**, for example: "typewriter: Pixabay, fine", or "door sound: Zapsplat, needs credit 'Sound from zapsplat.com'".

## The files

### Sounds: all three supplied by you (**YOU**)

They're stored inside the code, so you won't see them as separate files in GitHub. To hear them, play the game.

| Sound | Where in the game | Stored in |
|---|---|---|
| Typewriter loop | Plays while each briefing types out | `src/typesound.js` (`TYPE_SND`) |
| Ratchet clicks (2 takes) | Turning the cipher dial | `src/dialsound.js` (`DIAL_SND`) |
| Door opening | When a cipher is solved | `src/dialsound.js` (`SOLVE_SND`) |

### Pictures supplied by you (**YOU**)

| Image | Round | File |
|---|---|---|
| Finding a leak (bait-test flowchart) | Resistance Courier, round 4 | `img/r4-fa.webp` |
| Rommel strikes back (Libya map) | Ultra Liaison, round 3 | `img/r3-ul.png` |
| Operation Fortitude (Channel map) | Round 6, every role | `img/r6.png` |

Also check **`img/old/`**. It holds your earlier versions of most maps. They're no longer used in the game, but anyone can download them from the public GitHub repository. If any of them shouldn't be public, Claude can remove them from the repository.

### Pictures drawn by Claude (no action needed)

These are fine to share, with the credits already on the For Teachers page:
- `r1`, `r1-nv`, `r1-mi`, `r2`, `r3`, `r3-fa`, `r4`, `r4-mi`, `r4-ul`, `r5`, `r5-fa`, `r5-bp`, `r5-mi`
- all the pixel animations and portraits, which are drawn by code in this project

They were drawn from map data:
- **Natural Earth:** public domain.
- **CShapes 2.0 (ETH Zürich):** CC BY-NC-SA 4.0, which means: give credit (done), no commercial use, and share any changes under the same licence. Sharing the game free with other teachers is fine. Selling it is not.

### Fonts (no action needed)

Atkinson Hyperlegible, Silkscreen and VT323 are under the SIL Open Font License, which allows them to be built into the page and shared.

## If a file can't be shared

- **A sound:** send Claude a replacement file (Pixabay and Freesound with the CC0 filter have free ones), or ask Claude to switch that sound off.
- **A picture:** send a replacement, or ask Claude to redraw it in the same style from public map data, as it did for the other maps.
- **Then publish a new frozen version** (`node release.js v2`), because `v1/` already contains the current files.

## Hosted image swaps

A file you put in the site's `images/` folder replaces that picture for every teacher using the main game. It does not affect the frozen `v1/` copy, which only looks in `v1/images/`. Any file you add there needs the same check.
