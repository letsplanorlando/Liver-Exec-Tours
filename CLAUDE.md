# Liver Exec Tours — Website & Digital Build: Living Reference

*Current-state doc for the website/digital side of the business. Read it first at the start of any session working in this folder. Wider business picture (Hugh/Joe structure, licensing, growth plan) is in the Project's `business-overview-and-plan.md` (private, not in this repo); the Oct 2026 launch list is in `launch-plan-oct-2026.md`. Older history (design iterations, debugging stories, per-session log) lives in `CLAUDE-archive.md`.*

*Last updated: 2026-11-13*

## Session start protocol — confirm these every session

- **The business is real** — Liver Exec Tours, a Liverpool chauffeur company, sole-traded by **Hugh** (Joe's father), who stays owner and holds the operator licences, insurance and finance. Hugh is staying as owner; all accounts, insurance and licences are unchanged. Joe works in the business as a self-employed driver and runs the website, social media and client-meeting side. The commercial terms are private and live in the Claude Project's business overview, not in this public repo. Nothing here is a demo project.
- **Contact details (decided 2026-10-27): phone `07808 299060`, email `info@liverexectours.com`** (BigWetFish cPanel forwarder landing in the business Gmail inbox). Use these everywhere, including the Google Business Profile.
  - Phone change → search-and-replace in `liverexectours-site/index.html`, and the WhatsApp number `447808299060` in `js/main.js` (hero bar) **and** `js/booking.js` (Plan Trip planner).
  - Email change → `index.html` (footer), `js/main.js` (hero bar `EMAIL_ADDRESS`), `js/booking.js` (planner `EMAIL_ADDRESS`).
  - **Gmail setup (2026-11-12):** the business Gmail (`liverexectours@googlemail.com`) sends as `info@liverexectours.com` via `smtp.gmail.com:587` with an app password (Joe made it; never stored here) and replies from whichever address a message was sent to. Both senders are named "Liver Exec Tours". SPF on the domain (BigWetFish Zone Editor) is `v=spf1 ip4:185.211.23.115 +a +mx include:_spf.google.com ~all`; keep the Google include. Gmail signature "Liver Exec Tours" (company only) is on new mail and replies; its badge loads from `https://liverexectours.com/images/brand/email-badge.png` (live since 2026-11-12), so never delete or rename that file.
- **Brand (set 2026-10-27):** round double-ring "LIVER / EXEC" badge for small spaces, full "LIVER EXEC TOURS" wordmark for wide ones, same porcelain/gunmetal/champagne colours and Playfair Display SC. Files are in `liver-exec-brand-kit/`; rules in the Project's `claude/brand-guidelines.md`. Not yet on the website (Joe: leave the site for now).
- **Client-naming rule:** never name any client (site, socials, GBP, testimonials, public repo). Use "trusted by leading Liverpool corporates and retail brands". Testimonial attributions are generic: "Corporate client" / "Agency client" / "Retail client". Who the clients are lives in private notes, not in this file.
- **This folder is the primary working location** for website files, fleet assets and this doc. It supersedes the Claude Project's copy for website content.
- **Hosting is manual upload to BigWetFish** (Joe's choice) — not auto-deploy. The GitHub repo (`github.com/letsplanorlando/Liver-Exec-Tours`) is version history/backup plus a live GitHub Pages preview (`https://letsplanorlando.github.io/Liver-Exec-Tours/`). Pushing to `main` updates Pages only, **not** BigWetFish. Production deploys follow `website-upload-guide.md` (§ 3 is the fast flow: zip only changed files; Joe types the cPanel password himself in a Chrome window Claude opens).
- **Production = git commit `2601181` (live 2026-11-12, canonical fix):** a `rel="canonical"` tag on all 16 pages, the 58 `href="index.html…"` links changed to `./`, and 301 redirects in the live `.htaccess` (www → apex, http → https, `/index.html` → `/`; `/.well-known/` exempt). The repo copy `liverexectours-site/.htaccess` holds only our block; on the server it sits above cPanel's PHP handler block, which must be kept. 16 pages hash-verified; backup `liverexectours-live-backup-2026-11-12.zip`. Since this upload, `/index.html` 301s, so hash-check the homepage at `/` instead. Before that: git commit `63b10ec` (live 2026-11-09, second upload that day): Manchester and John Lennon airport pages, new Cheltenham/Oasis prices (9 files, hashes verified; backup `liverexectours-live-backup-2026-11-09b.zip`). Before that, `82afa5a` (2026-11-09): cooler palette (brand silver back, cool greys), fewer small-caps labels, dash-free copy, cookies section, Cloudflare Web Analytics on every page, Search Console tag, sitemap.xml + robots.txt.** 19 files uploaded via the quick-update flow, all hashes verified; server backup `/home/realmome/liverexectours-live-backup-2026-11-09.zip`. Before that: `eb1051b` (2026-11-05), the full redesign: It went up through the quick-update flow: a 28-file zip of everything changed since `8a54af1`, extracted over the live folder, with all 28 live hashes verified and Maps confirmed loading on the live domain.
  - **Server backup** of the old live folder: `/home/realmome/liverexectours-live-backup-2026-11-05.zip`. The old version is also git commit `8a54af1`.
  - Previous upload: `8a54af1` (2026-10-19).
  - Update this line and the upload guide after every upload.
  - **Sections 1–2 below still describe the pre-redesign site and need a rewrite.** Until then, the memory note `project-redesign-2026-10.md` is the best guide to the new pages and data files.
- **The Google Business Profile address is private. Never show it anywhere public** (site, JSON-LD, GBP, socials) and never write it into this repo.
- **Terminal commands:** Claude runs git and shell commands directly. Commit only when Joe asks; push only when he says "push".
- **How Joe likes to work:** ignore stray full stops (his laptop keyboard inserts them); ask decisions as short numbered questions (popup questions are fine when he asks for them); discuss design/structure changes before building them; don't ship new placeholder content without asking. A fresh chat starts with `/liverexectours`, which reads this file and the memory notes.

## 1. Current status

### Page structure
Hero → About → Fleet → Testimonials (`#testimonials`) → Plan Trip (`#book`) → FAQ → Footer (`#contact`).
Nav: Home / Fleet / Contact (scrolls to footer) + header "Plan Trip" button. No standalone Contact section or form (removed 2026-09-20); Supabase wiring removed with it (`supabase/enquiries.sql` unused).

### Design system ("Waterfront")
- **Palette:** porcelain `#F5F5F5`, gunmetal `#2A2A2A`, champagne `#D4C5A9` (from `liver-exec-palette-03.html`, kept in the project root, not the deployable folder). CSS variable names are the old ones repointed (`--navy` = gunmetal, `--ivory` = porcelain, `--brass` = champagne; derived: `ivory-dark`, `navy-light`, `brass-light`, `grey-light`).
- **Text on champagne fills must be dark** (`--navy`), not white. `.btn-primary` is dark text, flipping to white only on `:hover` when the fill flips to gunmetal. Champagne as a *text* colour is fine.
- **Type:** Fraunces (headings not listed below) + Work Sans (body) + Playfair Display SC (hero title and nav wordmark only) + **PT Serif** via `--headline` for section `<h2>`s, their `.eyebrow`/`.section-intro`, Plan Trip step `<h3>`s, `.route-panel h3`, `.side-help-card h4`, fleet card names, footer column headings (all centred). PT Serif ships only 400/700, so rules set `font-weight: 700` explicitly and there are no italics.

### Hero
- **Desktop:** full-bleed scroll-scrubbed video (`images/hero-scrub.mp4`, H.264, keyframe every frame, 15fps/1440px). `initHeroScrub` in `main.js` seeks `currentTime` from scroll progress via IntersectionObserver + rAF; it never calls `.play()`. `.hero` becomes `200vh` and `.hero-pin` sticky once JS adds `.is-scrubbing` (after metadata loads). Title, Call/Plan Trip buttons and enquiry box fade in together at 900ms. Header is hidden over the hero and fades in at scroll progress ≥ 0.99 (`initHeaderReveal`).
- **Mobile (≤720px):** scrub disabled (iOS blocks seeking without a gesture); static `images/hero-mobile2.jpg` (`object-fit: cover; object-position: center top`, no fade). `.hero-pin` uses `100svh` (plain `100vh` resizes with the address bar and reads as a zoom). Title reads "Liver Exec Tours" (`.hero-title-full`, `clamp(2.1rem, 9vw, 2.6rem)`, fits one line to ~360px, wraps naturally below). Title block fades in at 900ms, enquiry box at 1700ms. `.hero-title-mark` is dead CSS, safe to delete.
- **Hero enquiry bar:** Pickup / Drop-off / Date / Pickup time → "Send via WhatsApp" (`wa.me/447808299060`) or "Send via Email" (`mailto:info@liverexectours.com`). Neither auto-sends; they hand a pre-filled message to the visitor's own app. Not a live quote. Address fields use live Google autocomplete and write the chosen address back into the original hidden `<input>`, so `main.js` message-building is unchanged.

### About
Three columns (`.about-cols`, `repeat(3, 1fr)`; 2 cols at 900px with the third centred and capped at 460px; 1 col at 720px), each a centred `<h3>` + one ~45-word paragraph: "20+ Years' Experience", "Who We Work With" (anonymised clients; UK-wide incl. regular London trips), "Our Fleet".

### Testimonials: real Google reviews (live since the 2026-11-05 redesign)
- Five real Google reviews in a `.review-slider` carousel on the homepage (`#testimonials`), quoted as written, **first name only** ("Tamia · Google review" etc.); two are trimmed to their key lines. A source comment above the section records this. No placeholder wording remains, so step 0 of the upload guide (`grep PLACEHOLDER`) now prints nothing.
- Corporate/agency/retail clients are still never named (client-naming rule above). No star rating or review count shown yet: the GBP has only a handful of reviews.

### Plan Trip (`#book`)
- Two steps. **Step 1 "Journey details":** trip-type tabs (One-way / Airport Transfer / Hourly), per-type fields, and a shared **Passengers** field (required, blank by default on purpose — it decides which vehicle Hugh quotes). Airport has Departure / Arrival / Both (outbound + return blocks). Airport list: Commercial (Liverpool John Lennon, Manchester T1/T2/T3, Leeds Bradford, Heathrow), Private aviation (Ravenair, Signature Flight Support), Other UK airport. **Step 2 "Your details":** Name (required), Phone (required, ≥7 digits), Notes (optional), trip recap, Send via WhatsApp / Email.
- Vehicle step and Email field removed on purpose. To bring email back: `index.html` + `booking.js` (state, validation, `buildMessageText`). To make phone optional: drop the digit check in the `[data-submit]` handler.
- Hero bar values carry into the planner's One-way fields (`carryHeroAddress` with Maps live, `mirrorInput` without). Hero → planner only.
- Maps failures (library import, blocked script, non-OK Directions) show a short "couldn't load a live route preview" message and `console.warn` the reason.
- Address text is Google's `formattedAddress` (street address, not place name); adding `displayName` costs a higher Places SKU, not done.
- **Google Maps key** lives in `index.html` as `window.GOOGLE_MAPS_API_KEY`, in the `liver-exec-tours` Google Cloud project under **Hugh's** account (legacy `.googlemail.com` address, not `.gmail.com`). APIs: Maps JavaScript, Places (New), Directions. Referrer restrictions: `http://localhost:8844/*`, `https://liverexectours.com/*`, `https://www.liverexectours.com/*`, `https://letsplanorlando.github.io/*`. Autocomplete uses `includedRegionCodes = ['gb']` + a 45,000m `locationBias` circle on Liverpool (Google caps the radius at 50,000m — more silently 400s every request).
- **Later:** `DirectionsService`/`DirectionsRenderer` are soft-deprecated (Feb 2026) in favour of `google.maps.routes.Route.computeRoutes`. Not urgent (12-month notice guaranteed).

### FAQ
Five accordion items; first answer says "Use Plan Trip above or call us directly…". Question text left-aligned, `.faq-list` centred (`margin: 0 auto`). Background `images/faqphotomobile.jpeg` with `background-size: cover` (not `100% auto`, which exposed a grey block when an answer expanded) under a gunmetal gradient overlay. Topics: getting a quote, airports (UK-wide + regular London trips), max group size, flight delays, corporate clients.

### Footer / contact
`<footer id="contact">`. Explore list: Home / Fleet / Plan Trip / FAQ. "Get in touch": phone, email, service-area line (North West + UK-wide long-distance/airport incl. regular London trips), "Bookings taken 24 hours a day — call or message any time and we'll confirm availability." The footer also carries a "Verified on Google" badge linking to the reviews and the review link (no numeric rating, as the real review count is still tiny). Wording is "Liverpool and the North West"; the `<meta>`/`og:description` tags and the FAQ corporate answer still say "Merseyside" (left alone deliberately).

### Photography (`images/`)
`hero-mobile2.jpg` (mobile hero), `hero-scrub.mp4`, `hero-poster.jpg`, `hero.jpg` (og:image only), `fleet-vito.jpg`, `fleet-sprinter.jpg`, `fleet-lexus.jpg` (live since 2026-11-05; raw edits in `Fleet photos/Lexus*`), `faqphotomobile.jpeg`; `story.jpg` and `accent-bw.jpg` are unused. Further fleet shots from the same shoot are in the Claude Project files (IMG_7479 … IMG_7529).

## 2. File map

```
Liverexectours/
├── CLAUDE.md                         ← this file
├── CLAUDE-archive.md                 ← old session log + superseded detail
├── website-upload-guide.md           ← BigWetFish manual-upload steps
├── google-maps-api-setup-guide.md    ← how the Maps key was set up
├── range_server.py                   ← local server: Range support + /__save for the visual editor
│                                        python3 range_server.py 8844 → http://localhost:8844/liverexectours-site/ (add ?edit=1 to edit text)
├── liverexectours-site/
│   ├── index.html
│   ├── css/style.css, css/booking.css
│   ├── js/main.js, js/booking.js, js/edit-mode.js
│   └── images/ …
├── Fleet photos/                     ← raw originals
├── supabase/enquiries.sql            ← unused (safe to delete)
├── _to_delete/                       ← safe to delete once confirmed
├── .github/workflows/pages.yml       ← deploys liverexectours-site/ to Pages on push to main
└── set-maps-key.py                   ← STALE (targets a file merged away in 2026-08); delete
```

## 3. Open items

- [ ] **Outlook shows "Unverified Sender" on mail from info@ (tested 2026-11-12).** Gmail sends info@ via smtp.gmail.com, so the mail is DKIM-signed by googlemail.com and the envelope sender is googlemail.com. Neither matches the From domain, so DMARC fails (p=none, so it still gets delivered, but Outlook flags it). Planned fix (free): create a real `info@` mailbox in cPanel, keep the forwarder to Gmail, give it a small quota and a filter, and switch Gmail's "Send mail as" for info@ to BigWetFish SMTP (`mail.liverexectours.com`, 465 SSL/587 TLS). BigWetFish signs with `default._domainkey`, so DKIM should align. Check first that server815's IP (185.211.23.115) isn't on a blacklist, because it's shared with the compromised realmoments.co.uk. Joe sets and types the mailbox password. Alternative: Google Workspace (about £6 a month). Also, the Gmail phone app ignores the web signature: Joe to set a plain-text Mobile Signature in the app.
  - **On hold (2026-11-13), waiting for a BigWetFish ticket reply.** MXToolbox: 185.211.23.115 is **listed on Barracuda** and clean on the other 57 lists, so switching SMTP now could bounce mail at corporate clients that use Barracuda filtering. Joe has asked BigWetFish to delist it, scan the account, confirm PHP versions (all three cPanel domains are on ea-php82) and confirm DKIM.
  - **ns3.bigwetfish.co.uk is stale.** It serves zone serial 2026050401 for liverexectours.com (ns1/ns2: 2026111200), including the **old SPF without `include:_spf.google.com`**, so about one lookup in three gets an SPF that fails mail sent through Gmail. That may be part of the Outlook warning. Ask BigWetFish to fix the ns3 sync.
  - **Hosting layout:** liverexectours.com's website and mail are on the server815 cPanel `realmome`, which the client area lists as a **free "Email Platform"** account. Ask BigWetFish whether it's fine for a live website or should move to the paid Enhance Lite plan (152.89.64.109, which hosts realmoments.co.uk; panel login from the client area currently errors).


**Read `launch-plan-oct-2026.md` first** (private, gitignored: ten ideas and the decisions still needed). **Launch-plan website work (due Fri 30 Oct, item 10):** new sections for airport shuttle, event shuttles, corporate, partner programme; terms + privacy page; Instagram/TikTok icons in footer + JSON-LD `sameAs`; logo mark + favicon; Search Console. None of it exists in the current page structure yet. Licensing for seat-selling: Joe confirmed it's fine (2026-11-02).

- [x] **Testimonials:** done. Real Google reviews, first names only, live since 2026-11-05. Add more as reviews come in.
- [ ] **Google Business Profile — largely optimised 2026-10-19** (service-area business with address hidden, cover photo + logo, hours 24h every day, Bookings link, two products, Q&A skipped, AI messaging declined). Still to check 24–72h later: 24-hour hours showing, Street View house photo gone, products live. Pending: review Google's suggestions + "Confirm" banner before accepting; weekly Posts (Joe uploads photos over two weeks); WhatsApp Business once Joe has the phone (07808 299060). Make sure phone is `07808 299060` and email `info@liverexectours.com` (it had the old Gmail address), align wording with the site's UK-wide/London language, and confirm which Google account owns it (`liverexectours@gmail.com` vs Hugh's `.googlemail.com`).
- [x] **Lexus SUV photo:** done. `images/fleet-lexus.jpg`, live since 2026-11-05.
- [ ] **Favicon** (folded into launch-plan item 10 once the logo mark exists).
- [ ] **Local preview server** listens on all interfaces and `/__save` has no auth. Fix: bind to `127.0.0.1` (Maps still works — referrer is `localhost:8844`). Not done; needs Joe's OK to change `range_server.py`. Stop the server when not in use.
- [ ] **Client names in the public repo's history** — older commits (including the old `.claude/commands/liverexectours.md`) contain them. The repo must stay public for Pages. Current files are being cleaned; history rewrite is Joe's call.
- [ ] **Git remote has a personal access token in the URL** (`.git/config`). Worth moving to an SSH key or credential manager. Joe's call.
- [ ] **Parked idea:** homepage "Latest Updates" blog teaser (3–4 evergreen posts: airport transfers, golf, events/hourly, corporate — ranked below the launch plan). The Google-reviews badge idea was done 2026-10-19 as the footer "Verified on Google" badge.
- [ ] **Tidy:** delete `_to_delete/`, `supabase/enquiries.sql`, `set-maps-key.py`, and the leftover `/home/realmome/liverexectours-update-FULL.zip` (home folder, not web-visible, harmless).

## 4. Technical notes

### Local preview
Plain `python -m http.server` can't seek video (no Range support). Use:
```
cd /Users/joe/Documents/Liverexectours
python3 range_server.py 8844
```
then open `http://localhost:8844/liverexectours-site/`. **Stop it when done** (see open items).

### Visual editor
`?edit=1` on the localhost URL shows a "Save changes" bar; click any heading/paragraph/list item/FAQ answer/`span` to edit in place, Enter to finish, Save writes into `index.html` (previous version saved as `index.html.bak`, gitignored). Gated to localhost + `?edit=1` in `js/edit-mode.js`, inert in production. Not editable: hero, anything in a `<form>`, FAQ question text, copyright year. Save matches each element's old text as a unique substring of `index.html` and reports failure rather than guessing; reload for a fresh baseline. Saving normalises HTML entities (`&mdash;` etc.) to literal characters, so expect a larger-than-expected diff.

### GitHub Pages
Auto-deploys on push to `main` (~60s); repo must be public (free plan). Hard-refresh on phone to clear cache.

### Gotchas worth keeping
- **CSS specificity trap:** the rule hiding the mobile hero photo (`.hero-photo-mobile`) must sit inside `@media (min-width: 721px)`. Written as a plain rule after the mobile block, it wins everywhere (equal specificity, later source order) and the photo never shows on mobile.
- **`[hidden]` vs `display:flex`:** an element's own `display:flex` beats the `hidden` attribute; add an explicit `[hidden]{display:none!important}` where needed.
- **Grid `min-width:auto`:** wide descendants (Places autocomplete widget, native date/time inputs in WebKit) push grid tracks wider on iOS. Fixed with `min-width: 0` on `.wizard-main`, `.wizard-side` and `.field-group`. Applies to both Safari and Brave on iPhone (both WebKit).
- **`gmp-place-autocomplete`** uses a closed shadow root and follows the OS dark-mode preference; style it with `color-scheme` + explicit `background-color`/`border` on the element (light for Plan Trip, `.hero-address-input` dark variant for the hero).
- **zsh:** an unquoted `$FILES` doesn't word-split; keep file lists in an array (`FILES=(a b c)`, `"${FILES[@]}"`).
- **cPanel:** tokenised addresses mean Claude can't reuse Joe's logged-in tab; Joe logs in himself in a Chrome window Claude opens. Claude never handles passwords.
