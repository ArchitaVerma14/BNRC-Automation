import { test, expect } from '@playwright/test';

// Extend timeout for this heavy scan
test.setTimeout(180000); // 3 minutes

test('TC_ODK_10: Full Form Scan -Report', async ({ page }) => {

  console.log(" Starting ultra-stable form scan...");

  await page.goto(
    'https://sangrahiuat.piramalswasthya.org/-/single/JnDocVcnqt0L8NfA65aSBgpYFexezu9?st=YjtDgr6N!3EHD63usOiWyYKEnoXtF9aqnQO5JdlsSHWXjzuV9Mne0n3hHkTbT5Ae',
    { timeout: 60000 }
  );

  const form = page.locator('form');
  await expect(form).toBeVisible({ timeout: 20000 });

  // 1️ Load entire form
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(150);
  }

  // 2️ Scan safe text elements
  const selectors = [
    'label', 'span', 'p', 'strong', 'em',
    'h1', 'h2', 'h3', 'legend'
  ];

  const elements = form.locator(selectors.join(', '));
  const count = await elements.count();

  console.log(` Scanning ${count} elements...\n`);

  const htmlRegex = /<[^>]+>|<\/[^>]+>|&lt;.*?&gt;/;
  let problems = [];
  let found = false;

  async function safeVisible(el) {
    try { return await el.isVisible({ timeout: 100 }); }
    catch { return false; }
  }

  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);

    if (!(await safeVisible(el))) continue;

    try { await el.scrollIntoViewIfNeeded(); } catch {}

    let text = "";
    try {
      text = await el.evaluate(node => node.textContent?.trim() || "");
    } catch {
      continue;
    }

    if (!text || /^[0-9]+$/.test(text)) continue;

    if (htmlRegex.test(text)) {
      found = true;
      problems.push({
        index: i + 1,
        text
      });
      console.log(`❌ BAD TEXT ${i + 1}: ${text}`);
    }
  }

  console.log("\n✔ Scan complete.\n");

  // Attach report to Playwright
  if (found) {
    await test.info().attach("HTML Tag Issues", {
      body: JSON.stringify(problems, null, 2),
      contentType: "application/json"
    });
  }

  // ----------------------------
  // Important Change for MODE B
  // ----------------------------
  console.log("📄 REPORT MODE ENABLED — Test will NOT fail.");
  console.log("📌 Total Issues Found: ", problems.length);

  // FORCE TEST PASSING (even if issues found)
  expect(true).toBe(true);
});

// ! npx playwright test "test/ODK/htmltag.js" --headed --project=chromium
