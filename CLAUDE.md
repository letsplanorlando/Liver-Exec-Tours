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
- **Type:** Fraunces (serif, sub-headings/body headings) + Work Sans (body) + Playfair Display SC (hero title + nav wordmark specifically — unchanged) + **Mukta (added 2026-08-26)** for the five main section `<h2>`s only (About/Fleet/Book/FAQ/Contact) — new `--headline` CSS variable in `style.css`, applied via a `h2 { font-family: var(--headline); }` rule after the general `h1,h2,h3,h4` rule. Sub-headings (wizard step titles, fleet/vehicle card names, contact item labels — all `h3`/`h4`) deliberately still use Fraunces, not Mukta — "each section headline" was read narrowly as the top-level `<h2>`s only. The palette file (2026-08-26, colour change) also suggested Georgia + Helvetica Neue at the time, which was deliberately left alone then — the Mukta change is unrelated, a separate later request.
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
├── google-maps-api-setup-guide.md    ← steps for Joe to get a Maps API key for booking-example.html (see § Open items)
├── set-maps-key.py                   ← run: python3 set-maps-key.py — prompts for the Maps key (hidden input) and writes it into booking-example.html, so it never has to go through chat
├── range_server.py                   ← local HTTP server: Range support (video scrub) + /__save endpoint (visual editor)
│                                        Run: python3 range_server.py 8844
│                                        Then open: http://localhost:8844/liverexectours-site/
│                                        Add ?edit=1 to the URL for click-to-edit text mode (see § Technical notes)
├── liverexectours-site/
│   ├── index.html                    ← full page (Hero → About → Fleet → FAQ → Contact → Footer)
│   ├── booking-example.html          ← PROTOTYPE, not linked from index.html — 4-step booking wizard, see § Open items
│   ├── css/style.css                 ← Waterfront design system
│   ├── css/booking-example.css       ← styles for the booking wizard prototype only
│   ├── js/main.js                    ← nav, form, scroll-scrub, FAQ accordion, enquiry bar
│   ├── js/edit-mode.js               ← click-to-edit visual editor (localhost + ?edit=1 only, inert in production)
│   ├── js/booking-example.js         ← booking wizard logic + gated Google Maps integration
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

