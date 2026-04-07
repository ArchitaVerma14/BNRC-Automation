const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { Select } = require('selenium-webdriver/lib/select');
const chromedriver = require('chromedriver');
// Scrolls into view, waits for visibility & enabled, then sends keys
async function fillField(selector, value) {
    const elem = await driver.wait(until.elementLocated(By.css(selector)), 15000);
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", elem);
    await driver.wait(until.elementIsVisible(elem), 10000);
    await driver.wait(until.elementIsEnabled(elem), 10000);
    await elem.clear();
    await elem.sendKeys(value);
    await driver.sleep(500); // small delay
}

// Scrolls into view and selects an option from dropdown
async function selectDropdown(selector, value) {
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
async function safeClick(element) {
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    await driver.wait(until.elementIsVisible(element), 5000);
    await driver.wait(until.elementIsEnabled(element), 5000);
    try {
        await element.click();
    } catch (e) {
        await driver.executeScript("arguments[0].click();", element);
    }
}


describe('Transfer Registration Automation', function () {
    this.timeout(180000); // Increase timeout for browser actions
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

    it('should register a Transfer Registration with sample data', async function () {
        // 1. Open the website
        await driver.get('http://68.233.110.246/bnrc_stg/home');
        // Wait for the SweetAlert2 "OK" button to appear and click it
        const okButton = await driver.wait(
            until.elementLocated(By.css("button.swal2-confirm.btn.btn-danger")),
            10000
        );
        await driver.wait(until.elementIsVisible(okButton), 5000);
        await okButton.click();


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
            until.elementLocated(By.css('a.dropdown-item[href="/bnrc_stg/Website/transferIntoBihar"]')),
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
        await driver.sleep(5000);

        await fillField("input[formcontrolname='nameOfApplicant']", 'Testtest');
        await fillField("input[formcontrolname='fatherName']", 'Father Test');

        //await selectDropdown("select[formcontrolname='genderId']", 'Male');
        
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

        await fillField("input[formcontrolname='emailId']", 'test' + Math.floor(Math.random() * 1000) + 'new@gmail.com');
        //await fillField("input[formcontrolname='mobNo']", '9276945550');
        await selectDropdown("select[formcontrolname='stateId']", 'Bihar');
        await selectDropdown("select[formcontrolname='districtId']", 'GAYA');
        await selectDropdown("select[formcontrolname='casteCategory']", 'Unreserved (GEN/UR)');
        await fillField("input[formcontrolname='pinCode']", '800002');
        await fillField("textarea[formcontrolname='address']", 'Ashok Nagar, gaya');
        //await fillField("input[formcontrolname='aadhaarName']", 'Testtest');
        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
       /* await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();

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
        }*/
        //await fillField("input[formcontrolname='aadharNumber']", '829410302183');
        
      /*  const qualificationDropdown = await driver.findElement(By.css("select[formcontrolname='educationId']"));
        await qualificationDropdown.click();
        const intermediateOption = await driver.findElement(By.xpath("//option[text()='Intermediate']"));
        await intermediateOption.click();*/
        const intermediateOption = await driver.findElement(By.xpath("//option[normalize-space(.)='Intermediate']"));
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

      /*  const councilDropdown = await driver.findElement(By.css("select[formcontrolname='councilSate']"));
        await councilDropdown.click();
        const biharOption = await driver.findElement(By.xpath("//option[text()='Bihar']"));
        await biharOption.click();*/
        const councilDropdown = await driver.findElement(By.css("select[formcontrolname='councilSate']"));
        await councilDropdown.sendKeys("Bihar");


        await fillField("input[formcontrolname='currentRegistrationCouncil']", '8885786353');

        const issueInput = await driver.findElement(By.css("input[formcontrolname='issueDate']"));
        await issueInput.click();

        // Select year (example flow: open 2009, then click 2004)
        const Year2025 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            5000
        );
        await Year2025.click();

        let yearfound = false;

        while (!yearfound) {
            try {
                const yearElement = await driver.wait(
                    until.elementLocated(By.xpath("//span[text()='2018']")),
                    1000
                );
                await driver.executeScript("arguments[0].click();", yearElement);
                yearfound = true;
            } catch (e) {
                const prevButton = await driver.findElement(By.css("button.previous"));
                await prevButton.click();
            }
        }
        const monthMay = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='May']")),
            5000
        );
        await monthMay.click();
        await driver.sleep(3000);

        // Select day (example: 14)
        const day12 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='12']")),
            5000
        );
        await day12.click();
        await driver.sleep(1000);
