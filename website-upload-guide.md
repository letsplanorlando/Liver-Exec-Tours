# Getting the website live on BigWetFish

*Updated 2026-09-20 after the first quick update (§ 3); first written 2026-08-28 after the first real upload. This file now only covers the upload mechanics — for what's currently on the site, see `CLAUDE.md` in this folder, which is the single source of truth for that.*

## 0. Pre-flight — ten seconds, don't skip

From the project folder, run:

```
grep -n PLACEHOLDER liverexectours-site/index.html
```

If it prints nothing, carry on. If it finds the `PLACEHOLDER QUOTES` comment, the testimonials are still placeholder wording. That was shipped on purpose on 2026-09-20 (Joe's call), so it's fine to carry on *if he's still happy with it* — but the real, client-approved quotes should replace it as soon as they exist (see `CLAUDE.md` → Open items). Never ship new placeholder content without asking him first.

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

## 3. Quick update — only the files that changed (worked 2026-09-20)

Most updates touch a handful of small files, so skip the big zips. Last upload = git commit `469c861` (2026-09-20).

1. **Pack only what changed.** `git diff --stat <last-uploaded-commit> HEAD -- liverexectours-site` lists it. Zip just those files with their relative paths (`index.html`, `css/…`, `js/…`), run from inside `liverexectours-site`. Check each file in the zip matches `git show HEAD:liverexectours-site/<file>` (compare `shasum`). *zsh gotcha:* keep the file list in an array (`FILES=(a b c)` and `"${FILES[@]}"`) — an unquoted `$FILES` doesn't word-split in zsh.
2. **Check the live site hasn't been touched.** For each file, `curl -s https://liverexectours.com/<file> | shasum` should equal `git show <last-uploaded-commit>:liverexectours-site/<file> | shasum`. A mismatch means someone changed the live site — stop and look (this account has had a break-in, see the memory note).
3. **Log in to cPanel in a Chrome window that Claude opens.** Claude in Chrome can't reuse a tab you logged into earlier: cPanel addresses carry a session token, and the bare `https://server815.bigwetfish.co.uk:2083/` just says "The security token is missing". So Claude opens that address in its own window, **you type the password and log in** (Claude never enters passwords), and Claude then works from the tokenised address.
4. **Look at the folder first.** File Manager at `…/cpsessNNN/frontend/jupiter/filemanager/index.html?dir=%2Fhome%2Frealmome%2Fliverexectours.com`. It should hold only `.well-known`, `css`, `images`, `js`, `.htaccess` and `index.html`. Anything else — random-named folders, `php.ini`, stray `.php` files — is the earlier break-in coming back: stop. `.htaccess` should be just cPanel's own `# php -- BEGIN cPanel-generated handler` block (hosting rewrites it now and then; harmless).
5. **Upload to the home folder, extract into the site folder.** Upload page: `…/filemanager/upload-ajax.html?dir=%2Fhome%2Frealmome` (the home folder isn't web-visible, so there's nothing to delete from the public site afterwards). Then in File Manager at `/home/realmome`, right-click the zip → Extract → type `liverexectours.com` (relative to home) → Extract Files. The results should list exactly the files you zipped.
6. **Verify.** Repeat the `curl … | shasum` comparison against the new build, then load the live page and try an address in the planner (checks the Maps key still works on the live domain). Hard-refresh — browsers cache this site.
7. **Tidy up.** Close the Claude-opened window and log out of cPanel. The zip left in `/home/realmome` is harmless; delete it whenever.

**Rollback:** re-upload the previous versions from git (`git show <last-uploaded-commit>:liverexectours-site/<file>`) the same way.
