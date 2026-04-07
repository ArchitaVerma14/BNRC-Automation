import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/* ================= CONFIG ================= */

const TOTAL_USERS = 35;

const PDF_PATH =
  "D:\\OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE\\DigitalCV.pdf";

const CSV_PATH = path.join(__dirname, 'foreign_submitted_users.csv');

if (!fs.existsSync(CSV_PATH)) {
  fs.writeFileSync(
    CSV_PATH,
    'Run,UserName,Mobile,Aadhaar,TEMP_ID,Status\n'
  );
}

/* ================= VERHOEFF ================= */

const d = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],
  [7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0],
];

const p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8],
];

const inv = [0,4,3,2,1,5,6,7,8,9];

function generateVerhoeffDigit(num) {
  let c = 0;
  const reversed = num.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = d[c][p[(i + 1) % 8][reversed[i]]];
  }
  return inv[c];
}

function generateAadhaar() {
  let base = (Math.floor(Math.random() * 6) + 4).toString(); // >3
  for (let i = 0; i < 10; i++) {
    base += Math.floor(Math.random() * 10);
  }
  return base + generateVerhoeffDigit(base);
}

/* ================= DATA HELPERS ================= */

function generateMobile(run) {
  return `9${Math.floor(100000000 + run * 917)}`;
}

function generateUserName(run) {
  return `BNRC_USER_${Date.now()}_${run}`;
}

function writeCSV(run, userName, mobile, aadhaar, tempId) {
  fs.appendFileSync(
    CSV_PATH,
    `${run},${userName},${mobile},${aadhaar},${tempId},SUCCESS\n`
  );
}

/* ================= TEST ================= */