- [x] **Booking flow — built into `index.html`, live on the GitHub Pages preview** — `#book` section between Fleet and FAQ (see § Page structure and § Technical notes below for the full build). "Book Now" in header/footer/mobile nav; "Contact" deliberately still points at the simple form. Pushed 2026-08-26/27; BigWetFish upload still outstanding (see top of this list).
  - **2026-08-27 follow-ups, all shipped:** (1) Airport-transfer "Both" fields reordered/regrouped into explicit "Outbound journey" / "Return journey" blocks per Joe's spec — Date/Pickup time are no longer a single field-row shared across all three trip types; each trip type (`oneway`/`airport`/`hourly`) now has its own date/time fields living inside its own panel. (2) Fixed `<gmp-place-autocomplete>` rendering as a solid black box — it uses a closed shadow root and was defaulting to the OS/browser dark-mode preference; fixed with `color-scheme` + explicit `background-color`/`border` directly on the element (officially-supported hooks, no shadow-piercing needed) — light theme for the Book section, a separate dark/glassmorphic variant (`.hero-address-input`) for the hero. (3) Fixed autocomplete showing worldwide results (Joe saw India/Australia) — the `componentRestrictions` property from the *legacy* Autocomplete class doesn't exist on `PlaceAutocompleteElement`; replaced with the correct `includedRegionCodes = ['gb']` + `locationBias` (a circle — caught a real bug here too: Google caps `locationBias.radius` at 50,000m and the first attempt used 60,000, which silently 400'd *every* prediction request until fixed; now 45,000m centred on Liverpool). (4) Live address autocomplete extended to the hero enquiry bar's Pickup/Drop-off fields too (previously Book-section-only) — on selection it writes the chosen address back into the original (now-hidden) plain `<input>`'s `.value`, so `main.js`'s existing WhatsApp/email message-building code needed zero changes.
- [ ] **Homepage "Latest Updates" blog teaser — under consideration, not decided** — Joe's friend has a blog set up on his own chauffeur competitor site (DB Executive Chauffeur Services) for SEO; turned out to be a homepage teaser grid (3 latest posts, image + short excerpt, linking to full articles) rather than a prominent nav item — Joe found it by looking, wasn't obviously visible at first. Discussed as a bounded, scoped project rather than an ongoing commitment: a handful of evergreen, service-specific posts (airport transfers, golf transport, event/hourly hire, corporate travel) written once, plus a teaser section on the homepage — not a "must keep publishing" blog. Competitor's teaser images look AI-generated/stock-illustrated rather than real photography, which would keep this low-effort if pursued. **Ranked below GBP completion and getting the real site live on BigWetFish** in priority — Joe hasn't said whether to proceed, next step if he does is roughing out 3–4 post topics.
- [ ] **Google reviews floating badge — Joe likes it, explicitly deferred ("sort that another time")** — noticed in the same competitor screenshot as the blog teaser: a floating widget showing Google rating + review count (their example: "5.0★, Based on 70 reviews"). Liver Exec Tours doesn't currently show any review/rating trust signal anywhere on the site. Not scoped or discussed further yet — parked until Joe raises it again. Would need real review data (Google Business Profile review count/rating, once that's fully set up — see the GBP item above) rather than placeholder numbers.
- [x] **Booking flow prototype — Maps integration now fully working end-to-end** — `liverexectours-site/booking-example.html` (+ `css/booking-example.css`, `js/booking-example.js`), built 2026-08-26, not linked from `index.html` or live anywhere. Full 4-step wizard (Journey → Vehicle → Passenger → Confirm) inspired by a competitor's booking engine Joe found, scoped down per his call: no live pricing, no payment — ends in the same WhatsApp/email hand-off pattern as the hero enquiry bar. Joe reviewed and confirmed the flow/vehicle/passenger/confirm steps as built, then two follow-ups were added: a third airport "Both — depart and return" option with its own return date/time/flight-number fields, and the airport dropdown split into a "Commercial" group (Liverpool John Lennon, Manchester by Terminal 1/2/3, Leeds Bradford, Heathrow) and a "Private aviation" group (Liverpool — Ravenair, Manchester — Signature Flight Support) plus "Other UK airport". Live address autocomplete and the route-preview map (Google's current `PlaceAutocompleteElement`/`importLibrary` JS API) are working and tested for real — typed addresses return live predictions, selecting pickup + drop-off draws an actual route with accurate distance/time (verified: Liverpool John Lennon → Manchester Airport = 30.5 miles / 43 mins). Still gated behind a blank `window.GOOGLE_MAPS_API_KEY` fallback (same pattern as the Supabase keys) if the key ever needs blanking again. **Turned out the whole debugging saga was a wrong-project problem**: the key Joe originally generated lived in a Google Cloud project under a different/uncertain account, while the actual `liver-exec-tours` project under the correct `liverexectours@googlemail.com` account (Hugh's account — note the legacy UK `.googlemail.com` domain, not `.gmail.com`) had zero billing account and zero API keys the whole time. Fixed by working directly in Hugh's live, logged-in Chrome (with permission) once he connected it: linked his newly-created billing account to the correct project, enabled the 3 needed APIs there, and built a fresh correctly-restricted key (3 APIs: Maps JavaScript, Places (New), Directions; website restrictions `http://localhost:8844/*`, `https://liverexectours.com/*`, `https://www.liverexectours.com/*`, plus `https://letsplanorlando.github.io/*` added 2026-08-27 so Maps also works on the GitHub Pages preview Joe checks on his phone) — all done via clicking through the real Console UI rather than relaying typed instructions, which is what had caused the earlier typo/missing-wildcard mistakes. New key is live in `booking-example.html`. Only remaining follow-up: `google.maps.DirectionsService`/`DirectionsRenderer` are now soft-deprecated by Google (Feb 2026) in favour of `google.maps.routes.Route.computeRoutes` — still fully supported with a 12-month discontinuation notice guaranteed, so not urgent, but worth migrating at some point.
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

**2026-08-26 (new chat)** — Joe found a competitor site with a full booking engine (Google Places autocomplete, live Maps route preview, per-vehicle-class pricing, payment step) and asked what I thought. Recommended against full parity (live pricing + payment is more infrastructure than the business needs right now) but suggested the address-autocomplete + route-preview piece as an achievable upgrade to the existing enquiry bar. Joe came back wanting the full multi-step booking-engine *experience* but confirmed pricing doesn't need to be live — that can still be given after the enquiry lands, same as today. Built a working prototype at `liverexectours-site/booking-example.html` (not linked from the live site): 4-step wizard (Journey → Vehicle → Passenger → Confirm), trip-type tabs (One-way / Airport Transfer / Hourly), real fleet data pulled from `index.html` rather than invented, and a Confirm step that ends in the same "Send via WhatsApp / Send via Email" hand-off already used by the hero enquiry bar — so the whole flow is fully functional today with zero backend. Checked current Google Maps JS API docs before writing the Places/Directions integration (the old `google.maps.places.Autocomplete` class is being phased out in favour of `PlaceAutocompleteElement`) so the example isn't built on soon-to-be-deprecated code. Address autocomplete and the live route-preview map are gated behind a blank `window.GOOGLE_MAPS_API_KEY` constant in the HTML — same progressive-enhancement pattern as the Supabase keys — so the page works with plain text inputs today and lights up automatically once Joe adds a real key; that path is written to current docs but couldn't be tested live since there's no key yet. Tested everything else directly in-browser (full step flow, validation, vehicle selection, summary accuracy, WhatsApp message contents, mobile layout) and caught two real CSS bugs along the way: `.route-stats`/`.route-map-placeholder`'s own `display:flex` was silently beating the `hidden` attribute (same specificity trap already documented above for the mobile hero photo — fixed with an explicit `[hidden]{display:none!important}` rule scoped to this file), and a generic `.field-group input{width:100%}` rule was also stretching the flight-direction radio buttons to ~490px wide, breaking their layout (fixed by excluding `[type="radio"]`/`[type="checkbox"]` from that selector).

**Maps debugging conclusion:** After Joe generated a key and set restrictions per the guide, autocomplete still failed with a generic client-side error. Traced it through several real issues in sequence — a genuine code bug (the `loading=async` URL param, added to silence a cosmetic warning, introduced a timing race where `google.maps.importLibrary` wasn't always ready the instant the script's `onload` fired; fixed with a short poll before first use) — before landing on the real root cause: the key lived in a different, uncertain Google Cloud project the whole time, while the actual `liver-exec-tours` project under the correct account had no billing account and no API keys at all. Resolved by getting permission to work directly in Hugh's own logged-in Chrome: linked his billing account to the right project, enabled the 3 APIs there, and built a fresh correctly-restricted key by clicking through the Console myself rather than relaying instructions — which also explains why the earlier manual attempts kept landing on typos and missing wildcards. Confirmed working end-to-end with a real address-to-address route lookup. Full detail in the "Booking flow prototype" item in § Open items.

Joe reviewed the prototype and confirmed the flow, vehicle step, passenger step, and confirm step are all fine as-is. Two changes requested: a third airport flight-type option for round trips, and a richer airport list. Implemented both: added a "Both — we take you there and collect you on return" radio alongside Departure/Arrival, which reveals a "Return journey" sub-section (return date, return pickup time, return flight number) and relabels the shared Date/Pickup time/Flight number fields to "Outbound..." for clarity while it's active — all flowing through into the summary and the WhatsApp/email message correctly (verified in-browser, not just read). Split the airport dropdown into two `<optgroup>`s: "Commercial" (Liverpool John Lennon, Manchester T1/T2/T3 as separate options, Leeds Bradford, Heathrow) and "Private aviation" (Liverpool — Ravenair / Liverpool Aviation Services, Manchester — Signature Flight Support), with "Other UK airport" left outside both groups — matches what was visible in the competitor's own dropdown. Joe then asked to set up the Google Maps API, wanting a new Google Cloud project linked to `liverexectours@gmail.com`. Declined to create the account or touch billing directly — that's a hard boundary (account creation and entering payment details are things Claude never does on a user's behalf, no matter who asks) — and explained why, then wrote `google-maps-api-setup-guide.md` with exact click-by-click steps instead, including why key restriction matters (the key is publicly visible in the page source once live) and real current pricing pulled from Google's own pricing page rather than guessed from memory, since it touches Joe's actual billing decision.
