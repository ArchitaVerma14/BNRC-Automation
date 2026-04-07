// inspection.spec.js
import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// =======================================================
// CONFIG
// =======================================================
const BASE_URL = 'http://68.233.110.246/bnrc_stg/home';
const EXCEL_PATH = 'D:\\OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE\\institute_inspection_ids.xlsx';
const DIGITAL_CV = path.resolve('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\Sample document.pdf');

const TEMP_DEFAULT_PASSWORD = '123456';
const TEMP_NEW_PASSWORD = 'Av@12345';

const OFFICER_ID = 'ADDI_3443';
const OFFICER_PASSWORD = '123456';

// =======================================================
// LOG FILE INITIALIZATION
// =======================================================
const LOG_FILE = "./inspection_log.csv";

if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(
    LOG_FILE,
    "Timestamp,ApplicationNO,UserID,Status,Message\n"
  );
}

function logResult(applicationNo, userId, status, message = "") {
  const ts = new Date().toISOString();
  const row = `"${ts}","${applicationNo}","${userId}","${status}","${message.replace(/"/g, "'")}"\n`;
  fs.appendFileSync(LOG_FILE, row);
}

// =======================================================
// EXCEL READING
// =======================================================
function readExcelGroupedByApplicationNo(filepath) {
  const wb = XLSX.readFile(filepath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const headers = rows[0].map(h => String(h).trim());

  let col = {
    ApplicationNO: headers.findIndex(h => h.toLowerCase().includes("application")),
    Tempid: headers.findIndex(h => h.toLowerCase().includes("temp"))
  };

  if (col.ApplicationNO === -1 || col.Tempid === -1)
    throw new Error("Excel must contain ApplicationNO and Tempid columns!");

  const groups = {};
  let lastApp = null;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const app = String(row[col.ApplicationNO] || "").trim();
    const tempid = String(row[col.Tempid] || "").trim();

    if (app) {
      lastApp = app;
      if (!groups[app]) groups[app] = [];
      if (tempid) groups[app].push(tempid);
    } else if (lastApp && tempid) {
      groups[lastApp].push(tempid);
    }
  }

  return groups;
}

// =======================================================
// SAFE CLICK WITH SCROLL
// =======================================================
async function safeClick(element) {
  try { await element.scrollIntoViewIfNeeded(); } catch {}
  await element.page().waitForTimeout(200);

  try {
    await element.click({ timeout: 5000 });
  } catch {
    await element.click({ force: true });
  }
}

// =======================================================
// LOGIN POPUP
// =======================================================
async function openLoginPopup(page) {
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole('link', { name: 'Login' }).click()
  ]);

  await expect(popup.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();
  return popup;
}

// =======================================================
// LOGIN AS TEMP
// =======================================================
async function loginAsTemporary(popup, tempId, password) {
  await popup.locator("ng-select div").nth(3).click();
  await popup.getByRole("option", { name: " Temporary" }).click();

  await popup.getByRole("textbox", { name: " Enter Temporary ID" }).fill(tempId);
  await popup.getByRole("textbox", { name: "Enter your password" }).fill(password);
  await popup.getByRole("textbox", { name: "Enter Captcha" }).fill("1");

  await safeClick(popup.getByRole("button", { name: " Login" }));
}

// =======================================================
// LOGIN AS OFFICER
// =======================================================
async function loginAsOfficer(popup, officerId, password) {
  await popup.getByText("Select User Type").click();
  await popup.getByRole("option", { name: " Officers" }).click();

  await popup.getByRole("textbox", { name: " Enter Officer ID" }).fill(officerId);
  await popup.getByRole("textbox", { name: "Enter your password" }).fill(password);
  await popup.getByRole("textbox", { name: "Enter Captcha" }).fill("1");

  await safeClick(popup.getByRole("button", { name: " Login" }));
}

// =======================================================
// RESET PASSWORD IF NEEDED
// =======================================================
async function resetPasswordIfPrompted(popup) {
  try {
    const resetHeading = popup.getByRole('heading', { name: 'Reset Password' });

    if (await resetHeading.isVisible({ timeout: 3000 })) {
      console.log("Reset Password screen detected.");

      // Fill both fields using accessible labels
      await popup.getByRole('textbox', { name: 'Password', exact: true })
        .fill(TEMP_NEW_PASSWORD);

      await popup.getByRole('textbox', { name: 'Confirm Password' })
        .fill(TEMP_NEW_PASSWORD);

      await safeClick(popup.getByRole('button', { name: ' Save' }));

      await expect(popup.getByRole('dialog', { name: 'Saved!' }))
        .toBeVisible({ timeout: 5000 });

      await safeClick(popup.getByRole('button', { name: 'OK' }));

      await expect(popup.getByRole('img', { name: 'BNRC Logo' }))
        .toBeVisible({ timeout: 5000 });

      return true;
    }
  } catch (err) {
    console.log("Reset Password failed:", err);
  }

  return false;
}

