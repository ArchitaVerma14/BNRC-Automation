// pages/Dashboard.page.ts
import { Page } from '@playwright/test';

export class DashboardPage {
  page: Page;
  constructor(page: Page) { this.page = page; }

  async openEApplicationAndOpenForeignVerification() {
    // click E-Application
    await this.page.getByRole('button', { name: /E-Application| E-Application/ }).first().click();
    // click Foreign Verification inside that menu
    await this.page.getByRole('link', { name: 'Foreign Verification' }).first().click();
  }

  async proceedForPayment() {
    // find row with the recently created record and click Proceed for Payment
    const proceedBtn = this.page.getByRole('button', { name: /Proceed for Payment| Proceed for Payment/ }).first();
    await proceedBtn.waitFor({ state: 'visible', timeout: 10000 });
    await proceedBtn.click();
    // confirm yes
    const yesBtn = this.page.locator('//button[contains(normalize-space(.),"Yes, save it!")]');
    await yesBtn.waitFor({ state: 'visible', timeout: 10000 });
    await yesBtn.click();
    // wait for success and click OK
    const okBtn = this.page.getByRole('button', { name: 'OK' }).first();
    if (await okBtn.count()) await okBtn.click().catch(()=>{});
  }
}
