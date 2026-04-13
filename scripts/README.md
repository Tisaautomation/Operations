# scripts/

Utility scripts that Claude sessions can run directly via Bash. No MCP required.

## browser-test.js

Headless Chromium screenshot tool — works in the Claude Code sandbox where the MCP might not be available.

### Usage

```bash
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node scripts/browser-test.js
```

### What it does

1. Parses `HTTP_PROXY` env var (handles sandbox's JWT-auth proxy)
2. Launches Chromium from `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
3. Navigates to `tourinkohsamui.com`
4. Captures:
   - `/tmp/tiks-desktop.png` — 1440×900 desktop viewport
   - `/tmp/tiks-mobile.png` — 390×844 mobile (iPhone 13) viewport
   - `/tmp/tiks-mobile-full.png` — full-page scroll screenshot mobile

### When to use

- Before any theme edit (per `CLAUDE.md §12c` browser-test rule)
- After any commit that affects rendering — as a visual sanity check
- When the Playwright MCP isn't available in your session

### Extending it

The script is intentionally short and hackable. To test a different URL or flow, edit the `.goto()` line or add new steps like:

```js
await page.click('text=Tours');
await page.fill('input[name="properties[WhatsApp]"]', '+66812345678');
await page.screenshot({ path: '/tmp/after-click.png' });
```

### Gotchas

- The sandbox proxy does TLS interception — we use `ignoreHTTPSErrors: true`. Don't remove it unless you're running outside the sandbox.
- Chromium path is hardcoded to `/opt/pw-browsers/chromium-1194/...`. If Playwright updates the browser build, this path changes — check `ls /opt/pw-browsers/`.
- Full-page screenshots can be **huge** on content-heavy pages. Don't commit them.
