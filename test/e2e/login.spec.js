import { test, expect } from '@playwright/test';

test('BNRC login flow', async ({ page }) => {

  await page.goto('http://68.233.110.246/bnrc_stg/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Select User Type (ng-select)
  const userType = page.locator('.ng-select-container').first();
  await expect(userType).toBeVisible();
  await page.waitForTimeout(1000);

  await userType.click();
  await page.waitForTimeout(1000);

  // 2. Select "Officers"
  await page.locator('.ng-dropdown-panel').waitFor();
  await page.waitForTimeout(1000);

  await page
    .locator('.ng-dropdown-panel .ng-option', { hasText: 'Officers' })
    .click();
  await page.waitForTimeout(1000);

  // 3. Fill User ID
  await page.getByPlaceholder('Enter Officer ID').fill('ACSS_5040');
  await page.waitForTimeout(1000);

  // 4. Fill Password
  await page.getByPlaceholder('Enter your password').fill('123456');
  await page.waitForTimeout(1000);

  // 5. Fill Captcha
  await page.getByPlaceholder('Enter Captcha').fill('1');
  await page.waitForTimeout(1000);

  // 6. Login
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(5000);

  console.log('Login attempted successfully.');
});
