import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from 'verhoeff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateUniqueMobileNumber() {
  const firstDigit = Math.floor(Math.random() * 4) + 6;
  const restDigits = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, '0');
  return `${firstDigit}${restDigits}`;
}

function generateValidAadhaarNumber() {
  const firstDigit = Math.floor(Math.random() * 6) + 4;
  let remainingDigits = '';
  for (let i = 0; i < 10; i += 1) {
    remainingDigits += Math.floor(Math.random() * 10);
  }

  const baseNumber = `${firstDigit}${remainingDigits}`;
  const checkDigit = generate(baseNumber);
  return `${baseNumber}${checkDigit}`;
}

async function fillField(locator, value) {
  await locator.scrollIntoViewIfNeeded();
  await locator.fill(String(value));
}

async function setFieldValueWithoutJump(page, selector, value) {
  await page.evaluate(
    ({ css, val }) => {
      const elem = document.querySelector(css);
      if (!elem) {
        throw new Error(`Element not found: ${css}`);
      }
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      valueSetter.call(elem, String(val));
      elem.dispatchEvent(new Event('input', { bubbles: true }));
      elem.dispatchEvent(new Event('change', { bubbles: true }));
      elem.blur();
    },
    { css: selector, val: value }
  );
}

async function selectByVisibleLabel(page, selector, label) {
  const dropdown = page.locator(selector);
  await dropdown.scrollIntoViewIfNeeded();
  await dropdown.selectOption({ label });
}

test.describe('Certificate Verification Automation', () => {
  test('should register a certificate verification with sample data', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('http://68.233.110.246/bnrc_stg/home', { waitUntil: 'domcontentloaded' });

    // Dismiss startup alert if present
    const startupOk = page.locator("button.swal2-confirm, button:has-text('OK')").first();
    if (await startupOk.isVisible().catch(() => false)) {
      await startupOk.click({ force: true });
    }

    const eApplication = page.locator("a.nav-link.dropdown-toggle:has-text('E-Application')").first();
    await eApplication.scrollIntoViewIfNeeded();
    await eApplication.hover();
    try {
      await eApplication.click();
    } catch {
      await eApplication.click({ force: true });
    }

    const certificateVerificationOption = page
      .locator("a.dropdown-item[href='/bnrc_stg/Website/certificateVerification']")
      .first();
    await certificateVerificationOption.click();

    await page.locator("select[formcontrolname='course']").selectOption('2');

    await fillField(page.locator("input[formcontrolname='applicantName']"), 'DemodTest');
    await fillField(page.locator("input[formcontrolname='fatherName']"), 'Father Test');

    const dobInput = page.locator("input[formcontrolname='dob']");
    await dobInput.scrollIntoViewIfNeeded();
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - 220;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
    }, "input[formcontrolname='dob']");

    const yearHeader = page.locator("button.current span", { hasText: '2026' }).first();
    let dobOpened = false;
    for (let attempt = 0; attempt < 4 && !dobOpened; attempt += 1) {
      try {
        await dobInput.click();
      } catch {
        await page.evaluate((selector) => {
          const el = document.querySelector(selector);
          if (el) el.click();
        }, "input[formcontrolname='dob']");
      }

      if (await yearHeader.isVisible().catch(() => false)) {
        dobOpened = true;
      }
    }

    await expect(yearHeader).toBeVisible();
    await yearHeader.click();

    let yearSelected = false;
    for (let attempt = 0; attempt < 5 && !yearSelected; attempt += 1) {
      const year2003 = page.locator("xpath=//span[text()='2003']").first();
      try {
        await expect(year2003).toBeVisible();
        await year2003.click();
        yearSelected = true;
      } catch {
        await page.locator('button.previous').first().click();
      }
    }

    await expect(page.locator("xpath=//span[text()='June']").first()).toBeVisible();

    await page.locator("xpath=//span[text()='June']").first().click();
    await page.locator("xpath=//span[text()='20']").first().click();

    const emailValue = `test${Math.floor(Math.random() * 1000)}new@gmail.com`;
    await fillField(page.locator("input[formcontrolname='email']"), emailValue);

    const uniqueMobileNumber = generateUniqueMobileNumber();
    await setFieldValueWithoutJump(page, "input[formcontrolname='mobileNumber']", uniqueMobileNumber);

    await selectByVisibleLabel(page, "select[formcontrolname='state']", 'Bihar');
    await selectByVisibleLabel(page, "select[formcontrolname='category']", 'Unreserved (GEN/UR)');
    await selectByVisibleLabel(page, "select[formcontrolname='district']", 'GAYA JI');
    await selectByVisibleLabel(page, "select[formcontrolname='gender']", 'Female');

    await fillField(page.locator("input[formcontrolname='aadharName']"), 'DemodTest');

    await page.locator("xpath=//input[@placeholder='YYYY']").first().click();
    await page.waitForTimeout(700);
    await expect(page.locator("xpath=//*[text()='2003']").first()).toBeVisible();
    await page.locator("xpath=//*[text()='2003']").first().click();

    const validAadhaarNumber = generateValidAadhaarNumber();
    await fillField(page.locator("input[formcontrolname='aadharNumber']"), validAadhaarNumber);

    const sampleDocumentPath = path.resolve('./Sample document.pdf');

    await page.locator("input[name='organizationLetter']").setInputFiles(sampleDocumentPath);
    await fillField(page.locator("input[formcontrolname='agencyName']"), 'agencyagency');
    await page.locator("input[name='uploadCertificate']").setInputFiles(sampleDocumentPath);

    await fillField(page.locator("input[formcontrolname='captcha']"), '1');

    const declarationCheckbox = page.locator("input[type='checkbox']#flexCheckDefault");
    await declarationCheckbox.scrollIntoViewIfNeeded();
    await declarationCheckbox.check();

    await page.locator("button[type='submit'].btn-success").click();

    const yesSubmitButton = page.getByRole('button', { name: /Yes, Submit it!/i });
    await yesSubmitButton.click();

    const swalContainer = page.locator('div.swal2-html-container').first();
    await expect(swalContainer).toContainText(/TEMP\d+/);

    const swalText = await swalContainer.innerText();
    const tempIdMatch = swalText.match(/TEMP\d+/);
    const tempId = tempIdMatch ? tempIdMatch[0] : 'Not-found';

    const screenshotDir = path.resolve(__dirname, '../../BNRCscreenshots');
    if (!existsSync(screenshotDir)) {
      mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotDir, `temp-id-${tempId}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const okButton = page.getByRole('button', { name: /^OK$/i }).first();
    await okButton.click();
  });
});
