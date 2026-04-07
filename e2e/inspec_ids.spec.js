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
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP94369101');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page1.getByRole('textbox', { name: 'Password', exact: true }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page1.getByRole('textbox', { name: 'Confirm Password' }).fill('Av@123456');
  await page1.locator('i').nth(3).click();
  await page1.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page1.getByRole('textbox', { name: 'Confirm Password' }).fill('Av@12345');
  await page1.getByRole('button', { name: ' Save' }).click();
  await expect(page1.getByRole('dialog', { name: 'Saved!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('div').filter({ hasText: /^Select User Type$/ }).nth(2).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP94369101');
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('button', { name: 'Welcome TEMP94369101 User' })).toBeVisible();

  await page1.getByRole('button', { name: ' Recognition ' }).click();
  await page1.getByRole('link', { name: ' Institute Inspection' }).click();
  await expect(page1.getByRole('heading', { name: ' Recognition ' })).toBeVisible();

  await page1.getByRole('button', { name: ' Search' }).click();
  await expect(page1.getByRole('group', { name: 'Select page' })).toBeVisible();

  await page1.getByRole('button', { name: ' Start Inspection' }).click();
  await expect(page1.getByRole('heading', { name: ' Start Inspection' })).toBeVisible();

  await page1.getByRole('radio', { name: 'Yes Yes Yes Yes Yes Yes Yes' }).check();
  await page1.locator('.input-group > .btn').first().click();
  await page1.locator('.input-group > .btn').first().setInputFiles('DigitalCV.pdf');
  await expect(page1.getByRole('button', { name: 'Preview' })).toBeVisible();

  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('verified');
  await page1.locator('input[name="proposedAnnualIntakeStudentRequirment"]').first().check();
  await page1.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('verified');
  await page1.locator('input[name="affiliatingUniversityLandUseRequirment"]').first().check();
  await page1.locator('div:nth-child(3) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(3) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('erified');
  await page1.locator('input[name="universityNameRequirment"]').first().check();
  await page1.locator('div:nth-child(4) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(4) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('verified');
  await page1.locator('input[name="numberOfTeachingBlockRequirment"]').first().check();
  await page1.locator('div:nth-child(5) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(5) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await expect(page1.getByRole('button', { name: ' Remove' })).toBeVisible();

  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('verified');
  await page1.locator('input[name="numberOfHostelBlockRequirment"]').first().check();
  await page1.locator('div:nth-child(6) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(6) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('verified');
  await page1.locator('input[name="numberOfFaculitiesBlockRequirment"]').first().check();
  await page1.locator('div:nth-child(7) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(7) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('asdfg');
  await page1.locator('input[name="totalBuildingAreaRequirment"]').first().check();
  await page1.locator('div:nth-child(8) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(8) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('ssssssssss');
  await page1.locator('input[name="boardCommissionedRequirment"]').first().check();
  await page1.locator('div:nth-child(9) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(9) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('dddddddddddd');
  await page1.locator('input[name="personelFromOnBoardRequirment"]').first().check();
  await page1.locator('div:nth-child(10) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(10) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('ddddddddddddddd');
  await page1.locator('input[name="findingSourcesRequirment"]').first().check();
  await page1.locator('div:nth-child(11) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(11) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('dddddddddddddddddd');
  await page1.locator('input[name="hospitalTypeRequirment"]').first().check();
  await page1.locator('div:nth-child(12) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(12) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('ssssssssssss');
  await page1.locator('input[name="numberOfAffiliatedHospitalRequirment"]').first().check();
  await page1.locator('div:nth-child(13) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(13) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('dddddddddddddd');
  await page1.locator('input[name="regUnderClinicalEstRequirment"]').first().check();
  await page1.locator('div:nth-child(14) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(14) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('sssssssssssss');
  await page1.locator('input[name="hospitalNameRequirment"]').first().check();
  await page1.locator('div:nth-child(15) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(15) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('dddddddddddd');
  await page1.locator('input[name="numberOfBedRequirment"]').first().check();
  await page1.locator('div:nth-child(16) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(16) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('sssssssssssssssss');
  await page1.locator('input[name="numberOfGynaecologyBedRequirment"]').first().check();
  await page1.locator('div:nth-child(17) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(17) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().click();
  await page1.locator('.form-control.ng-untouched.ng-pristine.ng-invalid').first().fill('dddddddddddd');
  await page1.locator('input[name="numberOfDeliveriesPerMonthRequirment"]').first().check();
  await page1.locator('div:nth-child(18) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page1.locator('div:nth-child(18) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page1.locator('div').filter({ hasText: /^Remark\*Maximum 200 Characters$/ }).getByPlaceholder('Enter Remarks').click();
  await page1.locator('div').filter({ hasText: /^Remark\*Maximum 200 Characters$/ }).getByPlaceholder('Enter Remarks').fill('sssssssssssssss');
  await page1.getByRole('dialog').getByRole('document').locator('div').filter({ hasText: '16. Number of Beds 100 Does' }).nth(3).click({
    button: 'right'
  });
  await page1.getByRole('dialog').getByRole('document').locator('div').filter({ hasText: '16. Number of Beds 100 Does' }).nth(3).click({
    button: 'right'
  });
  await page1.getByRole('button', { name: 'Save Inspection' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'SUCCESS!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page2 = await page2Promise;
  await expect(page2.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page2.getByText('Select User Type').click();
  await expect(page2.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page2.getByRole('option', { name: ' Officers' }).click();
  await expect(page2.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page2.getByRole('textbox', { name: ' Enter Officer ID' }).click();
  await page2.getByRole('textbox', { name: ' Enter Officer ID' }).fill('ADDI_3443');
  await page2.getByRole('textbox', { name: 'Enter your password' }).click();
  await page2.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page2.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page2.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page2.getByRole('button', { name: ' Login' }).click();
  await expect(page2.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

  await page2.getByRole('button', { name: ' Recognition ' }).click();
  await page2.getByRole('link', { name: ' Institute Inspection' }).click();
  await expect(page2.getByRole('heading', { name: ' Recognition ' })).toBeVisible();

  await page2.getByRole('textbox').click();
  await page2.getByRole('textbox').fill('NI_69131231');
  await page2.getByRole('button', { name: ' Search' }).click();
  await expect(page2.getByRole('group', { name: 'Select page' })).toBeVisible();

  await page2.getByRole('button', { name: ' Start Inspection' }).click();
  await expect(page2.getByRole('heading', { name: ' Start Inspection' })).toBeVisible();

  await page2.locator('.form-check').first().click();
  await page2.locator('.input-group > .btn').first().click();
  await page2.locator('.input-group > .btn').first().setInputFiles('DigitalCV.pdf');
  await expect(page2.getByRole('button', { name: 'Preview' })).toBeVisible();

  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddddd');
  await page2.locator('input[name="proposedAnnualIntakeStudentRequirment"]').first().check();
  await page2.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('dddddddddddddd');
  await page2.locator('input[name="affiliatingUniversityLandUseRequirment"]').first().check();
  await page2.locator('div:nth-child(3) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(3) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('dddddddddddddd');
  await page2.locator('div:nth-child(4) > .card > .card-body > .col-lg-4 > div').first().click();
  await page2.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('input[name="universityNameRequirment"]').first().check();
  await page2.locator('div:nth-child(4) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(4) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddddddddd');
  await page2.locator('input[name="numberOfTeachingBlockRequirment"]').first().check();
  await page2.locator('div:nth-child(5) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(5) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await expect(page2.getByRole('button', { name: ' Remove' })).toBeVisible();

  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddddddd');
  await page2.locator('div:nth-child(6) > .card > .card-body > .col-lg-4 > div').first().click();
  await page2.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(2) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles([]);
  await page2.locator('input[name="numberOfHostelBlockRequirment"]').first().check();
  await page2.locator('div:nth-child(6) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(6) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddd');
  await page2.locator('input[name="numberOfFaculitiesBlockRequirment"]').first().check();
  await page2.locator('div:nth-child(7) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(7) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('dddddddddddd');
  await page2.locator('input[name="totalBuildingAreaRequirment"]').first().check();
  await page2.locator('div:nth-child(8) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(8) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddd');
  await page2.locator('input[name="boardCommissionedRequirment"]').first().check();
  await page2.locator('div:nth-child(9) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(9) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ssssssssssssss');
  await page2.locator('input[name="personelFromOnBoardRequirment"]').first().check();
  await page2.locator('div:nth-child(10) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(10) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ddddddddddd');
  await page2.locator('input[name="findingSourcesRequirment"]').first().check();
  await page2.locator('div:nth-child(11) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(11) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('sssssssssssss');
  await page2.locator('input[name="hospitalTypeRequirment"]').first().check();
  await page2.locator('div:nth-child(12) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(12) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ssssssssss');
  await page2.locator('input[name="numberOfAffiliatedHospitalRequirment"]').first().check();
  await page2.locator('div:nth-child(13) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(13) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('sssssssssssss');
  await page2.locator('input[name="regUnderClinicalEstRequirment"]').first().check();
  await page2.locator('div:nth-child(14) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(14) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('sssssssssss');
  await page2.locator('input[name="hospitalNameRequirment"]').first().check();
  await page2.locator('div:nth-child(15) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(15) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('sssssssssss');
  await page2.locator('input[name="numberOfBedRequirment"]').first().check();
  await page2.locator('div:nth-child(16) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(16) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ssssssss');
  await page2.locator('input[name="numberOfGynaecologyBedRequirment"]').first().check();
  await page2.locator('div:nth-child(17) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(17) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('.form-control.ng-untouched').first().click();
  await page2.locator('.form-control.ng-untouched').first().fill('ffffffffffff');
  await page2.locator('input[name="numberOfDeliveriesPerMonthRequirment"]').first().check();
  await page2.locator('div:nth-child(18) > .card > .card-body > .col-lg-8 > .input-group > .btn').click();
  await page2.locator('div:nth-child(18) > .card > .card-body > .col-lg-8 > .input-group > .btn').setInputFiles('DigitalCV.pdf');
  await page2.locator('div').filter({ hasText: /^Remark\*Maximum 200 Characters$/ }).getByPlaceholder('Enter Remarks').click();
  await page2.locator('div').filter({ hasText: /^Remark\*Maximum 200 Characters$/ }).getByPlaceholder('Enter Remarks').fill('fffffffffff');
  await page2.getByRole('dialog').getByRole('document').locator('div').filter({ hasText: 'Name of the proposed college Testing Nursing Institute A Does Requirement Meet' }).nth(1).click({
    button: 'right'
  });
  await page2.getByRole('button', { name: 'Save Inspection' }).click();
  await expect(page2.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page2.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page2.getByRole('dialog', { name: 'SUCCESS!' })).toBeVisible();

  await page2.getByRole('button', { name: 'OK' }).click();
});