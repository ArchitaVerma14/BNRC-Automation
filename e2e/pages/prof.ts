import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://bnrc2.bihar.gov.in/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page.getByRole('link', { name: ' Professional Registration' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Registration Number' }).click();
  await page.getByRole('textbox', { name: 'Enter Registration Number' }).fill('ddddddddd4');
  await page.getByRole('textbox', { name: 'Enter Applicant Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Applicant Name' }).fill('Niharika');
  await page.locator('input[name="dob"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2010' }).click();
  await expect(page.getByRole('row', { name: '2004 2005 2006' })).toBeVisible();

  await page.getByText('2003', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.locator('form div').filter({ hasText: 'Applicant Name *Date of Birth' }).getByRole('combobox').selectOption('2');
  await page.getByRole('textbox', { name: 'example@gmail.com' }).click();
  await page.getByRole('textbox', { name: 'example@gmail.com' }).fill('ssssss@gmail.com');
  await page.getByRole('textbox', { name: 'example@gmail.com' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('8888888888');
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter Father\'s Name' }).fill('ddddddd');
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).click();
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).fill('Niharika');
  await page.getByRole('textbox', { name: 'Enter Name As Per Aadhaar' }).press('Tab');
  await page.getByRole('textbox', { name: 'YYYY', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2003', { exact: true }).click();
  await page.getByRole('textbox', { name: '0000 0000' }).click();
  await page.getByRole('textbox', { name: '0000 0000' }).fill('555689715387');
  await page.locator('select[name="stateId"]').selectOption('7');
  await page.locator('select[name="stateId"]').selectOption('4');
  await page.locator('select[name="districtId"]').selectOption('10');
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
  await page.locator('.form-select.ng-untouched.ng-pristine').first().selectOption('1');
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).fill('aaaaa');
  await page.getByRole('textbox', { name: 'Enter Location' }).first().click();
  await page.getByRole('textbox', { name: 'Enter Location' }).first().fill('aaaaaaaa');
  await page.locator('input[name="startDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2021').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('January').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('3', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2022').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.getByRole('button', { name: '' }).first().click();
  await page.locator('.form-select.ng-untouched').first().selectOption('2');
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(1).fill('dddddddd');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(1).fill('ddddddddddddd');
  await page.locator('input[name="startDate"]').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2023').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('April').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('4', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').nth(1).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2024').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('May').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.getByRole('button', { name: '' }).nth(1).click();
  await page.locator('.form-select.ng-untouched').first().selectOption('3');
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Enter Name of the Institution' }).nth(2).fill('gggggggg');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(2).fill('ffffffffff');
  await page.locator('input[name="startDate"]').nth(2).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2024').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('June').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('4', { exact: true }).first().click();
  await page.locator('input[name="endDate"]').nth(2).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2026' }).click();
  await expect(page.getByRole('row', { name: '2020 2021 2022' })).toBeVisible();

  await page.getByText('2026').click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('2', { exact: true }).first().click();
  await page.locator('.form-select.ng-untouched').selectOption('2');
  await page.getByRole('textbox', { name: 'Enter Company Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Company Name' }).fill('vvvvvvv');
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).click();
  await page.getByRole('textbox', { name: 'Enter Location' }).nth(3).fill('fffffff');
  await page.getByRole('checkbox').first().check();
  await page.locator('input[name="wrkStartDate"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2', { exact: true }).first().click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
  await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page.getByText('Professional Registered').click();
  await expect(page.getByText('Professional Registered')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
});