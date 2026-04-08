import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateUniqueOrganizationPhoneNumber(usedNumbers) {
  let number = '';
  do {
    const restDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    number = `0${restDigits}`;
  } while (usedNumbers.has(number));
  usedNumbers.add(number);
  return number;
}

function generateUniqueMobileNumber(usedNumbers) {
  let number = '';
  do {
    const firstDigit = Math.floor(Math.random() * 4) + 6;
    const restDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    number = `${firstDigit}${restDigits}`;
  } while (usedNumbers.has(number));
  usedNumbers.add(number);
  return number;
}

function generateUniqueEmail(prefix = 'test') {
  const domain = '@gmail.com';
  const maxTotalLength = 20;
  const maxLocalLength = maxTotalLength - domain.length;

  const cleanPrefix = (prefix || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
  const suffix = `${Date.now().toString(36)}${Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0')}`;
  const maxPrefixLen = Math.max(1, maxLocalLength - suffix.length);
  const safePrefix = cleanPrefix.slice(0, maxPrefixLen);
  const localPart = `${safePrefix}${suffix}`.slice(0, maxLocalLength);

  return `${localPart}${domain}`;
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

async function openDatePicker(page, inputSelector, yearHeaderText, scrollOffset = 220, useManualScroll = true) {
  const input = page.locator(inputSelector).first();
  await input.scrollIntoViewIfNeeded();
  if (useManualScroll) {
    await page.evaluate(({ selector, offset }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
    }, { selector: inputSelector, offset: scrollOffset });
  }

  const yearHeader = page.locator('button.current span', { hasText: yearHeaderText }).first();
  let opened = false;
  for (let attempt = 0; attempt < 4 && !opened; attempt += 1) {
    try {
      await input.click();
    } catch {
      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.click();
      }, inputSelector);
    }
    if (await yearHeader.isVisible().catch(() => false)) opened = true;
  }

  await expect(yearHeader).toBeVisible();
  await yearHeader.click();
}

async function selectYearSlow(page, yearText, maxAttempts = 20) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const year = page.locator(`xpath=//span[text()='${yearText}']`).first();
    if (await year.isVisible().catch(() => false)) {
      await page.waitForTimeout(600);
      await year.click();
      return;
    }

    await page.locator('button.previous').first().click();
    await page.waitForTimeout(450);
  }

  throw new Error(`Year ${yearText} not found in date picker`);
}

async function selectMonthAndDay(page, monthText, dayText) {
  await page.locator(`xpath=//span[text()='${monthText}']`).first().click();
  await page.waitForTimeout(350);
  await page.locator(`xpath=//span[text()='${dayText}']`).first().click();
}

async function uploadPdfForLabel(page, labelMatcher, filePayload) {
  const card = page
    .locator('div.col-lg-4.col-md-6.col-sm-12')
    .filter({ has: page.locator('label.form-label', { hasText: labelMatcher }) })
    .first();

  await expect(card).toBeVisible();

  const input = card.locator("input[type='file'][accept='application/pdf']").first();
  await input.evaluate((el) => {
    el.classList.remove('d-none');
    el.style.display = 'block';
    el.style.visibility = 'visible';
    el.removeAttribute('disabled');
  });
  await input.scrollIntoViewIfNeeded();
  await input.setInputFiles(filePayload);

  const attachedCount = await input.evaluate((el) => (el.files ? el.files.length : 0));
  expect(attachedCount).toBeGreaterThan(0);
}

async function clickSweetAlertOk(page, timeout = 15000) {
  const popup = page.locator('div.swal2-popup.swal2-modal').first();
  await expect(popup).toBeVisible({ timeout });

  const okSelectors = [
    "button.swal2-confirm",
    "button:has-text('OK')",
    "xpath=//button[contains(@class,'swal2-confirm') and normalize-space()='OK']",
  ];

  for (const selector of okSelectors) {
    const okBtn = popup.locator(selector).first();
    if (await okBtn.isVisible().catch(() => false)) {
      try {
        await okBtn.click({ timeout: 4000 });
      } catch {
        await okBtn.click({ force: true, timeout: 4000 });
      }
      return;
    }
  }

  throw new Error('SweetAlert OK button did not appear or was not clickable');
}

