import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from 'verhoeff';
import { faker } from '@faker-js/faker';

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

function generateUniqueName() {
  const firstNameRaw = faker.person.firstName();
  const lastNameRaw = faker.person.lastName();
  const firstName = firstNameRaw.replace(/[^A-Za-z]/g, '') || 'Test';
  const lastName = lastNameRaw.replace(/[^A-Za-z]/g, '') || 'User';
  const suffix = faker.string.alpha({ length: 3, casing: 'upper' });
  return `${firstName} ${lastName} ${suffix}`;
}

function generateUniqueEmail(fullName) {
  const domain = '@gmail.com';
  const maxTotalLength = 30;
  const maxLocalLength = maxTotalLength - domain.length;

  const cleanBase = (fullName || 'user').toLowerCase().replace(/[^a-z]/g, '') || 'user';
  const suffix = `${Date.now().toString(36)}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')}`;
  const maxBaseLength = Math.max(1, maxLocalLength - suffix.length);
  const basePart = cleanBase.slice(0, maxBaseLength);
  const localPart = `${basePart}${suffix}`.slice(0, maxLocalLength);

  return `${localPart}${domain}`;
}

async function fillField(locator, value) {
  await locator.scrollIntoViewIfNeeded();
  await locator.fill(String(value));
}

async function selectByVisibleLabel(page, selector, label) {
  const dropdown = page.locator(selector);
  await dropdown.scrollIntoViewIfNeeded();
  await dropdown.selectOption({ label });
}

test.describe('Foreign Verification Automation', () => {
  test('should register a foreign verification with sample data', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('http://68.233.110.246/bnrc_stg/home', { waitUntil: 'domcontentloaded' });

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

    await page.locator("a.dropdown-item[href='/bnrc_stg/Website/foreign-verification']").first().click();

    await page.locator("select[formcontrolname='courseId']").selectOption('2');

    const uniqueApplicantName = generateUniqueName();
    const uniqueFatherName = generateUniqueName();
    const uniqueEmail = generateUniqueEmail(uniqueApplicantName);
    const uniqueMobile = generateUniqueMobileNumber();
    const uniqueAadhaar = generateValidAadhaarNumber();

    await fillField(page.locator("input[formcontrolname='applicantName']"), uniqueApplicantName);
    await selectByVisibleLabel(page, "select[formcontrolname='genderId']", 'Male');
    await fillField(page.locator("input[formcontrolname='fatherName']"), uniqueFatherName);

    const dobInput = page.locator("input[formcontrolname='dob']");
    await dobInput.scrollIntoViewIfNeeded();
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - 220;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
    }, "input[formcontrolname='dob']");

    const yearHeader = page.locator("button.current span", { hasText: '2010' }).first();
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
    await page.waitForTimeout(600);

    await expect(yearHeader).toBeVisible();
    await yearHeader.click();
    await page.waitForTimeout(600);

    let dobYearSelected = false;
    for (let attempt = 0; attempt < 6 && !dobYearSelected; attempt += 1) {
      const year2002 = page.locator("xpath=//span[text()='2002']").first();
      if (await year2002.isVisible().catch(() => false)) {
        await page.waitForTimeout(600);
        await year2002.click();
        dobYearSelected = true;
      } else {
        await page.locator('button.previous').first().click();
        await page.waitForTimeout(450);
      }
    }

    await page.locator("xpath=//span[text()='June']").first().click();
    await page.locator("xpath=//span[text()='14']").first().click();

    await fillField(page.locator("input[formcontrolname='email']"), uniqueEmail);
    await fillField(page.locator("input[formcontrolname='mobNo']"), uniqueMobile);

    await selectByVisibleLabel(page, "select[formcontrolname='stateId']", 'Bihar');
    await selectByVisibleLabel(page, "select[formcontrolname='districtId']", 'GAYA JI');
    await selectByVisibleLabel(page, "select[formcontrolname='categoryId']", 'Unreserved (GEN/UR)');

    await fillField(page.locator("input[formcontrolname='aadhaarName']"), uniqueApplicantName);

    await page.locator("input[placeholder='YYYY']").first().click();
    let aadhaarYearSelected = false;
    for (let attempt = 0; attempt < 6 && !aadhaarYearSelected; attempt += 1) {
      const year2002 = page.locator("xpath=//span[text()='2002']").first();
      if (await year2002.isVisible().catch(() => false)) {
        await page.waitForTimeout(600);
        await year2002.click();
        aadhaarYearSelected = true;
      } else {
        await page.locator('button.previous').first().click();
        await page.waitForTimeout(450);
      }
    }

    await fillField(page.locator("input[formcontrolname='aadharNumber']"), uniqueAadhaar);
    await selectByVisibleLabel(page, "select[formcontrolname='educationId']", 'Matriculation');

    await page.locator("input[formcontrolname='passedYear']").click();
    let passedYearSelected = false;
    for (let attempt = 0; attempt < 8 && !passedYearSelected; attempt += 1) {
      const year2020 = page.locator("xpath=//span[text()='2020']").first();
      if (await year2020.isVisible().catch(() => false)) {
        await year2020.click();
        passedYearSelected = true;
      } else {
        await page.locator('button.previous').first().click();
        await page.waitForTimeout(450);
      }
    }

    await fillField(page.locator("input[formcontrolname='boardName']"), 'CBSE');
    await fillField(page.locator("input[formcontrolname='securedMarks']"), '90');

    const degreeCertificateInput = page.locator("input#degreeCertificateDoc[type='file']");
    const certificatePath = path.resolve('./Sample document.pdf');
    await degreeCertificateInput.setInputFiles(certificatePath);

    await fillField(page.locator("input[formcontrolname='captcha']"), '1');

    const declarationCheckbox = page.locator("input[type='checkbox']#flexCheckDefault");
    await declarationCheckbox.scrollIntoViewIfNeeded();
    await declarationCheckbox.check();

    await page.locator("button[type='submit'].btn-success").click();

    const yesButton = page.getByRole('button', { name: /Yes, save it!/i }).first();
    await yesButton.click();

    const swalContainer = page.locator('div.swal2-html-container').first();
    await expect(swalContainer).toContainText(/TEMP\d+/);

    const swalText = await swalContainer.innerText();
    const tempIdMatch = swalText.match(/TEMP\d+/);
    const tempId = tempIdMatch ? tempIdMatch[0] : 'Not-found';

    const screenshotDir = path.resolve(__dirname, '../../BNRCscreenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const tempIdScreenshotPath = path.join(screenshotDir, `foreign-temp-id-${tempId}.png`);
    await page.screenshot({ path: tempIdScreenshotPath, fullPage: true });

    const okButton = page.getByRole('button', { name: /^OK$/i }).first();
    await okButton.click();
  });
});
