# Liver Exec Tours — Website & Digital Build: Living Reference

*This file is the up-to-date status doc for the website/digital side of the business. Read it first at the start of any session working in this folder. The broader business plan (ownership transition, licensing, PAYE) lives separately in the "Liver Exec Tours" Claude Project as `business-overview-and-plan.md` — this file only covers the site, hosting, and digital assets.*

*Last updated: 2026-08-16*

## Session start protocol — confirm these every session

- **The business is real** — Liver Exec Tours, a Liverpool chauffeur company, currently sole-traded by Hugh (Joe's father), with an ownership transition to Joe underway. Nothing here is a demo/fictional project.
- **Contact details used everywhere on the site and Google Business Profile:** phone `07808 299060`, email `Liverexectours@gmail.com`. If either changes, search-and-replace across `liverexectours-site/index.html` (5+ instances) and update the WhatsApp number `447808299060` in `js/main.js`.
- **Client-naming rule:** never name Carlsberg or Boodles anywhere public-facing (site, socials, GBP). Use "trusted by leading Liverpool corporates and retail brands" instead — deliberate open decision, not an oversight.
- **This folder is the primary working location** for all website files, fleet assets, and this reference doc — supersedes anything in the Claude Project's `claude/` doc folder for *website* content specifically.
- **Hosting is manual upload to BigWetFish** (Joe's explicit choice, 2026-08-14) — not GitHub-connected auto-deploy. The GitHub repo (`github.com/letsplanorlando/Liver-Exec-Tours`) now serves two purposes: version history/backup AND a live GitHub Pages preview at `https://letsplanorlando.github.io/Liver-Exec-Tours/`. Pushing to `main` deploys to Pages automatically (GitHub Actions, see `.github/workflows/pages.yml`) but does **not** update BigWetFish. Live production deploys still go through `website-upload-guide.md`.
- **Terminal commands:** Claude can run git commits, pushes, and all shell commands directly — Joe does not need to copy/paste anything into terminal.

## 1. Current status (as of 2026-08-16)

### Design system ("Waterfront")
- **Palette:** warm ivory (`#F4EFE6`) + deep navy (`#10192B`) + brass accent (`#C4973A`) — confirmed final by Joe 2026-08-15 after reviewing 4 alternates.
- **Type:** Fraunces (serif, headings) + Work Sans (body)
- **Brass text on brass backgrounds:** always `#ffffff`

### Page structure (current)
Hero → About → Fleet → FAQ → Contact → Footer

Nav links: Home / Fleet / Contact (trimmed from 5 items)

### Hero (desktop)
- Full-bleed scroll-scrubbed video (`images/hero-scrub.mp4`) — H.264/MP4, keyframe every frame, 15fps/1440px/2.7MB, no audio
- Video scrubs with scroll via `IntersectionObserver` + `requestAnimationFrame` — never calls `.play()`, only seeks `currentTime`
- `.hero-scrub` is 250vh tall; `.hero-scrub-pin` goes `position: sticky` once JS adds `.scrub-active` after video metadata loads
- "Liver Exec Tours" title + Call/Enquire buttons fade in at 900ms (`initCinematicFadeAndHeader` in `main.js`)
- Header is hidden over the hero, fades in once scroll progress past the hero ≥ 0.99 (same rect-math as video scrub)

### Hero (mobile, ≤720px)
- Video scrub disabled entirely (`initHeroScrub` returns early on mobile — iOS Safari blocks seeking without user gesture)
- Static photo `images/hero-mobile2.jpg` shown instead — portrait shot, Vito only, Liver Building clock tower, slight colour warmth
- Photo is `position: absolute; inset: 0; object-fit: cover; object-position: center top` — completely static, no parallax or zoom
- **Critical CSS note:** `display: none` (desktop hide rule) must live inside `@media (min-width: 721px)` — if placed outside/after the mobile media query, it wins on all screens due to equal specificity + source order. This was the root cause of the photo never appearing (fixed 2026-08-16).
- Text fades in at 1200ms (same `initCinematicFadeAndHeader`, mobile delay branch)

### Hero enquiry bar
- Fields: Pickup location / Drop-off location / Date / Pickup time
- Send buttons: "Send via WhatsApp" (opens `wa.me/447808299060` deep link, pre-filled) and "Send via Email" (opens `mailto:`, pre-filled)
- **Not a live quote engine** — packages visitor input and hands it to their own WhatsApp/email client
- Note: "Not a live quote — your details go straight to us and we usually reply within 2–3 hours."
- Mobile layout: Pickup + Drop-off full width, Date + Time side-by-side, WhatsApp + Email side-by-side (4 rows total, not 6)

### About section
- Added 2026-08-16, between Hero and Fleet
- Two-column text (collapses to single column on mobile)
- Wording is placeholder — Joe said "will work on wording soon"

### FAQ section
- 5 accordion items, between Fleet and Contact
- Background: `images/faqphotomobile.jpeg` (portrait, both vehicles, full Liver Building + Port of Liverpool building)
- Background is `position: absolute; inset: 0; background-size: 100% auto; background-position: center top` — fixed scale, never rescales when an accordion item opens (earlier `height:100vh; min-height:100%` approach caused a jump on expand)
- Dark gradient overlay (`rgba(16,25,43,0.82–0.70)`)
- Questions cover: getting a quote, airports covered, max group size, flight delays, corporate clients

### Contact section
- Standard enquiry form → Supabase (if keys set) or mailto fallback
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html` are still blank → falls back to mailto

### Photography
- `images/hero-mobile2.jpg` — mobile hero (Vito + Liver Building clock tower)
- `images/hero-scrub.mp4` — desktop hero video (orbit shot of Vito outside Liver Building)
- `images/hero-poster.jpg` — first frame of video, shown before video loads
- `images/hero.jpg` — not used in hero, kept as `og:image` for social previews
- `images/fleet-vito.jpg` — Vito shot (from IMG_7489)
- `images/fleet-sprinter.jpg` — Sprinter shot (from IMG_7511)
- `images/faqphotomobile.jpeg` — FAQ background (both vehicles, full Liver Building)
- `images/story.jpg`, `images/accent-bw.jpg` — unused in current page structure (About/trust-strip sections were removed)
- **No Lexus SUV photo exists** — shows "Photo coming soon" placeholder card

## 2. File map

```
Liverexectours/
├── CLAUDE.md                         ← this file
├── website-upload-guide.md           ← BigWetFish manual-upload instructions
├── range_server.py                   ← local HTTP server with Range support (needed for video scrub testing)
│                                        Run: python3 range_server.py 8844
│                                        Then open: http://localhost:8844/liverexectours-site/
├── liverexectours-site/
│   ├── index.html                    ← full page (Hero → About → Fleet → FAQ → Contact → Footer)
│   ├── css/style.css                 ← Waterfront design system
│   ├── js/main.js                    ← nav, form, scroll-scrub, FAQ accordion, enquiry bar
│   └── images/
│       ├── hero-scrub.mp4            ← desktop hero video (scroll-scrubbed)
│       ├── hero-poster.jpg           ← video first frame / og:image fallback
│       ├── hero.jpg                  ← og:image for social previews
│       ├── hero-mobile2.jpg          ← mobile hero static photo
│       ├── fleet-vito.jpg
│       ├── fleet-sprinter.jpg
│       ├── faqphotomobile.jpeg       ← FAQ section background
│       ├── story.jpg                 ← unused (About removed)
│       └── accent-bw.jpg            ← unused (trust-strip removed)
├── Fleet photos/                     ← raw/source originals
├── supabase/enquiries.sql            ← run once in Supabase SQL editor
├── kling_...webm                     ← original AI clip (watermark visible) — reference only
├── _to_delete/                       ← safe to delete: old fleet image + merged preview files
├── .github/workflows/pages.yml       ← deploys liverexectours-site/ to GitHub Pages on push to main
└── .git/
```

## 3. Open items / next actions

- [ ] **Upload to BigWetFish** via `website-upload-guide.md` to make the site live on `liverexectours.com`. Note: guide may reference old page structure (Services/About) — verify before relying on it.
- [ ] **Fill in Supabase keys** — `SUPABASE_URL` + `SUPABASE_ANON_KEY` in `index.html` to make the contact form write to the database instead of falling back to mailto.
- [ ] **About section wording** — Joe flagged as "will work on wording soon."
- [ ] **Lexus SUV photo** — none exists; placeholder card is live. Swap in a real photo once available.
- [ ] **Google Business Profile** — postcard verification submitted ~2026-07-26. Check if code arrived and enter it.
- [ ] **Favicon** — not done yet.
- [ ] **Clean up `_to_delete/`** — safe to delete once confirmed.
- [ ] **`website-upload-guide.md` refresh** — may still describe old Services/About page structure; update to match current Hero→About→Fleet→FAQ→Contact.

## 4. Technical notes

### Local preview (video scrub needs Range requests)
Plain `python -m http.server` doesn't support HTTP Range headers — video seeking fails silently. Use:
```
cd /Users/joe/Documents/Liverexectours
python3 range_server.py 8844
```
Then open `http://localhost:8844/liverexectours-site/` in a browser.

### GitHub Pages
- URL: `https://letsplanorlando.github.io/Liver-Exec-Tours/`
- Auto-deploys on every push to `main` via `.github/workflows/pages.yml`
- Repo must be public (GitHub Pages requires public repo on free plan)
- Deploy takes ~60 seconds after push; hard-refresh on phone to clear cache

### CSS specificity trap (important)
Any rule that hides the mobile hero image (`.hero-mobile-img`) must be inside `@media (min-width: 721px)`. If written as a plain `.hero-mobile-img { display: none; }` rule anywhere after the mobile `@media (max-width: 720px)` block, it silently wins on all screen sizes due to equal specificity + source order — the image never appears on mobile.

### Video scrub mechanics
`initHeroScrub` in `main.js`: IntersectionObserver tracks when section is in view, rAF updates `video.currentTime = progress * duration` on every scroll tick. Never calls `.play()`. `scrub-active` class added to section only after `loadedmetadata` fires and duration is valid — progressive enhancement so non-JS / reduced-motion get a normal viewport-height hero with poster frame.

## 5. Session log

**2026-08-14 (earlier)** — Reconnected after a gap, found drift between Claude Project docs and actual folder state. Wrote this file as single source of truth. Rebuilt site from scratch with "Waterfront" design system (ivory/navy/brass, Fraunces + Work Sans). Joe pushed back — hadn't asked for rebuild yet, wanted to discuss first. Lesson: discuss before building on this project.

**2026-08-14 (later)** — Built scroll-scrub video hero with Kling AI clip (cropped watermark, re-encoded with keyframe-per-frame). Fixed contrast bug on Call button. Verified scroll mechanics via Range-capable local server.

**2026-08-15** — Cinematic hero iteration: title + buttons fade in over video. Fixed header-reveal bug (sentinel div at wrong scroll position — replaced with same rect-math as video scrub). Joe shared competitor site → stripped site to Hero→Fleet→Contact, removed Services/trust-strip/About. Added hero enquiry bar (WhatsApp + email, not a live quote engine). Iterated palette — confirmed navy/ivory/brass. Brass updated to `#C4973A`. Phone number updated to `07808 299060`.

**2026-08-16** — Mobile optimisation pass: set up GitHub Pages (public repo, Actions workflow), added About section, FAQ section (5 accordion items, landscape photo background), mobile hero swapped to static photo. Fixed long-running mobile hero bug: `display: none` rule was placed after the mobile media query in style.css — equal specificity, last rule won, image permanently hidden on all screens. Moved hide rule into `@media (min-width: 721px)`. Fixed FAQ background jump on accordion expand: switched from `height:100vh; min-height:100%` to `inset:0; background-size:100% auto`. Reduced hero content size significantly (title, buttons, enquiry bar). Made mobile enquiry bar compact: Date + Time side-by-side, WhatsApp + Email side-by-side. Established that Claude runs git/terminal commands directly — Joe doesn't need to copy-paste.
