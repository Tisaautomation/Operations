# `.claude/` — Infrastructure Index

> Visual map of everything Claude needs to work on this repo. If you're a new session, **start here, then follow the links**.

---

## 🗺️ The Big Picture

```
Operations/
│
├── 📘 CLAUDE.md                      ← brand, design, theme architecture (START HERE)
├── 🔒 .gitignore                     ← protects secrets & artifacts
├── 📋 .env.example                   ← env var template (copy to .env locally)
├── 🔌 .mcp.json                      ← declares MCP servers for this project
│
├── 🚀 boot/                          ← fast context loading per domain
│   ├── README.md                     ← convention spec + index
│   ├── booking.md                    ← "boot booking"   → tour booking system
│   ├── theme.md                      ← "boot theme"     → Shopify Horizon arch
│   ├── brand.md                      ← "boot brand"     → colors/fonts/logos
│   ├── ops.md                        ← "boot ops"       → deploy/CLI/env/auth
│   ├── content.md                    ← "boot content"   → collections/metafields
│   ├── marketing.md                  ← "boot marketing" → ⚠️ separate repo
│   └── accounting.md                 ← "boot accounting"→ ⚠️ separate repo
│
└── .claude/                          ← Claude-specific infrastructure
    │
    ├── 📖 README.md                  ← (you are here) index of this folder
    ├── 🤖 CLAUDE.md                  ← sub-agent auto-trigger rules
    ├── 🔑 access.md                  ← credentials + "what to do when you can't find X"
    │
    └── agents/                       ← 4 specialized sub-agents
        ├── session-explorer.md       ← runs on greeting — reads all context
        ├── code-reviewer.md          ← runs after code changes — quality + security
        ├── debugger.md               ← runs before fixes — blast radius analysis
        └── test-writer.md            ← runs after new features — writes tests
```

---

## 🚦 Read Order for a New Session

| Order | File | Why | Time |
|---|---|---|---|
| 1 | `../CLAUDE.md` | Brand, colors, fonts, theme structure | 3 min |
| 2 | `CLAUDE.md` (this folder) | Know which sub-agent to trigger when | 30 sec |
| 3 | `access.md` | Know what APIs / MCPs are available | 1 min |
| 4 | `agents/*.md` | Only when actually using a sub-agent | on demand |

---

## 🚀 Boot Commands — Load Domain Context Fast

Say any of these and any Claude immediately has the full domain context in 30 seconds:

| Say this | Claude reads | What you get |
|---|---|---|
| `boot booking` | `../boot/booking.md` | Tour booking flow + action menu |
| `boot theme` | `../boot/theme.md` | Theme architecture + what can be edited |
| `boot brand` | `../boot/brand.md` | Colors, fonts, logos + usage patterns |
| `boot ops` | `../boot/ops.md` | Deploy, CLI, env, credentials |
| `boot content` | `../boot/content.md` | Collections, metafields, catalog |
| `boot marketing` | `../boot/marketing.md` | ⚠️ *lives in separate repo* |
| `boot accounting` | `../boot/accounting.md` | ⚠️ *lives in separate repo* |

Full convention + how to add a new boot: [`../boot/README.md`](../boot/README.md).
Rules: [`../CLAUDE.md` §15b](../CLAUDE.md).

---

## 🎯 Quick Reference — "I need to…"

| Task | Where to look |
|---|---|
| Know brand colors or fonts | `../CLAUDE.md` §3, §4 |
| Find a logo or favicon | `../CLAUDE.md` §5 or `../assets/` |
| Understand theme file structure | `../CLAUDE.md` §7 |
| See product metafields | `../CLAUDE.md` §9 |
| Check performance budget | `../CLAUDE.md` §11 |
| **Connect to Shopify Admin API** | `access.md` §3 |
| **Resolve "I can't find X"** | `access.md` §4 |
| Set up `.env` credentials | `access.md` §3 + `../.env.example` |
| Approve MCP servers | `access.md` §2 + `../.mcp.json` |
| Trigger a sub-agent | `CLAUDE.md` (this folder) §1-4 |

---

## 🤖 Sub-Agents — When They Run

| Agent | Trigger | Output |
|---|---|---|
| **session-explorer** | User greeting ("Hola", "Hi", "Hey") at session start | 30-line summary of project state, pending tasks, blockers |
| **code-reviewer** | After any `Write` / `Edit` to source code | Pass/fail verdict + actionable findings (types, security, perf) |
| **debugger** | User mentions bug / error / "not working" | Hypothesis + blast radius + verified fix proposal |
| **test-writer** | After new function / class / section / feature | Test file matching existing patterns, or manual checklist |

These trigger **automatically** — the main session doesn't read the heavy files, the sub-agents do. See `CLAUDE.md` in this folder for exact trigger rules.

---

## 🔑 Access Playbook — TL;DR

Full detail in [`access.md`](access.md). Short version:

1. **GitHub, Supabase, Vercel, Canva, Google Calendar** → ✅ already wired via MCPs
2. **Shopify Admin API** → needs user to:
   - Create Admin API token in Shopify admin
   - Copy `.env.example` → `.env` and paste token
   - `npm i -g @shopify/cli @shopify/theme && shopify login`
   - Accept `.mcp.json` prompt next Claude Code session
3. **"Can't find X"** → follow the 6-step search order in `access.md` §4 before ever saying "no"

---

## ⚠️ Golden Rules for Any Claude Session

| # | Rule | Enforced by |
|---|---|---|
| 1 | **🚨 Never change theme code based on linter/validator output alone — browser-test first. Production is at Lighthouse 97% and many "errors" are intentional optimizations.** | `../CLAUDE.md` §12c |
| 2 | **🚀 When user says "boot X" → read `../boot/X.md` IMMEDIATELY. Never ask for explanation if a boot exists.** | `../CLAUDE.md` §15b |
| 3 | Never hardcode brand colors / fonts — use CSS variables | `../CLAUDE.md` §12 |
| 4 | Never push to `main` without explicit approval | `../CLAUDE.md` §12 |
| 5 | Never commit `.env`, tokens, or keys | `../.gitignore` |
| 6 | Never give "I can't find X" without running the 6-step search | `access.md` §4 |
| 7 | Never skip the session-explorer sub-agent on a greeting | `CLAUDE.md` (this folder) §1 |
| 8 | Never modify Claude's global config (`~/.claude/settings.json`) | `access.md` §6 |

---

## 🔗 External Links

- Shopify theme docs: https://shopify.dev/docs/themes
- Liquid reference: https://shopify.dev/docs/api/liquid
- Shopify Admin API: https://shopify.dev/docs/api/admin
- GitHub repo: https://github.com/tisaautomation/operations
- Production site: https://tourinkohsamui.com

---

*Maintained by Claude sessions. If you update the structure of `.claude/`, update this README too.*
