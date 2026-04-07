// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://68.233.110.246/bnrc_stg/home');
//   await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

//   await page.getByRole('link', { name: ' Professional Registration' }).click();
//   await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'Enter Registration Number' }).click();
//   await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('4444444444');
//   await page.getByRole('textbox', { name: 'Enter Applicant Name' }).click();
//   await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('testign');
//   await page.locator('input[name="dob"]').click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2009' }).click();
//   await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

//   await page.getByText('2002', { exact: true }).click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('January').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('1', { exact: true }).nth(1).click();
//   await page.locator('form div').filter({ hasText: 'Applicant Name *Date of Birth' }).getByRole('combobox').selectOption('1');
//   await page.getByRole('textbox', { name: 'example@gmail.com' }).click();
//   await page.getByRole('textbox', { name: 'example@gmail.com' }).fill('dfdff66@gmail.com');
//   await page.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
//   await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9999999999');
//   await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).click();
//   await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).fill('testung father');
//   await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).click();
//   await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('testign');
//   await page.getByRole('textbox', { name: 'YYYY', exact: true }).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByText('2002', { exact: true }).click();
//   await page.getByRole('textbox', { name: '0000 0000' }).click();
//   await page.getByRole('textbox', { name: '0000 0000' }).fill('624998389474');
//   await page.locator('select[name="stateId"]').selectOption('4');
//   await page.locator('select[name="districtId"]').selectOption('8');
//   await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
//   await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).click();
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).fill('ddddddddddd');
//   await page.getByRole('textbox', { name: 'Enter Location' }).first().click();
//   await page.getByRole('textbox', { name: 'Enter Location' }).first().fill('dddddddddd');
//   await page.locator('input[name="startDate"]').click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2019').click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('February').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('1', { exact: true }).first().click();
//   await page.locator('input[name="endDate"]').click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2020').click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('February').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('1', { exact: true }).first().click();
//   await page.getByRole('button', { name: '' }).first().click();
//   await page.locator('.form-select.ng-untouched').first().selectOption('2');
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).click();
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).fill('ggggggggggg');
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).click();
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).fill('dddddddddd');
//   await page.locator('input[name="startDate"]').nth(1).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2021').click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('February').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('2', { exact: true }).first().click();
//   await page.locator('input[name="endDate"]').nth(1).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2022').click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('February').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('2', { exact: true }).first().click();
//   await page.getByRole('button', { name: '' }).nth(1).click();

//   await page.locator('input[name="endDate"]').nth(1).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByText('2', { exact: true }).first().click();
//   await page.getByRole('button', { name: '' }).nth(1).click();
//   await page.locator('.form-select.ng-untouched').first().selectOption('3');
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).click();
//   await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).fill('rrrrrrrrrr');
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).click();
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).fill('fffffffffffffffff');
//   await page.locator('input[name="startDate"]').nth(2).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2022').click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('April').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('3', { exact: true }).first().click();
//   await page.locator('input[name="endDate"]').nth(2).click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByRole('button', { name: '2025' }).click();
//   await expect(page.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

//   await page.getByText('2025', { exact: true }).click();
//   await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

//   await page.getByText('April').click();
//   await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

//   await page.getByText('3', { exact: true }).first().click();
//   await page.locator('.form-select.ng-untouched').selectOption('1');
//   await page.getByRole('textbox', { name: 'Enter Company Name' }).click();
//   await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('hhhhhhhhhhh');
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).click();
//   await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).fill('hhhhhhhhhhhh');
//   await page.locator('input[name="wrkStartDate"]').click();
//   await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

//   await page.getByText('1', { exact: true }).first().click();
//   await page.getByRole('checkbox').first().check();
//   await page.getByRole('textbox', { name: 'Enter Answer' }).click();
//   await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
//   await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

//   await page.getByRole('button', { name: 'Yes, save it!' }).click();
//   await page.getByRole('button', { name: 'OK' }).click();
//   await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

//   await page.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
//   await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9999999995');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

//   await page.getByRole('button', { name: 'Yes, save it!' }).click();
//   await expect(page.getByText('Professional Registered')).toBeVisible();
//   await page.getByRole('button', { name: 'OK' }).click();
// });
import { test, expect } from '@playwright/test';

