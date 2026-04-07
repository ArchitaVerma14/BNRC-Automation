/************************************************************
 * Foreign Verification – Full E2E Automation
 * Tech: Selenium WebDriver + Mocha
 ************************************************************/

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

/* ========================= VERHOEFF ========================= */
const Verhoeff = {
  d: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
  ],
  p: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
  ],
  inv: [0,4,3,2,1,5,6,7,8,9],
  generate(num) {
    if (parseInt(num[0], 10) <= 2) {
      throw new Error('Aadhaar first digit must be > 2');
    }
    let c = 0;
    for (let i = num.length - 1; i >= 0; i--) {
      c = this.d[c][this.p[(num.length - i) % 8][parseInt(num[i], 10)]];
    }
    return this.inv[c];
  }
};

/* ========================= HELPERS ========================= */
function generateValidAadhaar() {
  const firstDigit = Math.floor(Math.random() * 7) + 3; // 3–9
  const rest = Math.floor(Math.random() * 1e10).toString().padStart(10, '0');
  const seed = `${firstDigit}${rest}`;
  return seed + Verhoeff.generate(seed);
}

async function fillField(driver, selector, value) {
  const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'})", el);
  await el.clear();
  await el.sendKeys(value);
  await driver.sleep(500);
}

/* ========================= TEMP USER FLOW ========================= */
async function handleTempUserFlow(driver) {
  let tempId;
  async function navigateToForeignVerificationAndPay(driver) {

  console.log("Navigating to Foreign Verification...");

  const eAppDropdown = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
    20000
  );

  await driver.actions({ bridge: true })
    .move({ origin: eAppDropdown })
    .perform();

  const foreignVerification = await driver.wait(
    until.elementLocated(
      By.css('a.dropdown-item[href="/bnrc_stg/Website/foreign-verification"]')
    ),
    15000
  );

  await foreignVerification.click();

  await driver.wait(
    until.elementLocated(By.xpath("//h3[contains(text(),'Foreign Verification')]")),
    20000
  );

  console.log("Waiting for Payment button...");

  const paymentButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(.,'Payment')]")),
    20000
  );

  await driver.wait(until.elementIsVisible(paymentButton), 10000);

  await driver.wait(async () => {
    const disabled = await paymentButton.getAttribute("disabled");
    return disabled === null;
  }, 10000);

  await driver.executeScript(
    "arguments[0].scrollIntoView({block:'center'})",
    paymentButton
  );

  try {
    await paymentButton.click();
  } catch {
    await driver.executeScript("arguments[0].click();", paymentButton);
  }

  console.log("Payment button clicked successfully");
}


  // Capture TEMP ID
  const swal = await driver.wait(
    until.elementLocated(By.css('div.swal2-html-container')),
    15000
  );

  await driver.wait(async () => {
    const txt = await swal.getText();
    return /TEMP\s*\d+/i.test(txt);
  }, 10000);

  tempId = (await swal.getText()).match(/TEMP\s*\d+/i)[0].replace(/\s+/g, '');
  console.log('Captured TEMP ID:', tempId);

  // Close success popup
  await driver.findElement(By.xpath("//button[contains(text(),'OK')]")).click();

  /* ---------- Temporary Login ---------- */
  await driver.get('http://68.233.110.246/bnrc_stg/login');
  await driver.wait(until.elementLocated(By.css("img[alt='BNRC Logo']")), 20000);

  await driver.findElement(By.css('.ng-select-container')).click();
  await driver.findElement(By.xpath("//span[contains(text(),'Temporary')]")).click();

  await driver.findElement(By.css("input[placeholder='Enter Temporary ID']")).sendKeys(tempId);
  await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys('123456');
  await driver.findElement(By.css("input[placeholder='Enter Captcha']")).sendKeys('1');
  await driver.findElement(By.xpath("//button[normalize-space()='Login']")).click();

  /* ---------- Reset Password ---------- */
  await driver.wait(until.elementLocated(By.css("input[formcontrolname='newPassword']")), 15000);
  await driver.findElement(By.css("input[formcontrolname='newPassword']")).sendKeys('Av@12345');
  await driver.findElement(By.css("input[formcontrolname='confirmPassword']")).sendKeys('Av@12345');
  await driver.findElement(By.css("button[type='submit']")).click();

  await driver.findElement(By.xpath("//button[contains(text(),'OK')]")).click();
  console.log('Password reset successful');
  /* ---------- Re-login with RESET password ---------- */
await driver.wait(until.urlContains('/login'), 10000);

await driver.findElement(By.css('.ng-select-container')).click();
await driver.findElement(By.xpath("//span[contains(text(),'Temporary')]")).click();

await driver.findElement(By.css("input[placeholder='Enter Temporary ID']")).clear();
await driver.findElement(By.css("input[placeholder='Enter Temporary ID']")).sendKeys(tempId);
await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys('Av@12345');
await driver.findElement(By.css("input[placeholder='Enter Captcha']")).sendKeys('1');
await driver.findElement(By.xpath("//button[normalize-space()='Login']")).click();

await driver.wait(
  until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
  20000
);

