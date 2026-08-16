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

- Run all git/terminal commands directly — never give Joe copy-paste instructions
- Discuss design or structural changes before building them
- Phone number is 07808 299060 (5+ places in index.html, and 447808299060 in main.js)
- Brass colour is #C4973A — text on brass is always #ffffff
- Never name Carlsberg or Boodles publicly — use "trusted by leading Liverpool corporates and retail brands"
- GitHub Pages (letsplanorlando.github.io/Liver-Exec-Tours) auto-deploys on push to main — production is BigWetFish (manual upload)