/* -------------------- Helpers -------------------- */

async function pickDate(page, year, month, day) {
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  // Open year selection (calendar header button shows current year like 2025)
  await page.getByRole('button', { name: '2025' }).click();

  // Select year → month → day
  await page.getByText(year, { exact: true }).click();
  await page.getByText(month, { exact: true }).click();
  await page.getByText(day, { exact: true }).first().click();
}

async function fillQualificationRow(
  page,
  qualificationValue,
  institution,
  location,
  start,
  end
) {
  // Qualification dropdown (always target the LAST row)
  await page.locator('.form-select.ng-untouched').last().selectOption(qualificationValue);

  // Institution
  await page
    .getByRole('textbox', { name: 'Enter Name of the Institution' })
    .last()
    .fill(institution);

  // Location
  await page
    .getByRole('textbox', { name: 'Enter Location' })
    .last()
    .fill(location);

  // Start Date
  await page.locator('input[name="startDate"]').last().click();
  await pickDate(page, start.year, start.month, start.day);

  // End Date
  await page.locator('input[name="endDate"]').last().click();
  await pickDate(page, end.year, end.month, end.day);
}

/* -------------------- Test -------------------- */

test('Professional Registration – full form with all fields', async ({ page }) => {
  /* ---------- Open App ---------- */
  await page.goto('http://68.233.110.246/bnrc_stg/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page.getByRole('link', { name: ' Professional Registration' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  /* ---------- Basic Details ---------- */

  await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('4444444444');
  await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('testign');

  // DOB
  await page.locator('input[name="dob"]').click();
  await pickDate(page, '2002', 'January', '1');

  await page
    .locator('form div')
    .filter({ hasText: 'Applicant Name *Date of Birth' })
    .getByRole('combobox')
    .selectOption('1'); // Gender

  await page.getByRole('textbox', { name: 'example@gmail.com' }).fill('dfdff66@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9949999969');
  await page.getByRole('textbox', { name: "Enter Father's Name" }).fill('testing father');
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('testign');

  // Birth Year (YYYY)
  await page.getByRole('textbox', { name: 'YYYY', exact: true }).click();
  await page.getByText('2002', { exact: true }).click();

  // Aadhaar
  await page.getByRole('textbox', { name: '0000 0000' }).fill('615526811912');

  // Address / Category
  await page.locator('select[name="stateId"]').selectOption('4');
  await page.locator('select[name="districtId"]').selectOption('8');
  await page.locator('select[name="categoryId"]').selectOption('1');

  /* ---------- Qualifications ---------- */

  // 1) Matriculation (default row)
  await fillQualificationRow(
    page,
    '1',
    'ABC School',
    'Patna',
    { year: '2019', month: 'February', day: '1' },
    { year: '2020', month: 'February', day: '1' }
  );

  // 2) Intermediate
  await page.getByRole('button', { name: '' }).click();
  await fillQualificationRow(
    page,
    '2',
    'XYZ College',
    'Patna',
    { year: '2021', month: 'February', day: '2' },
    { year: '2022', month: 'February', day: '2' }
  );

  // 3) ANM
  await page.getByRole('button', { name: '' }).click();
  await fillQualificationRow(
    page,
    '3',
    'Nurse University',
    'Patna',
    { year: '2022', month: 'April', day: '3' },
    { year: '2025', month: 'April', day: '3' }
  );

  /* ---------- Professional / Work Details ---------- */

  await page.locator('.form-select.ng-untouched').last().selectOption('1'); // Job title
  await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('abcCompany');
  await page.getByRole('textbox', { name: 'Enter Location' }).last().fill('Patna');

  // Work Start Date
  await page.locator('input[name="wrkStartDate"]').click();
  await pickDate(page, '2025', 'January', '1');

  // Currently working checkbox
  await page.getByRole('checkbox').first().check();

  /* ---------- Captcha & Consent ---------- */

  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
  await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();

  /* ---------- Submit ---------- */

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await expect(page.getByText('Professional Registered')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
});
