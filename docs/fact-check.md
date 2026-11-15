# Historical fact check — Codebreakers: The Silent Service

First full pass: 2026-11-15. It covers all student-facing text in `src/data.js` (723 strings), the Asset Studio text in `src/studio.js`, the Padlet text in `src/app.js`, all 16 Real History images, and the historical details in the 13 pixel animations.

**Verdicts:**
- **Correct:** matches the record.
- **Simplified:** true enough for a class game; kept, but listed so the teacher knows.
- **Fixed:** was wrong and has been corrected in the game.
- **NEEDS TEACHER REVIEW:** disputed, or a fix would change the story or a role's premise; the teacher decides.

**Main sources used:**
- NSA Center for Cryptologic History: *The First Americans* (Sherman, 2016), Sinkov oral history (NSA-OH-02-79), and "Origins of US–British cooperation".
- UK National Archives Security Service files (KV 2/453, Owens).
- US Naval History and Heritage Command and Navy Region Hawaii's Station HYPO history.
- U.S. Naval Cryptologic Veterans Association ("World War II Code Girls").
- Bletchley Park Trust and Erskine's notes on Hut 8 (cryptocellar.org).
- Standard histories: Hinsley, *British Intelligence in the Second World War*; Macintyre, *Operation Mincemeat* and *Double Cross*; Kahn, *The Codebreakers* and *Seizing the Enigma*; Parshall and Tully, *Shattered Sword*; Mundy, *Code Girls*.
- CIA *Studies in Intelligence* on Popov.
- Defense Media Network on Popov and the FBI.

---

## 1. Fixed in this pass (game text, `src/data.js`)

| # | Where | Was | Now | Why |
|---|---|---|---|---|
| 1 | `ROUNDS[1].sitrep` (Round 2, everyone) | "Bletchley can read some U-boat orders for the first time" | "within weeks Bletchley is reading U-boat orders in time to use them" | Hut 8 had already read some February and April 1941 traffic using the *Krebs* capture (Lofoten raid, March 1941), but too late to be useful. Timely reading began in June and July 1941, after the May captures (U-110 and the weather ship *München*). *Sources:* Erskine's notes on Hut 8; Hinsley. |
| 2 | `SCEN["MI-0"].sitrep` (MI, Round 1) | Owens "has been sending reports … on a hidden radio set" | "has been passing information to German intelligence in Hamburg, which has sent him a secret radio set" | The Germans sent Owens a transmitter early in 1939, and he handed it to the authorities. He only began radioing, under MI5 control, after being interned in September 1939. *Sources:* National Archives KV 2/453; Owens biography (cdvandt.org). |
| 3 | `ROLES` NV `echo` | "the hundreds of Navy WAVES" | "the thousands of Navy WAVES" | OP-20-G had 2,469 WAVES billets by December 1943, and over 2,000 served there during the war. *Sources:* USNCVA; Mundy, *Code Girls*. |
| 4 | NV Round 2 briefing source line | "Navy Department, February 1941" … "In a few weeks you will be sent to Britain" | "Navy Department, January 1941" … "In a few days you will sail for Britain" | The Sinkov mission sailed on HMS *King George V* in late January 1941 and reached Bletchley in early February. *Sources:* NSA, *The First Americans*; Sinkov oral history. |
| 5 | NV Round 3 briefing source line | "Fleet Radio Unit report, December 1941" | "Combat Intelligence Unit report, December 1941" | In 1941 the Hawaii unit (Station HYPO) was called the Combat Intelligence Unit. "Fleet Radio Unit Pacific" is a later name. *Source:* Navy Region Hawaii, Station HYPO history. |
| 6 | MI Round 3 briefing | Popov "will meet the head of the FBI" | "will meet the FBI" | Popov met FBI officials in August 1941. His story of a face-to-face meeting with Hoover comes from his own memoir, and FBI files have no record of it. *Sources:* CIA *Studies in Intelligence*; Defense Media Network. |
| 7 | `ROLE_HIST.MI[2].call` | "MI5 passed the questions on." | "The questions reached the FBI." | Popov delivered the questionnaire to the FBI himself, with British approval. "MI5 passed them on" overstates MI5's part. *Same sources as #6.* |
| 8 | `REALCALL[1]` (Round 2 real call) | "its crew was sworn to silence" | "the British sailors involved were sworn to silence" | "Its crew" read as U-110's German crew. It was the British boarding party and the ships' crews who were sworn to secrecy. *Sources:* Kahn, *Seizing the Enigma*; IWM. |
| 9 | `SCEN["FA-4"].sitrep` (FA, Round 5) | the rocket "can fly hundreds of miles" | "can fly about 200 miles" | The V-2's range was about 320 km (200 miles). *Sources:* IWM; National WWII Museum. |