// Valid Till
        // Open calendar
        const validInput = await driver.findElement(By.css("input[formcontrolname='validTillDate']"));
        await validInput.click();

        // Select year 2025
        //const year_2025 = await driver.wait(
          //  until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            //5000
        //);
        //await year_2025.click();

        // Keep clicking next arrow until December is visible
        while (true) {
            try {
                const december = await driver.findElement(By.xpath("//button[@class='current ng-star-inserted']/span[text()='December']"));
                if (await december.isDisplayed()) {
                    break;  // December is visible, exit loop
                }
            } catch (e) {
                const nextArrow = await driver.findElement(By.css("button.next"));
                await nextArrow.click();
                await driver.sleep(500);  // wait for UI update
            }
        }        // Click December
                

        // Select day (example: 10)
        const day10 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='10']")),
            5000
        );
        await day10.click();


        //document
        const path = require('path');

        // List of file paths for 8 upload fields
        const filePaths = [
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
            "C:\\Users\\Harsh\\Downloads\\Digital CV.pdf",
        ];

        // Locate all file inputs (there should be 8)
        const uploadInputs = await driver.wait(
            until.elementsLocated(By.css("input[type='file'][accept='application/pdf']")),
            10000
        );

        console.log("Found upload fields:", uploadInputs.length);

        // Loop through each input and upload the file
        for (let i = 0; i < filePaths.length; i++) {
            const absPath = path.resolve(filePaths[i]);

            // Make input visible before sending file (in case hidden by CSS 'd-none')
            await driver.executeScript("arguments[0].style.display='block';", uploadInputs[i]);
            await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", uploadInputs[i]);

    // Wait a bit to ensure DOM update
            await driver.sleep(500);
            await uploadInputs[i].sendKeys(absPath);
            console.log(`Uploaded: ${absPath}`);
            await driver.sleep(300);
           // await driver.executeScript("window.scrollBy(0, 200);"); // scroll down 200px

}
            //console.log("File uploaded successfully.");
           const radioButton = await driver.findElement(By.css("input[type='radio'][formcontrolname='incCompliant'][value='2']"));
           await radioButton.click();
           await fillField("input[formcontrolname='organizationPhoneNo']", '0885786353');
           await fillField("input[formcontrolname='organizationEmailId']", 'jdfhjdf@gmail.com');
           await fillField("input[formcontrolname='mobNo']", '9276945553');
           const mobInput = await driver.findElement(By.css("input[formcontrolname='mobNo']"));
           await mobInput.sendKeys(Key.TAB); // moves focus out
           const sendOtpButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(text(),'Send OTP')]")),
                10000
            );

            
            // Scroll it into view
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", sendOtpButton);

            // Wait until visible & enabled
            await driver.wait(until.elementIsVisible(sendOtpButton), 5000);
            await driver.wait(until.elementIsEnabled(sendOtpButton), 5000);

            // Try normal click, fallback to JS click if intercepted
            try {
                await sendOtpButton.click();
            } catch (e) {
                await driver.executeScript("arguments[0].click();", sendOtpButton);
            }

           // Wait for the first "OK" button after sending OTP and click it
           const okButtonAfterSend = await driver.wait(
                until.elementLocated(By.xpath("//button[text()='OK']")),
                10000
            );
           await driver.wait(until.elementIsVisible(okButtonAfterSend), 5000);
           await okButtonAfterSend.click();

           // Wait for the OTP input field to be visible and enter a placeholder OTP
           const otpInput = await driver.wait(
                until.elementLocated(By.css("input[formcontrolname='otp']")),
                10000
           );
           await driver.wait(async () => {
                const value = await otpInput.getAttribute("value");
                return value && value.trim().length > 0; // ensure OTP is filled
            }, 10000);
           //await otpInput.sendKeys("123456"); // Placeholder OTP, replace if needed

           // Wait for the "Verify OTP" button to be clickable and click it
           const verifyOtpButton = await driver.wait(
                until.elementLocated(By.xpath("//button[normalize-space()='Verify OTP']")),
                10000
            );
           await driver.wait(until.elementIsVisible(verifyOtpButton), 5000);
           await verifyOtpButton.click();

           // Wait for the second "OK" button after verifying OTP and click it
           const okButtonAfterVerify = await driver.wait(
                until.elementLocated(By.xpath("//button[text()='OK']")),
                10000
            );
           await driver.wait(until.elementIsVisible(okButtonAfterVerify), 5000);
           await okButtonAfterVerify.click();

       
        await fillField("input[formcontrolname='captcha']", '1');

        // Agree to Aadhaar checkbox (click the actual checkbox, not label)
        const aadhaarCheckboxInput = await driver.findElement(By.css("input[type='checkbox'][id='flexCheckDefault']"));

        // Scroll into view
        await driver.executeScript("arguments[0].scrollIntoView(true);", aadhaarCheckboxInput);

        // Click only if not already selected
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
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\transfer_registration_success.png', image, 'base64');
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