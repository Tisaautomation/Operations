# Boot: Operations

**TL;DR (30 seconds):** Shopify theme development. Local dev via `shopify theme dev`, deploy via `shopify theme push`. Credentials live in `.env` (gitignored). Every Claude session that opens this repo can learn what's wired and what's missing from `.claude/access.md`. `main` is the canonical library branch — every session starts there.

## Current State (2026-04-12)

- ✅ `main` is the canonical branch, all Claudes start here
- ✅ `.gitignore` protects `.env` and secrets
- ✅ `.env.example` documents required vars
- ✅ `.mcp.json` declares MCP servers
- ✅ `shopify-dev` MCP is **ACTIVE** (validated live with `validate_theme`)
- ✅ `.claude/access.md` is the "can't find X" playbook
- ✅ 4 sub-agents available (`session-explorer`, `code-reviewer`, `debugger`, `test-writer`)
- ⚠️ Shopify CLI NOT installed in this sandbox — user installs on their own machine
- ⚠️ Shopify Admin MCP declared but not yet installed (needs token + package)
- ❌ No Playwright MCP yet → cannot browser-test automatically (required per `CLAUDE.md §12c`)

## Key Files

| Path | Purpose |
|---|---|
| `.env.example` | Copy to `.env`, never commit. Lists required vars. |
| `.mcp.json` | Declares MCP servers for this project |
| `.gitignore` | Protects secrets + artifacts |
| `.claude/access.md` | Credential playbook (§1-6) |
| `.claude/README.md` | Golden rules + `.claude/` folder index |
| `.claude/agents/*.md` | 4 specialized sub-agents |
| `CLAUDE.md §13` | Shopify CLI command reference |
| `CLAUDE.md §14b` | Access overview |

## How It Works

```
User's local machine (your laptop)
    │
    ├── .env (real tokens — never committed)
    ├── shopify CLI logged into tourinkohsamui.myshopify.com
    └── Claude Code opens this repo
         │
         ↓ reads
    .mcp.json → prompts user → activates MCPs
         ↓
    ACTIVE:  shopify-dev, github, supabase, vercel, canva, gcal
    PENDING: shopify-admin (needs token), playwright (needs install)
```

## What You Can Do Right Now

### Local development
- **Start preview** → `shopify theme dev` (after `shopify login`)
- **Deploy to unpublished theme** → `shopify theme push --unpublished` (requires user approval)
- **Publish** → `shopify theme publish --theme <id>` (NEVER without explicit user approval)

### Validation & docs
- **Validate any theme file** → `mcp__shopify-dev__validate_theme`
- **Learn a Shopify API** → `mcp__shopify-dev__learn_shopify_api` then `search_docs_chunks`
- **Validate GraphQL** → `mcp__shopify-dev__validate_graphql_codeblocks`

### Git
- **Start new work** → `git checkout main && git pull && git checkout -b claude/<topic>-<id>`
- **Merge to main** → ONLY with explicit user approval for that merge

### Debugging access
- **"I can't find X"** → follow `.claude/access.md §4` (6-step search order) before ever saying "no"
- **Shopify Admin API setup** → `.claude/access.md §3` step-by-step

## Gotchas

- `.env` must NEVER be committed. If `.gitignore` disappears, restore it immediately.
- `~/.claude/settings.json` is OFF-LIMITS for Claude — it's the user's global config.
- Do not push to `main` without **explicit user approval for THIS merge**, even if the branch is ready. A prior approval ≠ standing approval.
- The sandbox where Claude runs does NOT have Shopify CLI installed — don't rely on it in scripts. User's machine does.
- Shopify Dev MCP requires calling `learn_shopify_api` FIRST to get a `conversationId`; all other tools fail without it.

## Authoritative Sources

- `.claude/access.md` — full access playbook
- `.claude/README.md` — golden rules
- `CLAUDE.md §12` — branching + coding conventions
- `CLAUDE.md §13` — Shopify CLI commands
- `CLAUDE.md §14b` — access overview + related files

## Last Updated

2026-04-12 · commit pending
