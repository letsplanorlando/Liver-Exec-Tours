# Liver Exec Tours — Website & Digital Build: Living Reference

*This file is the up-to-date status doc for the website/digital side of the business. Read it first at the start of any session working in this folder. The broader business plan (ownership transition, licensing, PAYE) lives separately in the "Liver Exec Tours" Claude Project as `business-overview-and-plan.md` — this file only covers the site, hosting, and digital assets.*

*Last updated: 2026-08-14*

## Session start protocol — confirm these every session

- **The business is real** — Liver Exec Tours, a Liverpool chauffeur company, currently sole-traded by Hugh (Joe's father), with an ownership transition to Joe underway. Nothing here is a demo/fictional project.
- **Contact details used everywhere on the site and Google Business Profile:** phone `07540 838531`, email `Liverexectours@gmail.com`. If either changes, it needs updating in `liverexectours-site/index.html` (multiple places) — search and replace.
- **Client-naming rule:** never name Carlsberg or Boodles anywhere public-facing (site, socials, GBP). Use "trusted by leading Liverpool corporates and retail brands" instead — this is a deliberate open decision, not an oversight.
- **This folder is the primary working location** for all website files, fleet assets, and this reference doc — supersedes anything in the Claude Project's `claude/` doc folder for *website* content specifically (the Project still holds the wider business plan).
- **Hosting is manual upload to BigWetFish** (Joe's explicit choice, 2026-08-14) — not GitHub-connected auto-deploy. The GitHub repo is for version history/backup only; pushing to `main` does **not** put anything live. Live deploys always go through `website-upload-guide.md`.

## 1. Current status (as of 2026-08-14)

**The site has been fully redesigned** — new "Waterfront" visual direction (Joe chose "new direction from scratch" over refreshing the old dark/gold build). Old build is preserved in git history (see commit before 2026-08-14) if anything from it is ever wanted back.

**New design:**
- Palette: warm ivory/stone (`#F4EFE6`) with deep navy (`#10192B`) and a brass/copper accent (`#A8632E`) — moved off the old charcoal-and-gold "generic luxury car service" look toward something referencing Liverpool's waterfront limestone architecture.
- Type: **Fraunces** (serif, headings) + **Work Sans** (body) — replaces the old Playfair Display + Inter pairing.
- Layout: still a single scrolling page (Home/Services/Fleet/About/Contact via anchor nav) — that structural choice was kept since it suits the business; the redesign is about look and feel, not information architecture.
- Hero is now a split layout (headline + CTAs left, full-height real photo right) instead of a full-width text-only banner.
- Services section is now a numbered editorial list (01–06) instead of icon cards.
- A new full-bleed "trust strip" section uses a black-and-white architectural photo with the "trusted by leading Liverpool corporates and retail brands" line as a large pull-quote.
- About section is a split layout using a real fleet photo (see below) instead of inventing a fake team photo.

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
│   ├── js/main.js               ← nav toggle, form submit (Supabase or mailto fallback) — logic unchanged from before
│   └── images/                  ← hero.jpg, fleet-vito.jpg, fleet-sprinter.jpg, story.jpg, accent-bw.jpg
├── Fleet photos/                ← raw/source photos (originals, not the processed web versions)
├── supabase/enquiries.sql       ← run once in Supabase SQL editor to create the enquiries table (unchanged)
├── kling_...webm                ← AI-generated video asset, still not placed anywhere
└── .git/                        ← github.com/letsplanorlando/Liver-Exec-Tours — version history only, not connected to hosting
```

Note: the old `images/fleet/` subfolder (just `mercedes-vito.jpg`) is no longer referenced by the site — it's been moved to `_to_delete/` in the folder root. Safe to delete once confirmed unwanted.

## 3. Open items / next actions

- [ ] Upload `liverexectours-site/` to BigWetFish per `website-upload-guide.md` so the site actually goes live.
- [ ] Fill in `SUPABASE_URL` / `SUPABASE_ANON_KEY` in `index.html` to make the enquiry form actually write to Supabase instead of falling back to mailto.
- [ ] Get a Lexus SUV photo — none exists anywhere yet (checked both this folder and the Claude Project's uploads). Once available, swap it in per the instructions in `website-upload-guide.md`.
- [ ] Decide what to do with the Kling video asset (social post? unused?).
- [ ] Enter GBP postcard verification code if not already done; confirm profile is live/searchable.
- [ ] Consider a proper favicon (not done in this redesign).
- [ ] Empty or repurpose `_to_delete/` once Joe's confirmed the old fleet image isn't needed.

## 4. Session log

**2026-08-14 (earlier)** — Joe reconnected after a gap and said he was "lost where we are." Read back through the Claude Project docs and the actual folder/repo state — found real drift between the two. Wrote this file to make the folder the single source of truth going forward. Flagged the redesign scope and hosting approach as open decisions before doing any rebuild work.

**2026-08-14 (later)** — Joe answered: full redesign from scratch, hosting stays manual BigWetFish upload. Sourced and reviewed all 9 fleet images available (this folder + the Claude Project uploads) to find usable shots — found professional photography of the Vito and Sprinter outside the Liver Building/Cunard Building, including one with the actual Liver Building clock tower and Liver Bird, that hadn't been used anywhere yet. Built a new "Waterfront" design system (ivory/navy/brass, Fraunces + Work Sans) and rebuilt `index.html`/`style.css`/`main.js` from scratch around it, keeping the proven Supabase/mailto-fallback form logic. Processed and cropped 5 images for web use. Verified the build by rendering it in a headless browser at desktop and mobile widths and reviewing screenshots of every section before shipping. Rewrote `website-upload-guide.md` to match. Moved the now-unused old `images/fleet/` folder to `_to_delete/`. Still open: Supabase keys, Lexus photo, actually uploading to BigWetFish.
