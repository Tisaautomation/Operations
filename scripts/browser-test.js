const { chromium } = require('/opt/node22/lib/node_modules/playwright');

// Parse HTTP_PROXY env var: http://user:pass@host:port
function parseProxy(url) {
  if (!url) return null;
  const m = url.match(/^https?:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return { server: url };
  return {
    server: `http://${m[3]}`,
    username: m[1],
    password: m[2],
  };
}

(async () => {
  const proxy = parseProxy(process.env.HTTP_PROXY || process.env.http_proxy);
  console.log(`→ proxy: ${proxy ? proxy.server : 'none'}`);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Claude-Code-Agent',
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  console.log('→ Desktop: https://tourinkohsamui.com');
  await page.goto('https://tourinkohsamui.com', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(2000); // let fonts + hero load
  console.log(`  title: ${await page.title()}`);
  await page.screenshot({ path: '/tmp/tiks-desktop.png', fullPage: false });
  console.log('  ✓ /tmp/tiks-desktop.png');

  console.log('→ Mobile: 390×844 (iPhone 13 viewport)');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/tiks-mobile.png', fullPage: false });
  console.log('  ✓ /tmp/tiks-mobile.png');

  console.log('→ Full-page mobile (scroll screenshot)');
  await page.screenshot({ path: '/tmp/tiks-mobile-full.png', fullPage: true });
  console.log('  ✓ /tmp/tiks-mobile-full.png');

  await browser.close();
  console.log('DONE');
})().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
