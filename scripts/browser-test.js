// scripts/browser-test.js
// Browser agent for Tour in Koh Samui Operations repo.
//
// Two modes, auto-detected:
//
//   1. LOCAL MODE (preferred — you SEE the browser):
//      Runs on your own machine, uses your real Chrome with Profile 16.
//      Requires .env with CHROME_USER_DATA_DIR + CHROME_PROFILE.
//      All logins (GYG, Shopify admin, etc.) are already saved in the profile.
//      PREREQ: close Chrome completely first — Chrome locks the profile dir.
//
//   2. SANDBOX MODE (fallback):
//      Headless in Claude's sandbox with bundled Chromium.
//      No persistent profile — fresh every run. Fine for public-page screenshots.
//
// Usage:
//   node scripts/browser-test.js                   # auto-detect mode
//   node scripts/browser-test.js --sandbox         # force sandbox
//   node scripts/browser-test.js --url=URL         # override target URL

const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

// ---------- tiny .env loader (zero-dependency) ----------
(function loadEnv() {
  const p = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
})();

// ---------- args ----------
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v === undefined ? true : v];
}));
const URL_ = args.url || 'https://tourinkohsamui.com';
const FORCE_SANDBOX = !!args.sandbox;

// ---------- proxy parser (sandbox) ----------
function parseProxy(url) {
  if (!url) return null;
  const m = url.match(/^https?:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return { server: url };
  return { server: `http://${m[3]}`, username: m[1], password: m[2] };
}

// ---------- decide mode ----------
const hasLocalProfile = !!process.env.CHROME_USER_DATA_DIR;
const inSandbox = !!process.env.HTTP_PROXY;
const mode = (FORCE_SANDBOX || (!hasLocalProfile && inSandbox)) ? 'sandbox' : 'local';

console.log(`mode: ${mode}  |  url: ${URL_}`);

(async () => {
  let browser, ctx;

  if (mode === 'local') {
    const userDataDir = process.env.CHROME_USER_DATA_DIR;
    const profile = process.env.CHROME_PROFILE || 'Profile 16';
    console.log(`profile: ${profile}  |  userDataDir: ${userDataDir}`);
    console.log('⚠  Close all Chrome windows first — Chrome locks the profile dir.\n');

    ctx = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',        // real Chrome, not bundled Chromium
      headless: false,          // visible window
      viewport: null,           // use natural window size
      args: [`--profile-directory=${profile}`],
    });
  } else {
    browser = await chromium.launch({
      headless: true,
      executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      proxy: parseProxy(process.env.HTTP_PROXY),
    });
    ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      ignoreHTTPSErrors: true,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Claude-Code-Agent',
    });
  }

  const page = ctx.pages()[0] || await ctx.newPage();

  // Resilient navigation: retry on transient 503 / sandbox-IP rate limits
  // (Shopify edge sometimes 503s requests from datacenter IPs; that is NOT
  // a customer-facing bug — never report it as one. See git log a4f0... for context.)
  async function gotoWithRetry(url, attempts = 3) {
    for (let i = 1; i <= attempts; i++) {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(e => ({ _err: e.message }));
      const status = resp && !resp._err ? resp.status() : null;
      if (status && status < 400) return resp;
      const errorPage = await page.evaluate(() => /there was a problem loading|503/i.test(document.title + document.body.textContent.slice(0, 200))).catch(() => false);
      if (status && status < 500 && !errorPage) return resp; // 4xx is real, not transient
      console.log(`  ⚠ attempt ${i}/${attempts}: status=${status || 'err'} ${errorPage ? '(error page)' : ''} — retrying in ${i * 2}s`);
      if (i < attempts) await page.waitForTimeout(i * 2000);
    }
    throw new Error(`Failed after ${attempts} attempts (likely transient 503 from sandbox IP, not a real bug)`);
  }

  console.log('→ navigating…');
  await gotoWithRetry(URL_);
  await page.waitForTimeout(2000);
  console.log(`  title: ${await page.title()}`);
  console.log(`  url:   ${page.url()}`);

  await page.screenshot({ path: '/tmp/shot-desktop.png' });
  console.log('  ✓ /tmp/shot-desktop.png');

  if (mode === 'sandbox') {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/tmp/shot-mobile.png' });
    console.log('  ✓ /tmp/shot-mobile.png');
  }

  if (mode === 'local') {
    console.log('\n✅ Browser is open on your screen. Interact freely.');
    console.log('   Close the Chrome window when you\'re done.');
  } else {
    if (browser) await browser.close();
    console.log('DONE');
  }
})().catch(e => {
  console.error('\nFATAL:', e.message);
  if (/ProcessSingleton|SingletonLock|profile/i.test(e.message)) {
    console.error('Hint: close ALL Chrome windows first (Chrome locks the profile).');
  }
  if (/chromium.*not found|Chrome distribution/i.test(e.message)) {
    console.error('Hint: run `npx playwright install chrome` on your local machine.');
  }
  process.exit(1);
});
