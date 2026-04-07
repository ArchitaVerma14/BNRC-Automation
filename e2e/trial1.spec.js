import { test, expect } from '@playwright/test';

// -----------------------------------------------------------
// VERHOEFF CHECKSUM IMPLEMENTATION FOR VALID AADHAAR
// -----------------------------------------------------------
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
  [9,8,7,6,5,4,3,2,1,0]
];

const p = [
  [0,1,2,3,4,5,6,7,8,9],
  [1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],
  [4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],
  [7,0,4,6,9,1,3,2,5,8]
];

const inv = [0,4,3,2,1,5,6,7,8,9];

function generateAadhaar() {
  let base = "";
  for (let i = 0; i < 11; i++) base += Math.floor(Math.random() * 10);
  let c = 0;
  const reversed = base.split("").reverse();
  reversed.forEach((num, i) => {
    c = d[c][p[(i + 1) % 8][parseInt(num)]];
  });
  const checksum = inv[c];
  return base + checksum;
}
async function pickDate(page, inputLocator, year, monthName, day) {
  // Click the input field
  await page.locator(inputLocator).click();

  // Always click the calendar year header "2025"
  await page.getByRole('button', { name: '2025' }).click();

  // Select year from grid
  await page.getByRole('gridcell', { name: String(year) }).click();

  // Select month
  await page.getByText(monthName, { exact: true }).click();

  // Select day
  await page.getByText(String(day), { exact: true }).first().click();
}


// -----------------------------------------------------------
// MAIN TEST – RUNS COMPLETE FLOW 25 TIMES
// -----------------------------------------------------------
test('BNRC Aadhaar registration repeated 25 times', async ({ page }) => {

  for (let i = 1; i <= 25; i++) {
    console.log(`========= ITERATION ${i} START =========`);

    const aadhaar = generateAadhaar();
    console.log("Aadhaar generated:", aadhaar);

    await page.goto('http://68.233.110.246/bnrc_stg/home');
    await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

    await page.getByRole('link', { name: ' Professional Registration' }).click();
    await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

    // Personal Info
    await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('8888888888');
    await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('testing');

    // DOB Calendar
    await page.locator('input[name="dob"]').click();
    await page.getByRole('button', { name: '2009' }).click();
    await page.getByText('2002', { exact: true }).click();
    await page.getByText('February').click();
    await page.getByText('8', { exact: true }).first().click();

    await page.locator('form div')
      .filter({ hasText: 'Applicant Name *Date of Birth' })
      .getByRole('combobox')
      .selectOption('1');  // Female/Male

    // Other personal details
    await page.getByRole('textbox', { name: 'example@gmail.com' }).fill('aaaaaa@gmail.com');
    await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9876543456');
    await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).fill('test father');
    await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('testing');

    // Year of Birth As Per Aadhaar
    await page.locator('input[placeholder="YYYY"]').click();
    await page.getByRole('gridcell', { name: '2002' }).click();

    // Aadhaar
    await page.getByRole('textbox', { name: '0000 0000' }).fill(aadhaar);

    // Demography
    await page.locator('select[name="stateId"]').selectOption('4');
    await page.locator('select[name="districtId"]').selectOption('10');
    await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('2'); 
    await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');

    // -----------------------------------------------------------
    // EDUCATION SECTION (3 BLOCKS: Matriculation → Intermediate → ANM)
    // -----------------------------------------------------------

    // BLOCK 1 — Matriculation
    await page.locator('select[formcontrolname="qualification"]').nth(0)
      .selectOption({ label: 'Matriculation' });

    await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(0).fill('School A');
    await page.getByRole('textbox', { name: 'Enter Location' }).nth(0).fill('Patna');

    await pickDate(page, 'input[name="startDate"] >> nth=0', 2015, 'January', 10);
    await pickDate(page, 'input[name="endDate"] >> nth=0', 2017, 'March', 15);
    // ADD BLOCK 2
    await page.getByRole('button', { name: '' }).first().click();

    // BLOCK 2 — Intermediate
    await page.locator('select[formcontrolname="qualification"]').nth(1)
      .selectOption({ label: 'Intermediate' });

    await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).fill('College B');
    await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).fill('Patna');

    await pickDate(page, 'input[name="startDate"] >> nth=1', 2017, 'April', 10);
    await pickDate(page, 'input[name="endDate"] >> nth=1', 2019, 'March', 12);

    // ADD BLOCK 3
    await page.getByRole('button', { name: '' }).first().click();

    // BLOCK 3 — ANM (FINAL)
    await page.locator('select[formcontrolname="qualification"]').nth(2)
      .selectOption({ label: 'ANM (Auxiliary Nurse Midwife)' });

    await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).fill('ANM Institute C');
    await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).fill('Patna');

    await pickDate(page, 'input[name="startDate"] >> nth=2', 2019, 'July', 5);
    await pickDate(page, 'input[name="endDate"] >> nth=2', 2021, 'May', 20);

    // -----------------------------------------------------------
    // WORK EXPERIENCE
    // -----------------------------------------------------------
    const jobTitle = page.locator('select[formcontrolname="jobTitle"]');
    await expect(jobTitle).toBeVisible();
    await expect(jobTitle).toBeEnabled();
    await jobTitle.selectOption({ label: 'Registered Nurse' });

    await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('XYZ Hospital');
    await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).fill('Patna');

    await page.locator('input[name="wrkStartDate"]').click();
    await page.getByText('2', { exact: true }).first().click();

    await page.getByRole('checkbox').first().check();
    await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
    await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();

    // Submit form
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Yes, save it!' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    await page.getByText('Professional Registered').click();
    await page.getByRole('button', { name: 'OK' }).click();

    console.log(`========= ITERATION ${i} COMPLETED =========`);
  }

});
