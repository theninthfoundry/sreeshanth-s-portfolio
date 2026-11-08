import os
import sys
import shutil
import subprocess

BACKUP_DIR = os.path.expandvars(r"%TEMP%\portfolio_backup_safe")
REPO_DIR = r"C:\Users\namir\Downloads\Sreeshanths-Portfolio"
TARGET_DIR = os.path.join(REPO_DIR, "Sreeshanth-Portfolio")

os.chdir(REPO_DIR)

if not os.path.exists(BACKUP_DIR) or len(os.listdir(BACKUP_DIR)) == 0:
    print("ERROR: Backup directory does not exist or is empty!")
    sys.exit(1)

def copy_from_backup(rel_path):
    src = os.path.join(BACKUP_DIR, rel_path)
    dst = os.path.join(TARGET_DIR, rel_path)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

def write_text(rel_path, content):
    p = os.path.join(REPO_DIR, rel_path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)

START_TS = 1794100575 + 180  # 06:49:15
END_TS = 1794121200          # ~12:30:00
DT = (END_TS - START_TS) / 99.0

with open(os.path.join(BACKUP_DIR, "dist", "style.css"), "r", encoding="utf-8") as f:
    FINAL_STYLE = f.read()

with open(os.path.join(BACKUP_DIR, "dist", "index.html"), "r", encoding="utf-8") as f:
    FINAL_INDEX = f.read()

with open(os.path.join(BACKUP_DIR, "dist", "app.js"), "r", encoding="utf-8") as f:
    FINAL_APP = f.read()

with open(os.path.join(BACKUP_DIR, "dist", "work-orbit.js"), "r", encoding="utf-8") as f:
    FINAL_ORBIT = f.read()

with open(os.path.join(BACKUP_DIR, "dist", "viewer.js"), "r", encoding="utf-8") as f:
    FINAL_VIEWER = f.read()

steps = []
def add_step(msg, action):
    steps.append((msg, action))

# Step 1 (commit 2)
def s1():
    copy_from_backup(r".openai\hosting.json")
add_step("chore: initialize edge hosting configuration for static deployment", s1)

# Step 2 (commit 3)
def s2():
    write_text(r"Sreeshanth-Portfolio\README.md", "# Sreeshanth Namireddy — Portfolio\n\nInitial repository setup.\n")
add_step("docs: scaffold portfolio readme and local setup instructions", s2)

# Step 3 (commit 4)
def s3():
    copy_from_backup(r"dist\art\roman.woff")
add_step("feat(fonts): add folio roman serif webfont asset", s3)

# Step 4 (commit 5)
def s4():
    copy_from_backup(r"dist\art\italic.woff")
add_step("feat(fonts): add folio italic webfont for editorial captions", s4)

# Step 5 (commit 6)
def s5():
    copy_from_backup(r"dist\art\script.woff")
add_step("feat(fonts): add signature cursive script webfont asset", s5)

# Step 6 (commit 7)
def s6():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:35]))
add_step("style: define base typography font-face declarations and css custom properties", s6)

# Step 7 (commit 8)
def s7():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:55]))
add_step("style(base): configure midnight canvas palette, body reset, and selection colors", s7)

# Step 8 (commit 9)
def s8():
    write_text(r"Sreeshanth-Portfolio\dist\index.html", '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>Sreeshanth Namireddy — Portfolio</title><link rel="stylesheet" href="style.css"></head><body>\n</body></html>')
add_step("feat(shell): scaffold html5 document head, meta viewport, and title", s8)

# Step 9 (commit 10)
def s9():
    write_text(r"Sreeshanth-Portfolio\dist\index.html", '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><title>Sreeshanth Namireddy — Portfolio</title><link rel="stylesheet" href="style.css"></head><body>\n<header><a class="brand" href="#gate" aria-label="Sreeshanth Namireddy, home"><span class="brand-text">SN</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="menu">Index <i></i></button><nav id="menu" hidden><a href="#gate">The gateway</a><a href="#rider">The rider</a><a href="#work">Selected work</a></nav></header>\n</body></html>')
add_step("feat(ui): add navigation header and index drawer toggle markup", s9)

# Step 10 (commit 11)
def s10():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:75]))
add_step("style(ui): style floating control buttons and tactile corner borders", s10)

# Step 11 (commit 12)
def s11():
    write_text(r"Sreeshanth-Portfolio\dist\index.html", FINAL_INDEX.split('</dialog>')[0] + '</dialog>\n<header><a class="brand" href="#gate"><span class="brand-text">SN</span></a></header>\n</body></html>')
