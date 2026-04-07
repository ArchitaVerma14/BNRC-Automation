import { test, expect } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// ----------------------------------------------------
// UNIVERSAL SAFE CLICK
// ----------------------------------------------------
async function safeClick(locator) {
  try {
    await locator.click({ timeout: 5000 });
  } catch {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await locator.click({ force: true });
  }
}

// ----------------------------------------------------
// UNIVERSAL SAFE FILL
// ----------------------------------------------------
async function safeFill(locator, value) {
  try {
    await locator.fill(value, { timeout: 5000 });
  } catch {
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await locator.click({ force: true });
    await locator.clear().catch(() => {});
    await locator.pressSequentially(value, { delay: 30 });
  }
}

// ----------------------------------------------------
// A → Z → AA → AB...
// ----------------------------------------------------
function alphabetCode(index) {
  let str = '';
  index += 1;
  while (index > 0) {
    index--;
    str = String.fromCharCode(65 + (index % 26)) + str;
    index = Math.floor(index / 26);
  }
  return str;
}

function updateCsvStatus(tempId, status) {
  const rows = parse(fs.readFileSync(CSV_FILE_PATH, 'utf8'), {
    columns: true,
    skip_empty_lines: true
  });

  rows.forEach(r => {
    if (r.tempId === tempId) r.status = status;
  });

  const header = Object.keys(rows[0]).join(',') + '\n';
  const body = rows.map(r => Object.values(r).join(',')).join('\n');
  fs.writeFileSync(CSV_FILE_PATH, header + body);
}

// ----------------------------------------------------
// CONFIG
// ----------------------------------------------------
const CSV_FILE_PATH = 'C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\tempids.csv';
const PDF_PATH = 'C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\Sample document.pdf';
const LOG_FILE = 'inspection-records.json';

// ----------------------------------------------------
// READ CSV
// ----------------------------------------------------
const csvData = parse(fs.readFileSync(CSV_FILE_PATH, 'utf8'), {
  columns: true,
  skip_empty_lines: true
});

let tempList = csvData.map((r, i) => ({
  tempId: r.tempId.trim(),
  password: r.newPassword.trim(),
  instituteName: `Testing Nursing Institute ${alphabetCode(i)}`
}));

// ----------------------------------------------------
// SKIP SUCCESS ENTRIES
// ----------------------------------------------------
let doneIds = [];
if (fs.existsSync(LOG_FILE)) {
  doneIds = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
    .filter(x => x.status === 'SUCCESS')
    .map(x => x.tempId);
}

tempList = tempList.filter(x => !doneIds.includes(x.tempId));

console.log("Pending TEMP IDs:", tempList.map(x => x.tempId));

