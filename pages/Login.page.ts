// pages/Login.page.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  page: Page;
  constructor(page: Page) { this.page = page; }

  async openLoginPopupAndGetPage(parentPage: Page) {
    const popupPromise = parentPage.waitForEvent('popup');
    await parentPage.getByRole('link', { name: 'Login' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('networkidle');
    return popup;
  }

  // Select Temporary user type (handles ng-select)
  async selectTemporaryUserType(popup: Page) {
    // attempt to click ng-select that shows options (nth(3) as in your script)
    const ngSelect = popup.locator('ng-select div').nth(3);
    if (await ngSelect.count()) {
      await ngSelect.click();
      const option = popup.getByRole('option', { name: ' Temporary' }).first();
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
    }
  }

  async loginWithTemp(popup: Page, tempId: string, password = '123456') {
    // temporary id field
    const tempField = popup.getByRole('textbox', { name: /Enter Temporary ID|Enter Temporary ID/ }).first();
    await tempField.fill(tempId);
    const pwd = popup.getByRole('textbox', { name: /Enter your password|Enter Password/ }).first();
    await pwd.fill(password);
    // captcha is simple '1' in your flow
    const captcha = popup.getByRole('textbox', { name: /Enter Captcha|Enter Captcha/ }).first();
    if (await captcha.count()) await captcha.fill('1');
    await popup.getByRole('button', { name: /Login| Login/ }).first().click();
  }

  async resetPassword(popup: Page, newPassword: string) {
    // Wait for Reset Password heading to appear
    await popup.getByRole('heading', { name: /Reset Password/ }).waitFor({ timeout: 10000 });
    const pw = popup.getByRole('textbox', { name: 'Password', exact: true }).first();
    const conf = popup.getByRole('textbox', { name: 'Confirm Password' }).first();
    await pw.fill(newPassword);
    await conf.fill(newPassword);
    await popup.getByRole('button', { name: /Save| Save/ }).first().click();
    // Wait for Saved dialog and click OK
    await popup.getByRole('dialog', { name: /Saved!|Saved!/ }).waitFor({ timeout: 10000 }).catch(()=>{});
    const ok = popup.getByRole('button', { name: 'OK' });
    if (await ok.count()) await ok.first().click().catch(()=>{});
  }

  async loginAfterReset(popup: Page, tempId: string, newPassword: string) {
    // select user type again if required
    await this.selectTemporaryUserType(popup);
    await this.loginWithTemp(popup, tempId, newPassword);
    // wait for UI change that indicates successful login
    await popup.getByRole('button', { name: /Welcome/ }).first().waitFor({ timeout: 10000 });
  }
}
