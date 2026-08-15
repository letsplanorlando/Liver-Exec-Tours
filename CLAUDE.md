# Liver Exec Tours — Website & Digital Build: Living Reference

*This file is the up-to-date status doc for the website/digital side of the business. Read it first at the start of any session working in this folder. The broader business plan (ownership transition, licensing, PAYE) lives separately in the "Liver Exec Tours" Claude Project as `business-overview-and-plan.md` — this file only covers the site, hosting, and digital assets.*

*Last updated: 2026-08-15*

## Session start protocol — confirm these every session

- **The business is real** — Liver Exec Tours, a Liverpool chauffeur company, currently sole-traded by Hugh (Joe's father), with an ownership transition to Joe underway. Nothing here is a demo/fictional project.
- **Contact details used everywhere on the site and Google Business Profile:** phone `07540 838531`, email `Liverexectours@gmail.com`. If either changes, it needs updating in `liverexectours-site/index.html` (multiple places) — search and replace.
- **Client-naming rule:** never name Carlsberg or Boodles anywhere public-facing (site, socials, GBP). Use "trusted by leading Liverpool corporates and retail brands" instead — this is a deliberate open decision, not an oversight.
- **This folder is the primary working location** for all website files, fleet assets, and this reference doc — supersedes anything in the Claude Project's `claude/` doc folder for *website* content specifically (the Project still holds the wider business plan).
- **Hosting is manual upload to BigWetFish** (Joe's explicit choice, 2026-08-14) — not GitHub-connected auto-deploy. The GitHub repo is for version history/backup only; pushing to `main` does **not** put anything live. Live deploys always go through `website-upload-guide.md`.

## 1. Current status (as of 2026-08-15)

**The site has been through two redesign passes now — both live in `index.html`/`style.css`/`main.js` as of today.** Old builds preserved in git history if anything's ever wanted back.

**Pass 1 (2026-08-14) — "Waterfront" visual direction:**
- Palette: warm ivory/stone (`#F4EFE6`) with deep navy (`#10192B`) and a brass/copper accent (`#A8632E`) — moved off the old charcoal-and-gold "generic luxury car service" look toward something referencing Liverpool's waterfront limestone architecture. **Palette confirmed as final by Joe on 2026-08-15** after reviewing 4 alternates (charcoal/gold, racing-green/cream, midnight-steel, burgundy/champagne) — staying with navy/ivory/brass.
- Type: **Fraunces** (serif, headings) + **Work Sans** (body).

**Pass 2 (2026-08-15) — cinematic minimal hero + enquiry widget, replacing pass 1's split-layout hero/full nav.** Joe reviewed a competitor's site (LA-based chauffeur company) and asked to strip the site down significantly:
- **Nav trimmed** to Home / Fleet / Contact (was Home/Services/Fleet/About/Contact).
- **Hero is now cinematic and minimal**: full-bleed scroll-scrub video (unchanged mechanics, see below), with just "Liver Exec Tours" title + Call/Enquire buttons fading in on top (900ms delay) — no headline/lead copy, no stats bar.
- **Services section removed entirely** (was a numbered 01–06 list) — cut, not trimmed, per Joe's direction to remove whole sections.
- **Trust-strip/quote-band section removed entirely.**
- **About section removed entirely.**
- Page is now just: Hero → Fleet → Contact → footer.
- **Header** is fixed + transparent/hidden over the hero, fades in (`opacity` transition) only once the visitor has scrolled past the pinned hero — reuses the same scroll-progress math as the video scrub itself (see `initCinematicFadeAndHeader` in `main.js`), not a separate sentinel/IntersectionObserver approach (that was tried first and had a bug — see session log).
- **New hero enquiry bar** (`#hero-enquiry-bar`): compact Pickup / Drop-off / Date / Pickup-time fields sitting under the Call/Enquire buttons, with two buttons — "Send via WhatsApp" (opens `wa.me` deep link, pre-filled message) and "Send via Email" (opens `mailto:`, pre-filled). **Not a live quote/booking engine** — just structured lead capture routed through the visitor's own WhatsApp/email client, landing directly with Joe. A note underneath reads "Not a live quote — your details go straight to us and we usually reply within 2–3 hours."
- Footer's "Explore" links updated to match what's left (Home/Fleet/Contact — no more dead `#services`/`#about` anchors).

**Real photography is now used throughout** — sourced from the Claude Project's uploaded images (`IMG_7505`, `IMG_7511`, `IMG_7489`, `IMG_7492`, `IMG_7516`, `IMG_7529` — all professional shots of the Vito and Sprinter outside the Liver Building/Cunard Building), processed (cropped/resized/compressed) and placed as:
- `images/hero.jpg` — from `IMG_7516`, both vehicles with the actual Liver Building clock tower and Liver Bird visible. This is the single best photo in the set — very recognisably Liverpool.
- `images/fleet-vito.jpg` — from `IMG_7489`, dedicated Vito shot.
- `images/fleet-sprinter.jpg` — from `IMG_7511`, dedicated Sprinter shot.
- `images/story.jpg` — from `IMG_7529`, both vehicles together, used in the About section.
- `images/accent-bw.jpg` — from `IMG_7492`, black-and-white architectural shot, used as the trust-strip background.

**Still no photo exists anywhere for the Lexus SUV** — it shows a styled "Photo coming soon" card (not a broken/ugly placeholder). Also still no team/driver photo — the About section intentionally uses a real fleet photo instead of a fake one; revisit if a genuine team photo ever gets taken.

**What still works from before (unchanged):**
- Supabase table (`public.enquiries`, schema in `supabase/enquiries.sql`) for the contact form, RLS set to allow public insert only.
- **Still not live** — `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html` are still blank, so the form still falls back to opening the visitor's email client. Same as before the redesign — nobody has supplied the Supabase project keys yet.
- Git repo at `github.com/letsplanorlando/Liver-Exec-Tours`, branch `main`, used for version history only (see hard invariant above — it is not connected to hosting).

**Not hosted live yet.** `liverexectours.com` (BigWetFish) still needs the manual upload per `website-upload-guide.md` — that guide was rewritten this session to match the new file/image names.

**Cross-reference — the Claude Project's `business-overview-and-plan.md`** (last synced 2026-07-27) is now stale relative to this folder on multiple points (describes the old dark/gold design, no backend). Treat *this* file as authoritative for site/build status.

**Google Business Profile** (from the Project doc, not re-verified this session): set up under `Liverexectours@gmail.com`, category Chauffeur service, postcard verification was submitted ~2026-07-26 and pending — check whether the code has since arrived and been entered.

## 2. File map

```
Liverexectours/
├── CLAUDE.md                    ← this file
├── website-upload-guide.md      ← BigWetFish manual-upload instructions (rewritten 2026-08-14 for the new design)
├── liverexectours-site/         ← the static site (fully redesigned 2026-08-14)
│   ├── index.html
│   ├── css/style.css            ← "Waterfront" design system: ivory/navy/brass, Fraunces + Work Sans
│   ├── js/main.js               ← nav toggle, form submit (Supabase/mailto fallback), hero scroll-scrub logic
│   └── images/
│       ├── hero-scrub.mp4       ← the scroll-scrubbed hero video (see below) — H.264/MP4, no audio
│       ├── hero-poster.jpg      ← first frame of hero-scrub.mp4, shown before the video loads
│       ├── hero.jpg             ← the portrait Liver Building/tower shot — no longer used in the hero (replaced by video), kept as the og:image for social link previews
│       ├── fleet-vito.jpg, fleet-sprinter.jpg, story.jpg, accent-bw.jpg
├── Fleet photos/                ← raw/source photos (originals, not the processed web versions)
├── supabase/enquiries.sql       ← run once in Supabase SQL editor to create the enquiries table (unchanged)
├── kling_...webm                ← original AI-generated source clip (with watermark) — kept for reference; the cropped/cleaned version used on-site is images/hero-scrub.mp4
└── .git/                        ← github.com/letsplanorlando/Liver-Exec-Tours — version history only, not connected to hosting
```

Note: the old `images/fleet/` subfolder (just `mercedes-vito.jpg`) is no longer referenced by the site — it's been moved to `_to_delete/` in the folder root. Safe to delete once confirmed unwanted.

## Hero: scroll-scrubbed video background

The hero is now a full-bleed video (`images/hero-scrub.mp4`) that scrubs through its 5 seconds as the visitor scrolls, then holds on whatever frame they stop at — **it never calls `.play()`, only seeks**, so it can't autoplay by definition. Source clip was Joe's Kling-generated orbit shot of the Vito outside the Liver Building; it had a "KlingAI 3.0 Omni" watermark burned into every frame (Joe's call: crop it out rather than regenerate or ship it visible), so it's cropped tighter, re-encoded with a keyframe on every frame (needed for fast/accurate seeking — normal video compression only stores full frames occasionally, which makes arbitrary seeking slow/janky), stripped of audio, and downscaled to 1440px wide → 2.7MB.

Mechanics (`js/main.js`, `initHeroScrub`): reads scroll position via `IntersectionObserver` + `requestAnimationFrame` (never a raw scroll-event handler — that's the perf-killer version), maps it to `video.currentTime` across a pinned scroll runway (`.hero-scrub` is 250vh tall — 200vh on mobile — with `.hero-scrub-pin` going `position: sticky` once JS confirms the video loaded). Progressive enhancement: if `prefers-reduced-motion` is set, or the browser lacks `IntersectionObserver`, the hero silently stays a normal single-viewport section showing the poster frame — no pin, no scrub, still not autoplaying. That fallback path is the *default* CSS state; JS adds a `.scrub-active` class to opt into the tall pinned version.

**Testing note for next session:** verified end-to-end (scroll → frame changes, holds with zero drift when scrolling stops, reverses correctly scrolling back up, `paused` stays `true` throughout) using a local server with proper HTTP Range support and a VP9/WebM copy of the same clip — the sandboxed test browser here can't decode H.264 and a plain `python -m http.server` doesn't support Range requests (video seeking needs both), so the shipped MP4 itself couldn't be exercised directly in this environment. Neither limitation exists on a real device or on BigWetFish. Worth Joe just eyeballing the scroll feel once it's live, since this environment couldn't give a 100%-identical dry run.

## 3. Open items / next actions

- [ ] **Joe to eyeball the live scroll-scrub feel + new minimal hero/enquiry-bar once uploaded** — this environment couldn't test the exact shipped MP4 directly (see testing note above), only a substitute; Joe *has* now confirmed the local-preview feel was good before this was merged into the live files.
- [ ] Upload `liverexectours-site/` to BigWetFish per `website-upload-guide.md` so the site actually goes live. **Note: the guide still describes the pre-minimal-redesign page structure (Services/About sections) — needs a refresh to match the current Hero→Fleet→Contact structure before Joe relies on it.**
- [ ] Fill in `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html` to make the *contact-section* enquiry form actually write to Supabase instead of falling back to mailto. (The new *hero* enquiry bar is separate — it never touches Supabase, it always goes to WhatsApp/email directly, by design.)
- [ ] Get a Lexus SUV photo — none exists anywhere yet. Once available, swap it in.
- [ ] Enter GBP postcard verification code if not already done; confirm profile is live/searchable.
- [ ] Consider a proper favicon (not done yet).
- [ ] Empty or repurpose `_to_delete/` in `liverexectours-site/` — now contains the old fleet image AND the now-merged `index-preview.html`/`preview.css`/`preview.js` (safe to delete, their content is fully folded into the live files).
- [ ] Decide whether a FAQ accordion section (seen on the competitor site Joe shared) is worth adding — discussed, not decided, not built.

## 4. Session log

**2026-08-14 (earlier)** — Joe reconnected after a gap and said he was "lost where we are." Read back through the Claude Project docs and the actual folder/repo state — found real drift between the two. Wrote this file to make the folder the single source of truth going forward. Flagged the redesign scope and hosting approach as open decisions before doing any rebuild work.

**2026-08-14 (later)** — Joe answered: full redesign from scratch, hosting stays manual BigWetFish upload. Sourced and reviewed all 9 fleet images available (this folder + the Claude Project uploads) to find usable shots — found professional photography of the Vito and Sprinter outside the Liver Building/Cunard Building, including one with the actual Liver Building clock tower and Liver Bird, that hadn't been used anywhere yet. Built a new "Waterfront" design system (ivory/navy/brass, Fraunces + Work Sans) and rebuilt `index.html`/`style.css`/`main.js` from scratch around it, keeping the proven Supabase/mailto-fallback form logic. Processed and cropped 5 images for web use. Verified the build by rendering it in a headless browser at desktop and mobile widths and reviewing screenshots of every section before shipping. Rewrote `website-upload-guide.md` to match. Moved the now-unused old `images/fleet/` folder to `_to_delete/`.

**Correction, same day:** Joe pushed back — he hadn't asked for the redesign to be *built*, he wanted to talk through his ideas first. Fair catch. Nothing was live/lost (BigWetFish untouched, old design safe in git history), so no harm done, but the lesson going forward: **discuss direction before building, on this project specifically** — Joe wants to weigh in on design decisions before they're implemented, not review them after.

**2026-08-14 (later still)** — Joe's idea: use the Kling AI video he'd added to the folder as a scroll-scrubbed hero background (video progresses frame-by-frame with scroll position, holds when scrolling stops, never autoplays). Talked through the technical approach *before building* this time — found the clip had a burned-in "KlingAI 3.0 Omni" watermark, presented options, Joe chose: crop the watermark out, use video+dense-keyframes (not image-sequence/canvas), pin the hero for ~2.5 screens of scroll. Built it: cropped the watermark out, re-encoded to H.264/MP4 with a keyframe on every frame (needed for responsive seeking) at 15fps/1440px (2.7MB, audio stripped), replaced the split-photo hero with a full-bleed video hero + scroll-scrub JS (`IntersectionObserver` + `requestAnimationFrame`, never calls `.play()`), with a static-poster fallback for reduced-motion/no-JS. Found and fixed a real contrast bug along the way (the "Call" outline button was navy-on-navy against the new dark video overlay — invisible). Verified the scroll mechanics end-to-end using a local Range-capable test server (see the Hero section above for why the exact shipped file couldn't be tested directly in this environment). The old portrait tower-photo hero image (`hero.jpg`) is no longer used in the hero but kept as the social-share (`og:image`) preview image.

**2026-08-15** — Joe asked for the hero to "fade in from black" instead of the split-photo layout, and suggested previewing it before touching the real code — good call, adopted as the working pattern for the rest of this session (and going forward, per the earlier correction: discuss before building). Built and iterated entirely in parallel preview files (`index-preview.html`, `css/preview.css`, `js/preview.js`) that never touched the live `index.html`/`style.css`/`main.js` until Joe explicitly signed off. Through Q&A landed on: "Liver Exec Tours" title + Call/Enquire buttons fading in over the video (not the old headline/lead/stats), everything below the hero starting black, header fading in only after scrolling past the hero. Fixed a real bug along the way — the header reveal was first built with a sentinel `<div>` + `IntersectionObserver` watching for `top<=0`, but the sentinel sits at the *bottom of the full pinned box* (~2250px scrolled) rather than where the sticky pin actually releases (~1350px = the scroll runway), so the header never appeared until scrolling ~900px further than intended. Fixed by dropping the sentinel and reusing the exact same rect-based progress formula already used for the video scrub (`progress = (0-rect.top)/runway`), triggering reveal at `progress >= 0.99`.

Joe then shared 4 screenshots of an LA-based competitor's site (live pricing widget in the hero, FAQ accordion, service category cards) for reference. After reviewing, Joe's direction: strip the site down a lot, delay the hero title fade slightly, and — instead of a live-pricing booking widget — add a simple pickup/drop-off/date/time enquiry bar that sends straight to WhatsApp or email (visitor's choice) rather than any kind of live quote engine, with a "we reply in 2–3 hours" note. Confirmed via clarifying questions: cut whole sections (not just trim copy), offer both WhatsApp and email, keep the widget alongside (not replacing) the Call/Enquire buttons, and show the response-time promise. Built accordingly: removed the info-band, Services, trust-strip, and About sections entirely from the preview; pushed the title fade-in from 200ms to 900ms; added the `#hero-enquiry-bar` form with WhatsApp (`wa.me` deep link) and email (`mailto:`) send buttons, styled as a glassy dark bar matching the Waterfront palette.

Joe ran the preview locally (via `range_server.py`, since a plain `python -m http.server` doesn't support the Range requests the video scrub needs) and confirmed it looked good, but wasn't keen on the colour scheme. Generated and sent 4 alternate palette screenshots (charcoal/gold, racing-green/cream, midnight-steel, burgundy/champagne) as quick CSS-variable swaps over the existing layout — Joe reviewed and confirmed: **keep navy/ivory/brass as-is**, no change needed.

With the design confirmed, merged everything from the preview files into the real `index.html`/`style.css`/`main.js` — this is now what's live in the working files (not yet uploaded to BigWetFish). Verified the merged live files end-to-end with the same local Range-server + VP9 test-substitute pattern (desktop + mobile, hero load/fade/scroll/header-reveal/fleet/contact) before shipping. Deleted the now-redundant `index-preview.html`/`preview.css`/`preview.js` from the live folder (moved to `_to_delete/`, since `device_bash` can't actually delete files in this sandbox) — their content is fully folded into the live files now, nothing lost.