// =======================================================
// TEMP INSPECTION FLOW
// =======================================================
async function fillInspectionForTemp(popup, applicationNo) {

  await safeClick(popup.getByRole('button', { name: ' Recognition ' }));
  await safeClick(popup.getByRole('link', { name: ' Institute Inspection' }));

  await popup.getByRole('textbox').first().fill(applicationNo);
  await safeClick(popup.getByRole('button', { name: ' Search' }));

  await expect(popup.getByRole('group', { name: 'Select page' })).toBeVisible();

  await safeClick(popup.getByRole('button', { name: ' Start Inspection' }));

  // Upload all file inputs
  const fileInputs = popup.locator('input[type="file"]');
  const count = await fileInputs.count();

  for (let i = 0; i < count; i++) {
    try {
      await fileInputs.nth(i).setInputFiles(DIGITAL_CV);
    } catch {}
  }

  await popup.locator("textarea, input[placeholder*='Remark']").first()
    .fill("Automated TEMP Inspection");

  await safeClick(popup.getByRole('button', { name: 'Save Inspection' }));

  await expect(popup.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();
  await safeClick(popup.getByRole('button', { name: 'Yes, save it!' }));

  await expect(popup.getByRole('dialog', { name: 'SUCCESS!' })).toBeVisible();
  await safeClick(popup.getByRole('button', { name: 'OK' }));
}

// =======================================================
// OFFICER INSPECTION FLOW
// =======================================================
async function fillInspectionForOfficer(popup, applicationNo) {

  await safeClick(popup.getByRole('button', { name: ' Recognition ' }));
  await safeClick(popup.getByRole('link', { name: ' Institute Inspection' }));

  await popup.getByRole('textbox').first().fill(applicationNo);
  await safeClick(popup.getByRole('button', { name: ' Search' }));

  await expect(popup.getByRole('group', { name: 'Select page' })).toBeVisible();

  await safeClick(popup.getByRole('button', { name: ' Start Inspection' }));

  const fileInputs = popup.locator('input[type="file"]');
  const count = await fileInputs.count();

  for (let i = 0; i < count; i++) {
    try {
      await fileInputs.nth(i).setInputFiles(DIGITAL_CV);
    } catch {}
  }

  await popup.locator("textarea, input[placeholder*='Remark']").first()
    .fill("Officer Automated Inspection");

  await safeClick(popup.getByRole('button', { name: 'Save Inspection' }));

  await expect(popup.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();
  await safeClick(popup.getByRole('button', { name: 'Yes, save it!' }));

  await expect(popup.getByRole('dialog', { name: 'SUCCESS!' })).toBeVisible();
  await safeClick(popup.getByRole('button', { name: 'OK' }));
}

// =======================================================
// MAIN TEST
// =======================================================
test('Batch TEMP + Officer Inspection Automation With Logging', async ({ page }) => {

  if (!fs.existsSync(EXCEL_PATH)) throw new Error("Excel file missing!");
  if (!fs.existsSync(DIGITAL_CV)) throw new Error("DigitalCV.pdf missing!");

  const groups = readExcelGroupedByApplicationNo(EXCEL_PATH);
  console.log("Applications Found:", Object.keys(groups));

  await page.goto(BASE_URL);

  for (const applicationNo of Object.keys(groups)) {

    const tempList = groups[applicationNo].filter(id => id.startsWith("TEMP"));

    // -------------------------------
    // TEMP USERS
    // -------------------------------
    for (const tempId of tempList) {

      const popup = await openLoginPopup(page);

      try {
        await loginAsTemporary(popup, tempId, TEMP_DEFAULT_PASSWORD);

        const reset = await resetPasswordIfPrompted(popup);

        if (reset) {
          await loginAsTemporary(popup, tempId, TEMP_NEW_PASSWORD);
        } else {
          try {
            await expect(popup.getByRole('button', { name: new RegExp(tempId) }))
              .toBeVisible({ timeout: 2000 });
          } catch {
            await loginAsTemporary(popup, tempId, TEMP_NEW_PASSWORD);
          }
        }

        await fillInspectionForTemp(popup, applicationNo);

        logResult(applicationNo, tempId, "Success", "TEMP inspection completed");

      } catch (e) {
        logResult(applicationNo, tempId, "Failed", e.message);
      }

      // CORRECT FIX — close popup safely
      await popup.close().catch(() => {});
      await page.goto(BASE_URL);
    }

    // -------------------------------
    // OFFICER INSPECTION
    // -------------------------------
    const officerPopup = await openLoginPopup(page);

    try {
      await loginAsOfficer(officerPopup, OFFICER_ID, OFFICER_PASSWORD);
      await fillInspectionForOfficer(officerPopup, applicationNo);

      logResult(applicationNo, OFFICER_ID, "Success", "Officer inspection completed");

    } catch (e) {
      logResult(applicationNo, OFFICER_ID, "Failed", e.message);
    }

    await officerPopup.close().catch(() => {});
    await page.goto(BASE_URL);
  }

  console.log("ALL APPLICATIONS PROCESSED. CHECK inspection_log.csv");
});
