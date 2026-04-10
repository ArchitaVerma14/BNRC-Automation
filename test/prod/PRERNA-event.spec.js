import { test } from '@playwright/test';

function makeAlphabeticName(prefix, maxLength = 15) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const roomForRandom = Math.max(1, maxLength - prefix.length);
	let randomPart = '';
	for (let index = 0; index < roomForRandom; index += 1) {
		randomPart += chars[Math.floor(Math.random() * chars.length)];
	}
	return `${prefix}${randomPart}`.slice(0, maxLength);
}

test('event registration copy', async ({ page }) => {
	await page.goto('https://bnrc2.bihar.gov.in/home');
	await page.locator('a.nav-link.dropdown-toggle', { hasText: 'Mission Unnayan' }).click();
	await page.locator('a.dropdown-item.arrow-down', { hasText: 'PRERNA' }).click();
	await page.getByRole('link', { name: 'PRERNA Events Registration' }).click();
	const instituteName = makeAlphabeticName('Inst');
	const applicantName = makeAlphabeticName('App');
	await page.getByRole('combobox').first().selectOption('2');
	await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
	await page.getByRole('gridcell', { name: '22' }).click();
	await page.locator('div').filter({ hasText: /^Institute Name\*$/ }).getByRole('textbox').click();
	await page.locator('div').filter({ hasText: /^Institute Name\*$/ }).getByRole('textbox').fill(instituteName);
	await page.locator('div').filter({ hasText: /^Applicant Name\*$/ }).getByRole('textbox').click();
	await page.locator('div').filter({ hasText: /^Applicant Name\*$/ }).getByRole('textbox').fill(applicantName);
	await page.locator('div').filter({ hasText: /^Email ID\*$/ }).getByRole('textbox').click();
	await page.locator('div').filter({ hasText: /^Email ID\*$/ }).getByRole('textbox').fill('testg76@gmail.com');
	await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').click();
	await page.locator('div').filter({ hasText: /^Mobile Number\*$/ }).getByRole('textbox').fill('7319722565');
	await page.getByRole('combobox').nth(1).selectOption('1');
	await page.getByRole('combobox').nth(2).selectOption('18');
	await page.locator('div').filter({ hasText: /^Institute Address\*$/ }).getByRole('textbox').click();
	await page.locator('div').filter({ hasText: /^Institute Address\*$/ }).getByRole('textbox').fill('tshgfjdsf');
	await page.getByRole('checkbox', { name: 'Student' }).check();
	await page.getByRole('checkbox', { name: 'Professional' }).check();
	await page.getByRole('checkbox', { name: 'Public' }).check();
	await page.getByRole('checkbox', { name: 'Institute' }).check();
	await page.getByRole('combobox').nth(3).selectOption('1');
	await page.getByRole('textbox', { name: 'Please Enter Event Title' }).click();
	await page.getByRole('textbox', { name: 'Please Enter Event Title' }).fill('nursing session');
	await page.locator('.timepicker').first().click();
	await page.locator('.timepicker.form-control.toTime').click();
	await page.getByRole('link', { name: ' Increment Hours' }).click();
	await page.locator('textarea').nth(1).click();
	await page.locator('textarea').nth(1).fill('jjjjjjjjjjjjjjjjjjj');
	await page.getByRole('button', { name: 'Submit' }).click();
	await page.getByRole('button', { name: 'Yes' }).click();
	await page.getByRole('button', { name: 'OK' }).click();
});
