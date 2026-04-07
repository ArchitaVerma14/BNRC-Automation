import { test, expect } from '@playwright/test';
const verhoeff = {
  d: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
  ],
  p: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
  ],
  inv: [0,4,3,2,1,5,6,7,8,9]
};

function generateAadhaar() {
   let num = String(Math.floor(Math.random() * 7) + 3);

  // Remaining 10 digits
  for (let i = 0; i < 10; i++) {
    num += Math.floor(Math.random() * 10);
  }

  let c = 0;
  const reversed = num.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = verhoeff.d[c][verhoeff.p[(i + 1) % 8][reversed[i]]];
  }

  return num + verhoeff.inv[c];
}

import fs from 'fs';

const CSV_PATH = 'submitted_students.csv';

if (!fs.existsSync(CSV_PATH)) {
  fs.writeFileSync(
    CSV_PATH,
    'Iteration,StudentName,Aadhaar,Status,Timestamp\n'
  );
}

function getLastIteration() {
  const data = fs.readFileSync(CSV_PATH, 'utf8').trim();

  // Only header present
  if (!data || data.split('\n').length === 1) {
    return 0;
  }

  const lines = data.split('\n');
  const lastLine = lines[lines.length - 1];

  const lastIteration = parseInt(lastLine.split(',')[0], 10);
  return isNaN(lastIteration) ? 0 : lastIteration;
}


function logSuccess(iteration, studentName, aadhaar) {
  const line = `${iteration},${studentName},${aadhaar},SUCCESS,${new Date().toISOString()}\n`;
  fs.appendFileSync(CSV_PATH, line);
}



test('test', async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);
  async function uploadMandatory(labelText, filePath) {
  const label = page1.getByText(labelText, { exact: false });

  const fileInput = label
    .locator('..')
    .locator('input[type="file"]')
    .first();

  await expect(fileInput).toBeAttached({ timeout: 10000 });
  await fileInput.setInputFiles(filePath);
}

 async function scrollAndUpload(locator, filePath) {
  await locator.waitFor({ state: 'attached', timeout: 10000 });
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible({ timeout: 10000 });
  await locator.setInputFiles(filePath);
}

