# scripts/

Utility scripts that Claude sessions can run directly via Bash. No MCP required.

## browser-test.js — dual-mode browser agent

Opens a browser and navigates. Two modes, auto-detected:

### 🟢 LOCAL MODE (preferred — you can SEE and INTERACT with the browser)

Uses your **real Chrome with Profile 16** — the profile dedicated to this project. All your logins (GYG supplier, Shopify admin, etc.) are already saved. **No password handling needed.**

**Prereqs:**
1. `.env` has `CHROME_USER_DATA_DIR` and `CHROME_PROFILE` set (see `.env.example`)
2. **Close all Chrome windows** before running (Chrome locks the profile directory)

**Find your Chrome path:**
1. Open Chrome with Profile 16 active
2. Go to `chrome://version/`
3. Copy the **"Profile Path"** — the parent dir is `CHROME_USER_DATA_DIR`, the last segment (`Profile 16`) is `CHROME_PROFILE`

**Run:**
```bash
node scripts/browser-test.js
# Chrome opens visibly with Profile 16, navigates to tourinkohsamui.com
```

When captcha or password prompts appear, **you solve them manually** in the window. The script leaves the browser open for interaction.

### 🟡 SANDBOX MODE (fallback — headless)

Runs in Claude's sandbox with bundled Chromium. No login state, no interaction — just screenshots of public pages.

**Used automatically** when `CHROME_USER_DATA_DIR` is not set and `HTTP_PROXY` is present (Anthropic sandbox indicator).

**Force sandbox mode:**
```bash
node scripts/browser-test.js --sandbox
```

### Options

```bash
node scripts/browser-test.js --url=https://supplier.getyourguide.com
node scripts/browser-test.js --url=https://tourinkohsamui.com/products/koh-tan-snorkeling
```

### Output

- `/tmp/shot-desktop.png` — viewport screenshot
- `/tmp/shot-mobile.png` — 390×844 iPhone viewport (sandbox only)

---

## How to use this from Claude

### When Claude Code runs on your local machine

1. Make sure Chrome is **closed**
2. In Claude Code, say: *"abrí el browser con Profile 16 y andá a GYG"*
3. Claude invokes the Playwright MCP (declared in `.mcp.json`) which auto-launches your Chrome with Profile 16
4. You see the window, Claude drives it, you intervene when asked

### When Claude Code runs in the cloud sandbox

- `.mcp.json`'s Playwright config can't reach your local Chrome — use sandbox mode
- Claude runs `scripts/browser-test.js --sandbox` via Bash and returns screenshots
- No interaction possible from your side (no window to show)

---

## Extending the script

```js
// After navigating, do more:
await page.click('text=Tours');
await page.fill('input[name="properties[WhatsApp]"]', '+66812345678');
await page.screenshot({ path: '/tmp/after-click.png' });
```

## Gotchas

- **LOCAL: close Chrome first.** Chrome locks the profile directory while running; Playwright's `launchPersistentContext` will fail otherwise.
- **LOCAL: requires real Chrome installed.** If you only have Chromium, edit the script to remove `channel: 'chrome'`.
- **SANDBOX: proxy does TLS interception.** That's why `ignoreHTTPSErrors: true` is set. Don't remove outside the sandbox.
- **SANDBOX: bot detection.** GYG and similar will often detect sandbox IPs and reject logins with "incorrect password" even when creds are valid. Use LOCAL mode for any authenticated flow.
- **Full-page screenshots** on content-heavy pages can be huge. Don't commit them.
