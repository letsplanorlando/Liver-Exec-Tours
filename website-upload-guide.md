# Getting the website live on BigWetFish

Your site is built and ready — a single scrolling page (Home / Services / Fleet / About / Contact, all on one page with a nav that jumps to each section), fully responsive, no ongoing costs beyond the hosting you already have. Here's how to get it live.

## 1. Upload the files

1. Log in to your BigWetFish account and open the **Enhance** control panel for liverexectours.com.
2. Look for **File Manager** (sometimes under "Files" or "Website").
3. Navigate to your site's web root — usually called `public_html`, `htdocs`, or just `/` depending on how Enhance labels it.
4. If there's an existing blank `index.html` (or similar) sitting there, delete or rename it.
5. Unzip `liverexectours-site.zip` on your own computer first, then upload the **contents** of the `liverexectours-site` folder (not the folder itself) into that web root — you should end up with `index.html` and the `css`, `js`, `images` folders all sitting directly in the web root.
6. Visit liverexectours.com in a browser to check it's live. It can take a few minutes to update.

If File Manager doesn't accept a zip upload directly, most panels let you upload the zip and then "extract" it in place — look for an extract/unzip option after uploading.

## 2. Adding your fleet photos (after this weekend's shoot)

Right now, everywhere a vehicle photo will go, the site shows a placeholder box that says "Photo coming soon." To swap in a real photo:

1. Pick your best shot for each vehicle (recommended: landscape orientation, roughly 1200×900px, under 1MB each for fast loading).
2. Name them clearly, e.g. `vito.jpg`, `lexus.jpg`, `sprinter.jpg`, and upload them into the `images` folder via File Manager.
3. In each page's HTML where you see a block like this:

   ```html
   <div class="photo-placeholder">
     <span class="ph-label">Photo coming soon &mdash; Mercedes Vito</span>
   </div>
   ```

   Replace it with:

   ```html
   <div class="photo-placeholder">
     <img src="images/vito.jpg" alt="Mercedes Vito">
   </div>
   ```

   Most file managers have a built-in code editor — click the file, find that block, and edit directly in the browser. No need to re-upload the whole site.

4. There are 4 placeholders in total, all in `index.html`: three in the Fleet section (Vito, Lexus, Sprinter) and one in the About section (team/driver photo). Happy to do this edit for you directly once you've got the photos — just share them here.

## 3. A couple of things worth knowing

- **The contact form** doesn't have a backend (there's no server behind this site, which is what keeps it free) — when a visitor submits it, it opens their own email app with the message pre-filled, addressed to Liverexectours@gmail.com. It works, but it's an extra step for the visitor. If you want a smoother "submits without opening email" experience later, a free tier of a form service like Formspree can be dropped in — just ask and I'll wire it up.
- **The phone number and email** throughout the site come from what's on the Google Business Profile (07540 838531 / Liverexectours@gmail.com). If either changes, it's all in the one `index.html` file (search-and-replace, or ask me to update it).
- **Nothing on this site names Carlsberg or Boodles** — it uses the "trusted by leading Liverpool corporates and retail brands" line, consistent with the Business Profile and the open decision on client-showcase approach.
