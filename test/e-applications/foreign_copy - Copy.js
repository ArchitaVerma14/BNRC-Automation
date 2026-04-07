const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { Select } = require('selenium-webdriver/lib/select');
require("chromedriver"); // just load it

//const chromedriver = require('chromedriver');
const service = new chrome.ServiceBuilder(require("chromedriver").path);

const faker = require('faker');

const Verhoeff = {
    d: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]],
    p: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]],
    inv: [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],

    generate: function(num) {
         if (parseInt(num[0], 10) <= 2) {
            throw new Error("First digit must be greater than 2");
        }
        let c = 0;
        for (let i = num.length - 1; i >= 0; i--) {
            c = Verhoeff.d[c][Verhoeff.p[(num.length - i) % 8][parseInt(num[i], 10)]];
        }
        return Verhoeff.inv[c];
    }
};

describe('Foreign Verification Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        try {
            require("chromedriver"); 
            const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const options = new chrome.Options();
            options.setChromeBinaryPath(chromeBinaryPath);
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--allow-insecure-localhost');
            options.addArguments('--disable-web-security');
            options.addArguments('--start-maximized');
            options.addArguments('--disable-features=IsolateOrigins,site-per-process');
            options.addArguments('--allow-running-insecure-content');
            // options.addArguments('--headless'); // Uncomment to run in headless mode

            const service = new chrome.ServiceBuilder(require("chromedriver").path);

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .setChromeService(service)
                .build();
        } catch (err) {
            console.error('Error in before hook:', err);
            throw err;
        }
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should register a foreign verification with sample data', async function () {
        // 1. Open the website
        await driver.get('http://68.233.110.246/bnrc_stg/home');
        // Wait for the SweetAlert2 "OK" button to appear and click it
      //  const okButton = await driver.wait(
        //    until.elementLocated(By.css("button.swal2-confirm.btn.btn-danger")),
          //  10000
        //);
        //await driver.wait(until.elementIsVisible(okButton), 5000);
        //await okButton.click();


        // 2. Wait for the "E-Application" dropdown
        const eAppDropdown = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
            20000
        );
        await driver.wait(until.elementIsVisible(eAppDropdown), 5000);

        // Hover over the element to show the dropdown
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: eAppDropdown }).perform();

        // 5. Wait for and click the "Foreign Verification" option
        const certOption = await driver.wait(
            until.elementLocated(By.css('a.dropdown-item[href="/bnrc_stg/Website/foreign-verification"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(certOption), 5000);
        await certOption.click();

        // Click on the body to close the dropdown
        await driver.findElement(By.css('body')).click();
        await driver.sleep(5000); // Wait for page to stabilize after closing dropdown

        // Helper to dismiss any open navigation dropdowns
        async function dismissNavigationDropdown() {
            await driver.findElement(By.css('body')).click();
            await driver.sleep(1000); // Small delay to ensure dropdown closes
        }

        // Helper to interact with fields safely and add 3s delay after each
        async function fillField(selector, value) {
            const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
            await driver.wait(until.elementIsVisible(elem), 10000);
            await driver.wait(until.elementIsEnabled(elem), 10000);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", elem);
            await elem.clear();
            await elem.sendKeys(value);
            await driver.sleep(3000); // 3 seconds delay after filling field
        }

        async function selectDropdown(selector, value) {
            const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
            await driver.wait(until.elementIsVisible(elem), 10000);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", elem);
            await driver.sleep(500); // Wait for scroll to finish

            // Click the dropdown first to trigger loading or opening
            await elem.click();

            // Construct XPath for the specific option value
            const optionXPath = `//option[normalize-space(text())='${value.replace(/\'/g, "\'")}']`;
            const optionElement = await driver.wait(until.elementLocated(By.xpath(optionXPath)), 10000, `Option "${value}" not found in dropdown ${selector}`);
            await driver.wait(until.elementIsVisible(optionElement), 5000);
            await driver.wait(until.elementIsEnabled(optionElement), 5000);
            await optionElement.click();
            await driver.sleep(1000); // Small delay after selection to allow dropdown to close
        }


        // 4. Fill out the registration form with random data
      //  await fillField("input[formcontrolname='registrationNumber']", 'REG' + Math.floor(Math.random() * 100000));
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


        
        const path = require('path');

            const uploadInput = await driver.wait(
                until.elementLocated(By.css('input#degreeCertificateDoc[type="file"]')),
                10000
            );
            await driver.wait(until.elementIsVisible(uploadInput), 5000);

            await driver.executeScript("arguments[0].style.display='block';", uploadInput);

            const certificatePath = path.resolve("D:\\OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE\\Sample document.pdf");

            await uploadInput.sendKeys(certificatePath);

       
        await fillField("input[formcontrolname='captcha']", '1');

        const aadhaarCheckboxInput = await driver.findElement(By.css("input[type='checkbox'][id='flexCheckDefault']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", aadhaarCheckboxInput);
        if (!(await aadhaarCheckboxInput.isSelected())) {
            await aadhaarCheckboxInput.click();
        }
        await driver.sleep(3000);

        const submitBtn = await driver.wait(
            until.elementLocated(By.css("button[type='submit'].btn-success"))
        , 10000);
        await driver.wait(until.elementIsVisible(submitBtn), 5000);
        await driver.wait(until.elementIsEnabled(submitBtn), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);

        console.log("Clicking submit button...");
        await submitBtn.click();

    let yesBtn;
    try {
        yesBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[contains(text(),'Yes, save it!')]")),
            10000
        );
        await driver.wait(until.elementIsVisible(yesBtn), 5000);

        await driver.executeScript("arguments[0].click();", yesBtn);
        console.log("Clicked 'Yes, save it!'");
    } catch (e) {
        console.error("'Yes, save it!' button not found:", e);
    }
    await driver.sleep(7000); 

let tempId = "Not found";
try {
    const swalContainer = await driver.wait(
        until.elementLocated(By.css("div.swal2-html-container")),
        10000
    );
    await driver.wait(async () => {
        const text = await swalContainer.getText();
        return /TEMP\d+/.test(text);
    }, 5000, "TEMP ID not found in popup");

    const swalText = await swalContainer.getText();

    const tempIdMatch = swalText.match(/TEMP\d+/);  

    if (tempIdMatch) {
        tempId = tempIdMatch[0];
    }
    console.log(" Form submitted successfully. TEMP ID:", tempId);
} catch (e) {
    console.error("No TEMP ID popup found:", e);
}

let okBtn;
try {
    okBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(okBtn), 5000);
    await driver.sleep(5000);
    await driver.takeScreenshot().then(function(image) {
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\foreign_registration_success.png', image, 'base64');
    });
    await driver.executeScript("arguments[0].click();", okBtn);
    console.log("Clicked 'OK' to close popup.");
} catch (e) {
    console.error("'OK' button not found:", e);
}

await driver.sleep(3000);

       if (tempId !== "Not found") { 
        // 1. Open the login page directly
        await driver.get('http://68.233.110.246/bnrc_stg/login');
        await driver.wait(until.elementLocated(By.css("img[alt='BNRC Logo']")), 20000);

        // 1. Select User Type (ng-select)
        const userType = await driver.wait(until.elementLocated(By.css(".ng-select-container")), 20000);
       // await driver.wait(until.elementIsVisible(userType), 20000);
        await userType.click();

        // 2. Select "Temporary"
        await driver.wait(until.elementLocated(By.css(".ng-dropdown-panel")), 20000);
        const temporaryOption = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class,'ng-option')]//span[contains(text(),'Temporary')]")),
        20000
        );
        await temporaryOption.click();
        // 3. Fill User ID
        await driver.findElement(By.css("input[placeholder='Enter Temporary ID']")).sendKeys(tempId);
       //  await driver.wait(until.elementIsVisible(dropdownPanel), 50000);
        // 4. Fill Password
        await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys('123456');
       //  await driver.wait(until.elementIsVisible(dropdownPanel), 50000);
        // 5. Fill Captcha
        await driver.findElement(By.css("input[placeholder='Enter Captcha']")).sendKeys('1');
        //  await driver.wait(until.elementIsVisible(dropdownPanel), 50000);
        // 6. Login
        const loginBtn = await driver.findElement(By.xpath("//button[normalize-space()='Login']"));
        // await driver.wait(until.elementIsVisible(dropdownPanel), 50000);

        await loginBtn.click();
    // 2. Force Password Change
    console.log("Changing password...");
    const newPasswordInput = await driver.wait(until.elementLocated(By.css("input[formcontrolname='newPassword']")), 10000);
    await newPasswordInput.sendKeys('Av@12345');
    await driver.findElement(By.css("input[formcontrolname='confirmPassword']")).sendKeys('Av@12345');
    await driver.findElement(By.css("button[type='submit']")).click();

    // Wait for the success message and click OK
    const okButtonPassword = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(okButtonPassword), 5000);
    await okButtonPassword.click();
    console.log("Password changed successfully.");

    // 3. Re-login with the new password
    console.log("Re-logging in with new password...");
    await driver.get('http://68.233.110.246/bnrc_stg/login'); // Navigate back to login page to ensure fresh login page

    // Wait for userid field to be interactable
    const reUserid = await driver.wait(
        until.elementLocated(By.css("input[formcontrolname='userid']")),
        20000
    );
    await driver.wait(until.elementIsVisible(reUserid), 20000);
    await driver.wait(until.elementIsEnabled(reUserid), 20000);

    // move + JS click to ensure page "wakes up"
    await driver.actions().move({ origin: reUserid }).perform();
    await driver.executeScript("arguments[0].scrollIntoView(true);", reUserid);
    await driver.sleep(200);
    await driver.executeScript("arguments[0].click();", reUserid);

    // CLICK Select User Type (correct control)
    const reUserTypeDropdown = await driver.wait(
        until.elementLocated(By.css("mat-select[formcontrolname='user_type']")),
        20000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", reUserTypeDropdown);
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", reUserTypeDropdown);

    // SELECT Temporary
    const reTemporaryOption = await driver.wait(
        until.elementLocated(
            By.xpath("//mat-option//span[normalize-space()='Temporary']")
        ),
        50000
    );
    await driver.sleep(200);
    await driver.executeScript("arguments[0].click();", reTemporaryOption);

    // Fill remaining fields
    await fillField("input[formcontrolname='userid']", tempId);
    await fillField("input[formcontrolname='password']", "Av@12345"); // Use new password
    await fillField("input[formcontrolname='captcha']", "1");

    // Login submit
    const reLoginBtn = await driver.findElement(By.css("button.btn.btn-success[type='submit']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", reLoginBtn);
    await driver.executeScript("arguments[0].click();", reLoginBtn);
    console.log("Re-login successful.");

    // 4. Navigate to E-Application -> Foreign Verification
    console.log("Navigating to Foreign Verification...");
    const eAppDropdownAfterLogin = await driver.wait(
        until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
        20000
    );
    await driver.wait(until.elementIsVisible(eAppDropdownAfterLogin), 5000);
    const actionsAfterLogin = driver.actions({ bridge: true });
    await actionsAfterLogin.move({ origin: eAppDropdownAfterLogin }).perform();

    const certOptionAfterLogin = await driver.wait(
        until.elementLocated(By.css('a.dropdown-item[href="/bnrc_stg/Website/foreign-verification"]')),
        10000
    );
    await driver.wait(until.elementIsVisible(certOptionAfterLogin), 5000);
    await certOptionAfterLogin.click();
    console.log("Navigation successful.");

    // 5. Click the payment button
    console.log("Clicking payment button...");
    const paymentButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Make Payment')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(paymentButton), 5000);
    await paymentButton.click();

    console.log('Successfully completed foreign verification steps after temporary ID generation.');
}
    },
