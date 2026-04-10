const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const chromedriver = require('chromedriver');
const faker = require('faker');

// ---------------- Helper functions ----------------

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

// ---------------- Test Script ----------------
describe('Transfer Registration Automation', function () {
    this.timeout(180000);
    let driver;

    before(async function () {
        const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
        const options = new chrome.Options();
        options.setChromeBinaryPath(chromeBinaryPath);
        options.addArguments('--ignore-certificate-errors');
        options.addArguments('--disable-web-security');
        options.addArguments('--start-maximized');
        options.addArguments('--allow-running-insecure-content');

        const service = new chrome.ServiceBuilder(chromedriver.path);
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

        // Hover on "E-Application" dropdown
        const eAppDropdown = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
 10000);
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: eAppDropdown }).perform();

        // Click "Certificate Verification" option
        const certOption = await driver.wait(
            until.elementLocated(By.xpath('//a[contains(text(), " Transfer (Moving into Bihar) ")]')),
            10000
        );
        await driver.wait(until.elementIsVisible(certOption), 5000);
        await certOption.click();

        // Fill registration form
        await selectDropdown(driver, "select[formcontrolname='courseId']", 'ANM');
        await fillField(driver, "input[formcontrolname='nameOfApplicant']", faker.name.findName());
        await fillField(driver, "input[formcontrolname='fatherName']", faker.name.findName());

        // DOB selection
        const dobYear = faker.datatype.number({ min: 1980, max: 2000 });
        const dob = new Date(dobYear, faker.datatype.number({min: 0, max: 11}), faker.datatype.number({min: 1, max: 28}));
        const dobMonth = dob.toLocaleString('default', { month: 'long' });
        const dobDay = dob.getDate();

        const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        const yearDropdown = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
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
        await safeClick(driver, monthElement);

        const dayElement = await driver.wait(
            until.elementLocated(By.xpath(`//span[text()='${dobDay}']`)),
            5000
        );
        await safeClick(driver, dayElement);


        await fillField(driver, "input[formcontrolname='emailId']", faker.internet.email());
        await selectDropdown(driver, "select[formcontrolname='stateId']", 'Bihar');
        await driver.sleep(2000);
        await selectDropdown(driver, "select[formcontrolname='districtId']", 'GAYA');
        await selectDropdown(driver, "select[formcontrolname='casteCategory']", 'Unreserved (GEN/UR)');
        await fillField(driver, "input[formcontrolname='pinCode']", faker.address.zipCode('######'));
        await fillField(driver, "textarea[formcontrolname='address']", faker.address.streetAddress());
        await selectDropdown(driver, "select[formcontrolname='educationId']", 'Intermediate');

        const yearInput = await driver.findElement(By.css("input[formcontrolname='passedYear']"));
        await safeClick(driver, yearInput);
        let year2020 = false;
        while (!year2020) {
            const yearElems = await driver.findElements(By.xpath("//span[text()='2020']"));
            if (yearElems.length > 0) {
                await safeClick(driver, yearElems[0]);
                year2020 = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await safeClick(driver, prevButton);
                await driver.sleep(500);
            }
        }

        await fillField(driver, "input[formcontrolname='boardName']", 'CBSE');
        await fillField(driver, "input[formcontrolname='securedMarks']", '90');
        const councilDropdown = await driver.findElement(By.css("select[formcontrolname='councilSate']"));
        await councilDropdown.sendKeys("Bihar");
        await fillField(driver, "input[formcontrolname='currentRegistrationCouncil']", faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString());

        // Issue Date
        const issueInput = await driver.findElement(By.css("input[formcontrolname='issueDate']"));
        await issueInput.click();
        const Year2025 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            5000
        );
        await Year2025.click();
        const year2018 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='2018']")),
            5000
        );
        await safeClick(driver, year2018);
        const monthMay = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='May']")),
            5000
        );
        await safeClick(driver, monthMay);
        const day12 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='12']")),
            5000
        );
        await safeClick(driver, day12);

        // Valid Till Date
        const validInput = await driver.findElement(By.css("input[formcontrolname='validTillDate']"));
        await safeClick(driver, validInput);
        const day18 = await driver.findElement(By.xpath("//span[text()='18']"),5000);
        await safeClick(driver, day18);

        // File uploads
        const filePaths = Array(8).fill("C:\\Users\\Harsh\\Downloads\\Digital CV.pdf");
        const uploadInputs = await driver.wait(until.elementsLocated(By.css("input[type='file'][accept='application/pdf']")),
 10000);
        for (let i = 0; i < filePaths.length; i++) {
            await driver.executeScript("arguments[0].style.display='block';", uploadInputs[i]);
            await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", uploadInputs[i]);
            await uploadInputs[i].sendKeys(path.resolve(filePaths[i]));
            await driver.sleep(300);
        }

        // Radio button
        const radioButton = await driver.findElement(By.css("input[type='radio'][formcontrolname='incCompliant'][value='2']"));
        await safeClick(driver, radioButton);

        await fillField(driver, "input[formcontrolname='organizationPhoneNo']", faker.phone.phoneNumber('0#########'));
        await fillField(driver, "input[formcontrolname='organizationEmailId']", faker.internet.email());
        await fillField(driver, "input[formcontrolname='mobNo']", faker.phone.phoneNumber('9#########'));
        await driver.findElement(By.css("input[formcontrolname='mobNo']")).sendKeys(Key.TAB);

        // Send OTP
        const sendOtpButton = await driver.findElement(By.xpath("//button[contains(text(),'Send OTP')]" ));
        await safeClick(driver, sendOtpButton);

        const okButtonAfterSend = await driver.wait(until.elementLocated(By.xpath("//button[text()='OK']")),
 10000);
        await safeClick(driver, okButtonAfterSend);

        const verifyOtpButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Verify OTP']")),
 10000);
        await safeClick(driver, verifyOtpButton);

        await fillField(driver, "input[formcontrolname='captcha']", '1');

        // Aadhaar checkbox
        const aadhaarCheckboxInput = await driver.findElement(By.css("input[type='checkbox'][id='flexCheckDefault']"));
        if (!(await aadhaarCheckboxInput.isSelected())) await safeClick(driver, aadhaarCheckboxInput);

        // Submit
        const submitBtn = await driver.findElement(By.css("button[type='submit'].btn-success"));
        await safeClick(driver, submitBtn);

        // Confirmation "Yes, save it!"
        const yesBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Yes, save it!')]")),
 3000);
        await driver.sleep(5000);
        await safeClick(driver, yesBtn);

        // TEMP ID
    let tempId = "Not found";
    try {
        // Wait for the swal container to be present
        await driver.wait(until.elementLocated(By.css("div.swal2-html-container")), 10000);

        // Wait for the text with TEMP ID to appear, handles dynamism
        await driver.wait(async () => {
            try {
                const elem = await driver.findElement(By.css("div.swal2-html-container"));
                const text = await elem.getText();
                return /TEMPID\s*:\s*-\s*TEMP\d+/.test(text);
            } catch (e) {
                return false; // Stale element or not found, retry
            }
        }, 5000, "TEMP ID not found in popup");

        const swalContainer = await driver.findElement(By.css("div.swal2-html-container"));
        const swalText = await swalContainer.getText();
        const tempIdMatch = swalText.match(/TEMPID\s*:\s*-\s*(TEMP\d+)/);

        if (tempIdMatch) {
            tempId = tempIdMatch[1]; // Assign to the outer tempId
            console.log("Captured TEMP ID:", tempId);
        } else {
            console.log("TEMP ID not found in popup text:", swalText);
        }
    } catch (e) {
        console.error("No TEMP ID popup found:", e);
    }

        // Final OK
        const okBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),20000);
        await driver.takeScreenshot().then(function(image) {
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\transfer_registration_success.png', image, 'base64');
    });

        await safeClick(driver, okBtn);
        await driver.sleep(3000);
    });
});
