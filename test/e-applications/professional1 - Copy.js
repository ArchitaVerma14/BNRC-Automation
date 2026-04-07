const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ================= CSV SETUP =================
const csvFile = path.join(__dirname, 'temp_ids.csv');
if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(csvFile, 'Run,Mobile,Aadhaar,TEMP_ID,Status\n');
}

// ================= VERHOEFF TABLES =================
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

// ================= HELPERS =================
function generateVerhoeffDigit(num) {
  let c = 0;
  const arr = num.split('').reverse().map(Number);
  for (let i = 0; i < arr.length; i++) {
    c = d[c][p[(i + 1) % 8][arr[i]]];
  }
  return inv[c];
}

// Aadhaar: first digit always 5–9
function generateAadhaar() {
  let base = (Math.floor(Math.random() * 5) + 5).toString();
  for (let i = 0; i < 10; i++) {
    base += Math.floor(Math.random() * 10);
  }
  return base + generateVerhoeffDigit(base);
}

// Mobile: starts with 6–9
function generateMobile() {
  return (
    (Math.floor(Math.random() * 4) + 6).toString() +
    Math.floor(100000000 + Math.random() * 900000000).toString()
  );
}

// ================= TEST =================
test('BNRC Professional Registration – 30 Loop (JS)', async ({ page }) => {

  for (let run = 1; run <= 30; run++) {

    const mobile = generateMobile();
    const aadhaar = generateAadhaar();
    let tempId = 'NOT_FOUND';

    console.log(`\n▶ Run ${run}`);
    console.log(`Mobile: ${mobile}`);
    console.log(`Aadhaar: ${aadhaar}`);

    try {
      await page.goto('http://68.233.110.246/bnrc_stg/home');
      await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

      await page.getByRole('link', { name: ' Professional Registration' }).click();
      await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

      await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('4444444444');
      await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('Testing User');

      await page.locator('input[name="dob"]').click();
      await page.getByRole('button', { name: '2009' }).click();
      await page.getByText('2002', { exact: true }).click();
      await page.getByText('January').click();
      await page.getByText('1', { exact: true }).nth(1).click();

      await page.locator('form div')
        .filter({ hasText: 'Applicant Name *Date of Birth' })
        .getByRole('combobox')
        .selectOption('1');

      await page.getByRole('textbox', { name: 'example@gmail.com' })
        .fill(`test${run}@mail.com`);

      await page.getByRole('textbox', { name: 'Enter Mobile Number' })
        .fill(mobile);

      await page.getByRole('textbox', { name: "Enter Father's Name" })
        .fill('Test Father');

      await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' })
        .fill('Testing User');

      // await page.getByText('2002', { exact: true }).click();
      await page.getByRole('textbox', { name: 'YYYY', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();
      await page.getByText('2002', { exact: true }).click();
      await page.getByRole('textbox', { name: '0000 0000' }).fill(aadhaar);
      await page.locator('select[name="stateId"]').selectOption('4');
      await page.locator('select[name="districtId"]').selectOption('8');

      await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
      await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');

      // await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).fill('ddddddddddd');
      // await page.getByRole('textbox', { name: 'Enter Location' }).first().fill('dddddddddd');

      // (education + experience blocks kept SAME as your script)
      await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).fill('ddddddddddd');
  await page.getByRole('textbox', { name: 'Enter Location' }).first().click();
  await page.getByRole('textbox', { name: 'Enter Location' }).first().fill('dddddddddd');
  await page.locator('input[name="startDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2019').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2020').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.getByRole('button', { name: '' }).first().click();
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('2');
  await page.locator('.form-select.ng-untouched').first().selectOption('2');
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).fill('ggggggggggg');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).fill('dddddddddd');
  await page.locator('input[name="startDate"]').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2021').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('2', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2022').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('2', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2', { exact: true }).first().click();
  await page.getByRole('button', { name: '' }).nth(1).click();
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('3');
  await page.locator('.form-select.ng-untouched').first().selectOption('3');
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).fill('rrrrrrrrrr');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).fill('fffffffffffffffff');
  await page.locator('input[name="startDate"]').nth(2).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2022').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('April').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('3', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').nth(2).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2025' }).click();
  await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page.getByText('2025', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('April').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('3', { exact: true }).first().click();
    await page.locator('select[formcontrolname="jobTitle"]').selectOption({ index: 1 });

  await page.getByRole('textbox', { name: 'Enter Company Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('hhhhhhhhhhh');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).fill('hhhhhhhhhhhh');
  await page.locator('input[name="wrkStartDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.getByRole('checkbox').first().check();
  await page.getByRole('textbox', { name: 'Enter Answer' }).click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');


      // await page.locator('select[formcontrolname="jobTitle"]').selectOption({ index: 1 });
      // await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('hhhhhhhhhhh');
      // await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).fill('hhhhhhhhhhhh');

      // await page.getByRole('checkbox').first().check();
      // await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
      await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();

      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();
      await page.getByRole('button', { name: 'Yes, save it!' }).click();
      try {
  const swalContainer = page.locator('div.swal2-html-container');
  await expect(swalContainer).toContainText(/TEMP\d+/);
  const text = await swalContainer.textContent();
  tempId = text.match(/TEMP\d+/)?.[0] || 'Not found';
  console.log('TEMP ID:', tempId);
} catch (e) {
  console.error('TEMP ID not found');
}

  await expect(page.getByText('Professional Registered')).toBeVisible();
  
      await page.getByRole('button', { name: 'OK' }).click();
      fs.appendFileSync(
  csvFile,
  `${run},${mobile},${aadhaar},${tempId},SUCCESS\n`)

    } 
    catch (err) {
      
      console.error(`✖ Run ${run} failed`);

      fs.appendFileSync(
        csvFile,
        `${run},${mobile},${aadhaar},${tempId},FAILED\n`
      );
    }
  }
});
