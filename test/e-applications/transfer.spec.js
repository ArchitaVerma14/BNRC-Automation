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

async function findPdfInputNearLabel(page, labelMatcher) {
  const labels = page.locator('label');
  const total = await labels.count();

  for (let i = 0; i < total; i += 1) {
    const label = labels.nth(i);
    const text = (await label.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    if (!text || !labelMatcher.test(text)) continue;

    const container = label.locator("xpath=ancestor::*[.//input[@type='file']][1]").first();
    const input = container
      .locator("input[type='file'][accept*='pdf'], input[type='file'][accept='application/pdf'], input[type='file']")
      .first();

    if ((await input.count().catch(() => 0)) > 0) {
      return input;
    }
  }

  return null;
}

async function uploadPdfForLabel(page, labelMatcher, filePayload, fallbackIndex = 0) {
  let input = await findPdfInputNearLabel(page, labelMatcher);

  if (!input) {
    const allPdfInputs = page.locator(
      "input[type='file'][accept*='pdf'], input[type='file'][accept='application/pdf'], input[type='file']"
    );
    const count = await allPdfInputs.count();
    if (fallbackIndex >= count) {
      throw new Error(
        `Could not find upload input for ${labelMatcher}. Found only ${count} file inputs.`
      );
    }
    input = allPdfInputs.nth(fallbackIndex);
  }

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

async function pickYear(page, inputLocator, year) {
  // Click to open the picker, select the year cell, then close
  await inputLocator.scrollIntoViewIfNeeded();
  await inputLocator.click();
  const picker = page.locator('bs-datepicker-container');
  await picker.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  const yearCell = page.locator('bs-datepicker-container table.years td:not(.disabled) span').filter({ hasText: new RegExp(`^${year}$`) }).first();
  let clicked = false;
  for (let i = 0; i < 5; i++) {
    if (await yearCell.isVisible().catch(() => false)) {
      await yearCell.click();
      clicked = true;
      break;
    }
    await page.locator('bs-datepicker-container button.previous').first().click();
    await page.waitForTimeout(300);
  }
  if (!clicked) {
    // fallback: fill directly and trigger Angular events
    await inputLocator.fill(year);
    await inputLocator.press('Tab');
  }
  // Close picker if still open
  const pickerVisible = await picker.isVisible().catch(() => false);
  if (pickerVisible) await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
}

test.describe('Transfer Registration Automation', () => {
  test('should register a Transfer Registration with sample data', async ({ page }) => {
    test.setTimeout(180000);

    const usedContactNumbers = new Set();
    const uniqueMobileNumber = generateUniqueMobileNumber(usedContactNumbers);
    const uniqueEmail = generateUniqueEmail('transfer');
    const briefPause = async (ms = 150) => page.waitForTimeout(ms);

    await page.goto('http://68.233.110.246/bnrc_stg/Website/transferIntoBihar');
    await page.locator('.form-select').first().selectOption('13');
    await briefPause();
    await page.getByRole('textbox', { name: 'Enter Name of Applicant' }).click();
    await page.getByRole('textbox', { name: 'Enter Name of Applicant' }).fill('demodemo');
    await briefPause();
    await page.getByRole('textbox', { name: "Enter Father's Name" }).click();
    await page.getByRole('textbox', { name: "Enter Father's Name" }).fill('demo father');
    await briefPause();
    await page.locator('input[name="dob"]').click();
    await page.getByRole('button', { name: '2026' }).click();
    await page.getByRole('button', { name: '‹' }).click();
    await page.getByText('2003', { exact: true }).click();
    await page.getByText('February').click();
    await page.getByText('1', { exact: true }).first().click();
    await briefPause(200);
    const genderLocator = page.locator('select[formcontrolname="gender"]');
    try { await page.keyboard.press('Escape'); } catch {}
    await page.waitForTimeout(200);
    try { await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); }); } catch {}

    try {
      await genderLocator.waitFor({ state: 'attached', timeout: 3000 });
      await genderLocator.scrollIntoViewIfNeeded();
      await genderLocator.selectOption('1');
    } catch (e) {
      // fallback to name selector
      try {
        const genderByName = page.locator('select[name="gender"]');
        await genderByName.scrollIntoViewIfNeeded();
        await genderByName.selectOption('1');
      } catch (e2) {
        // last resort: set via JS
        try {
          await page.evaluate(() => {
            const s = document.querySelector('select[formcontrolname="gender"]') || document.querySelector('select[name="gender"]');
            if (s) {
              s.value = '1';
              s.dispatchEvent(new Event('input', { bubbles: true }));
              s.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        } catch {}
      }
    }
    await page.getByRole('textbox', { name: 'Enter your Email' }).click();
    await page.getByRole('textbox', { name: 'Enter your Email' }).fill(uniqueEmail);
    await briefPause();
    await page.locator('select[formcontrolname="casteCategory"]').selectOption('2');
    await briefPause();
    await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).click();
    await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('demodemo');
    await page.locator('input[name="birthYear"]').click();
    await page.getByRole('button', { name: '‹' }).click();
    await page.getByText('2003', { exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter Aadhaar Number' }).click();
    await page.getByRole('textbox', { name: 'Enter Aadhaar Number' }).fill('654003457010');
    await page.locator('select[name="stateIdCross"]').selectOption('6');
    await page.getByRole('textbox', { name: 'Enter District' }).click();
    await page.getByRole('textbox', { name: 'Enter District' }).fill('ssssssssssss');
    await page.getByRole('textbox', { name: 'Enter Pin Code' }).first().click();
    await page.getByRole('textbox', { name: 'Enter Pin Code' }).first().fill('997837');
    await page.getByRole('textbox', { name: 'Enter Address' }).first().click();
    await page.getByRole('textbox', { name: 'Enter Address' }).first().fill('hssssssssssssssse3');
    await page.getByRole('checkbox', { name: 'Permanent Address same as' }).check();
    await pickYear(page, page.locator('input[name="sessionFrom"]').first(), '2015');
    await pickYear(page, page.locator('input[name="sessionTo"]').first(), '2017');
    await pickYear(page, page.locator('input[name="passedYear"]').first(), '2017');
    await page.getByRole('textbox', { name: 'Enter College Name' }).first().click();
    await page.getByRole('textbox', { name: 'Enter College Name' }).first().fill('abshdskhf');
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).first().click();
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).first().fill('dddddddddddddd');
    await page.getByRole('textbox', { name: 'Enter Board Name' }).first().click();
    await page.getByRole('textbox', { name: 'Enter Board Name' }).first().fill('eeeeeeeee');
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).first().click();
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).first().fill('67');
    await briefPause();
    // Fill the 2nd initial education row (Intermediate) BEFORE clicking Add More
    await pickYear(page, page.locator('input[name="sessionFrom"]').nth(1), '2018');
    await pickYear(page, page.locator('input[name="sessionTo"]').nth(1), '2020');
    await pickYear(page, page.locator('input[name="passedYear"]').nth(1), '2020');
    await page.getByRole('textbox', { name: 'Enter College Name' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Enter College Name' }).nth(1).fill('fffffffff');
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).nth(1).fill('eeeeeeeeeeeeee');
    await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).fill('ffffffffffffff');
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).click();
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).fill('77');
    await briefPause();
    // Now click Add More to create the 3rd row (both initial rows are valid)
    await page.getByRole('button', { name: 'Add More' }).click();
    await briefPause(250);
    // Select education type for the 3rd row (Add More rows have a dropdown, unlike pre-populated rows)
    await page.locator('select[formcontrolname="educationId"]').last().selectOption({ label: 'Auxiliary Nursing Midwifery (ANM Nursing)' });
    await briefPause();
    // Fill the 3rd row — must not overlap with row 1 (2022-2024)
    await pickYear(page, page.locator('input[name="sessionFrom"]').nth(2), '2021');
    await pickYear(page, page.locator('input[name="sessionTo"]').nth(2), '2023');
    await pickYear(page, page.locator('input[name="passedYear"]').nth(2), '2023');
    await page.getByRole('textbox', { name: 'Enter College Name' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Enter College Name' }).nth(2).fill('vvvvvvvvvvv');
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Enter Examination Conducted By' }).nth(2).fill('fffffffffffffffff');
    await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(2).fill('ffffffffffffffff');
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(2).click();
    await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(2).fill('88');
    await briefPause();
    await page.locator('select[name="stateId"]').selectOption('12');
    await page.getByRole('textbox', { name: 'Current Council Registration Number' }).fill('5555555y');
    // Issue Date: fill directly in DD-MM-YYYY format (picker navigation unreliable)
    await page.locator('input[name="issueDate"]').fill('11-03-2020');
    await page.locator('input[name="issueDate"]').press('Tab');
    await page.waitForTimeout(200);

    // Valid Till Date: use picker (same pattern that worked)
    await page.locator('input[name="validTillDate"]').click();
    await page.waitForTimeout(300);
    await page.locator('bs-datepicker-container button.current').nth(1).click();
    await page.waitForTimeout(200);
    for (let i = 0; i < 3; i++) {
      if (await page.locator('bs-datepicker-container table.years td:not(.disabled) span').filter({ hasText: '2034' }).first().isVisible().catch(() => false)) break;
      await page.locator('bs-datepicker-container button.next').first().click();
      await page.waitForTimeout(200);
    }
    await page.locator('bs-datepicker-container table.years td:not(.disabled) span').filter({ hasText: '2034' }).first().click();
    await page.waitForTimeout(200);
    await page.locator('bs-datepicker-container').getByRole('gridcell', { name: 'September' }).click();
    await page.waitForTimeout(200);
    await page.locator('bs-datepicker-container').getByRole('gridcell', { name: '22', exact: true }).first().click();
    await page.waitForTimeout(300);

    // Create a minimal PNG for image-only fields (Applicant Photo, Upload Signature)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const imagePath = path.resolve(__dirname, '../../utils/sample-photo.png');
    fs.writeFileSync(imagePath, Buffer.from(pngBase64, 'base64'));
    const samplePdf = path.resolve(__dirname, '../../utils/Sample document.pdf');

    // Dismiss any file-type validation dialog that may appear
    const dismissFileDialog = async () => {
      const okBtn = page.locator('div.swal2-popup button.swal2-confirm').first();
      if (await okBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await okBtn.click();
        await page.waitForTimeout(300);
      }
    };

    // Upload image files for photo/signature, PDFs for document fields
    // Label names match exactly what the form shows in the snapshot
    await uploadPdfForLabel(page, /Applicant Photo/i, imagePath, 0);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /Upload Signature/i, imagePath, 1);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /^10th Certificate/i, samplePdf, 2);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /^12th Certificate/i, samplePdf, 3);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /^12th Marksheet/i, samplePdf, 4);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /ANM.*Admit Card/i, samplePdf, 5);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /^Caste Certificate/i, samplePdf, 6);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /ANM.*Marksheet/i, samplePdf, 7);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /ANM.*Degree/i, samplePdf, 8);
    await dismissFileDialog();
    await uploadPdfForLabel(page, /ANM.*Registration Certificate/i, samplePdf, 9);
    await dismissFileDialog();
    await page.getByRole('textbox', { name: 'Enter Applicant Phone Number' }).click();
    await page.getByRole('textbox', { name: 'Enter Applicant Phone Number' }).fill(uniqueMobileNumber);
    await page.getByRole('button', { name: 'Send OTP' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('textbox', { name: 'Enter OTP' }).click();
    await page.getByRole('textbox', { name: 'Enter OTP' }).fill('123456');
    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('textbox', { name: 'Enter Answer' }).click();
    await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
    await page.getByRole('checkbox', { name: 'I Agree.I hereby declare that' }).check();
    await page.getByRole('button', { name: 'Submit' }).click();
    // The submit may show a SweetAlert confirmation — click it
    const confirmBtn = page.locator('div.swal2-popup button.swal2-confirm');
    await confirmBtn.waitFor({ state: 'visible', timeout: 15000 });
    await confirmBtn.click();

    const swalContainer = page.locator('div.swal2-html-container').first();
    await expect(swalContainer).toContainText(/TEMP\d+/);
    const swalText = await swalContainer.innerText();
    const tempIdMatch = swalText.match(/TEMP\d+/);
    const tempId = tempIdMatch ? tempIdMatch[0] : 'Not-found';

    // Take a screenshot of the TEMP popup itself, then close the page
    const screenshotDir = path.resolve(__dirname, '../../BNRCscreenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    try {
      const popup = page.locator('div.swal2-popup.swal2-modal').first();
      const popupPath = path.join(screenshotDir, `transfer-temp-popup-${tempId}.png`);
      if (await popup.isVisible().catch(() => false)) {
        await popup.screenshot({ path: popupPath });
      } else {
        // fallback to full page screenshot if popup not visible
        const fallbackPath = path.join(screenshotDir, `transfer-temp-id-${tempId}.png`);
        await page.screenshot({ path: fallbackPath, fullPage: true });
      }
    } catch (e) {
      const fallbackPath = path.join(screenshotDir, `transfer-temp-id-${tempId}.png`);
      try { await page.screenshot({ path: fallbackPath, fullPage: true }); } catch {}
    }

    // Close the popup by clicking OK if present, then close the page
    try {
      const okBtn = page.getByRole('button', { name: /^OK$/i }).first();
      if (await okBtn.isVisible().catch(() => false)) await okBtn.click({ force: true });
    } catch {}

    try { await page.close(); } catch {}
  });
});
