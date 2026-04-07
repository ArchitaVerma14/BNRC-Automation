const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { Select } = require('selenium-webdriver/lib/select');

describe('Certificate Verification Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        try {
            const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const options = new chrome.Options();
            options.setChromeBinaryPath(chromeBinaryPath);
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--disable-web-security');
            options.addArguments('--allow-running-insecure-content');
            // options.addArguments('--headless'); // Uncomment to run in headless mode

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();
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

        await fillField("input[formcontrolname='applicantName']", 'DemodTest');
        await fillField("input[formcontrolname='fatherName']", 'Father Test');
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

        await fillField("input[formcontrolname='email']", 'test' + Math.floor(Math.random() * 1000) + 'new@gmail.com');
        await fillField("input[formcontrolname='mobileNumber']", '8176945550');
        await selectDropdown("select[formcontrolname='state']", 'Bihar');
        await selectDropdown("select[formcontrolname='category']", 'Unreserved (GEN/UR)');
        await selectDropdown("select[formcontrolname='district']", 'GAYA');
        await selectDropdown("select[formcontrolname='gender']", 'Female');
        await fillField("input[formcontrolname='aadharName']", 'DemodTest');
        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();
        // Directly select 2003 (if year grid appears immediately)
        const year2003Elem = await driver.wait(until.elementLocated(By.xpath("//*[text()='2003']")),5000);
        await driver.executeScript("arguments[0].click();", year2003Elem);
        await fillField("input[formcontrolname='aadharNumber']", '725449000022');
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