import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Random Yes/No generator
function randomYesNo() {
  return Math.random() < 0.5 ? "Yes" : "No";
}

test('ODK Complete Automation - Stable Selectors (Q1b + Q17 Fixed)', async ({ page }) => {

  // Open form
  await page.goto('https://sangrahiuat.piramalswasthya.org/-/single/JnDocVcnqt0L8NfA65aSBgpYFexezu9?st=YjtDgr6N!3EHD63usOiWyYKEnoXtF9aqnQO5JdlsSHWXjzuV9Mne0n3hHkTbT5Ae');
  await expect(page.getByRole('group', { name: '1. Is the X-ray Centre' })).toBeVisible();

  // ---------------- Q1 ----------------
  const q1_choice = randomYesNo();
  await page.getByRole('group', { name: '1. Is the X-ray Centre' })
    .getByLabel(q1_choice).check();

  // Q1b appears ONLY if Q1 == Yes
  if (q1_choice === "Yes") {
    await expect(page.getByRole('group', { name: '1a. If Yes, is there any' })).toBeVisible();
    const q1b_choice = randomYesNo();
    await page.getByRole('group', { name: '1a. If Yes, is there any' })
      .getByLabel(q1b_choice).check();
  }

  // ---------------- Coordinates ----------------
  await page.getByRole('spinbutton', { name: 'latitude (x.y °)' })
    .fill(faker.location.latitude().toString());
  await page.getByRole('spinbutton', { name: 'longitude (x.y °)' })
    .fill(faker.location.longitude().toString());
  await page.getByRole('spinbutton', { name: 'altitude (m)' })
    .fill(faker.number.int({ min: 10, max: 500 }).toString());
  await page.getByRole('spinbutton', { name: 'accuracy (m)' })
    .fill(faker.number.int({ min: 1, max: 50 }).toString());

  // ---------------- Dropdown Picker ----------------
  async function pickDropdown(labelText) {
    const dropdownButton = page.locator('label').filter({ hasText: labelText }).getByRole('button');
    await dropdownButton.click();
    const options = page.locator('ul.dropdown-menu:visible li a label');
    const count = await options.count();
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      await options.nth(randomIndex).click();
      await page.waitForTimeout(200);
    }
  }

  await pickDropdown('Select Agency (X-Ray Service');
  await pickDropdown('Select District*');
  await pickDropdown('Select Facility');

  // ---------------- Radio Groups 2–16 (Random Yes/No) ----------------
  const radioGroups = [
    '2. Is the x-ray room and', '3. Availability of Lead', '4. Availability of Lead glass',
    '5. Is Warning Light installed', '6. Is Warning light', '7. Availability of Chest',
    '8. Display of radiation', '9. Display of warning signage', '10. IEC Displaying timings',
    '11a. Is X-Ray equipment', '11b. Display of AERB Licence', '12a. Is proper data-entry',
    '12b. Is the data for time of', '12c. Copy of BHAVYA coupons', '12d. Copy of Prescription/OPD',
    '13a. Protective (Mobile)', '13b. Lead Apron * Physical', '13c. Goggles * Physical',
    '13d. Thyroid Shields *', '14a. Provision of ID Cards', '14b. Is X-ray technician',
    '15a. Is technological', '16a. Availability of SOP (', '16b. Equipment downtime',
    '16e. Availability of power'
  ];

  for (const name of radioGroups) {
    const choice = randomYesNo();
    const radio = page.getByRole('group', { name }).getByLabel(choice);
    if (await radio.count() > 0) {
      await radio.scrollIntoViewIfNeeded();
      await radio.check({ force: true });
    }
  }

  // 12e. Total number of patients (0–9999)
const field12e = page.getByRole('spinbutton', { name: '12e. Total no of of patients' });
let value12e = 0;

if (await field12e.count() > 0) {
  await field12e.scrollIntoViewIfNeeded();
  value12e = faker.number.int({ min: 0, max: 9999 });  // allowed range
  await field12e.fill(value12e.toString());
  await page.waitForTimeout(100);
}

// 12f depends on 12e → must be <= 12e
const field12f = page.getByRole('spinbutton', { name: '12f. How many patients were' });
if (await field12f.count() > 0) {
  await field12f.scrollIntoViewIfNeeded();
  const value12f = faker.number.int({ min: 0, max: value12e });
  await field12f.fill(value12f.toString());
  await page.waitForTimeout(100);
}

  // ---------------- Numeric Fields ----------------
  // await page.getByRole('spinbutton', { name: '12e. Total no of of patients' })
  //   .fill(faker.number.int({ min: 0, max: value12e }).toString());

  // await page.getByRole('spinbutton', { name: '12f. How many patients were' })
  //   .fill(faker.number.int({ min: 0, max: 50 }).toString());

  await page.getByRole('spinbutton', { name: '16c. No. of days the X-ray' })
    .fill(faker.number.int({ min: 1, max: 30 }).toString());

  await page.getByRole('spinbutton', { name: '16d. No. of days with power' })
    .fill(faker.number.int({ min: 1, max: 30 }).toString());

  // ---------------- Q17 - FINAL FIX: Using Recorder-Verified Selectors ----------------
  // P1
  await page.locator('input[name="/data/gp1/q17a_p1"]').nth(1).check({ force: true });
  await page.locator('input[name="/data/gp1/q17b_p1"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp1/q17c_p1"]').nth(2).check({ force: true });
  await page.locator('section:nth-child(7) > fieldset:nth-child(5) > fieldset > .option-wrapper > label:nth-child(3)').click();

  // P2
  await page.locator('section:nth-child(8) > fieldset > fieldset > .option-wrapper > label:nth-child(4)').first().click();
  await page.locator('input[name="/data/gp2/q17b_p2"]').nth(1).check();
  await page.locator('section:nth-child(8) > fieldset:nth-child(4) > fieldset > .option-wrapper > label:nth-child(4)').click();
  await page.locator('section:nth-child(8) > fieldset:nth-child(5) > fieldset > .option-wrapper > label:nth-child(4)').click();

  // P3
  await page.locator('input[name="/data/gp3/q17a_p3"]').nth(1).check();
  await page.locator('input[name="/data/gp3/q17b_p3"]').nth(2).check();
  await page.locator('input[name="/data/gp3/q17c_p3"]').nth(1).check();
  await page.locator('input[name="/data/gp3/q17d_p3"]').nth(1).check();
    const textFields = [
    'Name of X-Ray Technician *',
    'Name of Nodal Person (HM/BHM',
    'Name of Superintendent/DS/',
    'Name of State Representative *'
  ];

  for (const name of textFields) {
    const textbox = page.getByRole('textbox', { name });
    if (await textbox.count() > 0) {
      await textbox.scrollIntoViewIfNeeded();
      let plainName = faker.person.firstName() + ' ' + faker.person.lastName();
      plainName = plainName.replace(/[^A-Za-z ]/g, '');
      await textbox.fill(plainName);
      await page.waitForTimeout(150);
    }
  }



  // ---------------- Submit ----------------
  await Promise.all([
    page.waitForURL('**/thanks', { timeout: 15000 }),
    page.getByRole('button', { name: ' Submit' }).click()
  ]);


  await expect(page.locator('.vex-content')).toContainText('Thank you for participating!');
  console.log("🎉 ODK Form Submitted Successfully with NO blanks.");

});