(Earlier fixes, from 2026-11-14: Operation Mincemeat. The body was picked up at sea by a fisherman rather than washed ashore, and Germany reinforced Greece and Sardinia. These were made in the text, the Studio prompts and the map image.)

---

## 2. Teacher review items: ALL APPLIED 2026-11-15

The teacher said "Yes, apply all". Each suggested wording below is now in `src/data.js` (R3 uses "Purple machines", in both the history text and its real call; R4 uses the new source line). All five roles were tested. Kept here for the record.

| # | Where | Claim | The issue | Suggested wording |
|---|---|---|---|---|
| R1 | `ROLE_HIST.UL[0].t` and `.call`; UL role premise ("generals who cannot be told how you know") | "Commanders were not told where it came from." / "Commanders were told only that the source was reliable." | Mostly wrong for **senior** commanders. Those cleared to receive Ultra (army and army group commanders, such as Montgomery, Alexander and Eisenhower) were "indoctrinated": they knew it came from codebreaking, and they were bound by strict rules never to reveal it or act on it without cover. Junior officers and staff were not told. In 1940, some Ultra was disguised as reports from an agent ("Boniface"). The role's dilemma still works: what is secret is how you know, for everyone below the general. | **t:** "Special Liaison Units carried Ultra to commanders in the field. They showed the message, waited while it was read, then took it back. Only a handful of senior officers knew it came from codebreaking, and they were forbidden to reveal it." **call:** "Only the commander was told the source, and the paper never stayed with him." |
| R2 | `ROLE_HIST.FA[2].call` (Channel Dash, real call) | "Warnings did reach London but were not acted on in time." | Partly true. London expected a breakout, and on 2 February 1942 an Admiralty appreciation predicted the Channel route. But the ships were not spotted until they were near Dover, because the patrol aircraft's radar failed and German jamming hid them. No specific Resistance warning that went unread is documented. | "London knew the ships would soon sail, but they were not spotted until they were almost at Dover, too late to stop them. Passing on an uncertain warning, clearly labeled, is better than staying silent." |
| R3 | `ROLE_HIST.NV[1].t` | "sailed to Britain with a Purple machine" | Sources differ on whether the mission brought one Purple machine or two (NSA documents say both). "A Purple machine" is safe if one is meant as "at least one". | Keep, or say "with Purple machines". |
| R4 | BP Round 4 briefing ("Letter from a friendly service, 1942") | The Americans in Hawaii asked Bletchley for help with the code group "AF". | This is an invented scenario. There is no record of HYPO asking Bletchley about AF, although British and Australian units did work on JN-25 with the US. It is fine as a "what would you do", but students may take it as fact. | Keep, or change the source line to "A request that might have come, 1942". |
| R5 | `ROUNDS[5].real` and `REALCALL[5]` | "Some German armored divisions were held back for weeks" / "German troops waited at Calais for weeks after D-Day." | Correct in substance. The 15th Army stayed in the Pas-de-Calais into late July, and the 116th Panzer Division was held north of the Seine until late July. Hitler's own orders were also a factor, not only Fortitude. | Optional: "Germany's 15th Army, and some armored divisions, were held back near Calais for weeks." |

---

## 3. Simplified but true (kept as is)

