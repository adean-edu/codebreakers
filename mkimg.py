# Builds src/recimages.js from img/r1..r6 (any of png/jpg/jpeg/webp). Missing rounds stay null (sketch map is used).
import os, base64, io, glob
from PIL import Image
out = []
for n in range(1, 7):
    f = sorted(glob.glob(f"img/r{n}.*"))
    if not f: out.append("null"); continue
    im = Image.open(f[0]).convert("RGB"); im.thumbnail((1500, 1500), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "WEBP", quality=72, method=6)
    out.append('"data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode() + '"')
    print(n, f[0], im.size, len(b.getvalue()))
slots = {}
for f in sorted(glob.glob("img/r[1-6]-*.*")):
    name = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert("RGB"); im.thumbnail((1500, 1500), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "WEBP", quality=72, method=6)
    slots[name] = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode(); print(name, f, im.size, len(b.getvalue()))
open("src/recimages.js", "w").write("/* Teacher-supplied Real History images, one per round (null = use the sketch map). Built by mkimg.py. */\nconst REC_IMG = [" + ", ".join(out) + "];\n/* Teacher-supplied images for individual-scenario slots, by slot name. These replace Claude's sketch maps. */\nconst SLOT_IMG = {" + ", ".join(f'"{k}": "{v}"' for k, v in slots.items()) + "};\n")
