import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://bnrc2.bihar.gov.in/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page.getByRole('link', { name: 'Foreign Verification' }).click();
  await page.locator('select[name="courseId"]').selectOption('3');
  await page.locator('div').filter({ hasText: /^Name of Applicant\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Name of Applicant\*$/ }).getByRole('textbox').fill('testing team');
  await page.locator('form div').filter({ hasText: 'Course *--Select--RANM GNM NPM B.Sc (Nursing) M.Sc (Nursing) PBBSc Name of' }).getByRole('combobox').nth(1).selectOption('2');
  await page.locator('div').filter({ hasText: /^Father's Name\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Father's Name\*$/ }).getByRole('textbox').fill('testingfather');
  await page.getByRole('textbox', { name: 'YYYY-MM-DD' }).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '2009' }).click();
  await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page.getByText('May').click();
  await expect(page.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page.getByText('8', { exact: true }).first().click();
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').fill('test@1234');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').press('ArrowLeft');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').press('ArrowLeft');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').press('ArrowLeft');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').press('ArrowLeft');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').fill('test1234');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').press('End');
  await page.locator('div').filter({ hasText: /^Email\*$/ }).getByRole('textbox').fill('test1234@gmail.com');
  await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').fill('7319722565');
  await page.locator('select[name="stateId"]').selectOption('4');
  await page.locator('select[name="districtId"]').selectOption('10');
  await page.locator('form div').filter({ hasText: 'Course *--Select--RANM GNM NPM B.Sc (Nursing) M.Sc (Nursing) PBBSc Name of' }).getByRole('combobox').nth(4).selectOption('4');
  await page.locator('div').filter({ hasText: /^Name as per Aadhaar\*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Name as per Aadhaar\*$/ }).getByRole('textbox').fill('testing team');
  await page.locator('div').filter({ hasText: /^Year of Birth as per Aadhaar\*$/ }).getByPlaceholder('YYYY').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByRole('button', { name: '‹' }).click();
  await expect(page.getByRole('row', { name: '2003 2004 2005' })).toBeVisible();

  await page.getByText('2002', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Aadhaar Number \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Aadhaar Number \*$/ }).getByRole('textbox').fill('970493294252');
  await page.locator('.form-select.education').selectOption('1');
  await page.locator('input[name="passedYear"]').click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2018', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).fill('cbse');
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).click();
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).fill('90');
  await page.getByRole('button', { name: 'Add More' }).click();
  await page.locator('.form-select.education.ng-untouched').selectOption('2');
  await page.getByRole('textbox', { name: 'YYYY' }).nth(3).click();
  await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page.getByText('2020').click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).fill('cbse');
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter Board Name' }).nth(1).fill('cbse8');
  await page.getByRole('textbox', { name: 'Enter Secured Marks' }).nth(1).fill('98');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('DigitalCV.pdf');
  await page.getByRole('textbox', { name: 'Enter Answer' }).click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
  await page.getByRole('checkbox', { name: 'I agree to provide my Aadhaar' }).check();
  await page.getByRole('button', { name: 'Submit Details' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page.getByRole('dialog', { name: 'Success' })).toBeVisible();

  await page.getByText('Foreign verification successful, Login Id TEMP37801').click();
  await page.getByText('Foreign verification successful, Login Id TEMP37801').click();
  await expect(page.getByText('Foreign verification successful, Login Id TEMP37801')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('link', { name: ' new test Published Date 17-' })).toBeVisible();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP37801');
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

  await page1.locator('div').filter({ hasText: /^Select User Type$/ }).nth(1).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP37801');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP37801 User Image ' })).toBeVisible();

  await page1.getByRole('button', { name: ' E-Application ' }).click();
  await page1.getByRole('link', { name: ' Foreign Verification' }).click();
  await expect(page1.getByRole('row', { name: '1 testing team testingfather' })).toBeVisible();

  await page1.getByRole('button', { name: ' Proceed for Payment' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'SUCCESS' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
});