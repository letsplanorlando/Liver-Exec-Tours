# Google Maps API Setup Guide — Booking Flow Example

Purpose: get a Google Maps Platform API key so the booking flow prototype's address autocomplete and live route-preview map can switch on. This is an account + billing step only Joe can do — Claude can't create Google accounts, sign in, or enter payment details on anyone's behalf.

## What this unlocks

Right now in `liverexectours-site/booking-example.html`, the address fields are plain text and the "Route preview" panel shows a placeholder. Once a key is added, addresses autocomplete as you type and the panel shows a real map with the driving route, distance, and time.

## Steps (about 10 minutes)

0. **Check which Google account you're actually signed into first.** The first attempt at this (2026-08-26) turned out to be sitting under a personal/other-project Google account by accident rather than the business one — easy mistake, since a project can be named anything regardless of which account owns it. Go to [myaccount.google.com](https://myaccount.google.com/) or check the avatar in the top-right of any Google page and confirm it says `liverexectours@gmail.com` before doing anything else. If it doesn't, switch accounts (or use an incognito/private window) first.
1. **Go to** [console.cloud.google.com](https://console.cloud.google.com/) as `liverexectours@gmail.com`.
2. **Create a new project** — top-left project dropdown → "New Project". Name it something like "Liver Exec Tours Website".
3. **Enable billing, and confirm it's actually Active before moving on.** Google requires a billing account with a payment method on file before any Maps Platform API will work, even within the free monthly quota (see costs below). You'll be prompted for this automatically the first time you enable an API if it isn't set up already — but don't just click through it. Go to **Billing** in the left sidebar afterwards and confirm the account status genuinely shows **Active**, not pending/unverified. A half-finished billing setup is the most likely explanation if APIs look enabled and restrictions look right but requests still silently fail.
4. **Enable three APIs** — go to "APIs & Services" → "Library" and enable each of:
   - Maps JavaScript API
   - Places API (New)
   - Directions API
5. **Create an API key** — "APIs & Services" → "Credentials" → "Create Credentials" → "API key". Google generates it immediately.
6. **Restrict the key — don't skip this, and get the format exact.** The key sits in plain view in the page's source once it's live, so anyone can see it.
   - **API restrictions** → "Restrict key" → tick only the three APIs above, nothing else. Google Cloud sometimes defaults to every enabled API being selected — check the "Selected APIs" list actually shows just those three before saving.
   - **Application restrictions** → "Websites" → add exactly these three entries (scheme prefix and trailing `/*` both matter — an entry without the `/*` wildcard only matches that one exact URL, not the site generally):
     ```
     http://localhost:8844/*
     https://liverexectours.com/*
     https://www.liverexectours.com/*
     ```
     Double-check the domain spelling before saving — a typo here fails silently rather than showing an obvious error.
   - Click **Save**. Changes can take a few minutes to take effect.
7. **Send me the key**, or paste it directly into `window.GOOGLE_MAPS_API_KEY` near the bottom of `booking-example.html` — either way, I'll confirm it's wired in and working.

## What it actually costs

Checked directly against Google's current pricing page (2026):

- **Maps JavaScript API** (showing the map itself) — free, no cap.
- **Places Autocomplete** and **Directions** — each get **10,000 free requests a month**, then roughly £2–3 per 1,000 after that.

For a small business enquiry form, normal traffic won't get anywhere near 10,000 requests a month, so this should cost nothing in practice. Google still requires a card on file as a condition of switching the APIs on at all — that's their fraud-prevention step, not a sign you're expected to pay.
