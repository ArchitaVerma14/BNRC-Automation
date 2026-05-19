import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

function makeAlphabeticName(prefix, maxLength = 15) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const roomForRandom = Math.max(1, maxLength - prefix.length);
	let randomPart = '';
	for (let index = 0; index < roomForRandom; index += 1) {
		randomPart += chars[Math.floor(Math.random() * chars.length)];
	}
	return `${prefix}${randomPart}`.slice(0, maxLength);
}

async function saveScreenshot(page, prefix) {
	const screenshotDir = path.resolve(process.cwd(), 'BNRCscreenshots');
	await fs.mkdir(screenshotDir, { recursive: true });
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const screenshotPath = path.join(screenshotDir, `${prefix}-${timestamp}.png`);
	await page.screenshot({ path: screenshotPath, fullPage: true });
	return screenshotPath;
}

test('event registration copy', async ({ page }) => {
	try {
		await page.goto('http://68.233.110.246/bnrc_stg/home');
		await page.locator('a.nav-link.dropdown-toggle', { hasText: 'Mission Unnayan' }).click();
		await page.locator('a.dropdown-item.arrow-down', { hasText: 'PRERNA' }).click();
		await page.getByRole('link', { name: 'PRERNA Events Registration' }).click();
		const applicantName = makeAlphabeticName('App');
		await page.getByRole('combobox').first().selectOption('2');
		await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
		await expect(page.getByRole('dialog', { name: 'calendar' })).toBeVisible();
		await page.locator('span[bsdatepickerdaydecorator]:not(.disabled)').getByText('30', { exact: true }).click();
		await page.locator('select[formcontrolname="organizer"]').selectOption('1');
		await page.locator('select[formcontrolname="instituteId"]').selectOption({ index: 1 });
		await page.locator('div').filter({ hasText: /^Applicant Name\*$/ }).getByRole('textbox').click();
		await page.locator('div').filter({ hasText: /^Applicant Name\*$/ }).getByRole('textbox').fill(applicantName);
		await page.locator('div').filter({ hasText: /^Email ID\*$/ }).getByRole('textbox').click();
		await page.locator('div').filter({ hasText: /^Email ID\*$/ }).getByRole('textbox').fill('testg76@gmail.com');
		await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').click();
		await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').fill('7319722565');
		await page.locator('select[formcontrolname="designation"]').selectOption('2');
		await page.locator('select[formcontrolname="district"]').selectOption('1');
		await page.locator('div').filter({ hasText: /^Institute Address\*$/ }).getByRole('textbox').click();
		await page.locator('div').filter({ hasText: /^Institute Address\*$/ }).getByRole('textbox').fill('tshgfjdsf');
		await page.getByRole('checkbox', { name: 'Public' }).check();
		await page.locator('select[formcontrolname="communicationLanguage"]').selectOption('1');
		await page.getByRole('textbox', { name: 'Please Enter Event Title' }).click();
		await page.getByRole('textbox', { name: 'Please Enter Event Title' }).fill('nursing session');
		await page.locator('.timepicker').first().click();
		await page.locator('.timepicker.form-control.toTime').click();
		await page.getByRole('link', { name: ' Increment Hours' }).click();
		await page.locator('textarea[formcontrolname="eventDescription"]').click();
		await page.locator('textarea[formcontrolname="eventDescription"]').fill('jjjjjjjjjjjjjjjjjjj');
		await page.getByRole('button', { name: 'Submit' }).click();
		await page.getByRole('button', { name: 'Yes' }).click();
		await page.getByRole('button', { name: 'OK' }).click();
	} finally {
		await saveScreenshot(page, 'prerna-event');
	}
});