test('BNRC Foreign Verification – 35 Users E2E', async ({ page }) => {

  for (let run = 1; run <= TOTAL_USERS; run++) {

    const userName = generateUserName(run);
    const mobile = generateMobile(run);
    const aadhaar = generateAadhaar();

    /* ---------- APPLICATION FORM ---------- */

    await page.goto('http://68.233.110.246/bnrc_stg/home');
    await page.getByRole('button', { name: 'E-Application ' }).click();
    await page.getByRole('link', { name: 'Foreign Verification' }).click();

    await page.locator('select[name="courseId"]').selectOption('2');

    // await page.getByRole('textbox', { name: /Name of Applicant/i }).fill(userName);
    const nameInput = page.locator('input').nth(0); // first textbox in General Information
    await expect(nameInput).toBeVisible();
    await nameInput.fill(userName);

    await page.locator('select').nth(1).selectOption('1');

    // await page.getByRole('textbox', { name: /Father/i }).fill('Test Father');
    const fatherInput = page.locator('input').nth(1); // Father’s Name textbox
    await expect(fatherInput).toBeVisible();
    await fatherInput.fill('Test Father');

    // ---- DOB Datepicker (STRICT FLOW) ----
    await page.getByRole('textbox', { name: 'YYYY-MM-DD' }).click();
    await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

    // Open year selection
    await page.getByRole('button', { name: '2009' }).click();
    await expect(
    page.getByRole('row', { name: '2003 2004 2005' })
    ).toBeVisible();

    // Select year
    await page.getByText('2002', { exact: true }).click();
    await expect(
    page.getByRole('row', { name: 'January February March' })
    ).toBeVisible();

    // Select month
    await page.getByText('February').click();
    await expect(
    page.getByRole('row', { name: 'weekday weekday weekday' })
    ).toBeVisible();

    // Select day
    await page.getByText('1', { exact: true }).first().click();
    await page.keyboard.press('Tab');
    // ---------- Email & Mobile (stable locator) ----------
    // ---------- Email ----------
    const emailInput = page
    .getByText('Email')
    .locator('..')
    .locator('input');

    await expect(emailInput).toBeVisible();
    await emailInput.fill(`${userName}@mail.com`);

    // ---------- Mobile Number ----------
    const mobileInput = page
    .getByText('Mobile Number')
    .locator('..')
    .locator('input');

    await expect(mobileInput).toBeVisible();
    await mobileInput.fill(mobile);



    // await page.getByRole('textbox', { name: /Email/i }).fill(`${userName}@mail.com`);
    // await page.getByRole('textbox', { name: /Mobile/i }).fill(mobile);

    await page.locator('select[name="stateId"]').selectOption('4');
    await page.locator('select[name="districtId"]').selectOption('8');
    // ---------- Social Category ----------
    await page.locator('select[formcontrolname="categoryId"]').selectOption('1');


    // await page.getByRole('textbox', { name: /Name as per Aadhaar/i }).fill(userName);
    // ---------- Name as per Aadhaar (stable locator) ----------
  
    // ---------- Name as per Aadhaar ----------
    const nameAsAadhaar = page.locator('input[formcontrolname="aadhaarName"]');
    await expect(nameAsAadhaar).toBeVisible();
    await nameAsAadhaar.fill(userName);


    // ---- Year of Birth as per Aadhaar (Year-only Datepicker) ----
    // await page.getByPlaceholder('YYYY').click();
    // await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();
    // ---- Year of Birth as per Aadhaar (scoped, non-ambiguous) ----
    // await expect(inputs.nth(5)).toBeVisible();
    // await inputs.nth(5).click();
    const yobAadhaarInput = page
    .getByText('Year of Birth as per Aadhaar')
    .locator('..')
    .locator('input');

    await expect(yobAadhaarInput).toBeVisible();
    await yobAadhaarInput.click();

    // Switch to year grid
    await page.getByRole('button', { name: '‹' }).click();
    await expect(
    page.getByRole('row', { name: '2003 2004 2005' })
    ).toBeVisible();

    // Select year
    await page.getByText('2002', { exact: true }).click();
    // await page.getByRole('textbox', { name: /Aadhaar/i }).fill(aadhaar);
    // Aadhaar Number
    // Index mapping: 5 → Aadhaar Number
    // ---------- Aadhaar Number ----------
    // const aadhaarInput = page.locator('input[formcontrolname="aadhaarNumber"]');
    // await expect(aadhaarInput).toBeVisible();
    // await aadhaarInput.fill(aadhaar);
    const aadhaarInput = page
    .getByText('Aadhaar Number')
    .locator('..')
    .getByRole('textbox');

    await expect(aadhaarInput).toBeVisible();
    await aadhaarInput.fill(aadhaar);


    // ================= EDUCATION DETAILS =================

    // Education – First Qualification
    await page.locator('.form-select.education').selectOption('1');

    await page.locator('input[name="passedYear"]').click();
    await expect(
    page.getByRole('dialog', { name: 'calendar' })
    ).toBeVisible();

    await page.getByText('2020', { exact: true }).click();
    // ---------- Education – First Qualification (stable locators) ----------
    const educationSection = page
    .getByRole('heading', { name: 'Educational Details' })
    .locator('..');

    const eduInputs = educationSection.locator('input[type="text"]');

    // Index mapping inside Educational Details:
    // 0 → Passed Year (handled separately by calendar)
    // 1 → Board Name (1st qualification)
    // 2 → Secured Marks (1st qualification)

    await expect(eduInputs.nth(1)).toBeVisible();
    await eduInputs.nth(1).fill('CBSE');

    await expect(eduInputs.nth(2)).toBeVisible();
    await eduInputs.nth(2).fill('89');


    // await page.getByRole('textbox', { name: 'Enter Board Name' }).fill('CBSE');
    // await page.getByRole('textbox', { name: 'Enter Secured Marks' }).fill('89');

    // Add second education row
    await page.getByRole('button', { name: 'Add More' }).click();

    // Education – Second Qualification
    await page.locator('.form-select.education.ng-untouched').selectOption('2');

    await page.getByRole('textbox', { name: 'YYYY' }).nth(3).click();
    await expect(
    page.getByRole('dialog', { name: 'calendar' })
    ).toBeVisible();

    await page.getByText('2022', { exact: true }).click();
    // ---------- Education – Second Qualification ----------
    await expect(eduInputs.nth(3)).toBeVisible();
    await eduInputs.nth(3).fill('CBSE');

    await expect(eduInputs.nth(4)).toBeVisible();
    await eduInputs.nth(4).fill('89');


    // await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).fill('CBSE');
    // await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).fill('89');


    await page.locator('input[type="file"]').setInputFiles(PDF_PATH);

    await page.getByRole('textbox', { name: /Answer/i }).fill('1');
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Submit Details' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Submit Details' }).click();

    await page.getByRole('button', { name: 'Yes, save it!' }).click();

    /* ---------- TEMP ID ---------- */

    const successText = await page.locator('.swal2-html-container').innerText();
    const match = successText.match(/TEMP\d+/);

    if (!match) throw new Error('TEMP ID not generated');

    const tempId = match[0];
    writeCSV(run, userName, mobile, aadhaar, tempId);

    await page.getByRole('button', { name: 'OK' }).click();

    /* ---------- LOGIN & PAYMENT ---------- */

    const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
    await page.getByRole('link', { name: 'Login' }).click();
    const page1 = await popupPromise;

    await page1.getByRole('textbox', { name: /Temporary ID/i }).fill(tempId);
    await page1.getByRole('textbox', { name: /password/i }).fill('123456');
    await page1.getByRole('textbox', { name: /Captcha/i }).fill('1');
    await page1.getByRole('button', { name: /Login/i }).click();

    await page1.getByRole('textbox', { name: 'Password', exact: true }).fill('Av@12345');
    await page1.getByRole('textbox', { name: /Confirm/i }).fill('Av@12345');
    await page1.getByRole('button', { name: /Save/i }).click();
    // ================= RE-LOGIN AFTER PASSWORD RESET =================

    await page1.getByRole('button', { name: 'OK' }).click();
    await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

    // Select Temporary user again
    await page1.locator('ng-select div').nth(3).click();
    await expect(
    page1.getByRole('listbox', { name: 'Options List' })
    ).toBeVisible();

    await page1.getByRole('option', { name: ' Temporary' }).click();
    await expect(
    page1.getByRole('button', { name: 'Clear all' })
    ).toBeVisible();

    // Login with updated password
    await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill(tempId);
    await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
    await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');

    await page1.getByRole('button', { name: ' Login' }).click();

    await expect(
    page1.getByRole('button', { name: new RegExp(`Welcome ${tempId}`) })
    ).toBeVisible();


    await page1.getByRole('button', { name: /E-Application/i }).click();
    await page1.getByRole('link', { name: /Foreign Verification/i }).click();
    await page1.getByRole('button', { name: /Proceed for Payment/i }).click();
    await page1.getByRole('button', { name: 'Yes, save it!' }).click();
    await page1.getByRole('button', { name: 'OK' }).click();
  }
});
