const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { Select } = require('selenium-webdriver/lib/select');
const chromedriver = require('chromedriver');

describe('Foreign Verification Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        try {
            const options = new chrome.Options();
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--disable-web-security');
            options.addArguments('--start-maximized');
            options.addArguments('--allow-running-insecure-content');
            // options.addArguments('--headless'); // Uncomment to run in headless mode

            const service = new chrome.ServiceBuilder(chromedriver.path);

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

        // 2. Wait for the "E-Application" dropdown
        const eAppDropdown = await driver.wait(
            until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
            10000
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
        until.elementLocated(By.css('select[formcontrolname="courseId"]')),
        10000
        );
        await driver.wait(until.elementIsVisible(courseDropdown), 5000);

        // Click the dropdown (optional)
        await courseDropdown.click();

        // Select "ANM" option by value
        const anmOption = await driver.findElement(By.css('select[formcontrolname="courseId"] option[value="2"]'));
        await anmOption.click();      

        await fillField("input[formcontrolname='applicantName']", 'Nitesh Sharma');
        await selectDropdown("select[formcontrolname='genderId']", 'Male');
        await fillField("input[formcontrolname='fatherName']", 'Kunal Sharma');
        //await fillField("input[formcontrolname='dob']", '1990-01-01');
        // Open DOB date picker
    const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        // Select year (example flow: open 2009, then click 2004)
        const year2025 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2009')]")),
            5000
        );
        await year2025.click();

        let yearFound = false;

        while (!yearFound) {
             const years = await driver.findElements(By.xpath("//span[text()='2003']"));
            if (years.length > 0) {
                await driver.executeScript("arguments[0].click();", years[0]);  // Click 2003 directly
                yearFound = true;
            } else {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
                await driver.sleep(500);  // small delay so DOM updates
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
        await fillField("input[formcontrolname='mobNo']", '8892693355');
        await selectDropdown("select[formcontrolname='stateId']", 'Bihar');
        await selectDropdown("select[formcontrolname='districtId']", 'GAYA');
        await selectDropdown("select[formcontrolname='categoryId']", 'Unreserved (GEN/UR)');
        await fillField("input[formcontrolname='aadhaarName']", 'Nitesh Sharma');
        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();

        let yearSelected = false;

        while (!yearSelected) {
            // Try to locate the year 2003 in the currently visible grid
            const years = await driver.findElements(By.xpath("//span[text()='2003']"));
            
            if (years.length > 0) {
                // Year 2003 found, click it
                await driver.executeScript("arguments[0].click();", years[0]);
                yearSelected = true; // ✅ set the flag
                console.log("Year 2003 selected.");
            } else {
                // Year 2003 not found, click the previous button
                const prevButtons = await driver.findElements(By.css("button.previous"));

                if (prevButtons.length > 0) {
                    // Use executeScript to ensure click works
                    await driver.executeScript("arguments[0].click();", prevButtons[0]);
                    await driver.sleep(500); // wait for DOM to update
                } else {
                    throw new Error("Previous button not found. Cannot navigate calendar.");
                }
            }
        }
        await fillField("input[formcontrolname='aadharNumber']", '715036049009');
        
        const qualificationDropdown = await driver.findElement(By.css("select[formcontrolname='educationId']"));
        await qualificationDropdown.click();
        const intermediateOption = await driver.findElement(By.xpath("//option[text()='Intermediate']"));
        await intermediateOption.click();

        // 3️⃣ Select Year 2020
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

        // 4️ Enter 'CBSE' as Board Name
        const boardInput = await driver.findElement(By.css("input[formcontrolname='boardName']"));
        await boardInput.clear();
        await boardInput.sendKeys("CBSE");

        // 5️ Enter Secured Marks '90'
        const marksInput = await driver.findElement(By.css("input[formcontrolname='securedMarks']"));
        await marksInput.clear();
        await marksInput.sendKeys("90");
        //document
        const path = require('path');

            // Locate the file input using id
            const uploadInput = await driver.wait(
                until.elementLocated(By.css('input#degreeCertificateDoc[type="file"]')),
                10000
            );
            await driver.wait(until.elementIsVisible(uploadInput), 5000);

            // Make sure input is visible (in case hidden by CSS)
            await driver.executeScript("arguments[0].style.display='block';", uploadInput);

            // Full path to your PDF file
            const certificatePath = path.resolve("C:\\Users\\Harsh\\Downloads\\Digital CV.pdf");

            // Upload the file
            await uploadInput.sendKeys(certificatePath);
            //console.log("File uploaded successfully.");

       
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
            until.elementLocated(By.xpath("//button[contains(text(),'Yes, save it!')]")), // match exact case
            10000
        );
        await driver.wait(until.elementIsVisible(yesBtn), 5000);

        // Click using JS to avoid element overlay issues
        await driver.executeScript("arguments[0].click();", yesBtn);
        console.log("Clicked 'Yes, save it!'");
    } catch (e) {
        console.error("'Yes, save it!' button not found:", e);
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
    await driver.takeScreenshot().then(function(image) {
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\foreign_registration_success.png', image, 'base64');
    });
    await driver.executeScript("arguments[0].click();", okBtn);
    console.log("Clicked 'OK' to close popup.");
} catch (e) {
    console.error("'OK' button not found:", e);
}

await driver.sleep(3000); // Let popup close before continuing

// You can now reuse `tempId` later if needed
    });
});    