| Where | Claim | Note |
|---|---|---|
| `REC[0]` | Pyry meeting "about five weeks before Germany invaded Poland" | **Correct.** The meeting was 26–27 July 1939 and the invasion was 1 September: 36–37 days, a little over five weeks. (This was flagged earlier; it checks out.) |
| `REC[3]` | HYPO's estimate: carriers from the northwest, about June 4, about 175 miles from Midway | **Correct.** Layton, Nimitz's fleet intelligence officer, predicted a bearing of 325°, 175 miles, around 0600 on June 4, based on HYPO's work. The label credits HYPO; strictly it was Layton's estimate drawn from HYPO's decrypts. |
| `REC[4]` | "Admiral Nimitz approved the mission" (Yamamoto) | **Correct.** Nimitz authorized Halsey to go ahead. Stories that Roosevelt personally ordered it are not documented. |
| `REC[5]`, `ROUNDS[5]`, map `r6` | Patton led the fake army "on paper" (FUSAG) | **Correct.** Patton was FUSAG's notional commander. |
| `ROUNDS[0]` | The Poles were "reading Enigma since 1932" | Rejewski broke it in December 1932. Różycki and Zygalski joined the work from 1932–33. |
| `ROUNDS[0].sitrep[1]` | Army and air force keys "change every day at midnight" | Correct for 1939–40. |
| `ROUNDS[1].real`, round 2 term | Ultra needed a cover story | Correct. Cover was the standing rule, although it wasn't followed every single time. |
| `REALCALL[0]` | "Britain hid every result behind a cover story, passing Ultra off as reports from spies" | Overstated ("every"), but this was the policy, and early Ultra was disguised as agent reports. |
| `ROUNDS[2].real`, `ROLE_HIST.BP[2]` | Shark blackout from 1 February 1942, about ten months, ended with the U-559 material (30 October 1942) and broken 13 December | **Correct.** |
| `ECHO[2].open.real` | The fourth rotor | The M4 had been planned before any suspicion. The game implies the change was a reaction, but the "real" note only says it happened, which is correct. |
| `ROUNDS[3].real`, `REALCALL[3]` | The water-plant trick | **Correct.** Midway sent the message in the clear on Rochefort's suggestion, and a Japanese message soon reported AF short of water. "Next coded message" is a simplification. |
| `ECHO[4].cover.real` | Chicago Tribune story after Midway | **Correct** (7 June 1942, Stanley Johnston). |
| `ROUNDS[4].real`, `REALCALL[4]` | Coastwatcher cover story; Japan "suspected … but kept using" its code | Broadly correct. Japan investigated and decided the codes were safe. |
| `ROLE_HIST.BP[5]` | Colossus "the first programmable electronic computer"; pre-D-Day Tunny messages showed Germany expected Calais | Commonly stated as "first programmable electronic digital computer". Pre-D-Day Tunny decrypts and Oshima's reports (Purple) both showed the Calais belief; the famous 5 June note to Eisenhower rests on Tommy Flowers's recollection. |
| `ROLES` NV Round 6 briefing | Oshima's tour of the Atlantic Wall, reported to Tokyo | **Correct** (tour late 1943). His messages were read mainly by the US Army's codebreakers at Arlington Hall, not the Navy's. |
| `ROLE_HIST.FA[5]` | Verlaine's lines warned "resistance groups" | They were action messages for specific SOE networks (VENTRILOQUIST). Germany's 15th Army was put on alert, but the 7th Army in Normandy was not. |
| `ROLE_HIST.FA[4]`, map `r5-fa` | Home Army reports helped locate Peenemünde; V-2 parts flown out in July 1944 | **Correct.** Polish reports were one of several sources, alongside photo-reconnaissance and other agents. Operation Most III ran 25–26 July 1944. |
| `SCEN["FA-2"]` | Ships "for almost a year" at Brest | Scharnhorst and Gneisenau arrived in March 1941 and Prinz Eugen in June 1941, so this is true for two of the three. |
| `ROLE_HIST.FA[0]` | Bertrand handed a replica to Menzies at Victoria Station | **Correct** (16 August 1939). |
| `ROLE_HIST.MI[0]`, `[1]` | SNOW as MI5's first double agent; Double Cross and the Twenty Committee | **Correct.** The Twenty Committee first met in January 1941. "This became the Double Cross System" compresses the timeline a little. |
| `ROLE_HIST.MI[3]` | Garbo's 27 imaginary agents | The commonly cited figure. |
| `ROLE_HIST.MI[5]` | Garbo's D-Day message, timed to arrive too late | **Correct.** He was allowed to transmit around 3 a.m.; Madrid didn't come on air until about 8 a.m. On 9 June he reported that Normandy was a diversion. |
| `ROLE_HIST.UL[2]`, `SCEN["UL-2"]` | Rommel's January 1942 counterattack; a decrypt "hints … fresh tanks and fuel" | Correct: a convoy landed tanks at Tripoli on 5 January. Note that Rommel hid his intentions even from Rome and Berlin, so Ultra gave no real warning of the attack itself. |
| `ROLE_HIST.UL[3]`, `SCEN["UL-3"]` | Spotter plane before every Malta strike | **Correct.** This was the standard practice. |
| `ROLES` echo lines | Turing, Welchman, Clarke, Batey (Matapan); Rochefort, Driscoll; Virginia Hall, Nancy Wake; Masterman, Harris, Montagu; Winterbotham | All **correct.** "Most of Bletchley's staff were women" is correct (about 75%). |
| `ENDINGS[2]` | "Few people would know your name for thirty years" | **Correct.** Ultra became public in 1974. |
| `TIMELINE` | All 11 dates | All **correct.** |
| `PLACES`, `MEANWHILE` | Places and one-line headlines | **Correct.** |
| Role briefings (all roles) | The A/B/C dilemmas and outcomes | These are hypothetical choices, not claims, and they fit the period. The UL Atlantic escort scene (Round 2) is invented: convoy rerouting was done from the Admiralty, not by liaison officers on ships. |

