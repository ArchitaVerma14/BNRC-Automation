import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('ODK form automation with dynamic dropdowns, waits, and numeric validations', async ({ page }) => {
  await page.goto('https://sangrahiuat.piramalswasthya.org/-/single/c11e397358ed051c99ebc4f44d9ca89b0536f8b96b85722b7e9b9edbd94fc5c2?st=wcqKnpg6el1DdPOriozXiXNFbXIZTIHEI0!ZSsWB2!V1NQ!JI1VmZjpbXW6a7iDI');
  await expect(page.getByRole('group', { name: '1. Is the X-ray Centre' })).toBeVisible();

  // Location search
  const city = faker.location.city();
  const searchBox = page.getByRole('textbox', { name: 'search for place or address' });
  await searchBox.fill(city);
  await expect(searchBox).toHaveValue(city);
  await page.getByRole('button', { name: '' }).click();
  await page.waitForTimeout(1000);

  // Coordinates and altitude
  const latitude = faker.location.latitude().toString();
  const longitude = faker.location.longitude().toString();
  const altitude = faker.number.int({ min: 10, max: 500 }).toString();
  const accuracy = faker.number.int({ min: 1, max: 50 }).toString();

  const latField = page.getByRole('spinbutton', { name: 'latitude (x.y °)' });
  await latField.fill(latitude);
  await expect(latField).toHaveValue(latitude);

  const longField = page.getByRole('spinbutton', { name: 'longitude (x.y °)' });
  await longField.fill(longitude);
  await expect(longField).toHaveValue(longitude);

  const altField = page.getByRole('spinbutton', { name: 'altitude (m)' });
  await altField.fill(altitude);
  await expect(altField).toHaveValue(altitude);

  const accField = page.getByRole('spinbutton', { name: 'accuracy (m)' });
  await accField.fill(accuracy);
  await expect(accField).toHaveValue(accuracy);

  // ---- Helper function for bootstrap dropdowns ----
  async function pickDropdown(labelText) {
    const dropdownButton = page.locator('label').filter({ hasText: labelText }).getByRole('button');
    await dropdownButton.click();
    await page.waitForTimeout(500); // wait for dropdown animation

    const menu = page.locator('ul.dropdown-menu:visible li a label');
    await menu.first().waitFor({ state: 'visible' });

    const optionCount = await menu.count();
    if (optionCount > 0) {
      const randomIndex = Math.floor(Math.random() * optionCount);
      const option = menu.nth(randomIndex);
      await option.click(); // click the label wrapper
      await page.waitForTimeout(800); // wait for selection to take effect
    }
  }

  // Dropdown selections (dynamic/random)
  await pickDropdown('Select Agency (X-Ray Service');
  await pickDropdown('Select District*');
  await pickDropdown('Select Facility');

  // Radio buttons
  const yesGroups = [
    '1. Is the X-ray Centre', '1a. If Yes, is there any', '2. Is the x-ray room and', '3. Availability of Lead',
    '4. Availability of Lead glass', '5. Is Warning Light installed', '6. Is Warning light', '8. Display of radiation',
    '10. IEC Displaying timings', '11a. Is X-Ray equipment', '11b. Display of AERB Licence', '12a. Is proper data-entry',
    '12b. Is the data for time of', '12c. Copy of BHAVYA coupons', '12d. Copy of Prescription/OPD', '13a. Protective (Mobile)',
    '13b. Lead Apron * Physical', '13c. Goggles * Physical', '13d. Thyroid Shields *', '14a. Provision of ID Cards',
    '14b. Is X-ray technician', '15a. Is technological', '16a. Availability of SOP (', '16b. Equipment downtime', '16e. Availability of power'
  ];

  for (const groupName of yesGroups) {
    const radio = page.getByRole('group', { name: groupName }).getByLabel('Yes');
    await radio.check();
    await page.waitForTimeout(300);
  }

  // Specific click actions
  await page.getByRole('group', { name: '7. Availability of Chest' }).locator('label').nth(1).click();
  await page.waitForTimeout(300);
  await page.getByRole('group', { name: '9. Display of warning signage' }).locator('label').nth(1).click();
  await page.waitForTimeout(300);

  // Numeric fields with validation
  const field12e = page.getByRole('spinbutton', { name: '12e. Total no of of patients' });
  const value12e = faker.number.int({ min: 1, max: 50 }).toString();
  await field12e.fill(value12e);
  await expect(field12e).toHaveValue(value12e);

  const field12f = page.getByRole('spinbutton', { name: '12f. How many patients were' });
  const value12f = faker.number.int({ min: 1, max: parseInt(value12e) }).toString(); // 12f ≤ 12e
  await field12f.fill(value12f);
  await expect(field12f).toHaveValue(value12f);

  const field16c = page.getByRole('spinbutton', { name: '16c. No. of days the X-ray' });
  const value16c = faker.number.int({ min: 1, max: 30 }).toString();
  await field16c.fill(value16c);
  await expect(field16c).toHaveValue(value16c);

  const field16d = page.getByRole('spinbutton', { name: '16d. No. of days with power' });
  const value16d = faker.number.int({ min: 1, max: 30 }).toString();
  await field16d.fill(value16d);
  await expect(field16d).toHaveValue(value16d);

  // Checkbox groups
  const checkboxGroups = [
    'input[name="/data/gp1/q17a_p1"]', 'input[name="/data/gp1/q17b_p1"]',
    'input[name="/data/gp1/q17c_p1"]', 'input[name="/data/gp1/q17d_p1"]',
    'input[name="/data/gp2/q17a_p2"]', 'input[name="/data/gp2/q17b_p2"]',
    'input[name="/data/gp2/q17c_p2"]', 'input[name="/data/gp2/q17d_p2"]',
    'input[name="/data/gp3/q17a_p3"]', 'input[name="/data/gp3/q17b_p3"]',
    'input[name="/data/gp3/q17c_p3"]', 'input[name="/data/gp3/q17d_p3"]'
  ];

  for (const selector of checkboxGroups) {
    await page.locator(selector).nth(1).check();
    await page.waitForTimeout(200);
  }

  // Text fields
  await page.getByRole('textbox', { name: 'Name of X-Ray Technician *' }).fill(faker.person.fullName());
  await page.getByRole('textbox', { name: 'Name of Nodal Person (HM/BHM' }).fill(faker.person.fullName());
  await page.getByRole('textbox', { name: 'Name of Superintendent/DS/' }).fill(faker.person.fullName());
  await page.getByRole('textbox', { name: 'Name of State Representative *' }).fill(faker.person.fullName());
  // Submit button
  await Promise.all([
    page.waitForURL('**/thanks', { timeout: 15000 }),
    page.getByRole('button', { name: ' Submit' }).click(),
  ]);

  // Thank You content validation
  const thankYouContent = page.locator('.vex-content');
  await expect(thankYouContent).toContainText('Thank you for participating!', { timeout: 10000 });

  // Close page
  await page.close();
  console.log('✅ Form submitted with numeric validations for 12e, 12f, 16c, 16d');
});
