// page1.js
const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: false }); // headless: false opens the browser
  const page = await browser.newPage();

  // Go to BNRC home page
  await page.goto('https://bnrc2.bihar.gov.in/home');

  // Click Professional Registration
  await page.click('text=Professional Registration');

  // Fill applicant details
  await page.fill('input[placeholder="Enter Registration Number"]', 'iufhiu4545');
  await page.fill('input[placeholder="Enter Applicant Name"]', 'demodemo');
  await page.click('input[placeholder="YYYY-MM-DD"]');
  await page.click('text=2009');
  await page.click('text=2004'); // Select birth year
  await page.click('text=February');
  await page.click('text=5');

  // Fill other fields
  await page.selectOption('select[name="gender"]', '2'); // Example gender select
  await page.fill('input[placeholder="example@gmail.com"]', 'dhffh@gmail.com');
  await page.fill('input[placeholder="Enter Mobile Number"]', '7319722565');
  await page.fill('input[placeholder="Enter Father\'s Name"]', 'demodemofather');
  await page.fill('input[placeholder="Enter Name As Per Aadhaar"]', 'demodemo');
  await page.fill('input[placeholder="0000 0000"]', '287938368109');

  // Select state and district
  await page.selectOption('select[name="stateId"]', '4');
  await page.selectOption('select[name="districtId"]', '13');

  // Fill institution details
  await page.fill('input[placeholder="Enter Name of the Institution"]', 'gfdjgjfdgkdfgj');
  await page.fill('input[placeholder="Enter Location"]', 'djfdskfhdjsfh');
  await page.click('input[name="startDate"]');
  await page.click('text=2025');
  await page.click('text=2018'); // Example start year
  await page.click('text=January');
  await page.click('text=7');
  await page.click('input[name="endDate"]');
  await page.click('text=2025');
  await page.click('text=2025'); // Example end year
  await page.click('text=May');
  await page.click('text=15');

  // Fill specialization & grades
  await page.fill('input[placeholder="Enter Specialization"]', 'aaaaaaaaaaaaa');
  await page.fill('input[placeholder="Enter Grades/Percentage/CGPA"]', '90');

  // Fill work experience
  await page.fill('input[placeholder="Enter Company Name"]', 'aaaaaaaaaaaaaaaaad');
  await page.fill('input[placeholder="Enter Location"]', 'ddddddddddddddd');
  await page.click('input[name="wrkStartDate"]');
  await page.click('text=2025');
  await page.click('text=2019');
  await page.click('text=February');
  await page.click('text=7');
  await page.click('input[name="wrkEndDate"]');
  //await page.click('text=2025');
  //await page.click('text=September');
  await page.click('text=30');

  // Agree to terms
  await page.check('input[type="checkbox"]'); // first checkbox
  await page.fill('input[placeholder="Enter Answer"]', '1');
  await page.check('input[aria-label="I agree to provide my Aadhaar"]');

  // Submit form
  await page.click('text=Submit');
  await page.click('text=Yes, save it!');
  await page.click('text=OK');

  // Optional: another mobile number submission
  await page.fill('input[placeholder="Enter Mobile Number"]', '7319722568');
  await page.click('text=Submit');
  await page.click('text=Yes, save it!');
  await page.click('text=OK');
  await page.click('text=Professional Registered');
  await page.click('text=OK');

  // Close browser
  await browser.close();
})();
