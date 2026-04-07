import chrome from 'selenium-webdriver/chrome.js';
import { Builder, By, until, Key } from 'selenium-webdriver';
import chromedriver from 'chromedriver';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';
import { Select } from 'selenium-webdriver/lib/select.js';
import { generate } from 'verhoeff';

describe('Certificate Verification Automation', function () {
    this.timeout(120000); // Increase timeout for browser actions
    let driver;

    // Helper function to generate unique mobile number (10 digits, starting with 6-9)
    function generateUniqueMobileNumber() {
        const firstDigit = Math.floor(Math.random() * 4) + 6; // 6-9
        const restDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        return firstDigit + restDigits;
    }

    // Helper function to generate valid Aadhaar number with Verhoeff algorithm
    function generateValidAadhaarNumber() {
        // Generate first digit: 4-9 (never less than 4)
        const firstDigit = Math.floor(Math.random() * 6) + 4; // 4-9
        
        // Generate remaining 10 random digits
        let remainingDigits = '';
        for (let i = 0; i < 10; i++) {
            remainingDigits += Math.floor(Math.random() * 10);
        }
        
        // Combine to create 11-digit base
        const baseNumber = firstDigit + remainingDigits;
        
        // Calculate Verhoeff check digit
        const checkDigit = generate(baseNumber);
        
        // Return complete 12-digit Aadhaar number
        return baseNumber + checkDigit;
    }

    before(async function () {
        try {
            console.log("STEP A: Starting browser setup");

            const service = new chrome.ServiceBuilder(chromedriver.path);

            const options = new chrome.Options();
            options.addArguments('--start-maximized');
            options.addArguments('--headless=new');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');

            console.log("STEP B: Building driver...");

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .setChromeService(service)
                .build();

            console.log("STEP C: Driver launched successfully");

        } catch (err) {
            console.error('Error in before hook:', err);
            throw err;
        }
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should register a certificate verification with sample data', async function () {
        // 1. Open the website
        await driver.get('http://68.233.110.246/bnrc_stg/home');

        // 2. Wait for the "E-Application" dropdown
        const eAppDropdown = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
            10000
        );
        await driver.wait(until.elementIsVisible(eAppDropdown), 5000);

        // Hover over the element to show the dropdown
        const actions = driver.actions({ bridge: true });
        await actions.move({ origin: eAppDropdown }).perform();

        // 5. Wait for and click the "Certificate Verification" option
        const certOption = await driver.wait(
            until.elementLocated(By.css('a.dropdown-item[href="/bnrc_stg/Website/certificateVerification"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(certOption), 5000);
        await certOption.click();

        // Helper to interact with fields safely with improved reliability
        async function fillField(selector, value) {
            let retries = 3;
            while (retries > 0) {
                try {
                    const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
                    await driver.wait(until.elementIsVisible(elem), 10000);
                    await driver.wait(until.elementIsEnabled(elem), 10000);
                    await elem.clear();
                    await driver.sleep(300); // Stabilize after clear
                    await elem.sendKeys(value);
                    await driver.sleep(1500); // Reasonable delay for frontend processing
                    return;
                } catch (e) {
                    retries--;
                    if (retries === 0) throw e;
                    console.log(`fillField retry for ${selector} (${retries} left)`, e.message);
                    await driver.sleep(1000);
                }
            }
        }

        async function setFieldValueWithoutJump(selector, value) {
            await driver.executeScript(
                `const elem = document.querySelector(arguments[0]);
                 if (!elem) {
                     throw new Error('Element not found: ' + arguments[0]);
                 }
                 const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                 valueSetter.call(elem, arguments[1]);
                 elem.dispatchEvent(new Event('input', { bubbles: true }));
                 elem.dispatchEvent(new Event('change', { bubbles: true }));
                 elem.blur();`,
                selector,
                value
            );
            await driver.sleep(500);
        }

        async function scrollToSelector(selector) {
            const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", elem);
            await driver.sleep(500);

            return elem;
        }

        async function selectDropdown(selector, value) {
            let retries = 3;
            while (retries > 0) {
                try {
                    const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
                    await driver.wait(until.elementIsVisible(elem), 10000);

                    // Click the dropdown first to trigger loading
                    await elem.click();
                    await driver.sleep(500); // Let dropdown open

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
                        const normalizedText = text.replace(/'/g, "'").trim();
                        const normalizedValue = value.replace(/'/g, "'").trim();

                        available.push(text);
                        if (normalizedText === normalizedValue) {
                            await opt.click();
                            await driver.sleep(500); // Stabilize after selection
                            return;
                        }
                    }
                    throw new Error(`Option "${value}" not found in dropdown ${selector}. Available: ${available.join(", ")}`);
                } catch (e) {
                    retries--;
                    if (retries === 0) {
                        console.error(`Dropdown select failed after 3 retries for "${value}":`, e.message);
                        throw e;
                    }
                    console.log(`Dropdown select retry for "${value}" (${retries} left)`);
                    await driver.sleep(1000);
                }
            }
        }


        // 4. Fill out the registration form with random data
      //  await fillField("input[formcontrolname='registrationNumber']", 'REG' + Math.floor(Math.random() * 100000));
                await scrollToSelector('select[formcontrolname="course"]');
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

        await scrollToSelector("input[formcontrolname='applicantName']");
        await fillField("input[formcontrolname='applicantName']", 'DemodTest');
        await scrollToSelector("input[formcontrolname='fatherName']");
        await fillField("input[formcontrolname='fatherName']", 'Father Test');
        //await fillField("input[formcontrolname='dob']", '1990-01-01');
        // Open DOB date picker
    await scrollToSelector("input[formcontrolname='dob']");
    const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        // Select year (example flow: open 2009, then click 2004)
        const year2026 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2026')]")),
            5000
        );
        await year2026.click();

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
        const day20 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='20']")),
            5000
        );
        await day20.click();
        await driver.sleep(1000);

        await scrollToSelector("input[formcontrolname='email']");
        await fillField("input[formcontrolname='email']", 'test' + Math.floor(Math.random() * 1000) + 'new@gmail.com');
        // Generate unique mobile number every time
        const uniqueMobileNumber = generateUniqueMobileNumber();
        await setFieldValueWithoutJump("input[formcontrolname='mobileNumber']", uniqueMobileNumber);
        console.log("Generated unique mobile number:", uniqueMobileNumber);

        await scrollToSelector("select[formcontrolname='state']");
        await selectDropdown("select[formcontrolname='state']", 'Bihar');

        await scrollToSelector("select[formcontrolname='category']");
        await selectDropdown("select[formcontrolname='category']", 'Unreserved (GEN/UR)');

        await scrollToSelector("select[formcontrolname='district']");
        await selectDropdown("select[formcontrolname='district']", 'GAYA JI');

        await scrollToSelector("select[formcontrolname='gender']");
        await selectDropdown("select[formcontrolname='gender']", 'Female');

        await scrollToSelector("input[formcontrolname='aadharName']");
        await fillField("input[formcontrolname='aadharName']", 'DemodTest');
        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();
        // Directly select 2003 (if year grid appears immediately)
        const year2003Elem = await driver.wait(until.elementLocated(By.xpath("//*[text()='2003']")),5000);
        await driver.executeScript("arguments[0].click();", year2003Elem);
        
        // Generate valid Aadhaar number with Verhoeff algorithm
        const validAadhaarNumber = generateValidAadhaarNumber();
        await scrollToSelector("input[formcontrolname='aadharNumber']");
        await fillField("input[formcontrolname='aadharNumber']", validAadhaarNumber);
        console.log("Generated valid Aadhaar number:", validAadhaarNumber);
        //document
        await scrollToSelector("input[name='organizationLetter']");
        const fileInput = await driver.wait(
            until.elementLocated(By.css('input[name="organizationLetter"]')),
            10000
        );

        // Make sure the element is visible
        await driver.wait(until.elementIsVisible(fileInput), 5000);

        // Provide the full path to your PDF file
        const filePath = resolve("C:\\Users\\Archita Verma\\OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE\\Sample document.pdf");

        // Attach the file
        await fileInput.sendKeys(filePath);
        
        await scrollToSelector("input[formcontrolname='agencyName']");
        await fillField("input[formcontrolname='agencyName']", 'agencyagency');
        //document
        await scrollToSelector("input[name='uploadCertificate']");
        const uploadInput = await driver.wait(
            until.elementLocated(By.css('input[name="uploadCertificate"]')),
            10000
        );
        await driver.wait(until.elementIsVisible(uploadInput), 5000);

        // Provide the full path to your PDF file
        const certificatePath = resolve("C:\\Users\\Archita Verma\\OneDrive - PIRAMAL SWASTHYA MANAGEMENT AND RESEARCH INSTITUTE\\Sample document.pdf");

        // Attach the file
        await uploadInput.sendKeys(certificatePath);
       
        await scrollToSelector("input[formcontrolname='captcha']");
        await fillField("input[formcontrolname='captcha']", '1');

        // Agree to Aadhaar checkbox (click the actual checkbox, not label)
        await scrollToSelector("input[type='checkbox'][id='flexCheckDefault']");
        const aadhaarCheckboxInput = await driver.findElement(By.css("input[type='checkbox'][id='flexCheckDefault']"));
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

        await scrollToSelector("button[type='submit'].btn-success");

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
    const screenshotDir = resolve(__dirname, '../../BNRCscreenshots');
    if (!existsSync(screenshotDir)) {
        mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = join(screenshotDir, `temp-id-${tempId}.png`);
    await driver.takeScreenshot().then((image) => writeFileSync(screenshotPath, image, 'base64'));
    console.log('Saved TEMP ID screenshot to:', screenshotPath);
    //tempId = tempIdMatch ? tempIdMatch[0].replace(/\s+/g, "") : "Not found";
    console.log(" Form submitted successfully. TEMP ID:", tempId);
} catch (e) {
    console.error("No TEMP ID popup found:", e);
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
