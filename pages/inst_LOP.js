
import fs from 'fs';
import { test, expect } from '@playwright/test';

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

function saveRecord(tempId, instituteName) {
  const file = "tempid-records.json";

  // If file does not exist or is empty
  let records = [];
  if (fs.existsSync(file)) {
    try {
      records = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      records = [];
    }
  }

  // Create new entry
  const newEntry = {
    tempId,
    instituteName,
    date: new Date().toISOString()
  };

  // Append
  records.push(newEntry);

  // Save back to JSON
  fs.writeFileSync(file, JSON.stringify(records, null, 2));

  console.log("Record saved:", newEntry);
}


test('test', async ({ page }) => {
  await page.goto('http://68.233.110.246/bnrc_stg/home');
  await expect(page.getByRole('link', { name: 'Bihar Nurses Registration' })).toBeVisible();
    // -------- RUN COUNTER LOGIC --------
  // let data = JSON.parse(fs.readFileSync("run-counter.json", "utf-8"));
  let data = { count: 0 };

  if (fs.existsSync("run-counter.json")) {
    data = JSON.parse(fs.readFileSync("run-counter.json", "utf-8"));
  }

  data.count += 1;

  const instituteNameSuffix = numberToOrdinalWord(data.count);

  fs.writeFileSync("run-counter.json", JSON.stringify(data, null, 2));

  const instituteName = `testing ${instituteNameSuffix}`;

  console.log("Generated Institute Name:", instituteName);
  // ------------------------------------

  await page.getByRole('button', { name: 'E-Application ' }).click();
  await expect(page.getByRole('img', { name: 'Banner' })).toBeVisible();

  await page.getByRole('link', { name: 'Recognition of New Institute' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society Email Id' }).click();
  await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society Email Id' }).fill('testing@gmail.com');
  await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society PAN Number' }).click();
  await page.getByRole('textbox', { name: 'Please enter Organization/Trust/Society PAN Number' }).fill('UWPCL6780T');
  await page.getByRole('textbox', { name: 'Please enter Authorized' }).click();
  await page.getByRole('textbox', { name: 'Please enter Authorized' }).fill('testing');
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
  await page.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('7319722565');
  await page.getByRole('button', { name: 'Send OTP' }).click();
  await expect(page.getByRole('dialog', { name: 'OTP Sent' })).toBeVisible();

  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter OTP' }).click();
  //await page.waitForTimeout(30000);
  await page.waitForFunction(() => {
  const el = document.querySelector('input[formcontrolname="otp"]');
  return el && el.value.length >= 6;
});

  //await page.getByRole('textbox', { name: 'Enter OTP' }).fill('450831');
  await expect(page.getByRole('button', { name: 'Resend OTP (279s)' })).toBeVisible();

  await page.getByRole('button', { name: 'Verify OTP' }).click();
  await expect(page.getByRole('dialog', { name: 'OTP Verified' })).toBeVisible();

  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Enter Answer' }).click();
  await page.getByRole('textbox', { name: 'Enter Answer' }).fill('1');
  await page.getByRole('button', { name: ' Register Now' }).click();
  await expect(page.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page.getByRole('dialog', { name: 'Institute Recognition' })).toBeVisible();

  // await page.getByText('Recognition of New Institute Registered Successfully.:-TEMP86827').click();
  // Capture the success text containing TEMP ID
  const successMsg = await page.locator('.swal2-html-container').innerText();

  // Extract TEMP ID using regex
  const tempIdMatch = successMsg.match(/TEMP\d+/);
  const tempId = tempIdMatch ? tempIdMatch[0] : null;

  console.log("Captured TEMP ID:", tempId);

  if (!tempId) {
    throw new Error("TEMP ID not found!");
  }
  // Save TEMP ID + Institute Name in records log 
  saveRecord(tempId, instituteName);


  await page.getByRole('button', { name: 'OK' }).click();

  //await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Login' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('ng-select div').nth(3).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).press('CapsLock');
  //await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP86827');
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill(tempId);
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  await expect(page1.getByRole('heading', { name: 'Reset Password' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Password', exact: true }).click();
  await page1.getByRole('textbox', { name: 'Password', exact: true }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Confirm Password' }).click();
  await page1.getByRole('textbox', { name: 'Confirm Password' }).fill('Av@12345');
  await page1.getByRole('button', { name: ' Save' }).click();
  await expect(page1.getByRole('dialog', { name: 'Saved!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  await expect(page1.getByRole('img', { name: 'BNRC Logo' })).toBeVisible();

  await page1.locator('div').filter({ hasText: /^Select User Type$/ }).nth(2).click();
  await expect(page1.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page1.getByRole('option', { name: ' Temporary' }).click();
  await expect(page1.getByRole('button', { name: 'Clear all' })).toBeVisible();

  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).click();
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).press('CapsLock');
  // await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill('TEMP86827');
  await page1.getByRole('textbox', { name: ' Enter Temporary ID' }).fill(tempId);
  await page1.getByRole('textbox', { name: 'Enter your password' }).click();
  await page1.getByRole('textbox', { name: 'Enter your password' }).press('CapsLock');
  await page1.getByRole('textbox', { name: 'Enter your password' }).fill('Av@12345');
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).click();
  await page1.getByRole('textbox', { name: 'Enter Captcha' }).fill('1');
  await page1.getByRole('button', { name: ' Login' }).click();
  // await expect(page1.getByRole('button', { name: 'Welcome TEMP86827 User Image ' })).toBeVisible();
  // await expect(page1.getByRole('button', { name: `Welcome ${tempId} User Image` })).toBeVisible();
  await expect(page1.getByText(`Welcome ${tempId}`)).toBeVisible();



  await page1.getByRole('button', { name: ' Recognition ' }).click();
  await page1.getByRole('link', { name: ' Request for LOP' }).click();
  await expect(page1.getByRole('heading', { name: ' Recognition ' })).toBeVisible();

  await page1.getByRole('link', { name: ' Request LOP' }).click();
  await expect(page1.getByRole('row', { name: 'Sl# Course Type Request Seat' })).toBeVisible();

  await page1.getByRole('button', { name: 'Add course' }).click();
  await page1.getByRole('combobox').first().selectOption('2');
  await expect(page1.getByRole('row', { name: 'ANM ' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'Enter Seats' }).click();
  await page1.getByRole('textbox', { name: 'Enter Seats' }).fill('50');
  await expect(page1.getByRole('row', { name: 'ANM 50 ' })).toBeVisible();

  await page1.locator('input[name="publishDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('1', { exact: true }).nth(1).click();
  await page1.locator('#instituteType').selectOption('1');
  await page1.getByRole('textbox', { name: 'Enter Institute Name' }).click();
  // await page1.getByRole('textbox', { name: 'Enter Institute Name' }).fill('testingnew');
  await page1.getByRole('textbox', { name: 'Enter Institute Name' }).fill(instituteName);

  await page1.getByRole('textbox', { name: 'Enter Institute Code' }).click();
  await page1.getByRole('textbox', { name: 'Enter Institute Code' }).fill('12345new');
  await page1.locator('div').filter({ hasText: /^Year of Establishment\*$/ }).getByPlaceholder('YYYY').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('2018', { exact: true }).click();
  await page1.getByRole('textbox', { name: 'Enter Principal / Vice' }).click();
  await page1.getByRole('textbox', { name: 'Enter Principal / Vice' }).fill('testing');
  await page1.getByRole('textbox', { name: 'Enter Mobile Number' }).click();
  await page1.getByRole('textbox', { name: 'Enter Mobile Number' }).fill('7319722565');
  await page1.getByRole('textbox', { name: 'Enter Chairperson Name' }).click();
  await page1.getByRole('textbox', { name: 'Enter Chairperson Name' }).fill('asdfgh');
  await page1.getByRole('textbox', { name: 'Enter Chairperson Mobile' }).click();
  await page1.getByRole('textbox', { name: 'Enter Chairperson Mobile' }).fill('9876543222');
  await page1.getByRole('textbox', { name: 'Enter Email Id' }).click();
  await page1.getByRole('textbox', { name: 'Enter Email Id' }).fill('hdhdh@gmail.com');
  await page1.getByRole('combobox').nth(2).selectOption('9');
  await page1.getByRole('combobox').nth(3).selectOption('83');
  await page1.getByRole('combobox').nth(4).selectOption('108');
  await page1.getByRole('textbox', { name: 'Enter Pin code' }).click();
  await page1.getByRole('textbox', { name: 'Enter Pin code' }).fill('876543');
  await page1.getByRole('textbox', { name: 'Enter Address' }).click();
  await page1.getByRole('textbox', { name: 'Enter Address' }).fill('jhdjhdsjjh3jhjh');
  await page1.getByRole('textbox', { name: 'Enter Tel/Fax No' }).click();
  await page1.getByRole('textbox', { name: 'Enter Tel/Fax No' }).fill('0987654345');
  await page1.locator('input[name="yearOfEstablishment"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByText('2018', { exact: true }).click();
  await page1.locator('div:nth-child(3) > .input-group > .form-control').first().click();
  await page1.locator('div:nth-child(3) > .input-group > .form-control').first().setInputFiles('DigitalCV.pdf');
  await page1.locator('#relatedDoc').click();
  await page1.locator('#relatedDoc').setInputFiles('Sample document.pdf');
  await page1.getByRole('textbox', { name: 'Enter Registration and major' }).click();
  await page1.getByRole('textbox', { name: 'Enter Registration and major' }).fill('cvhjkiuytrdghjk jhjhfjhfdh');
  await page1.getByRole('textbox', { name: 'Enter Objective of the' }).click();
  await page1.getByRole('textbox', { name: 'Enter Objective of the' }).fill('medical training to nursing student');
  await page1.getByRole('textbox', { name: 'Enter Financial strengths of' }).click();
  await page1.getByRole('textbox', { name: 'Enter Financial strengths of' }).fill('10000');
  await page1.locator('.bg-light > form > .row > div > .input-group > .form-control').first().click();
  await page1.locator('.bg-light > form > .row > div > .input-group > .form-control').first().setInputFiles('Sample document.pdf');
  await page1.locator('div:nth-child(2) > .input-group > .form-control').first().click();
  await page1.locator('div:nth-child(2) > .input-group > .form-control').first().setInputFiles('Sample document.pdf');
  await page1.locator('.bg-light > form > .row.g-4 > div:nth-child(3) > .input-group > .form-control').click();
  await page1.locator('.bg-light > form > .row.g-4 > div:nth-child(3) > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.getByRole('radio', { name: 'No' }).check();
  await page1.locator('.col-md-8 > .input-group > .form-control').click();
  await page1.locator('.col-md-8 > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.locator('.col-12 > div > .col-md-6 > .input-group > .form-control').first().click();
  await page1.locator('.col-12 > div > .col-md-6 > .input-group > .form-control').first().setInputFiles('Sample document.pdf');
  await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from District Magistrate' }).click();
  await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from District Magistrate' }).fill('876546');
  await page1.locator('input[name="nocDistrictMigrationIssueDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  //await page1.getByRole('button', { name: '‹' }).click();
  //await expect(page1.getByRole('row', { name: '26 27 28 29 30 31 1' })).toBeVisible();

  await page1.getByRole('button', { name: '2025' }).click();
  await expect(page1.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page1.getByText('2019').click();
  await expect(page1.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page1.getByText('February').click();
  await expect(page1.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page1.getByText('5', { exact: true }).nth(1).click();
  await page1.locator('.row.g-4.mb-4 > .col-12 > div > .col-md-6 > .input-group > .form-control').first().click();
  await page1.locator('.row.g-4.mb-4 > .col-12 > div > .col-md-6 > .input-group > .form-control').first().setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from Civil Surgeon' }).click();
  await page1.getByRole('textbox', { name: 'Enter Letter No. of NOC from Civil Surgeon' }).fill('098765h');
  await page1.locator('input[name="civilSurgenIssueDate"]').click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('button', { name: '2025' }).click();
  await expect(page1.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page1.getByText('2019').click();
  await expect(page1.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page1.getByText('March').click();
  await expect(page1.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page1.getByText('1', { exact: true }).nth(1).click();
  await page1.locator('.bg-light > div:nth-child(5) > div > .input-group > .form-control').first().click();
  await page1.locator('.bg-light > div:nth-child(5) > div > .input-group > .form-control').first().setInputFiles('graph.png');
  await page1.locator('div:nth-child(5) > div:nth-child(2) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(5) > div:nth-child(2) > .input-group > .form-control').setInputFiles('education.png');
  await page1.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'REGISTERED' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  // await expect(page1.getByRole('button', { name: 'Welcome TEMP86827 User Image ' })).toBeVisible();
  // await expect(page1.getByRole('button', { name: `Welcome ${tempId} User Image` })).toBeVisible();
  await expect(page1.getByText(`Welcome ${tempId}`)).toBeVisible();



  await page1.locator('.form-control').first().click();
  await page1.locator('.form-control').first().setInputFiles('DigitalCV.pdf');
  await page1.getByRole('textbox', { name: 'Enter Khata No.' }).click();
  await page1.getByRole('textbox', { name: 'Enter Khata No.' }).fill('09876543');
  await page1.getByRole('textbox', { name: 'Enter Khesra/Survey Plot No.' }).click();
  await page1.getByRole('textbox', { name: 'Enter Khesra/Survey Plot No.' }).fill('876543');
  await page1.getByRole('textbox', { name: 'Enter Area' }).click();
  await page1.getByRole('textbox', { name: 'Enter Area' }).fill('87654');
  await page1.getByRole('textbox', { name: 'Enter Deed No.' }).click();
  await page1.getByRole('textbox', { name: 'Enter Deed No.' }).fill('098765tyhj');
  await page1.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
  await page1.getByRole('textbox', { name: 'DD-MM-YYYY' }).click();
  await expect(page1.getByRole('dialog', { name: 'calendar' })).toBeVisible();

  await page1.getByRole('button', { name: '2025' }).click();
  await expect(page1.getByRole('row', { name: '2019 2020 2021' })).toBeVisible();

  await page1.getByText('2018', { exact: true }).click();
  await expect(page1.getByRole('row', { name: 'January February March' })).toBeVisible();

  await page1.getByText('January').click();
  await expect(page1.getByRole('row', { name: 'weekday weekday weekday' })).toBeVisible();

  await page1.getByText('12', { exact: true }).click();
  await page1.getByRole('combobox').first().selectOption('9');
  await page1.getByRole('combobox').nth(1).selectOption('108');
  await page1.getByRole('textbox', { name: 'Enter Mauza Village' }).click();
  await page1.getByRole('textbox', { name: 'Enter Mauza Village' }).fill('kuiyjghjgj');
  await page1.getByRole('textbox', { name: 'Enter police Station' }).click();
  await page1.getByRole('textbox', { name: 'Enter police Station' }).fill('jjjjjjjjjjj');
  await page1.getByRole('textbox', { name: 'Enter North Boundary' }).click();
  await page1.getByRole('textbox', { name: 'Enter North Boundary' }).fill('jgjgggggggggggggg');
  await page1.getByRole('textbox', { name: 'Enter South Boundary' }).click();
  await page1.getByRole('textbox', { name: 'Enter South Boundary' }).fill('jjjjjjjjjjjjjjj');
  await page1.getByRole('textbox', { name: 'Enter East Boundary' }).click();
  await page1.getByRole('textbox', { name: 'Enter East Boundary' }).fill('jjjjjjjjjjjjjjjjjj');
  await page1.getByRole('textbox', { name: 'Enter West Boundary' }).click();
  await page1.getByRole('textbox', { name: 'Enter West Boundary' }).fill('erghjjhgf');
  await page1.getByRole('textbox', { name: 'Enter Longitude' }).click();
  await page1.getByRole('textbox', { name: 'Enter Longitude' }).fill('88.7656');
  await page1.getByRole('textbox', { name: 'Enter Latitude' }).click();
  await page1.getByRole('textbox', { name: 'Enter Latitude' }).fill('33.44444');
  await page1.locator('textarea').first().click();
  await page1.locator('textarea').first().fill('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
  await page1.locator('.bg-light > .col-xl-6 > .input-group > .form-control').first().click();
  await page1.locator('.bg-light > .col-xl-6 > .input-group > .form-control').first().setInputFiles('DigitalCV.pdf');
  await page1.locator('textarea').nth(1).click();
  await page1.locator('textarea').nth(1).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhh');
  await page1.locator('div:nth-child(8) > .bg-light > .col-xl-6 > .input-group > .form-control').click();
  await page1.locator('div:nth-child(8) > .bg-light > .col-xl-6 > .input-group > .form-control').setInputFiles('DigitalCV.pdf');
  await page1.locator('textarea').nth(2).click();
  await page1.locator('textarea').nth(2).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  await page1.locator('div:nth-child(9) > .bg-light > .col-xl-6 > .input-group > .form-control').click();
  await page1.locator('div:nth-child(9) > .bg-light > .col-xl-6 > .input-group > .form-control').setInputFiles('Sample document.pdf');
  await page1.locator('textarea').nth(3).click();
  await page1.locator('textarea').nth(3).fill('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
  await page1.locator('div:nth-child(10) > .bg-light > div:nth-child(3) > .input-group > .form-control').click();
  await page1.locator('div:nth-child(10) > .bg-light > div:nth-child(3) > .input-group > .form-control').setInputFiles('Sample document.pdf');
  await page1.locator('#buildingMapApprovalDoc').click();
  await page1.locator('#buildingMapApprovalDoc').setInputFiles('Sample document.pdf');
  await page1.getByRole('button', { name: 'Save & Next' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'UPDATED!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
  //await expect(page1.getByRole('button', { name: 'Welcome TEMP86827 User Image ' })).toBeVisible();
  //await expect(page1.getByRole('button', { name: `Welcome ${tempId} User Image` })).toBeVisible();
  await expect(page1.getByText(`Welcome ${tempId}`)).toBeVisible();


  await page1.getByRole('checkbox', { name: 'I Agree.I hereby declare that' }).check();
  await expect(page1.getByRole('button', { name: ' Preview Application' })).toBeVisible();

  await page1.getByRole('button', { name: 'Submit & Request to verify' }).click();
  await expect(page1.getByRole('dialog', { name: 'Are you sure?' })).toBeVisible();

  await page1.getByRole('button', { name: 'Yes, save it!' }).click();
  await expect(page1.getByRole('dialog', { name: 'REQUESTED TO VERIFY!' })).toBeVisible();

  await page1.getByRole('button', { name: 'OK' }).click();
});