---

## 4. Real History images (16)

All 16 were audited on 2026-11-12. Every error found was fixed in redraws the teacher approved on 2026-11-13 (see CLAUDE.md, "Real History image audit").

This pass re-checked:
- `r6` (Fortitude): beach order Utah–Omaha–Gold–Juno–Sword, FUSAG under Patton, and the scale bar (100 mi = 161 km). **No errors.**
- `r3-ul` (Rommel): the dates (21 January, 29 January, early February, 5 January convoy) and the scale (Tripoli to Benghazi reads about 410 miles; the real distance is about 400). **No errors.**
- `r5-bp` / `r5-mi`: now read "Found by a fisherman" (fixed 2026-11-14).
- `r4-fa` (the teacher's own image): the open items from swap-in still stand. The raid truck's cross reads like a Red Cross marking, and there is a stray mark after "the next day". **NEEDS TEACHER REVIEW**, unchanged.

## 5. Pixel animations (historical details only)

| Scene | Check |
|---|---|
| `leak` (FA-3) | Opel Blitz truck, field-grey uniforms, steel helmets: right for occupied France in 1942. |
| `advance` (UL-2) | DAK Opel Blitz, Afrika Korps caps and tropical tunics: right. Real DAK tanks were mostly plain sand yellow; the grey-green patches are a stylistic choice (some vehicles had them). |
| `maltadawn` (UL-3) | Generic twin-engine RAF reconnaissance plane; Maltese limestone town. Fine. |
| `dash` (FA-2) | Dark, moonless night on 11 February 1942: right, since they sailed at about 22:45. |
| `shadows` (MI-3) | Blackout, barrage balloon, searchlight in London in 1942: right. The shadows are symbolic. |
| `landfall` (MI-4) | HMS Seraph (S-class submarine), the canister, the life jacket, and the fisherman picking him up at sea: matches the corrected history. |
| `hutdecrypt` (BP-4) | Generic hut; arrows toward Greece and Sardinia: right. |
| `bug` (FA-4) | Test V-2 in black-and-white paint, on the Bug River near Sarnaki, May 1944: right. |
| Headline scenes (`enigma`, `convoy`, `silence`, `midway`, `intercept`, `decoy`), `codeoffice`, `spyradio` | Nothing wrong for the period. Yamamoto's plane in `intercept` was a G4M "Betty" bomber, as described. |

## 6. Asset Studio and Padlet text

- **`src/studio.js`:** all image and animation descriptions agree with the corrected history. No errors.
- **`src/app.js` (Padlet):** instructions only, with no historical claims.