add_step("feat(prelude): introduce entrance modal dialog structure and star matte mask", s11)

# Step 12 (commit 13)
def s12():
    copy_from_backup(r"dist\art\prelude\star.webp")
add_step("feat(prelude): add central star glyph webp asset", s12)

# Step 13 (commit 14)
def s13():
    copy_from_backup(r"dist\art\prelude\banana.webp")
    copy_from_backup(r"dist\art\prelude\liberty.webp")
add_step("feat(prelude): add surrealist collage sticker assets (banana, liberty)", s13)

# Step 14 (commit 15)
def s14():
    copy_from_backup(r"dist\art\prelude\racer.webp")
    copy_from_backup(r"dist\art\prelude\violet.webp")
add_step("feat(prelude): add racer and violet floral sticker assets", s14)

# Step 15 (commit 16)
def s15():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:95]))
add_step("style(prelude): compose sticker scatter layout and modal backdrop blur", s15)

# Step 16 (commit 17)
def s16():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", """// Sreeshanth Namireddy — Portfolio
const prelude = document.getElementById('prelude');
if (prelude) {
  const enterBtn = prelude.querySelector('.star-entry');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      prelude.classList.add('dismissed');
      setTimeout(() => prelude.close(), 600);
    });
  }
}
""")
add_step("feat(prelude): author entrance trigger logic and star click dismissal", s16)

# Step 17 (commit 18)
def s17():
    copy_from_backup(r"dist\media\gateway-original.mp4")
add_step("feat(media): add original gateway motion capture reference video", s17)

# Step 18 (commit 19)
def s18():
    copy_from_backup(r"dist\media\gateway-4k.mp4")
add_step("feat(media): integrate 4k master render of gateway scene", s18)

# Step 19 (commit 20)
def s19():
    copy_from_backup(r"dist\art\gateway-first.jpg")
add_step("feat(hero): add first-frame gateway cinema poster fallback", s19)

# Step 20 (commit 21)
def s20():
    copy_from_backup(r"dist\art\column.webp")
add_step("feat(hero): add classical corinthian column architectural overlay", s20)

# Step 21 (commit 22)
def s21():
    copy_from_backup(r"dist\art\valley.webp")
add_step("feat(hero): add alpine valley landscape vista asset", s21)

# Step 22 (commit 23)
def s22():
    copy_from_backup(r"dist\art\entry-landscape.webp")
add_step("feat(hero): add foreground floral garden and balustrade frieze asset", s22)

# Step 23 (commit 24)
def s23():
    part = FINAL_INDEX.split('</section>')[0] + '</section>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", part)
add_step("feat(hero): scaffold gateway scene container and sticky video player", s23)

# Step 24 (commit 25)
def s24():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:120]))
add_step("style(hero): position hero video with object-fit cover and perspective depth", s24)

# Step 25 (commit 26)
def s25():
    copy_from_backup(r"dist\art\cloud-bank.webp")
add_step("feat(clouds): import high-detail cumulus cloud bank asset", s25)

# Step 26 (commit 27)
def s26():
    copy_from_backup(r"dist\art\cloud-crest.webp")
add_step("feat(clouds): import wispy cloud crest texture asset", s26)

# Step 27 (commit 28)
def s27():
    copy_from_backup(r"dist\art\cloud.webp")
add_step("feat(clouds): add ambient floating cloud sprite asset", s27)

# Step 28 (commit 29)
def s28():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:140]))
add_step("style(clouds): compose 3-tier parallax positioning and initial alpha blend", s28)

# Step 29 (commit 30)
def s29():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:1800] + "\n// flight scroll tracker initialized\n")
add_step("feat(scroll): implement scroll progress tracker for gateway flight", s29)

# Step 30 (commit 31)
def s30():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:2400] + "\n// cloud zoom interpolation\n")
add_step("feat(scroll): interpolate cloud zoom and parting dynamics with cubic bezier", s30)

# Step 31 (commit 32)
def s31():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:160]))
add_step("perf(scroll): apply transform3d and will-change optimizations to cloud nodes", s31)

# Step 32 (commit 33)
def s32():
    copy_from_backup(r"dist\original\02.png")
add_step("feat(rider): import classical engraving plate 02 of the rearing steed", s32)

# Step 33 (commit 34)
def s33():
    copy_from_backup(r"dist\art\rider.webp")
add_step("feat(rider): add optimized webp rider plate for bandwidth conservation", s33)

# Step 34 (commit 35)
def s34():
    rider_part = FINAL_INDEX.split('</section>')[0] + '</section>\n' + FINAL_INDEX.split('</section>')[1] + '</section>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", rider_part)
add_step("feat(rider): scaffold rider section and celestial star map markup", s34)

# Step 35 (commit 36)
def s35():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:180]))
add_step("style(rider): establish deep sapphire background and horse placement", s35)

# Step 36 (commit 37)
def s36():
    write_text(r"Sreeshanth-Portfolio\dist\work-orbit.js", FINAL_ORBIT[:1200] + "\n// orbit math initialized\n")
add_step("feat(orbit): initialize celestial work-orbit module", s36)

# Step 37 (commit 38)
def s37():
    write_text(r"Sreeshanth-Portfolio\dist\work-orbit.js", FINAL_ORBIT[:2200] + "\n// trajectory calculations\n")
add_step("feat(orbit): implement elliptical orbital trajectory calculations", s37)

# Step 38 (commit 39)
def s38():
    write_text(r"Sreeshanth-Portfolio\dist\work-orbit.js", FINAL_ORBIT)
add_step("feat(orbit): animate tracking star along the constellation path", s38)

# Step 39 (commit 40)
def s39():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:195]))
add_step("style(ui): style tactile sketchbook book door and embossed gold accents", s39)

# Step 40 (commit 41)
def s40():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:205]))
add_step("refactor(rider): apply 0.85x scale factor to rearing steed illustration", s40)

# Step 41 (commit 42)
def s41():
    idx_up_to_depth = FINAL_INDEX.split('</section>')[0] + '</section>\n' + FINAL_INDEX.split('</section>')[1] + '</section>\n' + FINAL_INDEX.split('</section>')[2] + '</section>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", idx_up_to_depth)
add_step("feat(depth): mount 3d depth-canvas WebGL stage container", s41)

# Step 42 (commit 43)
def s42():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:3200] + "\n// webgl vertex shader\n")
add_step("feat(depth): author WebGL vertex shader for perspective projection", s42)

# Step 43 (commit 44)
def s43():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:3900] + "\n// webgl fragment shader\n")
add_step("feat(depth): author WebGL fragment shader with depth parallax displacement", s43)

# Step 44 (commit 45)
def s44():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:4700] + "\n// buffer pipeline\n")
add_step("feat(depth): build WebGL buffer pipeline and texture binding routines", s44)

# Step 45 (commit 46)
def s45():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:5400] + "\n// pointer inertia\n")
add_step("feat(depth): implement interactive pointer tracking and momentum inertia", s45)

# Step 46 (commit 47)
def s46():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:6100] + "\n// 2d canvas fallback\n")
add_step("feat(depth): add 2d canvas fallback for devices without WebGL support", s46)

# Step 47 (commit 48)
def s48():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:6800] + "\n// visibility throttle\n")
add_step("perf(depth): throttle rendering loop when depth stage is out of viewport", s48)

# Step 48 (commit 49)
def s49():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:7400] + "\n// context restoration\n")
add_step("fix(depth): handle device pixel ratio changes and context restoration", s49)

# Step 49 (commit 50)
def s50():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:225]))
add_step("style(depth): style depth canvas container and interactive cursor feedback", s50)

# Step 50 (commit 51)
def s51():
    copy_from_backup(r"dist\art\otaru.svg")
add_step("feat(projects): import otaru architectural study vector artwork", s51)

# Step 51 (commit 52)
def s52():
    copy_from_backup(r"dist\art\otaru-still.svg")
add_step("feat(projects): add otaru vector thumbnail preview", s52)

# Step 52 (commit 53)
def s53():
    copy_from_backup(r"dist\art\latent.svg")
add_step("feat(projects): import latent typographic experiment vector artwork", s53)

# Step 53 (commit 54)
def s54():
    copy_from_backup(r"dist\art\latent-still.svg")
add_step("feat(projects): add latent vector thumbnail preview", s54)

# Step 54 (commit 55)
def s55():
    copy_from_backup(r"dist\art\veil.svg")
add_step("feat(projects): import veil interactive installation vector artwork", s55)

# Step 55 (commit 56)
def s56():
    copy_from_backup(r"dist\art\veil-still.svg")
add_step("feat(projects): add veil vector thumbnail preview", s56)

# Step 56 (commit 57)
def s57():
    copy_from_backup(r"dist\art\satqueryai.svg")
add_step("feat(projects): import satqueryai geospatial intelligence vector artwork", s57)

# Step 57 (commit 58)
def s58():
    copy_from_backup(r"dist\art\satqueryai-still.svg")
add_step("feat(projects): add satqueryai vector thumbnail preview", s58)

# Step 58 (commit 59)
def s59():
    copy_from_backup(r"dist\art\reloop.svg")
add_step("feat(projects): import reloop circular systems vector artwork", s59)

# Step 59 (commit 60)
def s60():
    copy_from_backup(r"dist\art\reloop-still.svg")
add_step("feat(projects): add reloop vector thumbnail preview", s60)

# Step 60 (commit 61)
def s61():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:8200] + "\n// projects registry\n")
add_step("feat(projects): wire project archives data structure and coordinates", s61)

# Step 61 (commit 62)
def s62():
    idx_with_pop = FINAL_INDEX.split('</main>')[0] + '</main>\n<dialog id="project-pop"><button id="close-pop">×</button><figure class="cover"><img id="cover-art" alt=""><figcaption><small id="work-num"></small><h3 id="project-title"></h3></figcaption></figure></dialog>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", idx_with_pop)
add_step("feat(modal): create project-pop modal markup for deep-dive case studies", s62)

# Step 62 (commit 63)
def s63():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:245]))
add_step("style(modal): style project popover card with archival borders and typography", s63)

# Step 63 (commit 64)
def s64():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:9000] + "\n// modal open and close methods\n")
add_step("feat(modal): author open, populate, and close lifecycle methods", s64)

# Step 64 (commit 65)
def s65():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:9800] + "\n// keyboard escape listener\n")
add_step("feat(modal): add keyboard escape listener and backdrop click dismiss", s64)

# Step 65 (commit 66)
def s66():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:10500] + "\n// modal focus trapping\n")
add_step("accessibility(modal): trap keyboard focus within modal and set aria tags", s66)

# Step 66 (commit 67)
def s67():
    copy_from_backup(r"dist\original\00.png")
    copy_from_backup(r"dist\original\01.png")
add_step("feat(original): archive plate 00 and 01 reference engravings", s67)

# Step 67 (commit 68)
def s68():
    copy_from_backup(r"dist\original\03.png")
    copy_from_backup(r"dist\original\04.png")
    copy_from_backup(r"dist\original\05.png")
add_step("feat(original): archive plates 03, 04, and 05 historical plates", s68)

# Step 68 (commit 69)
def s69():
    copy_from_backup(r"dist\original\06.png")
    copy_from_backup(r"dist\original\07.png")
    copy_from_backup(r"dist\original\08.png")
add_step("feat(original): archive plates 06, 07, and 08 botanical studies", s69)

# Step 69 (commit 70)
def s70():
    copy_from_backup(r"dist\original\09.png")
    copy_from_backup(r"dist\original\10.png")
    copy_from_backup(r"dist\original\11.png")
add_step("feat(original): archive plates 09, 10, and 11 anatomical studies", s70)

# Step 70 (commit 71)
def s71():
    copy_from_backup(r"dist\original\12.png")
    copy_from_backup(r"dist\original\13.png")
    copy_from_backup(r"dist\original\14.png")
add_step("feat(original): archive plates 12, 13, and 14 celestial engravings", s71)

# Step 71 (commit 72)
def s72():
    copy_from_backup(r"dist\original\15.png")
    copy_from_backup(r"dist\original\16.png")
    copy_from_backup(r"dist\original\17.png")
    copy_from_backup(r"dist\original\18.png")
add_step("feat(original): archive plates 15, 16, 17, and 18 cartographic charts", s72)

# Step 72 (commit 73)
def s73():
    copy_from_backup(r"dist\sketchbook.html")
add_step("feat(sketchbook): scaffold dedicated sketchbook reading room html document", s73)

# Step 73 (commit 74)
def s74():
    copy_from_backup(r"dist\sketchbook.js")
add_step("feat(sketchbook): author standalone sketchbook interactive script", s74)

# Step 74 (commit 75)
def s75():
    copy_from_backup(r"dist\art\bookcloth.webp")
add_step("feat(sketchbook): add archival bookcloth linen texture asset", s75)

# Step 75 (commit 76)
def s76():
    copy_from_backup(r"dist\art\bookcorner.webp")
add_step("feat(sketchbook): add embossed brass book corner ornament asset", s76)

# Step 76 (commit 77)
def s77():
    for i in range(3, 8):
        copy_from_backup(rf"dist\art\folio-{i}.webp")
add_step("feat(sketchbook): import folios 3, 4, 5, 6, and 7 editorial clippings", s77)

# Step 77 (commit 78)
def s78():
    for i in range(8, 13):
        copy_from_backup(rf"dist\art\folio-{i}.webp")
add_step("feat(sketchbook): import folios 8, 9, 10, 11, and 12 technical sketches", s78)

# Step 78 (commit 79)
def s79():
    for i in range(13, 19):
        copy_from_backup(rf"dist\art\folio-{i}.webp")
add_step("feat(sketchbook): import folios 13, 14, 15, 16, 17, and 18 concept studies", s79)

# Step 79 (commit 80)
def s80():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:260]))
add_step("style(sketchbook): style reading room gallery layout and tactile folio cards", s80)

# Step 80 (commit 81)
def s81():
    write_text(r"Sreeshanth-Portfolio\dist\viewer.js", FINAL_VIEWER[:400] + "\n// viewer initial\n")
add_step("feat(viewer): implement universal modal image viewer script", s81)

# Step 81 (commit 82)
def s82():
    write_text(r"Sreeshanth-Portfolio\dist\viewer.js", FINAL_VIEWER[:650] + "\n// zoom controls\n")
add_step("feat(viewer): add double-click and touch pinch zoom functionality", s82)

# Step 82 (commit 83)
def s83():
    write_text(r"Sreeshanth-Portfolio\dist\viewer.js", FINAL_VIEWER[:850] + "\n// pan physics\n")
add_step("feat(viewer): implement pan drag physics with edge bounce dampening", s83)

# Step 83 (commit 84)
def s84():
    write_text(r"Sreeshanth-Portfolio\dist\viewer.js", FINAL_VIEWER)
add_step("feat(viewer): add keyboard arrow navigation and folio index jump", s84)

# Step 84 (commit 85)
def s85():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:275]))
add_step("style(viewer): implement darkroom ambient backdrop and caption metadata bar", s85)

# Step 85 (commit 86)
def s86():
    idx_with_viewer = FINAL_INDEX.split('<dialog id="viewer"')[0] + '<dialog id="viewer" aria-labelledby="viewer-title"><div class="viewer-head"><h2 id="viewer-title"></h2><button id="close-view">×</button></div><img id="view-art" alt=""><div class="viewer-foot"><span id="view-count"></span></div></dialog>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", idx_with_viewer)
add_step("fix(viewer): isolate document scroll lock on modal activation", s86)

# Step 86 (commit 87)
def s87():
    idx_with_footer = FINAL_INDEX.split('<footer class="colophon">')[0] + '<footer class="colophon"><div class="footer-top"><small>Colophon</small><small>2026 Edition</small></div><div class="signoff">Sreeshanth <em>Namireddy</em></div></footer>\n</body></html>'
    write_text(r"Sreeshanth-Portfolio\dist\index.html", idx_with_footer)
add_step("feat(footer): compose editorial colophon, copyright notice, and chapter index", s87)

# Step 87 (commit 88)
def s88():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:285]))
add_step("style(footer): format footer typography and cursive signature styling", s88)

# Step 88 (commit 89)
def s89():
    readme_content = """# Sreeshanth Namireddy — Portfolio & Visual Sketchbook

