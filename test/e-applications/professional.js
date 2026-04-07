const { Builder, By, until, Key } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const faker = require('faker');
const { createDriver } = require('../.vscode/driver-helper');
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


describe('Professional Registration Automation', function () {
    this.timeout(900000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        this.timeout(30000); // Timeout for driver creation
        try {
            driver = await createDriver();
            console.log('✅ Chrome WebDriver started successfully.');
        } catch (err) {
            console.error('❌ Failed to initialize Chrome WebDriver:', err);
            throw err;
        }
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should register a professional with sample data', async function () {
        // 1. Open the website
        await driver.get('http://68.233.110.246/bnrc_stg/home');

        // 2. Wait for the "Professional Registration" button
        const regBtn = await driver.wait(
            until.elementLocated(By.css("a.btn.btn-danger")),
            15000
        );
        await driver.wait(until.elementIsVisible(regBtn), 10000);
        await driver.wait(until.elementIsEnabled(regBtn), 10000);

        // Wait for any popup to disappear
        try {
            await driver.wait(
                until.stalenessOf(
                    await driver.findElement(By.css('.swal2-container'))
                ),
                10000
            );
        } catch (e) {}

        // 3. Click the "Professional Registration" button
        await regBtn.click();

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
        async function pickDateSimple(driver, inputElement, year, month, day) {

    await inputElement.click();

    const periodBtn = await driver.wait(
        until.elementLocated(By.css(".mat-calendar-period-button")),
        5000
    );

    // Day → Month → Year
    await safeClick(driver, periodBtn);
    await safeClick(driver, periodBtn);

    await safeClick(
        driver,
        await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(@class,'mat-calendar-body-cell-content') and normalize-space()='${year}']`)
            ),
            5000
        )
    );

    await safeClick(
        driver,
        await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(@class,'mat-calendar-body-cell-content') and normalize-space()='${month}']`)
            ),
            5000
        )
    );

    await safeClick(
        driver,
        await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(@class,'mat-calendar-body-cell-content') and normalize-space()='${day}']`)
            ),
            5000
        )
    );
}
        async function fillQualificationBlock(driver, data) {

    const qualifications = await driver.findElements(By.css("select[formcontrolname='qualification']"));
    const institutions   = await driver.findElements(By.css("input[formcontrolname='institution']"));
    const locations      = await driver.findElements(By.css("input[formcontrolname='location']"));
    const startDates     = await driver.findElements(By.css("input[formcontrolname='startDate']"));
    const endDates       = await driver.findElements(By.css("input[formcontrolname='endDate']"));

    const index = qualifications.length - 1;

    await selectDropdownElement(qualifications[index], data.qualification);
    await institutions[index].sendKeys(data.institution);
    await locations[index].sendKeys(data.location);

    await pickDateSimple(driver, startDates[index], data.startYear, data.startMonth, data.startDay);
    await pickDateSimple(driver, endDates[index], data.endYear, data.endMonth, data.endDay);
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
        await fillField("input[formcontrolname='registrationNumber']", 'REG' + Math.floor(Math.random() * 100000));
        await fillField("input[formcontrolname='applicantName']", 'TestProfessional');
        //await fillField("input[formcontrolname='dob']", '1990-01-01');
        // Open DOB date picker
        const dobInput = await driver.findElement(By.css("input[formcontrolname='dob']"));
        await dobInput.click();

        // Select year (example flow: open 2009, then click 2004)
        const year2009 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2009')]")),
            5000
        );
        await year2009.click();

        const year2004 = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2004')]")),
            5000
        );
        await year2004.click();

        // Select month (example: May)
        const monthMay = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'May')]")),
            5000
        );
        await monthMay.click();

        // Select day (example: 14)
        const day14 = await driver.wait(
            until.elementLocated(By.xpath("//span[text()='14']")),
            5000
        );
        await day14.click();

        await driver.findElement(By.css('body')).click();

        await selectDropdown("select[formcontrolname='gender']", 'Male');
        await fillField("input[formcontrolname='email']", 'test' + Math.floor(Math.random() * 1000) + 'new@gmail.com');
        await fillField("input[formcontrolname='mobNo']", faker.phone.phoneNumber('9#########'));
        await fillField("input[formcontrolname='fatherName']", 'Father Test');
        await fillField("input[formcontrolname='nameAsPerAadhar']", 'TestProfessional');

        // Click the Birth Year input field (using placeholder 'YYYY')
        // Click Birth Year field
        await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();

        // Directly select 2004 (if year grid appears immediately)
        const year2004Elem = await driver.wait(until.elementLocated(By.xpath("//*[text()='2004']")),
        5000);
        await driver.executeScript("arguments[0].click();", year2004Elem);

        /*const birthYear = await driver.findElement(By.css("input[formcontrolname='birthYear']"));
        await dobInput.click(); 
        await fillField("input[formcontrolname='birthYear']", '2004');*/
        const aadhaarSeed = faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString();
        const aadhaarChecksum = Verhoeff.generate(aadhaarSeed);
        const aadhaarNumber = aadhaarSeed + aadhaarChecksum;
        await fillField("input[formcontrolname='aadharNumber']", aadhaarNumber);


     //   await fillField("input[formcontrolname='aadharNumber']", '766085117841');
        await selectDropdown("select[formcontrolname='stateId']", 'Bihar');
        await selectDropdown("select[formcontrolname='districtId']", 'GAYA JI');
        await selectDropdown("select[formcontrolname='categoryId']", 'Unreserved (GEN/UR)');
        it("should add all three qualifications", async function () {

    const qualificationData = [
        {
            qualification: "Matriculation",
            institution: "ABC School",
            location: "Patna",
            startYear: "2010",
            startMonth: "JAN",
            startDay: "01",
            endYear: "2012",
            endMonth: "MAY",
            endDay: "31"
        },
        {
            qualification: "Intermediate",
            institution: "XYZ College",
            location: "Patna",
            startYear: "2012",
            startMonth: "JUN",
            startDay: "01",
            endYear: "2014",
            endMonth: "MAY",
            endDay: "31"
        },
        {
            qualification: "ANM (Auxiliary Nurse Midwife)",
            institution: "Nurse University",
            location: "Patna",
            startYear: "2022",
            startMonth: "JAN",
            startDay: "13",
            endYear: "2023",
            endMonth: "MAY",
            endDay: "10"
        }
    ];

    // First qualification already present
    await fillQualificationBlock(driver, qualificationData[0]);

    // Add remaining qualifications
    for (let i = 1; i < qualificationData.length; i++) {
        await safeClick(
            driver,
            await driver.findElement(By.css("button.btn.btn-success"))
        );
        await fillQualificationBlock(driver, qualificationData[i]);
    }
});

//         await selectDropdown("select[formcontrolname='qualification']", "ANM (Auxiliary Nurse Midwife)");
//         await fillField("input[formcontrolname='institution']", 'Nurse University');
//         await fillField("input[formcontrolname='location']", 'Patna');
//         //await fillField("input[formcontrolname='startDate']", '01-01-2010');
//         // Click Start Date field
//         // Click Start Date field
// // Open the Start Date calendar
//         const startDateInput = await driver.findElement(By.css("input[formcontrolname='startDate']"));
//         await startDateInput.click();

//         // First select 2025
//         const year2025 = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
//             5000
//         );
//         await year2025.click();

//         // Then select 2022
//         const year2022 = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'2022')]")),
//             5000
//         );
//         await year2022.click();

//         // Select January
//         const january = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'January')]")),
//             5000
//         );
//         await january.click();

//         // Select day 13
//         const day13 = await driver.wait(
//             until.elementLocated(By.xpath("//span[normalize-space(text())='13']")),
//             5000
//         );
//         await day13.click();
//         //await fillField("input[formcontrolname='endDate']", '01-01-2014');
//         // Open the End Date calendar
//         const endDateInput = await driver.findElement(By.css("input[formcontrolname='endDate']"));
//         await endDateInput.click();

//         // First select 2025
//         const year2025_end = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
//             5000
//         );
//         await year2025_end.click();

//         // Then select 2023
//         const year2023_end = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'2023')]")),
//             5000
//         );
//         await year2023_end.click();

//         // Select February (example)
//         const may_end = await driver.wait(
//             until.elementLocated(By.xpath("//span[contains(text(),'May')]")),
//             5000
//         );
//         await may_end.click();
//         await driver.sleep(5000); 

//         // Select day 20 (example)
//         const day10_end = await driver.wait(
//             until.elementLocated(By.xpath("//span[normalize-space(text())='10']")),
//             5000
//         );
//         await driver.executeScript("arguments[0].click();", day10_end);

        await fillField("input[formcontrolname='specialization']", 'General');
        await fillField("input[formcontrolname='grade']", '80');
        await selectDropdown("select[formcontrolname='jobTitle']", 'Registered Nurse');
        await fillField("input[formcontrolname='companyName']", 'abcCompany');
        await fillField("input[formcontrolname='wrkLocation']", 'abc');
        //await fillField("input[formcontrolname='wrkStartDate']", '01-01-2015');
        // Open the Work Start Date calendar
        const wrkStartDateInput = await driver.findElement(By.css("input[formcontrolname='wrkStartDate']"));
        await wrkStartDateInput.click();
        await driver.sleep(500); 

        // First select 2025
        const year2025_wrk = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            3000
        );
        await year2025_wrk.click();
        await driver.sleep(3000); 

        // Then select 2022
        const year2024_wrk = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2024')]")),
            3000
        );
        await year2024_wrk.click();
        await driver.sleep(3000); 

        // Select March (example)
        const august_wrk = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'August')]")),
            3000
        );
        await august_wrk.click();
        await driver.sleep(3000); 

        // Select day 10 (example)
        const day15_wrk = await driver.wait(
            until.elementLocated(By.xpath("//span[normalize-space(text())='15']")),
            3000
        );
        await day15_wrk.click();
        await driver.sleep(3000); 

        //await fillField("input[formcontrolname='wrkEndDate']", '01-01-2020');
        // Open the Work End Date calendar
        const wrkEndDateInput = await driver.findElement(By.css("input[formcontrolname='wrkEndDate']"));
        await wrkEndDateInput.click();
        await driver.sleep(2000); 

        // First select 2025
       /* const year2025_wrkEnd = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'2025')]")),
            5000
        );
        await year2025_wrkEnd.click();

        // Then select 2022
        const year2022_wrkEnd = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'202')]")),
            5000
        );
        await year2022_wrkEnd.click();

        // Select April (example)
        const april_wrkEnd = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(text(),'Apr')]")),
            5000
        );
        await april_wrkEnd.click(); */

        // Select day 30 (example)
        const day4_wrkEnd = await driver.wait(
            until.elementLocated(By.xpath("//span[normalize-space(text())='4']")),
            2000
        );
        await day4_wrkEnd.click();

        // Checkbox "Are you working here?" (optional)
        // Uncomment if needed:
        // const workingCheckbox = await driver.findElement(By.css("input[type='checkbox']"));
        // await driver.executeScript("arguments[0].scrollIntoView(true);", workingCheckbox);
        // await workingCheckbox.click();
        // await driver.sleep(3000);

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
        until.elementLocated(By.xpath("//button[contains(text(),'Yes, save it!')]")),
        10000
    );
    await driver.wait(until.elementIsVisible(yesBtn), 5000);
    await driver.executeScript("arguments[0].click();", yesBtn);
    console.log("Clicked 'Yes, save it!'");
} catch (e) {
    console.error("'Yes, save it!' button not found:", e);
}

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
        const successPath = path.resolve(`C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\professional_registration_success_${timestamp}.png`);
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync(successPath, screenshot, 'base64');
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
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\professional_registration_success.png', image, 'base64');
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