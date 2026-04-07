import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://68.233.110.246/bnrc_stg/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page.getByRole('button', { name: 'E-Application ' }).click();
  await expect(page.getByRole('img', { name: 'Banner' })).toBeVisible();

  await page.getByRole('link', { name: 'Foreign Verification' }).click();
  await page.locator('select[name="courseId"]').selectOption('2');
  await page.locator('div').filter({ hasText: /^Name of Applicant\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Name of Applicant\*$/ }).getByRole('textbox').fill('testing');
  await page.locator('form div').filter({ hasText: 'Course *--Select--ANM GNM Name of Applicant*Gender*--Select--Male Female' }).getByRole('combobox').nth(1).selectOption('1');
  await page.locator('div').filter({ hasText: /^Father's Name\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Father's Name\*$/ }).getByRole('textbox').fill('sssssssssssssssssss');
  await page.getByRole('textbox', { name: 'YYYY-MM-DD' }).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2009' }).click();
  await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('February').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('1', { exact: true }).first().click();
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').fill('sssssssss@gmail.com');
  await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').fill('8776565665');
  await page.locator('select[name="stateId"]').selectOption('4');
  await page.locator('select[name="districtId"]').selectOption('8');
  await page.locator('form div').filter({ hasText: 'Course *--Select--ANM GNM Name of Applicant*Gender*--Select--Male Female' }).getByRole('combobox').nth(4).selectOption('1');
  await page.locator('div').filter({ hasText: /^Name as per Aadhaar\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Name as per Aadhaar\*$/ }).getByRole('textbox').fill('testing');
  await page.locator('div').filter({ hasText: /^Year of Birth as per Aadhaar\*$/ }).getByPlaceholder('YYYY').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '‹' }).click();
  await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Aadhaar Number \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Aadhaar Number \*$/ }).getByRole('textbox').fill('652164083276');
  await page.locator('.form-select.education').selectOption('1');
  await page.locator('input[name="passedYear"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2020').click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).fill('cbse');
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).click();
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).fill('89');
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.locator('.form-select.education.ng-untouched').selectOption('2');
  await page.getByRole('textbox', { name: 'YYYY' }).nth(3).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2022').click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).fill('cbse');
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).fill('89');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('DigitalCV.pdf');
  await page.getByRole('textbox', { name: 'Enter Answer' }).click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
  await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();
  await page.getByRole('button', { name: 'Submit Details' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page.getByText('Foreign verification successful, Login Id TEMP91839')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP91839');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page1.getByRole('textbox', { name: 'Password', exact: true }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page1.getByRole('textbox', { name: 'Confirm Password' }).fill('Av@12345');
  await page1.getByRole('button', { name: ' Save' }).click();
  await expect(page1.getByRole('dialog', { name: 'Saved!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP91839');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP91839 User Image ' })).toBeVisible();

  await page1.getByRole('button', { name: ' E-Application ' }).click();
  await page1.getByRole('link', { name: ' Foreign Verification' }).click();
  await expect(page1.getByRole('row', { name: '1 testing sssssssssssssssssss' })).toBeVisible();

  await page1.getByRole('button', { name: ' Proceed for Payment' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'SUCCESS' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
});