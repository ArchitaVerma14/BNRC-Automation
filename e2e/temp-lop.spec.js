import fs from 'fs';
import { test, expect } from '@playwright/test';


// Convert number → ordinal word
function numberToOrdinalWord(num) {
  const ordinals = [
    "", "first", "second", "third", "fourth", "fifth",
    "sixth", "seventh", "eighth", "ninth", "tenth",
    "eleventh", "twelfth", "thirteenth", "fourteenth",
    "fifteenth", "sixteenth", "seventeenth", "eighteenth",
    "nineteenth", "twentieth", "twenty-first", "twenty-second",
    "twenty-third", "twenty-fourth", "twenty-fifth"
  ];
  return ordinals[num] || `${num}th`;
}
function saveToCSV(tempId, newPassword) {
  const file = "tempids.csv";

  // Create CSV with header if it doesn't exist
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "tempId,newPassword\n");
  }

  const row = `${tempId},${newPassword}\n`;
  fs.appendFileSync(file, row);

  console.log("CSV saved:", row);
}


// Save TEMP ID + institute name
function saveRecord(tempId, instituteName) {
  const file = "tempid-records.json";

  let records = [];
  if (fs.existsSync(file)) {
    try {
      records = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      records = [];
    }
  }

  const newEntry = {
    tempId,
    instituteName,
    date: new Date().toISOString()
  };

  records.push(newEntry);
  fs.writeFileSync(file, JSON.stringify(records, null, 2));
  console.log("Record saved:", newEntry);
}

test('repeat 3 times until password saved', async ({ browser }) => {
  test.setTimeout(300000); // 5 minutes

  for (let run = 1; run <= 23; run++) {
    console.log(`---------------- RUN ${run} STARTED ----------------`);

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://68.233.110.246/bnrc_stg/home');
    await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();

    // Run counter logic
    let data = { count: 0 };
    if (fs.existsSync("run-counter.json")) {
      data = JSON.parse(fs.readFileSync("run-counter.json", "utf-8"));
    }
    data.count += 1;
    fs.writeFileSync("run-counter.json", JSON.stringify(data, null, 2));

    const instituteName = `testing ${numberToOrdinalWord(data.count)}`;
    console.log("Generated Institute Name:", instituteName);

    // Begin Flow
    await page.getByRole('button', { name: 'E-Application ' }).click();
    await page.getByRole('link', { name: 'Recognition of New Institute' }).click();

    await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society Email Id' }).fill('testing@gmail.com');
    await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society PAN Number' }).fill('UWPCL6780T');
    await page.getByRole('textbox', { name: "Please enter Organization's Name" }).fill('testing');
    await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('7319722565');

    await page.getByRole('button', { name: 'Send OTP' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // Wait until OTP auto-filled by backend
    const otpInput = page.locator('input[formcontrolname="otp"]');
    await otpInput.waitFor({ state: "visible", timeout: 15000 });
    await otpInput.scrollIntoViewIfNeeded();

    // Focus the OTP field
    await otpInput.click();


// Scroll to trigger Angular rendering if needed
    // await page.locator('input[formcontrolname="otp"]').scrollIntoViewIfNeeded();
    // await page.getByRole('textbox', { name: /Enter OTP/i }).click();

    await page.waitForFunction(() => {
    const otp = document.querySelector('input[formcontrolname="otp"]')?.value || "";
    return /^\d{6}$/.test(otp); 
    // return el && el.value.length >= 6;},{ timeout: 60000 
    });

    await page.getByRole('button', { name: 'Verify OTP' }).click();
    await page.getByRole('button', { name: 'OK' }).click();

    // await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
    const answerField = page.getByRole('textbox', { name: 'Enter Answer' });

// Scroll to bring field into viewport
    await answerField.scrollIntoViewIfNeeded();

    // Now fill
    await answerField.fill('1');

    await page.getByRole('button', { name: ' Register Now' }).click();
    await page.getByRole('button', { name: 'Yes, save it!' }).click();

    // Extract TEMP ID
    await page.waitForFunction(() => {
    const el = document.querySelector('.swal2-html-container');
    return el && /TEMP\s*\d+/i.test(el.innerText);
  });
    const successMsg = await page.locator('.swal2-html-container').innerText();
    const tempIdMatch = successMsg.match(/TEMP\s*\d+/i);
    const tempId = tempIdMatch ? tempIdMatch[0].replace(/\s+/g, "") : null;

    if (!tempId) throw new Error("TEMP ID not found!");

    console.log("Captured TEMP ID:", tempId);
    // saveRecord(tempId, instituteName);
    const newPassword = "Av@12345";   // your reset password
    saveToCSV(tempId, newPassword);


    await page.getByRole('button', { name: 'OK' }).click();

    // Open Login popup
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Login' }).click();
    const page1 = await popupPromise;

    await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

    // Select Temporary Login
    await page1.locator('ng-select div').nth(3).click();
    await page1.getByRole('option', { name: ' Temporary' }).click();

    // Login with TEMP ID + default password
    await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill(tempId);
    await page1.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
    await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
    await page1.getByRole('button', { name: ' Login' }).click();

    // Reset password page
    await expect(page1.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

    await page1.getByRole('textbox', { name: 'Password', exact: true }).fill('Av@12345');
    await page1.getByRole('textbox', { name: 'Confirm Password' }).fill('Av@12345');

    await page1.getByRole('button', { name: ' Save' }).click();

    // Success Popup
    await expect(page1.getByRole('dialog', { name: 'Saved!' })).toBeVisible();
    await page1.getByRole('button', { name: 'OK' }).click();

    // FINAL CHECKPOINT – Must see BNRC Login again
    // await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

    // console.log(`---------------- RUN ${run} COMPLETED ----------------`);

    // await context.close();
  }

});