async function ensureAgreementChecked(page) {
  const checkbox = page.locator("input[type='checkbox']#flexCheckDefault").first();
  await checkbox.scrollIntoViewIfNeeded();

  if (await checkbox.isChecked().catch(() => false)) return;

  try {
    await checkbox.check({ timeout: 4000 });
  } catch {
    const label = page.locator("label[for='flexCheckDefault']").first();
    if (await label.isVisible().catch(() => false)) {
      try {
        await label.click({ timeout: 3000 });
      } catch {
        await label.click({ force: true, timeout: 3000 });
      }
    }
  }

  if (await checkbox.isChecked().catch(() => false)) return;

  await checkbox.evaluate((el) => {
    const input = el;
    input.checked = true;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  await expect(checkbox).toBeChecked();
}

test.describe('Transfer Registration Automation', () => {
  test('should register a Transfer Registration with sample data', async ({ page }) => {
    test.setTimeout(180000);

    const usedContactNumbers = new Set();

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

    await page
      .locator("a.dropdown-item[href='/bnrc_stg/Website/transferIntoBihar']")
      .first()
      .click();

    await page.locator("select[formcontrolname='courseId']").selectOption('2');

    await fillField(page.locator("input[formcontrolname='nameOfApplicant']"), 'Testtest');
    await fillField(page.locator("input[formcontrolname='fatherName']"), 'Father Test');

    await openDatePicker(page, "input[formcontrolname='dob']", '2026');
    await selectYearSlow(page, '2003');
    await selectMonthAndDay(page, 'June', '14');

    const applicantEmail = generateUniqueEmail('transfer');
    await fillField(page.locator("input[formcontrolname='emailId']"), applicantEmail);

    await selectByVisibleLabel(page, "select[formcontrolname='stateId']", 'Bihar');
    await selectByVisibleLabel(page, "select[formcontrolname='districtId']", 'GAYA JI');
    await selectByVisibleLabel(page, "select[formcontrolname='casteCategory']", 'Unreserved (GEN/UR)');

    await fillField(page.locator("input[formcontrolname='pinCode']"), '800002');
    await fillField(page.locator("textarea[formcontrolname='address']"), 'Ashok Nagar, gaya');

    await selectByVisibleLabel(page, "select[formcontrolname='educationId']", 'Intermediate');

    await openDatePicker(page, "input[formcontrolname='passedYear']");
    await page.waitForTimeout(700);
    await selectYearSlow(page, '2020');

    await fillField(page.locator("input[formcontrolname='boardName']"), 'CBSE');
    await fillField(page.locator("input[formcontrolname='securedMarks']"), '90');

    await selectByVisibleLabel(page, "select[formcontrolname='councilSate']", 'Assam');

    await fillField(page.locator("input[formcontrolname='currentRegistrationCouncil']"), '8885786353');

    await openDatePicker(page, "input[formcontrolname='issueDate']", '2026');
    await selectYearSlow(page, '2018');
    await selectMonthAndDay(page, 'May', '12');

    await page.locator("input[formcontrolname='validTillDate']").first().click();
    for (let i = 0; i < 24; i += 1) {
      const decemberVisible = await page
        .locator("xpath=//button[@class='current ng-star-inserted']/span[text()='December']")
        .first()
        .isVisible()
        .catch(() => false);
      if (decemberVisible) break;
      await page.locator('button.next').first().click();
      await page.waitForTimeout(450);
    }
    await page.locator("xpath=//span[text()='10']").first().click();

    const certificatePath = path.resolve('./Sample document.pdf');
    if (!fs.existsSync(certificatePath)) {
      throw new Error(`Upload file not found at path: ${certificatePath}`);
    }
    const certificateBuffer = fs.readFileSync(certificatePath);

    const uploadPayload = {
      name: 'Sample document.pdf',
      mimeType: 'application/pdf',
      buffer: certificateBuffer,
    };

    const requiredUploadLabels = [
      /Upload\s*10th\s*Marksheet/i,
      /Upload\s*10th\s*Admit\s*Card/i,
      /Upload\s*12th\s*Marksheet/i,
      /Upload\s*12th\s*Admit\s*Card/i,
      /Upload\s*Marksheet/i,
      /Upload\s*Diploma\s*Certificate/i,
      /Upload\s*Registration\s*Certificate/i,
      /Upload\s*Completion\s*Certificate/i,
    ];

    for (const labelMatcher of requiredUploadLabels) {
      await uploadPdfForLabel(page, labelMatcher, uploadPayload);
      await page.waitForTimeout(250);
    }

    await page
      .locator("input[type='radio'][formcontrolname='incCompliant'][value='2']")
      .first()
      .check({ force: true });

    const uniqueOrganizationPhoneNumber = generateUniqueOrganizationPhoneNumber(usedContactNumbers);
    await fillField(page.locator("input[formcontrolname='organizationPhoneNo']"), uniqueOrganizationPhoneNumber);

    const organizationEmail = generateUniqueEmail('org');
    await fillField(page.locator("input[formcontrolname='organizationEmailId']"), organizationEmail);

    const uniqueAuthorizedMobileNumber = generateUniqueMobileNumber(usedContactNumbers);
    await setFieldValueWithoutJump(page, "input[formcontrolname='mobNo']", uniqueAuthorizedMobileNumber);

    const sendOtpButton = page.locator("xpath=//button[contains(text(),'Send OTP')]").first();
    await sendOtpButton.scrollIntoViewIfNeeded();
    await sendOtpButton.click();
    await clickSweetAlertOk(page);

    await fillField(page.locator("input[formcontrolname='otp']"), '123456');
    await page.locator("xpath=//button[normalize-space()='Verify OTP']").first().click();
    await clickSweetAlertOk(page);

    await fillField(page.locator("input[formcontrolname='captcha']"), '1');

    await ensureAgreementChecked(page);

    const submitBtn = page.locator("button[type='submit'].btn-success").first();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    const yesBtn = page.getByRole('button', { name: /Yes, save it!/i }).first();
    await yesBtn.click({ force: true });

    const swalContainer = page.locator('div.swal2-html-container').first();
    await expect(swalContainer).toContainText(/TEMP\d+/);

    const swalText = await swalContainer.innerText();
    const tempIdMatch = swalText.match(/TEMP\d+/);
    const tempId = tempIdMatch ? tempIdMatch[0] : 'Not-found';

    const screenshotDir = path.resolve(__dirname, '../../BNRCscreenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotDir, `transfer-temp-id-${tempId}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const okBtn = page.getByRole('button', { name: /^OK$/i }).first();
    await okBtn.click({ force: true });
  });
});
