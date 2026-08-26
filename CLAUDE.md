# Liver Exec Tours — Website & Digital Build: Living Reference

*This file is the up-to-date status doc for the website/digital side of the business. Read it first at the start of any session working in this folder. The broader business plan (ownership transition, licensing, PAYE) lives separately in the "Liver Exec Tours" Claude Project as `business-overview-and-plan.md` — this file only covers the site, hosting, and digital assets.*

*Last updated: 2026-08-26*

## Session start protocol — confirm these every session

- **The business is real** — Liver Exec Tours, a Liverpool chauffeur company, currently sole-traded by Hugh (Joe's father), with an ownership transition to Joe underway. Nothing here is a demo/fictional project.
- **Contact details used on the site:** phone `07808 299060`, email `info@liverexectours.com` (a BigWetFish cPanel forwarder set up 2026-08-25, landing in `liverexectours@gmail.com` — the inbox actually checked). If the phone changes, search-and-replace across `liverexectours-site/index.html` and update the WhatsApp number `447808299060` in `js/main.js`. If the email changes, update `index.html` (contact section + footer, 2 instances) and `js/main.js` (contact-form mailto fallback + hero enquiry bar `EMAIL_ADDRESS`, 2 instances). **Google Business Profile** was not part of this change and may still list `liverexectours@gmail.com` directly — check/update it separately if you want it to match.
- **Client-naming rule:** never name Carlsberg, Boodles, Liverpool Football Club, or Pulse Model Agency anywhere public-facing (site, socials, GBP). Use "trusted by leading Liverpool corporates and retail brands" instead — deliberate decision, reaffirmed 2026-08-26 when Joe drafted About-section copy naming all four and chose to anonymise rather than carve out exceptions.
- **This folder is the primary working location** for all website files, fleet assets, and this reference doc — supersedes anything in the Claude Project's `claude/` doc folder for *website* content specifically.
- **Hosting is manual upload to BigWetFish** (Joe's explicit choice, 2026-08-14) — not GitHub-connected auto-deploy. The GitHub repo (`github.com/letsplanorlando/Liver-Exec-Tours`) now serves two purposes: version history/backup AND a live GitHub Pages preview at `https://letsplanorlando.github.io/Liver-Exec-Tours/`. Pushing to `main` deploys to Pages automatically (GitHub Actions, see `.github/workflows/pages.yml`) but does **not** update BigWetFish. Live production deploys still go through `website-upload-guide.md`.
- **Terminal commands:** Claude can run git commits, pushes, and all shell commands directly — Joe does not need to copy/paste anything into terminal.

## 1. Current status (as of 2026-08-26)

### Design system ("Waterfront")
- **Palette (updated 2026-08-26):** porcelain (`#F5F5F5`) + gunmetal (`#2A2A2A`) + champagne accent (`#D4C5A9`) — swapped in from Joe's "Palette 03: Gunmetal & Champagne" brand-system file (kept as `liver-exec-palette-03.html` in the project root, not the deployable site folder). Same CSS variable names as before (`--navy`, `--ivory`, `--brass`, etc. in `style.css`), just repointed to new hex values — see the full mapping in the 2026-08-26 session log entry below.
  - Previous palette (superseded): warm ivory (`#F4EFE6`) + deep navy (`#10192B`) + brass (`#C4973A`), confirmed 2026-08-15.
- **Type:** unchanged — Fraunces (serif, headings) + Work Sans (body) + Playfair Display SC (hero/nav wordmark). The palette file also suggested Georgia + Helvetica Neue, but that wasn't part of what Joe asked to change, so fonts were deliberately left alone.
- **Text on `--brass` (champagne) fill backgrounds:** must be dark (`--navy`), not white — champagne is much lighter than the old brass and white text on it is close to unreadable. `.btn-primary` uses `color: var(--navy)` normally, flipping to `color: var(--white)` only in `:hover` once the background itself flips to `--navy`. Champagne as a *text* colour (eyebrows, accents on both light and dark backgrounds) is unaffected — that pattern is lifted directly from the palette file's own card-eyebrow example.

### Page structure (current)
Hero → About → Fleet → FAQ → Contact → Footer

Nav links: Home / Fleet / Contact (trimmed from 5 items)

### Hero (desktop)
- Full-bleed scroll-scrubbed video (`images/hero-scrub.mp4`) — H.264/MP4, keyframe every frame, 15fps/1440px/2.7MB, no audio
- Video scrubs with scroll via `IntersectionObserver` + `requestAnimationFrame` — never calls `.play()`, only seeks `currentTime` (`initHeroScrub` in `main.js`)
- `.hero` becomes `200vh` tall once JS adds `.is-scrubbing` (after video metadata loads); `.hero-pin` goes `position: sticky` at that point. Shortened from `250vh` on 2026-08-25 so less scrolling is needed to finish the video.
- Title ("Liver Exec Tours") + Call/Enquire buttons + the enquiry box all fade in **together** at 900ms (`initHeroReveal` in `main.js`) — desktop deliberately kept this single simultaneous fade; only mobile got staged (see below).
- Header is hidden over the hero, fades in once scroll progress past the hero ≥ 0.99 (`initHeaderReveal`, same rect-math as the video scrub)

### Hero (mobile, ≤720px)
- Video scrub disabled entirely (`initHeroScrub` returns early on mobile — iOS Safari blocks seeking without user gesture)
- Static photo `images/hero-mobile2.jpg` shown instead — portrait shot, Vito only, Liver Building clock tower, slight colour warmth
- Photo is `position: absolute; inset: 0; object-fit: cover; object-position: center top` — completely static, no parallax or zoom
- **Critical CSS note:** `display: none` (desktop hide rule) must live inside `@media (min-width: 721px)` — if placed outside/after the mobile media query, it wins on all screens due to equal specificity + source order. This was the root cause of the photo never appearing (fixed 2026-08-16).
- **Rebuilt 2026-08-25 as three staged fades** (`initHeroReveal` in `main.js`): photo at 200ms → title block ("LET" wordmark + Call/Enquire buttons) at 1100ms → enquiry box at 1900ms. Each is its own element sharing a `.hero-reveal`/`.is-visible` opacity transition, replacing the old single "everything fades in at once" behaviour.
- Title on mobile reads **"LET"** (Playfair Display SC, heavily letter-spaced), not the full "Liver Exec Tours" — the full name doesn't fit/space well at mobile widths. The `<h1>` carries `aria-label="Liver Exec Tours"` so screen readers still get the full name regardless of which inner span (`.hero-title-full` / `.hero-title-mark`) is visible at the current breakpoint.

### Hero enquiry bar
- Fields: Pickup location / Drop-off location / Date / Pickup time
- Send buttons: "Send via WhatsApp" (opens `wa.me/447808299060` deep link, pre-filled) and "Send via Email" (opens `mailto:info@liverexectours.com`, pre-filled) — tested live 2026-08-25, both build correct links but **neither auto-sends**; they hand the pre-filled message off to the visitor's own WhatsApp/email app, which the visitor still has to hit send in.
- **Not a live quote engine** — packages visitor input and hands it to their own WhatsApp/email client
- Note: "Not a live quote — your details go straight to us and we usually reply within 2–3 hours."
- Mobile layout: Pickup + Drop-off full width, Date + Time side-by-side, WhatsApp + Email side-by-side (4 rows total, not 6)
- Send buttons are centred as a pair, field labels solid white at 0.75rem (both fixed 2026-08-25 — buttons were left-aligned, labels were a dim translucent ivory at 0.68rem)

### About section
- Added 2026-08-16 (placeholder wording), **rewritten with real copy 2026-08-26**
- `.about-cols` now holds two wrapper `<div>`s (2 paragraphs left, 3 right) rather than bare `<p>` siblings, so multi-paragraph columns stack correctly — still collapses to one column on mobile
- Covers: 20+ years' experience, client base (specific client names anonymised per the client-naming rule above), service range (executive/corporate/long-distance/airport transfers, explicitly UK-wide including regular London journeys), fleet summary, closing line

### FAQ section
- 5 accordion items, between Fleet and Contact
- Background: `images/faqphotomobile.jpeg` (portrait, both vehicles, full Liver Building + Port of Liverpool building)
- Background is `position: absolute; inset: 0; background-size: 100% auto; background-position: center top` — fixed scale, never rescales when an accordion item opens (earlier `height:100vh; min-height:100%` approach caused a jump on expand)
- Dark gradient overlay, `rgba(42,42,42,0.82–0.70)` (gunmetal — updated 2026-08-26 from the old navy `rgba(16,25,43,…)`)
- Questions cover: getting a quote, airports covered (**broadened 2026-08-26** to UK-wide transfers + regular London trips, was Liverpool John Lennon/Manchester/Leeds Bradford only), max group size, flight delays, corporate clients

### Contact section
- Standard enquiry form → Supabase (if keys set) or mailto fallback
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html` are still blank → falls back to mailto
- "Service area" text **broadened 2026-08-26** to explicitly cover UK-wide long-distance/airport transfers and regular London trips, alongside the core North West list (Liverpool, Wirral, Sefton, Knowsley, St Helens, Manchester)

### Footer
- Geography wording simplified 2026-08-26 to "Liverpool and the North West" (was "Liverpool, Merseyside, and Manchester" / "Liverpool & Merseyside" across three spots) to match the About section's phrasing. The `<meta name="description">`/`og:description` tags and the FAQ "corporate clients" answer still say "Merseyside" — deliberately left alone, out of scope for that request.

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
├── range_server.py                   ← local HTTP server: Range support (video scrub) + /__save endpoint (visual editor)
│                                        Run: python3 range_server.py 8844
│                                        Then open: http://localhost:8844/liverexectours-site/
│                                        Add ?edit=1 to the URL for click-to-edit text mode (see § Technical notes)
├── liverexectours-site/
│   ├── index.html                    ← full page (Hero → About → Fleet → FAQ → Contact → Footer)
│   ├── css/style.css                 ← Waterfront design system
│   ├── js/main.js                    ← nav, form, scroll-scrub, FAQ accordion, enquiry bar
│   ├── js/edit-mode.js               ← click-to-edit visual editor (localhost + ?edit=1 only, inert in production)
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

- [ ] **Upload to BigWetFish** via `website-upload-guide.md` to make the site live on `liverexectours.com` — the 2026-08-25/26 work (hero rebuild, visual editor, new palette, About rewrite, FAQ/Contact/footer wording) is pushed to GitHub (commits `764aecf`/`014d680`, live on the Pages preview) but **not** on the real production site yet — that still needs a manual BigWetFish upload.
- [ ] **Fill in Supabase keys** — `SUPABASE_URL` + `SUPABASE_ANON_KEY` in `index.html` to make the contact form write to the database instead of falling back to mailto.
- [ ] **Lexus SUV photo** — none exists; placeholder card is live. Swap in a real photo once available.
- [ ] **Google Business Profile** — postcard verification submitted ~2026-07-26; check if the code arrived. Also still shows the old `Liverexectours@gmail.com` (not updated when the site switched to `info@liverexectours.com`) and doesn't reflect the About section's UK-wide/London language — worth a look for consistency once the core verification is sorted.
- [ ] **Favicon** — not done yet.
- [ ] **Clean up `_to_delete/`** — safe to delete once confirmed.
- [ ] **GitHub remote has a personal access token embedded in the URL** (visible in `.git/config`) — works, but flagged to Joe 2026-08-26 as worth moving to a safer credential setup (SSH key, or a git credential manager) at some point. No action taken; his call.

## 4. Technical notes

### Local preview (video scrub needs Range requests)
Plain `python -m http.server` doesn't support HTTP Range headers — video seeking fails silently. Use:
```
cd /Users/joe/Documents/Liverexectours
python3 range_server.py 8844
```
Then open `http://localhost:8844/liverexectours-site/` in a browser.

### Visual editor (click-to-edit text)
Added 2026-08-25. With `range_server.py` running, open `http://localhost:8844/liverexectours-site/?edit=1` — a "Save changes" bar appears bottom-right and headings/paragraphs/list items/FAQ answers get a dashed outline on hover. Click any of them and type directly; press Enter to finish editing (it blurs rather than inserting a line break). Click **Save changes** to write edits straight into `liverexectours-site/index.html`.

- Gated to `localhost`/`127.0.0.1` + `?edit=1` in `js/edit-mode.js` — inert everywhere else, safe to leave in the shipped site.
- Excluded from editing (by design): the hero (title/buttons/enquiry form — too much responsive/JS special-casing), anything inside a `<form>`, FAQ question text (shares markup with the `+`/`×` icon span), and the footer copyright year.
- Save works by matching each edited element's *old* text as an exact, unique substring of `index.html` and swapping in the new text — if that exact text appears more than once (or was already changed elsewhere) it'll report that edit as failed rather than guess wrong. Reload the page to get a fresh baseline if that happens.
- Every successful save writes `liverexectours-site/index.html.bak` (previous version, gitignored) as a one-step-back safety net before overwriting.
- Side effect: on save, the whole file's `&mdash;/&ndash;/&rsquo;/&amp;`-style HTML entities get normalized to literal characters (needed so saved text matches what contenteditable reports). Purely cosmetic in the source — renders identically — but don't be surprised by a bigger-than-expected diff after using it.

### GitHub Pages
- URL: `https://letsplanorlando.github.io/Liver-Exec-Tours/`
- Auto-deploys on every push to `main` via `.github/workflows/pages.yml`
- Repo must be public (GitHub Pages requires public repo on free plan)
- Deploy takes ~60 seconds after push; hard-refresh on phone to clear cache

### CSS specificity trap (important)
Any rule that hides the mobile hero photo (`.hero-photo-mobile`, renamed from `.hero-mobile-img` in the 2026-08-25 hero rebuild) must be inside `@media (min-width: 721px)`. If written as a plain `.hero-photo-mobile { display: none; }` rule anywhere after the mobile `@media (max-width: 720px)` block, it silently wins on all screen sizes due to equal specificity + source order — the image never appears on mobile.

### Video scrub mechanics
`initHeroScrub` in `main.js`: IntersectionObserver tracks when section is in view, rAF updates `video.currentTime = progress * duration` on every scroll tick. Never calls `.play()`. `is-scrubbing` class (renamed from `scrub-active` in the 2026-08-25 hero rebuild) added to `.hero` only after `loadedmetadata` fires and duration is valid — progressive enhancement so non-JS / reduced-motion get a normal viewport-height hero with poster frame. Runway is `250vh` → shortened to `200vh` on 2026-08-25 so the video finishes scrubbing with less scroll distance.

## 5. Session log

**2026-08-14 (earlier)** — Reconnected after a gap, found drift between Claude Project docs and actual folder state. Wrote this file as single source of truth. Rebuilt site from scratch with "Waterfront" design system (ivory/navy/brass, Fraunces + Work Sans). Joe pushed back — hadn't asked for rebuild yet, wanted to discuss first. Lesson: discuss before building on this project.

**2026-08-14 (later)** — Built scroll-scrub video hero with Kling AI clip (cropped watermark, re-encoded with keyframe-per-frame). Fixed contrast bug on Call button. Verified scroll mechanics via Range-capable local server.

**2026-08-15** — Cinematic hero iteration: title + buttons fade in over video. Fixed header-reveal bug (sentinel div at wrong scroll position — replaced with same rect-math as video scrub). Joe shared competitor site → stripped site to Hero→Fleet→Contact, removed Services/trust-strip/About. Added hero enquiry bar (WhatsApp + email, not a live quote engine). Iterated palette — confirmed navy/ivory/brass. Brass updated to `#C4973A`. Phone number updated to `07808 299060`.

**2026-08-16** — Mobile optimisation pass: set up GitHub Pages (public repo, Actions workflow), added About section, FAQ section (5 accordion items, landscape photo background), mobile hero swapped to static photo. Fixed long-running mobile hero bug: `display: none` rule was placed after the mobile media query in style.css — equal specificity, last rule won, image permanently hidden on all screens. Moved hide rule into `@media (min-width: 721px)`. Fixed FAQ background jump on accordion expand: switched from `height:100vh; min-height:100%` to `inset:0; background-size:100% auto`. Reduced hero content size significantly (title, buttons, enquiry bar). Made mobile enquiry bar compact: Date + Time side-by-side, WhatsApp + Email side-by-side. Established that Claude runs git/terminal commands directly — Joe doesn't need to copy-paste.

**2026-08-25** — Joe felt the site had gotten "vibecoded" and asked for a reset, mainly of the mobile hero. Asked clarifying questions first (learned from the 08-14 lesson) before touching code. Agreed scope: whole page simplified in a fresh rebuild, desktop hero/video kept exactly as-is, mobile hero rebuilt as three staged fades — photo, then a new "LET" wordmark (Playfair Display SC, replaces the full title on mobile since it doesn't fit/space well) + Call/Enquire buttons, then the enquiry box. Renamed the hero's CSS/JS hooks for clarity (`hero-scrub`→`hero`, `hero-mobile-img`→`hero-photo-mobile`, `scrub-active`→`is-scrubbing`, etc. — see the two technical-notes entries above) and deleted dead CSS left over from earlier redesigns (`.trust-strip`, `.quote-band*`, `.service-row*`, `.about-grid`/`.about-photo`). Follow-up fixes from Joe reviewing the result: centred the hero enquiry box's send buttons, made its field labels solid white and slightly bigger, shortened the video-scrub runway 250vh→200vh, made the hero title one uniform white (dropped the brass-accent split on "Tours") and bumped its size. Set up an `info@liverexectours.com` → `liverexectours@gmail.com` forwarder on BigWetFish (Joe did the cPanel side) and switched the site's displayed/mailto email from the Gmail address to `info@liverexectours.com` to match. Tested the hero's WhatsApp/email buttons live — both build correct links, but neither auto-sends; they hand off to the visitor's own WhatsApp/email app. Built a scoped visual editor (`js/edit-mode.js` + a `/__save` endpoint added to `range_server.py`): open `http://localhost:8844/liverexectours-site/?edit=1`, click any heading/paragraph/list item/FAQ answer to edit it in place, click "Save changes" to write straight into `index.html` (auto-backs-up to `index.html.bak` first). Gated to localhost, inert in production. See § Technical notes for what it can't edit and why.

**2026-08-26** — Joe dropped a new brand-system reference file (`liver-exec-palette-03.html`, "Gunmetal & Champagne") into the site folder and asked to update the site to it. Found it by checking recently-modified files rather than asking where it was. Applied the colour swap only (fonts left alone — the file also suggested Georgia/Helvetica Neue, but Joe asked for "colour palette" specifically, and the recent Playfair Display SC change was a deliberate separate decision). Mapping: navy→gunmetal `#2A2A2A`, ivory→porcelain `#F5F5F5`, brass→champagne `#D4C5A9`, ink→ash `#4A4A4A`, grey→smoke `#6E6E6E`; `ivory-dark`, `navy-light`, `brass-light`, `grey-light`, and the fleet-placeholder stripe colour don't exist in the reference file so were derived (documented in the Design system section above). Caught and fixed a real contrast bug the swap would otherwise have introduced: champagne is much lighter than the old brass, so `.btn-primary`'s white-on-brass text pattern would have been nearly unreadable on champagne — flipped to dark text normally, white only in `:hover` once the background flips to gunmetal. Also swept ~26 hardcoded `rgba(16,25,43,…)` / `rgba(244,239,230,…)` literals (overlays, glass-effect borders, translucent text) that bypassed the CSS variables and would otherwise have stayed visually tied to the old palette. Moved the reference file itself out of `liverexectours-site/` (the deployable folder) so it can't accidentally ship as a public page. Verified the result via computed styles and screenshots on both breakpoints rather than just eyeballing the CSS diff.

Joe then drafted new About-section copy and asked how it sounded. It named Carlsberg, Liverpool FC, Boodles, and Pulse Model Agency directly — caught the conflict with the standing client-naming rule (which only explicitly covered Carlsberg/Boodles before) and asked rather than either blindly complying or blindly stripping the names. Joe chose to keep all four anonymised, so the rule above now explicitly covers all four. The copy also claimed UK-wide airport transfers and regular London trips, broader than the existing FAQ/Contact text — Joe confirmed broadening those to match. Implemented: new About copy (anonymised, two wrapper-`<div>` columns), FAQ airports answer and Contact "Service area" both broadened to UK-wide/London, footer geography simplified to "Liverpool and the North West" in the three spots that mention it. Did a full pass over this file afterwards (prompted by Joe wanting a clean handoff to a fresh chat) and found the Hero/About/FAQ/Contact "Current status" write-ups still described pre-2026-08-25 mechanics (old class names, old rgba values, "wording is placeholder") — rewrote those sections to match current reality rather than just appending new facts on top of stale ones.
