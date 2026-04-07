
import fs from 'fs';
import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
function logSubmission(tempId, status) {
    const file = "lop-submission-records.json";

    let data = [];
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file, "utf-8"));
    }

    data.push({
        tempId,
        status,
        timestamp: new Date().toISOString()
    });

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


const FILE_PATH = "C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\Sample document.pdf";
const FILE_GRAPH = "C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\graph.png";
const FILE_EDUCATION = "C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\education.png";

const csvData = parse(fs.readFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\tempids.csv', 'utf8'), {
    columns: false,
    skip_empty_lines: true
});
const tempIds = csvData.slice(1).map(row => row[0]).filter(Boolean);
// -------------------------------------------------------------
// SKIP ALREADY SUCCESSFUL TEMP IDs
// -------------------------------------------------------------
let alreadySubmitted = [];
if (fs.existsSync("lop-submission-records.json")) {
    const log = JSON.parse(fs.readFileSync("lop-submission-records.json", "utf-8"));
    alreadySubmitted = log
        .filter(x => x.status === "SUCCESS")
        .map(x => x.tempId);
}

const pendingTempIds = tempIds.filter(id => !alreadySubmitted.includes(id));

console.log("Pending TEMP IDs:", pendingTempIds);


async function smartUploadAllFiles(page, pdfPath, graphPath, educationPath) {
    const inputs = page.locator('input[type="file"]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const accept = await input.getAttribute('accept');

        let fileToUpload = pdfPath; // default

        // If accept attribute is missing, assume PDF
        if (accept) {
            const acc = accept.toLowerCase();

            if (acc.includes('.png') || acc.includes('image')) {
                // For any image field (graph/education)
                const id = (await input.getAttribute('id')) || "";
                const name = (await input.getAttribute('name')) || "";

                if (/education|edu/i.test(id) || /education|edu/i.test(name)) {
                    fileToUpload = educationPath;
                } else {
                    fileToUpload = graphPath;
                }
            }
        }

        await input.setInputFiles(fileToUpload);
    }
}
test.describe.configure({ mode: 'serial' });
// END FUNCTION ADDITION ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