console.log("Re-login successful with reset password");
return tempId;


  
  
}

/* ========================= TEST ========================= */
describe('Foreign Verification Automation', function () {
  this.timeout(120000);
  let driver;

  before(async () => {
    const options = new chrome.Options()
      .addArguments('--start-maximized', '--ignore-certificate-errors');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('should complete foreign verification end-to-end', async () => {

    /* ---------- Open Application ---------- */
    await driver.get('https://68.233.110.246/bnrc_stg/home');

    const eApp = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
      20000
    );
    await driver.actions({ bridge: true }).move({ origin: eApp }).perform();

    await driver.findElement(
      By.css("a[href='/bnrc_stg/Website/foreign-verification']")
    ).click();

    // /* ---------- Basic Form Fill (sample) ---------- */
    // await fillField(driver, "input[formcontrolname='applicantName']", faker.name.findName());
    // await fillField(driver, "input[formcontrolname='fatherName']", faker.name.findName());
    // await fillField(driver, "input[formcontrolname='email']", faker.internet.email());
    // await fillField(driver, "input[formcontrolname='mobNo']", faker.phone.phoneNumber('9#########'));
    // await fillField(driver, "input[formcontrolname='aadharNumber']", generateValidAadhaar());
     const courseDropdown = await driver.wait(
        until.elementLocated(By.css('select[formcontrolname="courseId"]')),
        10000
        );
        await driver.wait(until.elementIsVisible(courseDropdown), 5000);

        // Click the dropdown (optional)
        await courseDropdown.click();

        // Select "ANM" option by value
        const anmOption = await driver.findElement(By.css('select[formcontrolname="courseId"] option[value="2"]'));
        await anmOption.click();      

        await fillField("input[formcontrolname='applicantName']", faker.name.findName());
        await selectDropdown("select[formcontrolname='genderId']", 'Male');
        await fillField("input[formcontrolname='fatherName']", faker.name.findName());
        
        const dobYear = faker.datatype.number({ min: 1980, max: 2000 });
        const dob = new Date(dobYear, faker.datatype.number({min: 0, max: 11}), faker.datatype.number({min: 1, max: 28}));
        const dobMonth = dob.toLocaleString('default', { month: 'long' });
        const dobDay = dob.getDate();

        const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        const yearDropdown = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2009')]")),
            5000
        );
        await yearDropdown.click();

        let yearFound = false;
        let dobAttempts = 0;
        while (!yearFound && dobAttempts < 20) {
             const years = await driver.findElements(By.xpath(`//span[text()='${dobYear}']`));
            if (years.length > 0) {
                await driver.executeScript("arguments[0].click();", years[0]);
                yearFound = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(500);
                dobAttempts++;
            }
        }

        const monthElement = await driver.wait(
            until.elementLocated(By.xpath(`//span[text()='${dobMonth}']`)),
            5000
        );
        await monthElement.click();

        const dayElement = await driver.wait(
            until.elementLocated(By.xpath(`//span[text()='${dobDay}']`)),
            5000
        );
        await dayElement.click();

        await fillField("input[formcontrolname='email']", faker.internet.email());
        await fillField("input[formcontrolname='mobNo']", faker.phone.phoneNumber('9#########'));
        await selectDropdown("select[formcontrolname='stateId']", 'Bihar');
        await selectDropdown("select[formcontrolname='districtId']", 'GAYA JI');
        await selectDropdown("select[formcontrolname='categoryId']", 'Unreserved (GEN/UR)');
        await fillField("input[formcontrolname='aadhaarName']", faker.name.findName());
        
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();

        let yearSelected = false;
        let yobAttempts = 0;
        while (!yearSelected && yobAttempts < 20) {
            const years = await driver.findElements(By.xpath(`//span[text()='${dobYear}']`));
            if (years.length > 0) {
                await driver.executeScript("arguments[0].click();", years[0]);
                yearSelected = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(500);
                yobAttempts++;
            }
        }
        const aadhaarSeed = faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString();
        const aadhaarChecksum = Verhoeff.generate(aadhaarSeed);
        const aadhaarNumber = aadhaarSeed + aadhaarChecksum;
        await fillField("input[formcontrolname='aadharNumber']", aadhaarNumber);
        const addMoreBtn = By.xpath("//button[normalize-space()='Add More']");
        
        const qualificationDropdown = await driver.findElement(By.css("select[formcontrolname='educationId']"));
        await qualificationDropdown.click();
        const matriculationOption = await driver.findElement(By.xpath("//option[text()='Matriculation']"));
        await matriculationOption.click();

        const yearInput = await driver.findElement(By.css("input[formcontrolname='passedYear']"));
        await yearInput.click();

        let year2020 = false;
        while (!year2020) {
            const yearElems = await driver.findElements(By.xpath("//span[text()='2020']"));
            if (yearElems.length > 0) {
                await driver.executeScript("arguments[0].click();", yearElems[0]);
                year2020 = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(500); // wait for DOM update
            }
        }

        const boardInput = await driver.findElement(By.css("input[formcontrolname='boardName']"));
        await boardInput.clear();
        await boardInput.sendKeys("CBSE");

        const marksInput = await driver.findElement(By.css("input[formcontrolname='securedMarks']"));
        await marksInput.clear();
        await marksInput.sendKeys("90");
       // Click Add More after Matriculation
        const addMoreAfterMatric = await driver.wait(until.elementLocated(addMoreBtn), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", addMoreAfterMatric);
        await addMoreAfterMatric.click();
        await driver.sleep(2000); // wait for Intermediate section to appear
        const educationDropdowns = await driver.findElements( By.css("select[formcontrolname='educationId']"));

// Click the LAST (newly added) dropdown
        const latestEducationDropdown = educationDropdowns[educationDropdowns.length - 1];
        await latestEducationDropdown.click();

        // Now select Intermediate from THAT dropdown
        const intermediateOption = await latestEducationDropdown.findElement(
        By.xpath(".//option[normalize-space()='Intermediate']")
        );
        await intermediateOption.click();


        const yearInputs = await driver.findElements(By.css("input[formcontrolname='passedYear']"));
        const year2Input = yearInputs[yearInputs.length - 1];
        await year2Input.click();

        let year2022 = false;
        while (!year2022) {
            const yearElems = await driver.findElements(By.xpath("//span[text()='2022']"));
            if (yearElems.length > 0) {
                await driver.executeScript("arguments[0].click();", yearElems[0]);
                year2022 = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(500); // wait for DOM update
            }
        }

        const board2Inputs = await driver.findElements(By.css("input[formcontrolname='boardName']"));
        const board2Input = board2Inputs[board2Inputs.length - 1];
        await board2Input.clear();
        await board2Input.sendKeys("CBSE");

        const marks2Inputs = await driver.findElements(By.css("input[formcontrolname='securedMarks']"));
        const marks2Input = marks2Inputs[marks2Inputs.length - 1];
        await marks2Input.clear();
        await marks2Input.sendKeys("90");

        const addMoreAfterMatric2 = await driver.wait(until.elementLocated(addMoreBtn), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", addMoreAfterMatric2);
        await addMoreAfterMatric2.click();
        await driver.sleep(2000); // wait for Intermediate section to appear
        // Get all education dropdowns
// Re-fetch education dropdowns AFTER Add More
        await driver.wait(async () => {
        const list = await driver.findElements(
            By.css("select[formcontrolname='educationId']")
        );
        return list.length === 3;
        }, 15000, "Graduation block not rendered");

        const educationDropdowns1 = await driver.findElements(
        By.css("select[formcontrolname='educationId']")
        );

        // Select LAST dropdown (Graduation)
        const latestEducationDropdown1 = educationDropdowns1[2];
        await latestEducationDropdown1.click();

        // Select Graduation option INSIDE that dropdown
        const gradOption = await latestEducationDropdown1.findElement(
        By.xpath(".//option[normalize-space()='Graduation']")
        );
        await gradOption.click();

        // ---- Passed Year (Graduation) ----
        const year3Inputs = await driver.findElements(
        By.css("input[formcontrolname='passedYear']")
        );
        const year3Input = year3Inputs[year3Inputs.length - 1];
        await year3Input.click();

        let year2025 = false;
        while (!year2025) {
        const yearElems = await driver.findElements(By.xpath("//span[text()='2025']"));
        if (yearElems.length > 0) {
            await driver.executeScript("arguments[0].click();", yearElems[0]);
            year2025 = true;
        } else {
            const prevButton = await driver.findElement(By.css("button.previous"));
            await prevButton.click();
            await driver.sleep(500);
        }
        }

        // ---- Board ----
        const board3Inputs = await driver.findElements(
        By.css("input[formcontrolname='boardName']")
        );
        const board3Input = board3Inputs[board3Inputs.length - 1];
        await board3Input.clear();
        await board3Input.sendKeys("CBSE");

        // ---- Marks ----
        const marks3Inputs = await driver.findElements(
        By.css("input[formcontrolname='securedMarks']")
        );
        const marks3Input = marks3Inputs[marks3Inputs.length - 1];
        await marks3Input.clear();
        await marks3Input.sendKeys("90");


    /* ---------- Upload Document ---------- */
    const upload = await driver.wait(
      until.elementLocated(By.css("input[type='file']")),
      10000
    );
    await driver.executeScript("arguments[0].style.display='block'", upload);
    upload.sendKeys(
      path.resolve('D:/OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE/Sample document.pdf')
    );

    /* ---------- Submit ---------- */
    await driver.findElement(By.css("button[type='submit'].btn-success")).click();
    await driver.findElement(By.xpath("//button[contains(text(),'Yes, save it!')]")).click();
    /* ---------- TEMP USER FLOW ---------- */
    const tempId = await handleTempUserFlow(driver);

    /* ---------- PAYMENT FLOW AFTER RELOGIN ---------- */
    await navigateToForeignVerificationAndPay(driver);

    console.log('End-to-end flow completed for:', tempId);


    /* ---------- TEMP USER FLOW ---------- */
    // const tempId = await handleTempUserFlow(driver);
    // console.log('End-to-end flow completed for:', tempId);
  });
});