async function waitForSpinnerToDisappear(page) {
  const spinner = page.locator('.ngx-spinner-overlay');
  if (await spinner.count()) {
    await spinner.first().waitFor({ state: 'hidden', timeout: 30000 });
  }
}


    
      async function safeUpload(locator, filePath) {
    try {
      await locator.setInputFiles(filePath);
    } catch {
      await locator.scrollIntoViewIfNeeded().catch(() => {});
      await locator.setInputFiles(filePath);
    }
  }

  const PNG_PATH = 'C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\e2e\\Form-Automation\\graph.png';
  const PDF_PATH = 'C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\e2e\\Form-Automation\\Sample document.pdf';
  


  await page.goto('http://68.233.110.246/bnrc_stg/home');
  // await page.goto('https://bnrc2.bihar.gov.in/home');

  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();
  const educationSelect = page1.locator('select[formcontrolname="educationId"]');
  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Institution' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Institute ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Institute ID' }).press('CapsLock');
  await page1.getByRole('textbox', { name: ' Enter Institute ID' }).fill('INS72502');
  // await page1.getByRole('textbox', { name: ' Enter Institute ID' }).fill('INS73493');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page1.getByRole('button', { name: ' Registration ' }).click();
  // for (let i = 1; i <= 20; i++) {
  const startIteration = getLastIteration() + 1;
  const totalRuns = 1;

  for (let i = startIteration; i < startIteration + totalRuns; i++) {

  console.log(`\n🚀 STARTING STUDENT APPLICATION ${i}\n`);

  const studentName = `Student_${Date.now()}_${i}`;
  const aadhaar = generateAadhaar();

  await page1.getByRole('link', { name: ' Student Registration' }).click();
  await page1.locator('select[name="registrationTypeId"]').selectOption('1');
  /*await page1.locator('input[name="registrationDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('button', { name: '2025' }).click();
  await expect(page1.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page1.getByText('2025', { exact: true }).click();
  await expect(page1.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page1.getByText('December').click();
  await expect(page1.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page1.getByText('9').nth(1).click();
  await page1.locator('input[name="registrationDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Enter Student Name' }).click();
  await page1.locator('input[name="registrationDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('9').nth(1).click();*/
  await page1.locator('input[name="registrationDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('10').first().click();
 
  await page1.getByRole('textbox', { name: 'Enter Student Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Student Name' }).fill(studentName);
  await page1.locator('input[name="dob"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('button', { name: '2025' }).click();
  await expect(page1.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page1.getByRole('button', { name: '‹' }).click();
  await expect(page1.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page1.getByText('2003').click();
  await expect(page1.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page1.getByText('February').click();
  await expect(page1.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page1.getByText('5', { exact: true }).nth(1).click();
//   await page1.locator('.form-select.ng-untouched').first().selectOption('2');
//   await page1.locator('.form-select.ng-untouched.ng-pristine.ng-invalid').first().selectOption('1');
    const courseSelect = page1.locator('select[formcontrolname="courseId"]');

    // 1. Scroll into view
    await courseSelect.scrollIntoViewIfNeeded();

        // 2. Click to trigger Angular option loading
    await courseSelect.click({ force: true });

        // 3. Wait until options are actually present
    await expect(
        courseSelect.locator('option[value="2"]')
    ).toBeAttached({ timeout: 10000 });

        // 4. Select the course (ANM)
    await courseSelect.selectOption({ value: '2' });
    
    const genderSelect = page1.locator('select[formcontrolname="gender"]');

    // 1) Ensure it is in view
    await genderSelect.scrollIntoViewIfNeeded();

    // 2) Click to trigger Angular option binding
    await genderSelect.click({ force: true });

    // 3) Wait until the desired option exists
    await expect(
    genderSelect.locator('option[value="1"]') // example: 1 = Male
    ).toBeAttached({ timeout: 10000 });

    // 4) Select the option
    await genderSelect.selectOption({ value: '1' });


  await page1.getByRole('textbox', { name: 'Enter Email' }).click();
  await page1.getByRole('textbox', { name: 'Enter Email' }).fill('stud23@gmail.com');
  await page1.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
  await page1.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9876543234');
  await page1.getByRole('textbox', { name: 'Enter Father\'s Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Father\'s Name' }).fill('test father');
  await page1.getByRole('textbox', { name: 'Enter Mother\'s Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Mother\'s Name' }).fill('test mother');

  const fileInputs = page1.locator('input[type="file"]');

// PNG upload (photo)
  await safeUpload(fileInputs.nth(0), PNG_PATH);
  await page1.waitForLoadState('networkidle');

    // PDF upload (document)
//  await safeUpload(fileInputs.nth(1), PDF_PATH);

//   await page1.getByText('Upload Photo').click();
//   await page1.locator('body').setInputFiles('graph.png');
  await page1.getByRole('textbox', { name: 'Enter Aadhaar Number' }).click();
  await page1.getByRole('textbox', { name: 'Enter Aadhaar Number' }).fill(aadhaar);
  await page1.getByRole('textbox', { name: 'YYYY', exact: true }).click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('2003').click();
  await page1.getByRole('textbox', { name: 'Enter Name as per Aadhaar' }).click();
  await page1.getByRole('textbox', { name: 'Enter Name as per Aadhaar' }).fill(studentName);
  await page1.locator('.form-select.ng-untouched.ng-pristine.ng-invalid').first().selectOption('1');
  await page1.locator('select[name="stateId"]').selectOption('4');
  await page1.locator('select[name="districtId"]').selectOption('9');
  await page1.getByRole('textbox', { name: 'Enter Student’s nationality' }).click();
  await page1.getByRole('textbox', { name: 'Enter Student’s nationality' }).fill('Indian');
  await page1.locator('select[name="minorityStatus"]').selectOption('2');
  await page1.locator('select[name="physicallyHandicapped"]').selectOption('2');
  await page1.getByRole('textbox', { name: 'Enter Identification Mark' }).click();
  await page1.getByRole('textbox', { name: 'Enter Identification Mark' }).fill('none');
  await page1
  .locator('app-add-student-step-one div')
  .filter({ hasText: '* 1 file of up to 2 MB or' })
  .first()
  .scrollIntoViewIfNeeded();

//   await page1.locator('app-add-student-step-one div').filter({ hasText: '* 1 file of up to 2 MB or' }).nth(2).click({
//     button: 'right'
//   });
  await page1.getByRole('button', { name: ' Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
//   await page1.getByRole('combobox').selectOption('1');
 await educationSelect.scrollIntoViewIfNeeded();
await expect(
  educationSelect.locator('option[value="1"]')
).toBeAttached({ timeout: 10000 });
await educationSelect.selectOption({ value: '1' });



  await page1.getByRole('textbox', { name: 'Enter Secured Marks' }).click();
  await page1.getByRole('textbox', { name: 'Enter Secured Marks' }).fill('99');
  await page1.getByRole('textbox', { name: 'YYYY' }).click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('2019').click();
  await page1.locator('div').filter({ hasText: /^School\/College Name\*$/ }).click();
  await page1.getByRole('textbox', { name: 'Enter school/College Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter school/College Name' }).fill('test school');
  await page1.getByRole('textbox', { name: 'Enter Board Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Board Name' }).fill('cbse');
  await page1.getByRole('button', { name: ' Add Education' }).click();
//   await page1.getByRole('combobox').selectOption('2');
await educationSelect.scrollIntoViewIfNeeded();
await expect(
  educationSelect.locator('option[value="2"]')
).toBeAttached({ timeout: 10000 });
await educationSelect.selectOption({ value: '2' });

  await page1.getByRole('textbox', { name: 'Enter Secured Marks' }).click();
  await page1.getByRole('textbox', { name: 'Enter Secured Marks' }).fill('84');
  await page1.getByRole('textbox', { name: 'YYYY' }).click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('2021').click();
  await page1.getByRole('textbox', { name: 'Enter school/College Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter school/College Name' }).fill('testschool');
  await page1.getByRole('textbox', { name: 'Enter Board Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Board Name' }).fill('cbse');
  await page1.getByRole('button', { name: ' Add Education' }).click();
  await expect(page1.getByRole('row', { name: '2 Intermediate 84 2021' })).toBeVisible();

  await page1.getByRole('button', { name: ' Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();
  // ---- PAGE 3 : UPLOAD ONLY MANDATORY DOCUMENTS ----

// Wait until Upload Documents section is visible
await expect(
  page1.getByRole('heading', { name: 'Upload Documents' })
).toBeVisible({ timeout: 15000 });

// Helper: upload file for a mandatory document by label text


// ✅ Upload ONLY mandatory documents
await uploadMandatory('Matriculation', PDF_PATH);
await uploadMandatory('Aadhaar', PDF_PATH);

// Small wait for Angular validation
await page1.waitForTimeout(500);



  await page1.getByRole('button', { name: ' Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page1.getByRole('textbox').first().click();
  await page1.getByRole('textbox').first().fill('house no-232, ashkok nagar, patna');
  await page1.locator('.form-select').first().selectOption('4');
  await page1.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('9');
  await page1.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('101');
  await page1.locator('div').filter({ hasText: /^Enter Pin Code\*$/ }).getByRole('textbox').click();
  await page1.locator('div').filter({ hasText: /^Enter Pin Code\*$/ }).getByRole('textbox').fill('999999');
  await page1.getByRole('checkbox', { name: 'Same as Correspondence Address' }).check();
  await page1.getByRole('button', { name: ' Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByText('Yes, save it!NoCancel').click();
  await expect(page1.getByRole('dialog', { name: 'SUCCESS' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  // await page1.getByRole('checkbox', { name: 'I Agree. I hereby declare' }).check();
  await waitForSpinnerToDisappear(page1);

  const agreeCheckbox = page1.getByRole('checkbox', {
    name: 'I Agree. I hereby declare'
  });

  await agreeCheckbox.scrollIntoViewIfNeeded();
  await expect(agreeCheckbox).toBeEnabled();
  await agreeCheckbox.check();

  await page1.getByRole('button', { name: ' Save As Draft' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'SUCCESS' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  /*await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page1.getByRole('button', { name: ' Preview Application' }).click();
  await expect(page1.getByRole('row', { name: 'Sl# Education Secured Marks' })).toBeVisible();

  await page1.getByText('Close').click();
  await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page1.getByRole('button', { name: ' Preview Application' }).click();
  await expect(page1.getByRole('row', { name: 'Sl# Education Secured Marks' })).toBeVisible();

  await page1.getByRole('dialog').click({
    button: 'right'
  });
  await page1.getByText('Close').click();*/
//   await expect(page1.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

//   await page1.getByRole('link', { name: ' In Process Applications' }).click();
//   await expect(page1.getByRole('row', { name: '1 Student one 1405 -- College' })).toBeVisible();

//   await page1.getByRole('button', { name: ' Request To Verify From' }).click();
// Ensure page loaded
await expect(
  page1.getByRole('link', { name: 'Bihar Nurses Registration' })
).toBeVisible();

// Open In-Process Applications
await page1.getByRole('link', { name: ' In Process Applications' }).click();

// Wait for table rows
// const rows = page1.locator('table tbody tr');
// await expect(rows.first()).toBeVisible({ timeout: 15000 });
const rows = page1.locator('table tbody tr');

// Wait until at least 1 row exists (not visibility-based)
await expect
  .poll(async () => await rows.count(), {
    timeout: 60000, // backend-safe
    message: 'Waiting for application to appear in In Process list'
  })
  .toBeGreaterThan(0);

// Click "Request To Verify From Administrator/Checker" in first row
await rows.first()
  .getByRole('button', { name: /Request To Verify/i })
  .click();

  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, Forward it!' }).click();
  await page1.getByRole('textbox', { name: 'Type your Remarks here' }).fill('requesting to verify');
  await page1.getByRole('button', { name: 'Submit' }).click();
  await expect(page1.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(
    page1.getByRole('dialog', { name: 'Success' })
  ).toBeVisible({ timeout: 15000 });

  // -------------------------------
  // LOG SUCCESS
  // -------------------------------
  logSuccess(i, studentName, aadhaar);

  console.log(`✅ STUDENT ${i} SUBMITTED SUCCESSFULLY`);

  // OPTIONAL: small wait to avoid backend throttling
  await page1.waitForTimeout(1000);
}
  
});