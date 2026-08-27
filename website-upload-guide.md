# Getting the website live on BigWetFish

*Updated 2026-08-28 after the first real upload. This file now only covers the upload mechanics — for what's currently on the site, see `CLAUDE.md` in this folder, which is the single source of truth for that.*

## 1. Find the right folder first — don't skip this

This BigWetFish account hosts **three separate domains** under one login: `realmoments.co.uk` (a different business — the account's main domain, files in `public_html`), `letsplanorlando.com`, and `liverexectours.com`. Liver Exec Tours' files go in **`/home/realmome/liverexectours.com`**, not `public_html` — uploading to the wrong folder would overwrite a different, unrelated live site.

To confirm the right folder: cPanel → **Domains** → find `liverexectours.com` in the list → the "Document Root" column shows the exact path. Always check this if it's been a while since the last upload, in case the account structure ever changes.

## 2. Upload the files

1. Log in to cPanel (`server815.bigwetfish.co.uk:2083`, or via BigWetFish's account panel) and open **File Manager**.
2. Navigate to `liverexectours.com`'s document root (found in step 1).
3. Upload the **contents** of the `liverexectours-site` folder (not the folder itself) — you should end up with `index.html` and the `css`, `js`, `images` folders sitting directly in that folder. Exclude `.DS_Store`, `_to_delete/`, and `index.html.bak` — none of those are meant to ship.
4. Visit `liverexectours.com` in a browser to confirm it's live. Hard-refresh (or use a private/incognito tab) if it looks stale — this site has been bitten by browser caching before.

**On file size:** File Manager's uploader (and some automation tools) can choke on very large uploads. If uploading the whole `liverexectours-site` folder as one zip fails or is rejected for size, split it into a few smaller zips instead (e.g. core files + a couple of image batches, each under ~8MB), upload each separately, and use File Manager's **Extract** feature on each — they'll merge into the same destination folder correctly since the zips share the same relative paths (`index.html`, `css/...`, `js/...`, `images/...`). Delete the zip(s) afterwards; they're not meant to stay on the server.

There's no FTP or git-based auto-deploy set up for production — this manual re-zip-and-reupload process is the standard way to update the live site until that changes.
