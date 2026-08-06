# RVCE Clubs Discovery Platform

An immersive, data-driven 3D club discovery experience for first-year engineering students during Induction 2026 at R.V. College of Engineering. Built on the motion language, GSAP 3D card engine, and ambient design philosophy of **MyShaky Picks**.

## Features

- **Data-Driven Architecture:** Powered completely by `clubs/clubs.csv` (or `data/clubs.csv`) and local asset folders. Zero code changes required to add, remove, or modify clubs.
- **Dynamic Folder-Based Logo Resolver:** Simply place `logo.png`, `logo.jpg`, `logo.jpeg`, `logo.webp`, or `logo.svg` inside `clubs/<club-folder>/` or `assets/logos/` — the system automatically detects and displays it!
- **Center RVCE Logo Support:** Place your official college logo in `assets/rvce-logo.png` (or `.jpg`, `.svg`) to display it inside the center of the 3D wheel, with automatic vector crest fallback!
- **3D Card Explorer:** Floating 3D card sphere displaying club logos with smooth perspective tilt, hover effects, and signature MyShaky 3D wheel spin-and-reveal animation.
- **Interactive Category Filtering:** Choose between **Technology Clubs** and **Non-Technical Clubs** with full-screen interactive panels.
- **Fullscreen Club Detail Experience:** Click any club card to trigger a cinematic card spin-and-reveal transition into a fullscreen detail page featuring:
  - Club Logo & Tagline
  - Venue & Category Badges
  - About Club Description
  - Flagship Events & Activities (parsed from semicolon-separated CSV string)
  - Life at Club Photo Gallery (auto-discovered from `/assets/gallery/<folder>/`)
  - Social Links (Instagram, LinkedIn, Website, Email)
  - Previous / Next navigation controls to browse clubs without leaving detail mode.
- **Ambient Design:** Dynamic rotating background glow spinner blobs, custom typography (`Playfair Display`, `Inter`, `Fraunces`, `Comfortaa`), and 60 FPS mobile-first performance.

---

## Directory Structure for Logos & Data

```text
c:/Hacks/club_dash/
├── index.html                # Entry point and HTML layout
├── css/
│   └── picks.css             # Main styling, ambient glow, 3D card layout & club detail page
├── js/
│   └── picks.js              # Core app logic: PapaParse CSV loader, GSAP 3D ring & card detail page
├── clubs/
│   ├── clubs.csv             # Primary CSV dataset
│   ├── gdg-rvce/
│   │   └── logo.png          # Drop logo here (PNG, JPG, JPEG, WEBP, or SVG)
│   ├── project-jatayu/
│   │   └── logo.png
│   ├── coding-club-rvce/
│   │   └── logo.png
│   └── ... (folders created for all 30 clubs)
└── assets/
    ├── rvce-logo.png         # Drop your college logo here!
    ├── logos/                # Alternative logos folder
    └── gallery/              # Photo gallery folders per club (e.g. /gdg-rvce/1.jpg, 2.jpg)
```

---

## How to Add Logos & Updates

### 1. Adding a Club Logo:
For any club (e.g., `gdg-rvce`):
- Place its logo named `logo.png` (or `logo.jpg`, `logo.jpeg`, `logo.webp`, `logo.svg`) inside **`clubs/<folder_name>/`** (e.g. `clubs/gdg-rvce/logo.png`).
- Alternatively, place it in `assets/logos/<folder_name>/logo.png` or `assets/logos/<filename>`.
- If no logo image file is found, the platform automatically renders a sharp vector initials badge (`GDG`, `PJ`, `CCR`, etc.).

### 2. Adding the RVCE College Logo:
- Drop your official RVCE logo image in **`assets/rvce-logo.png`** (or `.jpg`, `.svg`). It will immediately render inside the center of the 3D wheel!

---

## How to Run Locally

### Method 1: Using Python (Recommended)
Run the following command from the project root:

```bash
python -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Method 2: VS Code Live Server
Right-click `index.html` in VS Code and select **Open with Live Server**.
