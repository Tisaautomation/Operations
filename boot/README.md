# Boot Commands — Context Loading System

> Fast domain-specific context for any Claude session.

## What is a Boot?

A "boot" is a **single markdown file** that gives any Claude every piece of context they need about ONE domain of this project — in 30 seconds of reading.

When the user says *"boot X"*, *"cargá X"*, or *"load X context"*, Claude reads `boot/X.md` and responds with a summary + action menu. **No explanation needed from the user.**

## Available Boots in This Repo

| Command | File | What it loads |
|---|---|---|
| `boot booking` | `booking.md` | Tour booking flow — WhatsApp field, location picker, cart properties |
| `boot theme` | `theme.md` | Shopify Horizon architecture, sections, snippets, templates |
| `boot brand` | `brand.md` | Colors, fonts, logos, voice/tone |
| `boot ops` | `ops.md` | Deploy, Shopify CLI, env vars, credentials |
| `boot content` | `content.md` | Collections, product metafields, catalog data |
| `boot marketing` | `marketing.md` | ⚠️ *Placeholder — lives in a different repo* |
| `boot accounting` | `accounting.md` | ⚠️ *Placeholder — lives in a different repo* |

## Convention — Every Boot File Follows This Template

```markdown
# Boot: <Name>

**TL;DR (30 seconds):** <one paragraph — what this domain is>

## Current State (YYYY-MM-DD)
<what works, what's broken, what's in progress>

## Key Files
<file paths + what each does>

## How It Works
<short technical explanation, ASCII diagrams if useful>

## What You Can Do Right Now
<action menu with first commands>

## Gotchas
<intentional things that look wrong but aren't>

## Authoritative Sources
<links to the source-of-truth files>

## Last Updated
<YYYY-MM-DD · commit hash>
```

## Creating a New Boot

1. Copy the template above
2. Create `boot/<domain>.md` (keep it **< 200 lines**)
3. Add a row to the table in this file
4. Add a row to `.claude/README.md` → Boot Commands section
5. Add a row to `CLAUDE.md` §18
6. Commit: `Add boot/<domain>.md — <one-line summary>`

## Rules for Claude

1. **When user says "boot X"** → read `boot/X.md` **immediately** and respond with TL;DR + action menu.
2. **Never** ask the user to explain a domain if a boot file exists for it.
3. **If boot file is missing** → list available boots + ask which one matches.
4. Keep boots **short** (< 200 lines) — they are **entry points**, not comprehensive docs.
5. Boots **link** to authoritative sources, they **never duplicate** them.

## Why This Exists

Session handovers + brand docs + architecture notes can consume 60%+ of a session's context window if dumped raw. A boot is pre-curated so:
- The user doesn't re-explain every session what the project is
- Claude doesn't re-discover the architecture every session
- Context loading is predictable and takes seconds, not minutes