for (const tempId of pendingTempIds) {

    test(`LOP form submission for ${tempId}`, async ({ page }) => {
        await page.goto('http://68.233.110.246/bnrc_stg/home');
        await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('link', { name: 'Login' }).click();
        const page1 = await page1Promise;

        await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

        await page1.locator('ng-select div').nth(3).click();
        await page1.getByRole('option', { name: ' Temporary' }).click();

        await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill(tempId);
        await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
        await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
        await page1.getByRole('button', { name: ' Login' }).click();

        // await expect(page1.getByText(`Welcome ${tempId}`)).toBeVisible();

        await page1.getByRole('button', { name: ' Recognition ' }).click();
        await page1.getByRole('link', { name: ' Request for LOP' }).click();
        await expect(page1.getByRole('heading', { name: ' Recognition ' })).toBeVisible();

        await page1.getByRole('link', { name: ' Request LOP' }).click();
        
        await expect(page1.getByRole('row', { name: 'Sl# Course Type Request Seat' })).toBeVisible();


        // await page1.getByRole('button', { name: 'Add course' }).click();
        // await page1.getByRole('combobox').first().selectOption('2');
        // await expect(page1.getByRole('row', { name: 'ANM ' })).toBeVisible();
        // Add course
        // await page1.getByRole('button', { name: 'Add course' }).click();
        // // await page1.getByRole('combobox').first().selectOption('2');
        // await page1.locator('ng-select').first().click();
        // // await page1.locator('div.ng-option[data-value="2"]').click();
        // const panel = page1.locator('.ng-dropdown-panel .ng-option');

        // // wait for options to load
        // await panel.first().waitFor({ timeout: 10000 });

        // // click option with text ANM or value 2
        // await page1.locator('.ng-dropdown-panel .ng-option', { hasText: 'ANM' }).click();
        // await page1.getByRole('textbox', { name: 'Enter Seats' }).fill('50');
        // await page1.waitForTimeout(3000);
        // await expect(page1.getByRole('row', { name: 'ANM 50 ' })).toBeVisible({timeout:10000});


        // // await page1.waitForTimeout(3000);
        // // await expect(page1.getByRole('row', { name: 'ANM ' })).toBeVisible({timeout:10000});

        // // await page1.getByRole('textbox', { name: 'Enter Seats' }).click();
        // await page1.getByRole('textbox', { name: 'Enter Seats' }).fill('50');
        // await page1.waitForTimeout(3000);
        // await expect(page1.getByRole('row', { name: 'ANM 50 ' })).toBeVisible({timeout:10000});
        // Add course
        // Click Add course
        // await page1.getByRole('button', { name: 'Add course' }).click();

        // // Target the *real* clickable element of ng-select
        // const dropdown = page1.locator('ng-select').first().locator('.ng-select-container');

        // // Ensure it exists and is visible
        // await dropdown.waitFor({ state: 'visible', timeout: 10000 });

        // // Scroll into view (Angular needs this)
        // await dropdown.scrollIntoViewIfNeeded();

        // // Force click (important for Angular overlays)
        // await dropdown.click({ force: true });

        // // Now wait for the dropdown panel options
        // const panelOptions = page1.locator('.ng-dropdown-panel .ng-option');
        // await panelOptions.first().waitFor({ timeout: 10000 });

        // // Select ANM
        // await panelOptions.filter({ hasText: 'ANM' }).click();

        // // Wait until the seats input appears for this row
        // const seatsInput = page1.locator('input[formcontrolname="seat"]');
        // await seatsInput.waitFor({ state: 'visible', timeout: 10000 });

        // // Fill seats
        // await seatsInput.fill('50');
        // // Wait for UI binding to finish
        // await page1.waitForTimeout(2000);

        // // Validate row exists using more flexible locator
        // await expect(page1.locator('table tbody tr')).toContainText('ANM', { timeout: 10000 });
        // await expect(page1.locator('table tbody tr')).toContainText('50', { timeout: 10000 });
        await expect(page1.getByRole('row', { name: 'Sl# Course Type Request Seat' })).toBeVisible();

// Add course
        await page1.getByRole('button', { name: 'Add course' }).click();

        // Select course type (native HTML select)
        await page1.getByRole('combobox').first().selectOption('2');

        // Verify ANM row added
        await expect(page1.getByRole('row', { name: 'ANM ' })).toBeVisible();

        // Enter seats
        await page1.getByRole('textbox', { name: 'Enter Seats' }).fill('50');


        await page1.locator('input[name="publishDate"]').click();
        await page1.getByText('1', { exact: true }).nth(1).click();
        await page1.locator('#instituteType').selectOption('1');

        const instituteName = `testing institute for ${tempId}`;
        await page1.getByRole('textbox', { name: 'Enter Institute Name' }).fill(instituteName);
        const instituteCode = `IC-${tempId}`;
        await page1.getByRole('textbox', { name: 'Enter Institute Code' }).fill(instituteCode);


        // await page1.getByRole('textbox', { name: 'Enter Institute Code' }).fill('12345new');
        // await page1.locator('div').filter({ hasText: /^Year of Establishment*$/ }).getByPlaceholder('YYYY').click();
        // await page1.waitForSelector('input[formcontrolname="yearOfEstablishment"]');
        // await page1.locator('input[formcontrolname="yearOfEstablishment"]').click();
        // // Select year 2018 (the popup shows only years)
        // await page1.getByText('2018', { exact: true }).click();
        await page1.locator('div')
            .filter({ hasText: /^Year of Establishment\*$/ })
            .getByPlaceholder('YYYY')
            .click();

        await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

        await page1.getByText('2018', { exact: true }).click();


        // await page1.getByText('2018', { exact: true }).click();
        await page1.getByRole('textbox', { name: 'Enter Principal / Vice' }).fill('testing');
        await page1.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('7319722565');
        await page1.getByRole('textbox', { name: 'Enter Chairperson Name' }).fill('asdfgh');
        await page1.getByRole('textbox', { name: 'Enter Chairperson Mobile' }).fill('9876543222');
        await page1.getByRole('textbox', { name: 'Enter Email Id' }).fill('hdhdh@gmail.com');

        await page1.getByRole('combobox').nth(2).selectOption('9');
        await page1.getByRole('combobox').nth(3).selectOption('83');
        await page1.getByRole('combobox').nth(4).selectOption('108');

        await page1.getByRole('textbox', { name: 'Enter Pin code' }).fill('876543');
        await page1.getByRole('textbox', { name: 'Enter Address' }).fill('jhdjhdsjjh3jhjh');
        await page1.getByRole('textbox', { name: 'Enter Tel/Fax No' }).fill('0987654345');

        await page1.locator('input[name="yearOfEstablishment"]').click();
        await page1.getByText('2018', { exact: true }).click();

        await smartUploadAllFiles(page1, FILE_PATH, FILE_GRAPH, FILE_EDUCATION);


        await page1.getByRole('textbox', { name: 'Enter Registration and major' }).fill('cvhjkiuytrdghjk jhjhfjhfdh');
        await page1.getByRole('textbox', { name: 'Enter Objective of the' }).fill('medical training to nursing student');
        await page1.getByRole('textbox', { name: 'Enter Financial strengths of' }).fill('10000');
        await page1.getByRole('radio', { name: 'No' }).check();

        await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from District Magistrate' }).fill('876546');
        await page1.locator('input[name="nocDistrictMigrationIssueDate"]').click();
        await page1.getByRole('button', { name: '2025' }).click();
        await page1.getByText('2019').click();
        await page1.getByText('February').click();
        await page1.getByText('5', { exact: true }).nth(1).click();

        await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from Civil Surgeon' }).fill('098765h');
        await page1.locator('input[name="civilSurgenIssueDate"]').click();
        await page1.getByRole('button', { name: '2025' }).click();
        await page1.getByText('2019').click();
        await page1.getByText('March').click();
        await page1.getByText('1', { exact: true }).nth(1).click();
        
        // await page1.getByRole('button', { name: 'Save & Next' }).click();
        const saveNextBtn = page1.getByRole('button', { name: 'Save & Next' });

        await saveNextBtn.scrollIntoViewIfNeeded();

        try {
            await saveNextBtn.click({ timeout: 5000 });
        } catch (e) {
            await saveNextBtn.click({ force: true });
        }

        await page1.getByRole('button', { name: 'Yes, save it!' }).click();
        await expect(page1.getByRole('dialog', { name: 'REGISTERED' })).toBeVisible();
        await page1.getByRole('button', { name: 'OK' }).click();
        await expect(page1.getByRole('textbox', { name: 'Enter Khata No.' }))
            .toBeVisible({ timeout: 15000 });

        // const secondPageInputs = page1.locator('input[type="file"]');
        // const secondPageCount = await secondPageInputs.count();
        // for (let i = 0; i < secondPageCount; i++) {
        //     await secondPageInputs.nth(i).setInputFiles(FILE_PATH);
        // }
        await smartUploadAllFiles(page1, FILE_PATH, FILE_GRAPH, FILE_EDUCATION);
        await page1.getByRole('textbox', { name: 'Enter Khata No.' }).fill('09876543');
        await page1.getByRole('textbox', { name: 'Enter Khesra/Survey Plot No.' }).fill('876543');
        await page1.getByRole('textbox', { name: 'Enter Area' }).fill('87654');
        await page1.getByRole('textbox', { name: 'Enter Deed No.' }).fill('098765tyhj');
        await page1.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
        await page1.getByRole('button', { name: '2025' }).click();
        await page1.getByText('2018', { exact: true }).click();
        await page1.getByText('January').click();
        await page1.getByText('12', { exact: true }).click();

        await page1.getByRole('combobox').first().selectOption('9');
        await page1.getByRole('combobox').nth(1).selectOption('108');

        await page1.getByRole('textbox', { name: 'Enter Mauza Village' }).fill('kuiyjghjgj');
        await page1.getByRole('textbox', { name: 'Enter police Station' }).fill('jjjjjjjjjjj');
        await page1.getByRole('textbox', { name: 'Enter North Boundary' }).fill('jgjgggggggggggggg');
        await page1.getByRole('textbox', { name: 'Enter South Boundary' }).fill('jjjjjjjjjjjjjjj');
        await page1.getByRole('textbox', { name: 'Enter East Boundary' }).fill('jjjjjjjjjjjjjjjjjj');
        await page1.getByRole('textbox', { name: 'Enter West Boundary' }).fill('erghjjhgf');

        await page1.getByRole('textbox', { name: 'Enter Longitude' }).fill('88.7656');
        await page1.getByRole('textbox', { name: 'Enter Latitude' }).fill('33.44444');

        await page1.locator('textarea').first().fill('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
        await page1.locator('textarea').nth(1).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhh');
        await page1.locator('textarea').nth(2).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
        await page1.locator('textarea').nth(3).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

        await page1.getByRole('button', { name: 'Save & Next' }).click();
        await page1.getByRole('button', { name: 'Yes, save it!' }).click();
        await expect(page1.getByRole('dialog', { name: 'UPDATED!' })).toBeVisible();
        await page1.getByRole('button', { name: 'OK' }).click();

        await page1.getByRole('checkbox', { name: 'I Agree.I hereby declare that' }).check();
        await page1.getByRole('button', { name: 'Submit & Request to verify' }).click();
        await page1.getByRole('button', { name: 'Yes, save it!' }).click();
        await expect(page1.getByRole('dialog', { name: 'REQUESTED TO VERIFY!' })).toBeVisible();
        await page1.getByRole('button', { name: 'OK' }).click();
        logSubmission(tempId, "SUCCESS");

        // Safe logout — prevents test from failing and allows next tempId to run
        try {
            console.log(`Attempting logout for ${tempId}...`);

            // Try logout on popup page first
            let logoutBtn = page1.locator('button:has-text("Logout")');
            if (await logoutBtn.count() === 0) {
                // Try logout on main page
                logoutBtn = page.locator('button:has-text("Logout")');
            }

            // If still nothing, skip
            if (await logoutBtn.count() === 0) {
                console.log(`No logout button found for ${tempId}, skipping...`);
            } else {
                await logoutBtn.click({ timeout: 5000 });
                console.log(`Logout successful for ${tempId}`);
            }

        } catch (err) {
            console.log(`Logout failed for ${tempId}, continuing...`);
        }

                // await page1.locator('button:has-text("Logout")').click();
        // await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();
    });
}
