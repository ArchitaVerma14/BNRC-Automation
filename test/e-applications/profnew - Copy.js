import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://68.233.110.246/bnrc_stg/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page.getByRole('link', { name: ' Professional Registration' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Registration Number' }).click();
  await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('4444444444');
  await page.getByRole('textbox', { name: 'Enter Applicant Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('testign');
  await page.locator('input[name="dob"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2009' }).click();
  await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('January').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).nth(1).click();
  await page.locator('form div').filter({ hasText: 'Applicant Name *Date of Birth' }).getByRole('combobox').selectOption('1');
  await page.getByRole('textbox', { name: 'example@gmail.com' }).click();
  await page.getByRole('textbox', { name: 'example@gmail.com' }).fill('dfdff66@gmail.com');
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('9949389969');
  await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).fill('testung father');
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).click();
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('testign');
  await page.getByRole('textbox', { name: 'YYYY', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await page.getByRole('textbox', { name: '0000 0000' }).click();
  await page.getByRole('textbox', { name: '0000 0000' }).fill('480339147268');
  await page.locator('select[name="stateId"]').selectOption('4');
  await page.locator('select[name="districtId"]').selectOption('8');
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
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
//   await page.locator('.form-select.ng-untouched').selectOption('1');
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
  await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();
  await page.getByRole('button', { name: 'Yes, save it!' }).click();
  let tempId = 'Not found';
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
});