async function handleTempUserFlow(driver, fillField) {
  let tempId;

  // 1️⃣ Wait & extract TEMP ID
  const swalContainer = await driver.wait(
    until.elementLocated(By.css("div.swal2-html-container")),
    15000
  );

  await driver.wait(async () => {
    const text = await swalContainer.getText();
    return /TEMP\s*\d+/i.test(text);
  }, 10000, "TEMP ID not found in popup");

  const swalText = await swalContainer.getText();
  const match = swalText.match(/TEMP\s*\d+/i);

  if (!match) {
    throw new Error("TEMP ID not found in success popup");
  }

  tempId = match[0].replace(/\s+/g, "");
  console.log("Captured TEMP ID:", tempId);

  // 2️⃣ Click OK on success popup
  const okBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
    10000
  );
  await okBtn.click();

  // 3️⃣ Go to Login page
  await driver.get("http://68.233.110.246/bnrc_stg/login");
  await driver.wait(until.elementLocated(By.css("img[alt='BNRC Logo']")), 20000);

  // 4️⃣ Select Temporary user type
  const userType = await driver.wait(
    until.elementLocated(By.css(".ng-select-container")),
    15000
  );
  await userType.click();

  const tempOption = await driver.wait(
    until.elementLocated(By.xpath("//span[contains(text(),'Temporary')]")),
    15000
  );
  await tempOption.click();

  // 5️⃣ Login with default password
  await driver.findElement(By.css("input[placeholder='Enter Temporary ID']")).sendKeys(tempId);
  await driver.findElement(By.css("input[placeholder='Enter your password']")).sendKeys("123456");
  await driver.findElement(By.css("input[placeholder='Enter Captcha']")).sendKeys("1");

  await driver.findElement(By.xpath("//button[normalize-space()='Login']")).click();

  // 6️⃣ Reset password
  await driver.wait(
    until.elementLocated(By.css("input[formcontrolname='newPassword']")),
    15000
  );

  await driver.findElement(By.css("input[formcontrolname='newPassword']")).sendKeys("Av@12345");
  await driver.findElement(By.css("input[formcontrolname='confirmPassword']")).sendKeys("Av@12345");
  await driver.findElement(By.css("button[type='submit']")).click();

  const resetOk = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
    10000
  );
  await resetOk.click();
  console.log("Password reset successful");

  // 7️⃣ Re-login with new password
  await driver.get("http://68.233.110.246/bnrc_stg/login");

  await fillField("input[formcontrolname='userid']", tempId);
  await fillField("input[formcontrolname='password']", "Av@12345");
  await fillField("input[formcontrolname='captcha']", "1");

  await driver.findElement(By.css("button[type='submit']")).click();
  console.log("Re-login successful");

  // 8️⃣ Navigate to Foreign Verification
  const eApp = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
    20000
  );
  await driver.actions({ bridge: true }).move({ origin: eApp }).perform();

  const foreignLink = await driver.wait(
    until.elementLocated(By.css("a[href='/bnrc_stg/Website/foreign-verification']")),
    10000
  );
  await foreignLink.click();

  // 9️⃣ Click Make Payment
  const paymentBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'Make Payment')]")),
    10000
  );
  await paymentBtn.click();

  console.log("Payment initiated for TEMP ID:", tempId);

  return tempId;
}

);
    
});    
