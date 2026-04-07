import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://68.233.110.246/bnrc_stg/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP93760');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Youknowit@07');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP93760 User Image ' })).toBeVisible();

  await page1.getByRole('button', { name: ' Recognition ' }).click();
  await expect(page1.getByRole('link', { name: ' Request for LOP' })).toBeVisible();

  await page1.getByRole('link', { name: ' Apply for Inspection' }).click();
  await expect(page1.getByRole('heading', { name: ' Recognition ' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Enter Name of the proposed' }).click();
  await page1.getByRole('textbox', { name: 'Enter Name of the proposed' }).fill('testing Nursing Institute');
  await page1.getByRole('textbox', { name: 'Enter Proposed annual intake' }).click();
  await page1.getByRole('textbox', { name: 'Enter Proposed annual intake' }).fill('50');
  await page1.getByRole('textbox', { name: 'Enter Number of Teaching' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Teaching' }).fill('5');
  await page1.getByRole('textbox', { name: 'Enter Area of Teaching Block' }).click();
  await page1.getByRole('textbox', { name: 'Enter Area of Teaching Block' }).fill('2344');
  await page1.getByRole('button', { name: 'Choose File' }).first().click();
  await page1.getByRole('button', { name: 'Choose File' }).first().setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Hostel Blocks' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Hostel Blocks' }).fill('2');
  await page1.getByRole('textbox', { name: 'Enter Area of Hostel Blocks' }).click();
  await page1.getByRole('textbox', { name: 'Enter Area of Hostel Blocks' }).fill('34534');
  await page1.getByRole('button', { name: 'Choose File' }).nth(1).click();
  await page1.getByRole('button', { name: 'Choose File' }).nth(1).setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of faculities' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of faculities' }).fill('55');
  await page1.getByRole('button', { name: 'Choose File' }).nth(2).click();
  await page1.getByRole('button', { name: 'Choose File' }).nth(2).setInputFiles('DigitalCV.pdf');
  await page1.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByText('Yes, save it!NoCancel').click();
  await expect(page1.getByRole('dialog', { name: 'UPDATED' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP93760 User Image ' })).toBeVisible();

  await page1.getByRole('radio', { name: 'No No No' }).check();
  await page1.locator('[id="2"]').nth(1).check();
  await page1.locator('[id="2"]').nth(2).check();
  await page1.getByRole('button', { name: 'Save & next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'UPDATED' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP93760 User Image ' })).toBeVisible();

  await page1.getByRole('radio', { name: 'Both' }).check();
  await safeFill(page1.getByRole('textbox', { name: /Number of Tie-Up Hospital/i }), '1');

// Enter number of Tie-Up hospital
  await safeFill(page1.getByRole('textbox', { name: /Enter number of Tie-Up hospital/i }), '1');

  await page1.getByRole('radio', { name: 'Yes' }).check();
  await page1.getByRole('radio', { name: 'No' }).check();
  await page1.getByRole('textbox', { name: 'Enter Hospital Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Hospital Name' }).fill('testing hospital');
  await page1.locator('.input-group > .form-control').first().click();
  await page1.locator('.input-group > .form-control').first().setInputFiles('DigitalCV.pdf');
  await page1.locator('.input-group > .form-control').first().click();
  await page1.locator('.input-group > .form-control').first().setInputFiles([]);
  await page1.getByRole('textbox', { name: 'Enter Hospital Address' }).click();
  await page1.getByRole('textbox', { name: 'Enter Hospital Address' }).fill('aaaaaaaaa');
  await page1.getByRole('textbox', { name: 'Enter Total no. Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Total no. Beds' }).fill('50');
  await page1.locator('div:nth-child(4) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(4) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Medical Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Medical Beds' }).fill('5');
  await page1.locator('div:nth-child(5) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(5) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Surgical Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Surgical Beds' }).fill('10');
  await page1.locator('div:nth-child(6) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(6) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Gynaecology' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Gynaecology' }).fill('5');
  await page1.locator('div:nth-child(7) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(7) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).fill('10');
  await page1.locator('div:nth-child(8) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(8) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Number of Ortho Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Ortho Beds' }).fill('5');
  await page1.locator('div:nth-child(9) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(9) > .bg-light > .row > div:nth-child(2) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Total no. Beds' }).click();

  await page1.getByRole('textbox', { name: 'Enter Total no. Beds' }).fill('100');
  await page1.getByRole('textbox', { name: 'Enter Number of Medical Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Medical Beds' }).fill('50');
  await page1.getByRole('textbox', { name: 'Enter Number of Surgical Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Gynaecology' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Gynaecology' }).fill('10');
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).fill('10');
  await page1.getByRole('textbox', { name: 'Enter Number of Ortho Beds' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Ortho Beds' }).fill('20');
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).click();
  await page1.getByRole('textbox', { name: 'Enter Number of Peadiatrics' }).fill('10');
  await page1.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'UPDATED' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP93760 User Image ' })).toBeVisible();

  await page1.getByRole('button', { name: 'Submit & Proceed for payment' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Submit & Proceed for payment' }).click();
  await expect(page1.getByRole('dialog', { name: 'REQUESTED TO VERIFY!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
});