// ----------------------------------------------------
// LOG FUNCTION
// ----------------------------------------------------
function logResult(tempId, status) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  }
  logs.push({ tempId, status, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// ----------------------------------------------------
// TEST LOOP
// ----------------------------------------------------
test.describe.configure({ mode: "serial" });

for (const { tempId, password, instituteName } of tempList) {

  test(`Apply for Inspection - ${tempId}`, async ({ page }) => {
    try {

      // -------------------------------------------------
      // LOGIN
      // -------------------------------------------------
      await page.goto('http://68.233.110.246/bnrc_stg/home');

      const popup = page.waitForEvent('popup');
      await safeClick(page.getByRole('link', { name: 'Login' }));
      const page1 = await popup;

      await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

      await page1.locator('ng-select div').nth(3).click();
      await safeClick(page1.getByRole('option', { name: /Temporary/ }));

      await safeFill(page1.getByRole('textbox', { name: /Temporary ID/i }), tempId);
      await safeFill(page1.getByRole('textbox', { name: /password/i }), password);
      await safeFill(page1.getByRole('textbox', { name: /Captcha/i }), "1");

      await safeClick(page1.getByRole('button', { name: /Login/ }));

      await expect(page1.getByRole('button', { name: tempId })).toBeVisible();

      await safeClick(page1.getByRole('button', { name: /Recognition/ }));
      await safeClick(page1.getByRole('link', { name: /Apply for Inspection/ }));
      

      // -------------------------------------------------
      // PAGE 1
      // -------------------------------------------------
      await page1.waitForSelector('input[type="text"]');

      await safeFill(page1.getByRole('textbox', { name: /Enter Name of the proposed/i }), instituteName);
      await safeFill(page1.getByRole('textbox', { name: /Proposed annual intake/i }), '50');
      await safeFill(page1.getByRole('textbox', { name: /Number of Teaching/i }), '5');
      await safeFill(page1.getByRole('textbox', { name: /Area of Teaching Block/i }), '2344');

      await page1.getByRole('button', { name: 'Choose File' }).first().setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Number of Hostel Blocks/i }), '2');
      await safeFill(page1.getByRole('textbox', { name: /Area of Hostel Blocks/i }), '34534');

      await page1.getByRole('button', { name: 'Choose File' }).nth(1).setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /faculities/i }), '55');

      await page1.getByRole('button', { name: 'Choose File' }).nth(2).setInputFiles(PDF_PATH);

      await safeClick(page1.getByRole('button', { name: /Save & Next/ }));
      await safeClick(page1.getByRole('button', { name: /Yes, save it/ }));
      await safeClick(page1.getByRole('button', { name: 'OK' }));

      // -------------------------------------------------
      // PAGE 2
      // -------------------------------------------------
      await page1.waitForSelector('input[type="radio"]');

      await page1.getByRole('radio', { name: 'No No No' }).check();
      await page1.locator('[id="2"]').nth(1).check();
      await page1.locator('[id="2"]').nth(2).check();

      await safeClick(page1.getByRole('button', { name: /Save & next/ }));
      await safeClick(page1.getByRole('button', { name: /Yes, save it/ }));
      await safeClick(page1.getByRole('button', { name: 'OK' }));

      // -------------------------------------------------
      // PAGE 3
      // -------------------------------------------------
      await page1.getByRole('radio', { name: 'Parent' }).check();

      await safeFill(page1.getByRole('textbox', { name: /Number of Tie-Up Hospital/i }), '1');
      await safeFill(page1.getByRole('textbox', { name: /Enter number of Tie-Up hospital/i }), '1');

      await page1.getByRole('radio', { name: 'Yes' }).check();
      await page1.getByRole('radio', { name: 'No' }).check();

      await safeFill(page1.getByRole('textbox', { name: /Hospital Name/i }), 'Testing Hospital');
      await page1.locator('.input-group > .form-control').first().setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Hospital Address/i }), 'ABC City');
      await safeFill(page1.getByRole('textbox', { name: /Total no. Beds/i }), '100');

      await page1.locator('.input-group > .form-control').first().setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Medical Beds/i }), '25');
      await page1.locator('div:nth-child(5) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Surgical Beds/i }), '15');
      await page1.locator('div:nth-child(6) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Gynaecology/i }), '10');
      await page1.locator('div:nth-child(7) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Peadiatrics/i }), '20');
      await page1.locator('div:nth-child(8) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Ortho Beds/i }), '30');
      await page1.locator('div:nth-child(9) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeFill(page1.getByRole('textbox', { name: /Number of Deliveries Per Month/i }), '30');
      await page1.locator('div:nth-child(10) .input-group > .form-control').setInputFiles(PDF_PATH);

      await safeClick(page1.getByRole('button', { name: /Save & Next/ }));
      await safeClick(page1.getByRole('button', { name: /Yes, save it/ }));
      await safeClick(page1.getByRole('button', { name: 'OK' }));

      // -------------------------------------------------
      // FINAL SUBMIT
      // -------------------------------------------------
      await safeClick(page1.getByRole('button', { name: /Submit & Proceed for payment/ }));
      await safeClick(page1.getByRole('button', { name: /Yes, save it/ }));

      await expect(page1.getByRole('dialog', { name: /REQUESTED TO VERIFY/i })).toBeVisible();
      await safeClick(page1.getByRole('button', { name: 'OK' }));

      logResult(tempId, "SUCCESS");

    } catch (err) {
      console.log(`FAILED for ${tempId}:`, err);
      logResult(tempId, "FAILED");
      updateCsvStatus(tempId, "FAILED");
      throw err;
    }
  });
}