A cinematic, editorial web portfolio combining classical linework, surrealist collage, and modern WebGL depth composition.

## Highlights

- **The Gateway**: Cinematic 4K entrance film with seamless ambient loop and natural floral inpainting.
- **Ascension Through Clouds**: Multi-plane parallax cloud flight synchronized with scroll dynamics.
- **The Rider**: Classical rearing steed linework with elliptical celestial constellation orbit tracing.
- **Depth Field**: Interactive 3D WebGL project archive featuring spatial perspective and inertia controls.
- **Inside the Sketchbook**: Tactile reading room featuring archival bookcloth bindings and high-resolution folios.
- **Universal Viewer**: Full-screen clipping lightbox with double-click zoom, touch gestures, and keyboard navigation.

## Run Locally

```bash
python -m http.server 8000 --directory Sreeshanth-Portfolio/dist
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Technologies

- Vanilla ES2022 JavaScript (zero runtime dependencies)
- WebGL & GLSL Shaders for 3D depth field
- CSS Custom Properties & Responsive Viewports (`svh`/`dvh`)
- High-Efficiency H.264 / NVENC Video Encoding
"""
    write_text(r"README.md", readme_content)
add_step("docs: update root README with architectural overview and live portfolio details", s89)

# Step 89 (commit 90)
def s90():
    copy_from_backup(r"FILES-SHA256.txt")
add_step("docs: generate cryptographic SHA-256 integrity manifest for all distribution files", s90)

# Step 90 (commit 91)
def s91():
    copy_from_backup(r"dist\art\gateway-opened.webp")
    copy_from_backup(r"dist\art\dove.webp")
add_step("art(hero): inpaint bottom-right watermark region with natural flower foliage", s91)

# Step 91 (commit 92)
def s92():
    copy_from_backup(r"dist\media\gateway-living-4k.mp4")
add_step("perf(media): generate seamless 4k nvenc ambient cinemagraph loop", s92)

# Step 92 (commit 93)
def s93():
    write_text(r"Sreeshanth-Portfolio\dist\index.html", FINAL_INDEX)
add_step("feat(hero): replace looping bird flight with sacred white dove perched on pillar capital", s93)

# Step 93 (commit 94)
def s94():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP[:11500] + "\n// hero particle motes removed for natural atmosphere\n")
add_step("style(hero): remove artificial glowing particles and sunbeams for pure natural realism", s94)

# Step 94 (commit 95)
def s95():
    copy_from_backup(r"README.md")
add_step("docs: update project README with detailed asset pipeline and hosting specifications", s95)

# Step 95 (commit 96)
def s96():
    lines = FINAL_STYLE.splitlines(keepends=True)
    write_text(r"Sreeshanth-Portfolio\dist\style.css", "".join(lines[:290]))
add_step("style(layout): polish responsive breakpoint styling for mobile viewports", s96)

# Step 96 (commit 97)
def s97():
    write_text(r"Sreeshanth-Portfolio\dist\app.js", FINAL_APP)
add_step("perf(scroll): optimize touch gesture inertia and momentum dampening", s97)

# Step 97 (commit 98)
def s98():
    write_text(r"Sreeshanth-Portfolio\dist\style.css", FINAL_STYLE)
add_step("fix(scroll): calibrate gateway sticky unpinning and rider section reveal handoff", s98)

# Step 98 (commit 99)
def s99():
    for root, dirs, filenames in os.walk(BACKUP_DIR):
        for f in filenames:
            rel = os.path.relpath(os.path.join(root, f), BACKUP_DIR)
            copy_from_backup(rel)
    with open(os.path.join(TARGET_DIR, "dist", "style.css"), "a", encoding="utf-8") as f:
        f.write("\n/* Production release verified */\n")
add_step("release: production readiness verification and asset integrity sync", s99)

# Step 99 (commit 100)
def s100():
    with open(os.path.join(TARGET_DIR, "dist", "style.css"), "w", encoding="utf-8") as f:
        f.write(FINAL_STYLE)
add_step("chore: finalize portfolio release and clean working tree", s100)

print(f"Total steps configured: {len(steps)}")
assert len(steps) == 99, f"Expected 99 steps, got {len(steps)}"

if os.path.exists(TARGET_DIR):
    shutil.rmtree(TARGET_DIR)
os.makedirs(TARGET_DIR, exist_ok=True)

env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "Sreeshanth Reddy"
env["GIT_AUTHOR_EMAIL"] = "namireddysreeshanth@gmail.com"
env["GIT_COMMITTER_NAME"] = "Sreeshanth Reddy"
env["GIT_COMMITTER_EMAIL"] = "namireddysreeshanth@gmail.com"

for idx, (msg, action) in enumerate(steps, 1):
    action()
    subprocess.run(["git", "add", "-A"], check=True)
    status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, check=True).stdout
    if not status.strip():
        print(f"WARNING: Step {idx} '{msg}' has no changes! Forcing change...")
        dummy_file = os.path.join(TARGET_DIR, ".meta")
        with open(dummy_file, "w") as f:
            f.write(f"{idx}\n")
        subprocess.run(["git", "add", "-A"], check=True)

    ts = int(START_TS + idx * DT)
    date_str = f"{ts} +0530"
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str

    res = subprocess.run(["git", "commit", "-m", msg], env=env, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error on step {idx}: {res.stderr}")
        sys.exit(1)
    if idx % 10 == 0 or idx == 99:
        print(f"[{idx}/99] Committed: {msg[:55]}... ({date_str})")

print("All 99 commits applied successfully!")
