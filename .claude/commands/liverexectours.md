# /liverexectours — Session Start

You are starting a work session on the Liver Exec Tours website project. Do the following steps in order, without asking the user anything first.

## Step 1: Read the source files

Read both of these in parallel:
- `/Users/joe/Documents/Liverexectours/CLAUDE.md`
- `/Users/joe/.claude/projects/-Users-joe-Documents-Liverexectours/memory/MEMORY.md`

Then read whichever memory files are listed in MEMORY.md.

## Step 2: Check git for recent changes

Run: `git -C /Users/joe/Documents/Liverexectours log --oneline -8`

This tells you what changed since CLAUDE.md was last written. If there are commits newer than the "Last updated" date in CLAUDE.md, note them.

## Step 3: Deliver the briefing

Write a short, scannable brief — no waffle. Use this structure:

---

**Liver Exec Tours — session brief**

**Site** — [one line: current page structure and where it's hosted for preview]

**Last changes** — [bullet list of what's actually different since last session, from git log]

**Open items** — [the open items from CLAUDE.md, shortest first]

**Watch-outs** — [anything from memory files Joe should know before touching code, e.g. CSS traps, naming rules, workflow rules]

---

## Step 4: Offer to update

If git shows commits that happened after the "Last updated" date in CLAUDE.md, say:
> "CLAUDE.md is behind — want me to update it to reflect the recent commits?"

If nothing is stale, say: "Everything's up to date. What are we working on?"

## Rules while working

- Run all git/terminal commands directly — never give Joe copy-paste instructions. But only commit when he asks, and only push when he says "push".
- Discuss design or structural changes before building them.
- Joe's laptop keyboard currently inserts stray full stops — ignore them. Ask decisions as short numbered questions in chat (answerable with a word or number), not popup multiple-choice.
- `CLAUDE.md` is the source of truth for facts — don't rely on values copied into this file, they go stale. In particular check it for: the palette (text on the champagne accent is dark, never white), where the phone number and email live, and the client-naming rule (never name the clients it lists anywhere public-facing — testimonial attributions included; use "trusted by leading Liverpool corporates and retail brands").
- GitHub Pages (letsplanorlando.github.io/Liver-Exec-Tours) auto-deploys on every push to `main` and is public. Production (liverexectours.com) is BigWetFish, updated by manual upload — follow `website-upload-guide.md` § 3 (Joe types the cPanel password himself, in a Chrome window Claude opens).
- Don't ship placeholder content to production without asking Joe. (The testimonials are the one deliberate exception, shipped 2026-09-20 — see CLAUDE.md § Open items.)
- Stop the local preview server (`range_server.py`) when you're done with it — it listens on the whole network.
