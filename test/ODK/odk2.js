import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('ODK form automation - Select NO for all questions', async ({ page }) => {
  await page.goto('https://sangrahiuat.piramalswasthya.org/-/single/JnDocVcnqt0L8NfA65aSBgpYFexezu9?st=YjtDgr6N!3EHD63usOiWyYKEnoXtF9aqnQO5JdlsSHWXjzuV9Mne0n3hHkTbT5Ae');
  await expect(page.getByRole('group', { name: '1. Is the X-ray Centre' })).toBeVisible();

  // ---------------- Coordinates & altitude ----------------
  await page.getByRole('spinbutton', { name: 'latitude (x.y °)' }).fill(faker.location.latitude().toString());
  await page.getByRole('spinbutton', { name: 'longitude (x.y °)' }).fill(faker.location.longitude().toString());
  await page.getByRole('spinbutton', { name: 'altitude (m)' }).fill(faker.number.int({ min: 10, max: 500 }).toString());
  await page.getByRole('spinbutton', { name: 'accuracy (m)' }).fill(faker.number.int({ min: 1, max: 50 }).toString());

  // ---------------- Dropdown picker ----------------
  async function pickDropdown(labelText) {
    const dropdownButton = page.locator('label').filter({ hasText: labelText }).getByRole('button');
    await dropdownButton.scrollIntoViewIfNeeded();
    await dropdownButton.click();
    const menu = page.locator('ul.dropdown-menu:visible li a label');
    const optionCount = await menu.count();
    if (optionCount > 0) {
      const option = menu.nth(0); // Always pick first option
      await option.scrollIntoViewIfNeeded();
      await option.click();
      await page.waitForTimeout(300);
    }
  }

  await pickDropdown('Select Agency (X-Ray Service');
  await pickDropdown('Select District*');
  await pickDropdown('Select Facility');

  // ---------------- Radio button groups (1–16) - select NO ----------------
  const radioGroups = [
    '1. Is the X-ray Centre', '2. Is the x-ray room and', '3. Availability of Lead', '4. Availability of Lead glass',
    '5. Is Warning Light installed', '6. Is Warning light', '7. Availability of Chest', '8. Display of radiation',
    '9. Display of warning signage', '10. IEC Displaying timings', '11a. Is X-Ray equipment', '11b. Display of AERB Licence',
    '12a. Is proper data-entry', '12b. Is the data for time of', '12c. Copy of BHAVYA coupons', '12d. Copy of Prescription/OPD',
    '13a. Protective (Mobile)', '13b. Lead Apron * Physical', '13c. Goggles * Physical', '13d. Thyroid Shields *',
    '14a. Provision of ID Cards', '14b. Is X-ray technician', '15a. Is technological', '16a. Availability of SOP (',
    '16b. Equipment downtime', '16e. Availability of power'
  ];

  for (const group of radioGroups) {
    const radio = page.getByRole('group', { name: group }).getByLabel('No');
    if (await radio.count() > 0) {
      await radio.scrollIntoViewIfNeeded();
      await radio.waitFor({ state: 'visible', timeout: 5000 });
      await radio.check();
      await page.waitForTimeout(200);
    }
  }

  // ---------------- Numeric fields ----------------
  const field12e = page.getByRole('spinbutton', { name: '12e. Total no of of patients' });
  let value12e = 0;
  if (await field12e.count() > 0) {
    await field12e.scrollIntoViewIfNeeded();
    value12e = faker.number.int({ min: 0, max: 9999 }); // 0–9999 as per requirement
    await field12e.fill(value12e.toString());
    await page.waitForTimeout(100);
  }

  // 12f depends on 12e
  const field12f = page.getByRole('spinbutton', { name: '12f. How many patients were' });
  if (await field12f.count() > 0) {
    await field12f.scrollIntoViewIfNeeded();
    const value12f = faker.number.int({ min: 0, max: value12e }); // ensure ≤ 12e
    await field12f.fill(value12f.toString());
    await page.waitForTimeout(100);
  }

  const numericFields = [
    { name: '16c. No. of days the X-ray', min: 1, max: 30 },
    { name: '16d. No. of days with power', min: 1, max: 30 }
  ];

  for (const field of numericFields) {
    const el = page.getByRole('spinbutton', { name: field.name });
    if (await el.count() > 0) {
      await el.scrollIntoViewIfNeeded();
      await el.fill(faker.number.int({ min: field.min, max: field.max }).toString());
      await page.waitForTimeout(100);
    }
  }

  // ---------------- Q17 onwards - select NO (fixed reliable selectors) ----------------
  console.log('🔘 Selecting NO for Q17 onwards...');

  await page.locator('input[name="/data/gp1/q17a_p1"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp1/q17b_p1"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp1/q17c_p1"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp1/q17d_p1"]').nth(2).check({ force: true });

  await page.locator('input[name="/data/gp2/q17a_p2"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp2/q17b_p2"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp2/q17c_p2"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp2/q17d_p2"]').nth(2).check({ force: true });

  await page.locator('input[name="/data/gp3/q17a_p3"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp3/q17b_p3"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp3/q17c_p3"]').nth(2).check({ force: true });
  await page.locator('input[name="/data/gp3/q17d_p3"]').nth(2).check({ force: true });

  console.log('✅ All Q17–Q17d (P1–P3) NO options selected successfully');

  // ---------------- Text fields ----------------
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

 // await page.getByRole('button', { name: ' Submit' }).click();
  //await page.waitForTimeout(50000);
  // Wait for Thank You message or confirmation
await Promise.all([
  page.waitForURL('**/thanks', { timeout: 15000 }), // wait until URL changes to /thanks
  page.getByRole('button', { name: ' Submit' }).click(),
]);

// Optional: verify the Thank You content
const thankYouContent = page.locator('.vex-content');
await expect(thankYouContent).toContainText('Thank you for participating!', { timeout: 10000 });

// Close the page if you want to finish the test
await page.close();  // closes the browser tab
console.log('✅ Form submitted');
});