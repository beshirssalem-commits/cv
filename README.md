# Beshir Saad Salem — Interactive Engineering Portfolio

A fully static, single-page portfolio website for **Beshir Saad Salem**, Instrumentation & Control Specialist and Acting Head of Instrumentation Division at RASCO (Ras Lanuf Oil & Gas Processing Company). Built with plain HTML5, CSS3, and vanilla JavaScript — no build step, no framework, no dependencies — so it deploys directly on GitHub Pages.

**Live site:** https://beshirssalem-commits.github.io/cv/

---

## 1. What's in this repo

```
cv/
├── index.html              ← all page content & structure
├── style.css                ← all styling (dark/light theme, layout, animation)
├── script.js                 ← all interactivity (typing effect, counters, modal, etc.)
├── assets/
│   ├── images/
│   │   └── profile.png      ← your headshot, used in the hero section
│   └── Beshir_Saad_Salem_CV.pdf   ← the file the "Download CV" button links to
└── README.md                 ← this file
```

There is no build process. Whatever is in these files is exactly what GitHub Pages will serve.

---

## 2. Deploying on GitHub Pages

You already have the repository: `beshirssalem-commits/cv`.

1. Push (or upload) all the files in this folder to the **root** of the `main` branch of that repository — `index.html` must sit at the repo root (not inside a subfolder), exactly as it does here.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
5. Wait 1–2 minutes. Your site will be live at:
   `https://beshirssalem-commits.github.io/cv/`

That's it — no GitHub Actions, no Jekyll config, nothing else needed. Every time you push a change to `main`, the live site updates automatically within a minute or two.

---

## 3. How to update your content later

Everything is commented in plain language so you (or anyone) can update it without touching the design.

### Update your photo
Replace `assets/images/profile.png` with a new image of the **same filename** (or update the `src` in `index.html` inside the `<header class="hero">` section, in the `<img class="hero-photo">` tag).

### Update text content (name, bio, job history, contact info, etc.)
Open `index.html`. The file is organized into clearly labeled sections with HTML comments, e.g.:
```html
<!-- ============ HERO ============ -->
<!-- ============ ABOUT ============ -->
<!-- ============ EXPERIENCE TIMELINE ============ -->
<!-- ============ CONTACT ============ -->
```
Find the section you want to change and edit the text directly. No JavaScript knowledge needed for this.

### Update Major Projects
Projects are stored as structured data in `script.js`, near the top, in a comment block labeled:
```js
/* MAJOR PROJECTS — DATA (edit this array to add/remove projects) */
const projects = [ { tag: ..., title: ..., overview: ..., responsibilities: [...], ... }, ... ];
```
Copy an existing project object, edit the fields, and add it to the array (or delete one to remove a project). The website automatically builds the project cards and the pop-up detail view from this array — you never need to touch HTML or CSS for this.

### Update Professional Courses
Same pattern, in `script.js`:
```js
/* PROFESSIONAL COURSES — DATA (edit this array to add/remove) */
const courses = [ "Course name 1", "Course name 2", ... ];
```
Add, remove, or rename entries in this list.

### Update your CV file (Download CV button)
Replace `assets/Beshir_Saad_Salem_CV.pdf` with a new PDF of the **same filename** — the "Download CV" button in the hero section and the navigation bar will always point to that path. If you rename the file, update the `href="assets/...”` attribute in `index.html` (there are two `<a>` tags with `download` attributes — one in the nav bar, one in the hero).

### Update LinkedIn / GitHub links
At the bottom of `script.js`, in the section labeled `SOCIAL LINKS`, set:
```js
document.getElementById('linkedinLink').href = 'https://linkedin.com/in/your-actual-profile';
```
The GitHub link is already pointed at this repository.

### Light / dark mode
The site defaults to dark mode (matching the instrumentation/SCADA aesthetic) and includes a toggle in the top-right of the navigation bar. No setup needed — it works automatically.

---

## 4. Design notes

The visual language is deliberately drawn from the subject's own field: process & instrumentation diagrams (P&ID), SCADA/HMI dashboards, and analog instrument tag numbering (e.g. `PT-2104`, `GC-8000`). Specific choices:

- **Color:** dark navy/steel background with a cyan "signal" accent and amber/green status indicators — a control-room palette, not a generic tech-startup gradient.
- **Typography:** Space Grotesk for display headings, Inter for body copy, and JetBrains Mono for anything that reads like instrument data (tag numbers, dates, labels) — separating "engineering data" from "narrative text" the way a real HMI screen does.
- **Signature element:** instrument-style tag chips (e.g. the floating `PAI-101` / `IC-2007` labels next to the hero photo, and the tag numbers on each analyzer card) — borrowed directly from how instrumentation engineers label real equipment on a P&ID.
- **Motion:** a slow animated multi-line "signal trace" in the hero background, a timeline rail that fills as you scroll (literally tracing the career signal), and restrained hover/reveal animations elsewhere. Animation respects `prefers-reduced-motion`.

## 5. Browser support & performance

- Fully responsive from ~320px mobile widths up through large desktop monitors.
- No external JS frameworks — total page weight is small and loads fast.
- Google Fonts are loaded via `<link>` with `preconnect`; if you'd prefer fully offline/self-hosted fonts, download the three font families and update the `<link>` tags in `index.html` plus the `@font-face` setup in `style.css`.
- Keyboard navigation and focus states are supported throughout (nav, project cards, modal, copy buttons).

---

Questions or want a section added (e.g. testimonials, a blog, a downloadable project gallery)? Everything here is plain HTML/CSS/JS, so any web developer — or Claude, again — can extend it without re-architecting anything.
