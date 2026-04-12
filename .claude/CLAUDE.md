# Claude Code Sub-Agents Configuration

## Agent Auto-Trigger Rules

This project uses specialized sub-agents to keep the main session context clean.
Each agent runs in isolation - its context stays inside the subagent, not the main session.

### 1. Session Explorer (FIRST thing every session)
- **Trigger:** User greets Claude (Hi, Hello, Hey, Hola, etc.)
- **Action:** Spawn `session-explorer` agent IMMEDIATELY
- **Purpose:** Reads all handovers, memories, git history, and Supabase context
- **Result:** Delivers a clean 30-line summary to the main session
- **File:** `.claude/agents/session-explorer.md`

### 2. Code Reviewer (After every code change)
- **Trigger:** After ANY Write or Edit tool call that modifies source code
- **Action:** Spawn `code-reviewer` agent
- **Purpose:** Reviews types, security (OWASP), performance, and quality
- **Result:** Delivers pass/fail verdict with actionable findings
- **File:** `.claude/agents/code-reviewer.md`

### 3. Debugger (Before any fix)
- **Trigger:** When user reports a bug or before applying a fix
- **Action:** Spawn `debugger` agent BEFORE writing fix code
- **Purpose:** Impact analysis, hypothesis, verification plan
- **Result:** Delivers fix proposal with blast radius map
- **File:** `.claude/agents/debugger.md`

### 4. Test Writer (After new functionality)
- **Trigger:** After any new function, class, or feature is created
- **Action:** Spawn `test-writer` agent
- **Purpose:** Writes tests following existing project patterns
- **Result:** Delivers test file or manual test checklist
- **File:** `.claude/agents/test-writer.md`

## Why Sub-Agents?

Handovers and skills consume 60%+ of session context when read directly.
Sub-agents read the heavy files in isolation and return only concise summaries.
This keeps the main session clean with maximum capacity for actual work.

## Related Files

- **`access.md`** (in this same `.claude/` folder) — credentials, MCP servers, and "what to do when Claude says it can't find X". Read this if a task requires Shopify Admin API, the Shopify CLI, or any external service.
- **`../CLAUDE.md`** (repo root) — brand, design tokens, theme architecture, and coding conventions.
- **`../.env.example`** — environment variable template.
- **`../.mcp.json`** — project-level MCP server declarations.
