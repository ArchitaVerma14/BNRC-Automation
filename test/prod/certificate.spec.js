const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const chromedriver = require('chromedriver');
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
        let c = 0;
        for (let i = num.length - 1; i >= 0; i--) {
            c = Verhoeff.d[c][Verhoeff.p[(num.length - i) % 8][parseInt(num[i], 10)]];
        }
        return Verhoeff.inv[c];
    }
};


// Scrolls into view, waits for visibility & enabled, then sends keys
async function fillField(driver, selector, value) {
    const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", elem);
    await driver.wait(until.elementIsVisible(elem), 10000);
    await driver.wait(until.elementIsEnabled(elem), 10000);
    await elem.clear();
    await elem.sendKeys(value);
    await driver.sleep(500);
}

// Scrolls into view and selects an option from dropdown
async function selectDropdown(driver, selector, value) {
    const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", elem);
    await driver.wait(until.elementIsVisible(elem), 10000);
    await elem.click(); // open dropdown

    const options = await elem.findElements(By.css("option"));
    for (let opt of options) {
        const text = (await opt.getText()).trim();
        if (text === value) {
            await opt.click();
            return;
        }
    }
    throw new Error(`Option "${value}" not found in dropdown ${selector}`);
}

// Safe click: scrolls into view and clicks element (works even if normal click fails)
async function safeClick(driver, element) {
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    await driver.wait(until.elementIsVisible(element), 5000);
    await driver.wait(until.elementIsEnabled(element), 5000);
    try {
        await element.click();
    } catch (e) {
        await driver.executeScript("arguments[0].click();", element);
    }
}


