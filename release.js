/* Publish a frozen copy of the game for other teachers: node release.js v1
   Builds, then copies the game, Teacher Check and the For Teachers guide into <version>/ at the repo root
   (live at https://spyglass-lab.github.io/codebreakers/<version>/). Later changes to the main game do not touch it.
   Refuses to overwrite an existing version unless you add --force, so a class mid-unit is never changed by accident. */
const fs = require("fs"), path = require("path");
const ver = process.argv[2], force = process.argv.includes("--force");
if (!/^v\d+$/.test(ver || "")) { console.error("Usage: node release.js v1   (v2, v3 … for later versions)"); process.exit(1); }
const dir = path.join(__dirname, ver);
if (fs.existsSync(dir) && !force) { console.error(`${ver}/ already exists. Teachers may be using it mid-unit. Make a new version (v2, v3 …), or add --force to overwrite.`); process.exit(1); }
const { guide, SITE } = require("./build.js");
const day = new Date().toISOString().slice(0, 10);
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(path.join(__dirname, "dist/test.html"), path.join(dir, "index.html"));
fs.copyFileSync(path.join(__dirname, "dist/check.html"), path.join(dir, "check.html"));
fs.writeFileSync(path.join(dir, "teachers.html"), guide(`This is <b>version ${ver.slice(1)}</b> (frozen ${day}). It will not change while your class is using it. When a newer version comes out, it will have its own link, and this one stays as it is.`, SITE + ver + "/"));
console.log(`Published ${ver}/: index.html, check.html, teachers.html → ${SITE}${ver}/teachers.html`);
