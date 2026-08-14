# Getting the redesigned website live on BigWetFish

*Updated 2026-08-14 — this replaces the previous version of this guide. The site has been completely redesigned (new "Waterfront" look: ivory/navy/brass, real Liverpool waterfront photography of the fleet) but the upload process is unchanged since you're staying on BigWetFish manual upload.*

## 1. Upload the files

1. Log in to your BigWetFish account and open the **Enhance** control panel for liverexectours.com.
2. Look for **File Manager** (sometimes under "Files" or "Website").
3. Navigate to your site's web root — usually called `public_html`, `htdocs`, or just `/` depending on how Enhance labels it.
4. Delete or rename whatever's currently there (the blank placeholder page).
5. Upload the **contents** of the `liverexectours-site` folder (not the folder itself) into that web root — you should end up with `index.html` and the `css`, `js`, `images` folders all sitting directly in the web root.
6. Visit liverexectours.com in a browser to check it's live. It can take a few minutes to update.

If File Manager doesn't accept a folder upload directly, zip the contents of `liverexectours-site` first, upload the zip, then look for an "extract" option after uploading.

## 2. What changed in this redesign

- New colour palette (warm ivory/stone with deep navy and a brass accent) and new typefaces (Fraunces for headings, Work Sans for body text) — a different visual direction from the old dark charcoal/gold version.
- Real photos now used throughout instead of placeholders: the Vito and Sprinter both have dedicated shots taken outside the Royal Liver Building, and the hero banner uses a shot with the actual Liver Building clock tower.
- The **Lexus SUV** still has no photo — it shows a styled "Photo coming soon" card rather than a broken image. Same for adding one later:
  1. Take/select a photo (landscape orientation works best, roughly 1400×1050px, under 400KB for fast loading).
  2. Name it `fleet-lexus.jpg` and upload it into the `images` folder via File Manager.
  3. In `index.html`, find the Lexus card in the Fleet section — it currently looks like this:

     ```html
     <div class="fleet-photo fleet-photo-placeholder">
       <span class="ph-label">Photo coming soon</span>
       <span class="ph-sub">Lexus SUV</span>
     </div>
     ```

     Replace it with:

     ```html
     <div class="fleet-photo">
       <img src="images/fleet-lexus.jpg" alt="Liver Exec Tours Lexus SUV" loading="lazy" width="1400" height="1050">
     </div>
     ```

     Most file managers have a built-in code editor — click the file, find that block, and edit directly in the browser. Happy to do this edit for you directly once you've got the photo — just share it here.

## 3. A couple of things worth knowing

- **The contact form** submits into a Supabase database when `SUPABASE_URL` / `SUPABASE_ANON_KEY` are filled in near the bottom of `index.html` (currently blank) — until then it falls back to opening the visitor's email app with the message pre-filled. Ask if you want help getting the Supabase keys wired in.
- **The phone number and email** throughout the site come from what's on the Google Business Profile (07540 838531 / Liverexectours@gmail.com). If either changes, it's all in the one `index.html` file (search-and-replace, or ask me to update it).
- **Nothing on this site names Carlsberg or Boodles** — it uses the "trusted by leading Liverpool corporates and retail brands" line, consistent with the Business Profile and the open decision on client-showcase approach.
- This folder (not the Claude Project) is now the source of truth for the website — see `CLAUDE.md` in the folder root for full status.