describe('Certificate Verification Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
            const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const options = new chrome.Options();
            options.setChromeBinaryPath(chromeBinaryPath);
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--disable-web-security');
            options.addArguments('--start-maximized');
            options.addArguments('--allow-running-insecure-content');
            // options.addArguments('--headless'); // Uncomment to run in headless mode

            const service = new chrome.ServiceBuilder(require('chromedriver').path);
            driver = await new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(service).build();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should register a Transfer Registration with sample data', async function () {
        await driver.get('https://bnrc2.bihar.gov.in/home');

        // Click initial SweetAlert "OK"
      //  const okButton = await driver.wait(until.elementLocated(By.css("button.swal2-confirm.btn.btn-danger")), 10000);
        //await safeClick(driver, okButton);
        // Try to click initial SweetAlert "OK" if it exists
        const okButtons = await driver.findElements(By.css("button.swal2-confirm.btn.btn-danger"));
        if (okButtons.length > 0) {
            await safeClick(driver, okButtons[0]);
        }

        // Hover on "E-Application" dropdown
        const eAppDropdown = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
            10000
        );
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: eAppDropdown }).perform();


        // Hover on "E-Application" dropdown
       /* const eAppDropdown = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
 10000);
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: eAppDropdown }).perform();*/

        // 5. Wait for and click the "Certificate Verification" option
        const certOption = await driver.wait(
            until.elementLocated(By.xpath('//a[contains(text(), " Certificate Verification ")]')),
            10000
        );
        await driver.wait(until.elementIsVisible(certOption), 5000);
        await certOption.click();

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
            await driver.executeScript("arguments[0].scrollIntoView(true);", elem);

            // Click the dropdown first to trigger loading
            await elem.click();

            // Wait until at least 2 options exist (default + real one)
            await driver.wait(async () => {
                const options = await elem.findElements(By.css("option"));
                return options.length > 1;
            }, 10000, "Dropdown options did not load");

            // Now select
            const options = await elem.findElements(By.css("option"));
            let available = [];
            for (let opt of options) {
                const text = (await opt.getText()).trim();

                // normalize curly vs straight apostrophe for comparison
                const normalizedText = text.replace(/’/g, "'").trim();
                const normalizedValue = value.replace(/’/g, "'").trim();

                available.push(text);
                if (normalizedText === normalizedValue) {
                    await opt.click();
                    return;
                }
            }
            throw new Error(`Option "${value}" not found in dropdown ${selector}. Available: ${available.join(", ")}`);
        }


        // 4. Fill out the registration form with random data
      //  await fillField("input[formcontrolname='registrationNumber']", 'REG' + Math.floor(Math.random() * 100000));
      const applicantName = faker.name.findName();   
      const courseDropdown = await driver.wait(
        until.elementLocated(By.css('select[formcontrolname="course"]')),
        10000
        );
        await driver.wait(until.elementIsVisible(courseDropdown), 5000);

        // Click the dropdown (optional)
        await courseDropdown.click();

        // Select "ANM" option by value
        const anmOption = await driver.findElement(By.css('select[formcontrolname="course"] option[value="2"]'));
        await anmOption.click();      

        await fillField("input[formcontrolname='applicantName']", applicantName);    
        await fillField("input[formcontrolname='fatherName']", faker.name.findName());
        //await fillField("input[formcontrolname='dob']", '1990-01-01');
        // Open DOB date picker
        const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        // Select year (example flow: open 2009, then click 2004)
        const year2025 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            5000
        );
        await year2025.click();

        let yearFound = false;

        while (!yearFound) {
             const years = await driver.findElements(By.xpath("//span[text()='2003']"));
            if (years.length > 0) {
                await years[0].click();   // Click 2003 directly
                yearFound = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(800);  // small delay so DOM updates
            }
        }

       // const year2003 = await driver.wait(
         //   until.elementLocated(By.xpath("//span[contains(text(),'2003')]")),
           // 5000
        
      //  await year2003.click();
        //await driver.sleep(3000);

        // Select month (example: June)
        const monthJune = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='June']")),
            5000
        );
        await monthJune.click();
        await driver.sleep(3000);

        // Select day (example: 14)
        const day14 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='14']")),
            5000
        );
        await day14.click();
        await driver.sleep(1000);

        // Generate email starting with lowercase letter
        const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
        await fillField("input[formcontrolname='email']", email);

        await fillField("input[formcontrolname='mobileNumber']", faker.phone.phoneNumber('9#########'));
        await selectDropdown("select[formcontrolname='state']", 'Bihar');
        await selectDropdown("select[formcontrolname='category']", 'Unreserved (GEN/UR)');
        await selectDropdown("select[formcontrolname='district']", 'GAYA');
        await selectDropdown("select[formcontrolname='gender']", 'Female');
        await fillField("input[formcontrolname='aadharName']", applicantName);

        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();
        // Directly select 2003 (if year grid appears immediately)
        const year2003Elem = await driver.wait(until.elementLocated(By.xpath("//*[text()='2003']")),5000);
        await driver.executeScript("arguments[0].click();", year2003Elem);
        const aadhaarSeed = faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString();
        const aadhaarChecksum = Verhoeff.generate(aadhaarSeed);
        const aadhaarNumber = aadhaarSeed + aadhaarChecksum;
        await fillField("input[formcontrolname='aadharNumber']", aadhaarNumber);

        //document
        const fileInput = await driver.wait(
            until.elementLocated(By.css('input[name="organizationLetter"]')),
            10000
        );

        // Make sure the element is visible
        await driver.wait(until.elementIsVisible(fileInput), 5000);

        // Provide the full path to your PDF file
        const filePath = path.resolve("C:\\Users\\Harsh\\Downloads\\Digital CV.pdf");

        // Attach the file
        await fileInput.sendKeys(filePath);
        
        await fillField("input[formcontrolname='agencyName']", 'agencyagency');
        //document
        const uploadInput = await driver.wait(
            until.elementLocated(By.css('input[name="uploadCertificate"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(uploadInput), 5000);

        // Provide the full path to your PDF file
        const certificatePath = path.resolve("C:\\Users\\Harsh\\Downloads\\Digital CV.pdf");

        // Attach the file
        await uploadInput.sendKeys(certificatePath);
       
        await fillField("input[formcontrolname='captcha']", '1');

        // Agree to Aadhaar checkbox (click the actual checkbox, not label)
        const aadhaarCheckboxInput = await driver.findElement(By.css("input[type='checkbox'][id='flexCheckDefault']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", aadhaarCheckboxInput);
        if (!(await aadhaarCheckboxInput.isSelected())) {
            await aadhaarCheckboxInput.click();
        }
        await driver.sleep(3000);

        // 5. Submit the form

        const submitBtn = await driver.wait(
            until.elementLocated(By.css("button[type='submit'].btn-success")),
            10000
        );
        await driver.wait(until.elementIsVisible(submitBtn), 5000);
        await driver.wait(until.elementIsEnabled(submitBtn), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);

        console.log("Clicking submit button...");
        await submitBtn.click();

       // First SweetAlert confirmation: "Yes, save it!"
let yesBtn;
try {
    yesBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Yes, Submit it!')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(yesBtn), 5000);
    await driver.executeScript("arguments[0].click();", yesBtn);
    console.log("Clicked 'Yes, Submit it!'");
} catch (e) {
    console.error("'Yes, Submit it!' button not found:", e);
}
await driver.sleep(7000); 
// Wait for success message and extract TEMP ID
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
    //console.log("Popup text:", swalText);

    const tempIdMatch = swalText.match(/TEMP\d+/);  

    if (tempIdMatch) {
        tempId = tempIdMatch[0];  // whole match, e.g., TEMP12345
    }
    //tempId = tempIdMatch ? tempIdMatch[0].replace(/\s+/g, "") : "Not found";
    console.log(" Form submitted successfully. TEMP ID:", tempId);
     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const successPath = path.resolve(`C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\certification_verification_success_${timestamp}.png`);
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync(successPath, screenshot, 'base64');

} catch (e) {
   // console.error("No TEMP ID popup found:", e);
    console.error("❌ Test Failed:", e.message);

        // Take screenshot
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const failurePath = path.resolve(`C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\certification_verification_failure_${timestamp}.png`);
        const screenshot = await driver.takeScreenshot();
       // const screenshotPath = path.resolve("failure_screenshot.png");
        require("fs").writeFileSync(failurePath, screenshot, "base64");

        // Call your email sender (PowerShell or Node)
  //      await sendEmail("FAIL", e.message, failurePath);

        // Optional: mark test as failed
        throw e;
}

// Final SweetAlert "OK" button

let okBtn;
try {
    okBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(okBtn), 5000);
    await driver.sleep(5000);
    await driver.executeScript("arguments[0].click();", okBtn);
    console.log("Clicked 'OK' to close popup.");
    } catch (e) {
        console.error("'OK' button not found:", e);
    }

    await driver.sleep(3000); // Let popup close before continuing

// You can now reuse `tempId` later if needed
    });
});    
    