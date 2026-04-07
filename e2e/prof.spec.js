import { test, expect } from "@playwright/test";
import fs from "fs";

// ==============================================
// CSV INITIALIZATION
// ==============================================
const csvPath = "temp_ids.csv";

if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, "run_no,temp_id,timestamp\n");
}

// ==============================================
// HELPERS
// ==============================================
async function safeClick(page, locator) {
  const el = page.locator(locator);
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible({ timeout: 10000 });
  await expect(el).toBeEnabled({ timeout: 10000 });
  await el.click();
}

async function safeType(page, locator, value) {
  const el = page.locator(locator);
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible({ timeout: 10000 });
  await el.fill(value);
}

async function safeSelect(page, locator, text) {
  const el = page.locator(locator);
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible({ timeout: 10000 });

  const option = el.locator("option", { hasText: text });
  await expect(option).toHaveCount(1, { timeout: 10000 });

  const value = await option.first().getAttribute("value");
  await el.selectOption(value);
}

// ==============================================
// BNRC DATEPICKER — EXACT SELENIUM LOGIC
// Calendar opens directly in YEAR GRID (BNRC custom)
// ==============================================
async function pickDate(page, inputSelector, year, month, day) {
  await safeClick(page, inputSelector);

  // 1. Wait for ANY 4-digit year button (BNRC year grid)
  await expect(
    page.getByRole("button", { name: /20\d{2}/ }).first()
  ).toBeVisible({ timeout: 6000 });

  // 2. Click an upper decade year, same as Selenium (e.g., 2009)
  const decadeYear = String(Number(year) + 5);
  const decadeBtn = page.getByRole("button", { name: decadeYear });

  if (await decadeBtn.isVisible()) {
    await decadeBtn.click();
  }

  // 3. Select the actual year
await page.locator(`//div[@role='gridcell' and normalize-space()='${year}']`).click();

  // 4. Select month
  await page.locator(`//span[contains(text(),'${month}')]`).first().click();

  // 5. Select day
  await page.locator(`//span[normalize-space(text())='${day}']`).first().click();

  await page.click("body");
}

// ==============================================
// Aadhaar Generator
// ==============================================
function randomAadhaar() {
  return String(100000000000 + Math.floor(Math.random() * 900000000000));
}

// ==============================================
// MAIN TEST
// ==============================================
test("Generate 25 TEMP IDs and save to CSV", async ({ page }) => {
  for (let i = 1; i <= 25; i++) {
    console.log(`---------------- RUN ${i} STARTED ----------------`);

    await page.goto("https://bnrc2.bihar.gov.in/home", {
      waitUntil: "domcontentloaded",
    });

    // Close popup if visible
    const popupAlert = page.locator(".swal2-container");
    if (await popupAlert.isVisible()) {
      await popupAlert.locator("button:has-text('OK')").click();
    }

    // Go to Professional Registration
    await safeClick(page, "a.btn.btn-danger");

    // ---------------------------
    // PERSONAL INFORMATION
    // ---------------------------
    await safeType(page, "input[formcontrolname='registrationNumber']", "REG" + Date.now());
    await safeType(page, "input[formcontrolname='applicantName']", "TestProfessional");

    // DOB (BNRC datepicker)
    await pickDate(page, "input[formcontrolname='dob']", "2004", "May", "14");

    await safeSelect(page, "select[formcontrolname='gender']", "Male");
    await safeType(page, "input[formcontrolname='email']", `test${Date.now()}@gmail.com`);

    await safeType(
      page,
      "input[formcontrolname='mobNo']",
      "9" + Math.floor(100000000 + Math.random() * 900000000)
    );

    await safeType(page, "input[formcontrolname='fatherName']", "Father Test");
    await safeType(page, "input[formcontrolname='nameAsPerAadhar']", "TestProfessional");

    // Birth Year (separate)
    await safeClick(page, "//input[@placeholder='YYYY']");
    await page.locator("text=2004").first().click();

    // Aadhaar
    await safeType(page, "input[formcontrolname='aadharNumber']", randomAadhaar());

    // ---------------------------
    // DEMOGRAPHY
    // ---------------------------
    await safeSelect(page, "select[formcontrolname='stateId']", "Bihar");
    await safeSelect(page, "select[formcontrolname='districtId']", "GAYA");
    await safeSelect(page, "select[formcontrolname='categoryId']", "Unreserved (GEN/UR)");

    // ---------------------------
    // EDUCATION
    // ---------------------------
    await safeSelect(page, "select[formcontrolname='qualification']", "ANM (Auxiliary Nurse Midwife)");
    await safeType(page, "input[formcontrolname='institution']", "Nurse University");
    await safeType(page, "input[formcontrolname='location']", "Patna");

    // Start / End Dates — BNRC datepicker
    await pickDate(page, "input[formcontrolname='startDate']", "2022", "January", "13");
    await pickDate(page, "input[formcontrolname='endDate']", "2022", "May", "10");

    await safeType(page, "input[formcontrolname='specialization']", "General");
    await safeType(page, "input[formcontrolname='grade']", "80");

    // ---------------------------
    // WORK EXPERIENCE
    // ---------------------------
    await safeSelect(page, "select[formcontrolname='jobTitle']", "Registered Nurse");

    await safeType(page, "input[formcontrolname='companyName']", "abcCompany");
    await safeType(page, "input[formcontrolname='wrkLocation']", "abc");

    await pickDate(page, "input[formcontrolname='wrkStartDate']", "2024", "August", "15");
    await pickDate(page, "input[formcontrolname='wrkEndDate']", "2024", "April", "4");

    // ---------------------------
    // CAPTCHA + AGREEMENT
    // ---------------------------
    await safeType(page, "input[formcontrolname='captcha']", "1");
    await safeClick(page, "#flexCheckDefault");

    // ---------------------------
    // SUBMIT
    // ---------------------------
    await safeClick(page, "button.btn-success[type='submit']");

    const yesBtn = page.locator("button:has-text('Yes, save it!')");
    if (await yesBtn.isVisible({ timeout: 6000 })) await yesBtn.click();

    // ---------------------------
    // CAPTURE TEMP ID
    // ---------------------------
    const popup = page.locator("div.swal2-html-container");
    await expect(popup).toBeVisible({ timeout: 20000 });

    const text = await popup.innerText();
    const tempId = text.match(/TEMP\d+/)?.[0] || "NOT_FOUND";

    console.log(`RUN ${i} TEMP ID:`, tempId);

    await page.screenshot({
      path: `tempid_run${i}_${tempId}.png`,
      fullPage: true,
    });

    await page.locator("button:has-text('OK')").click();

    // ---------------------------
    // SAVE TO CSV
    // ---------------------------
    const ts = new Date().toISOString();
    fs.appendFileSync(csvPath, `${i},${tempId},${ts}\n`);

    console.log(`RUN ${i} COMPLETED AND SAVED`);
  }
});
