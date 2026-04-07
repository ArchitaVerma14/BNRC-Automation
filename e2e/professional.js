const { Builder, By, until } = require('selenium-webdriver');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const { createDriver } = require('../.vscode/driver-helper');


// ================================================
// CSV INITIALIZATION
// ================================================
const csvPath = "temp_ids_selenium.csv";
if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, "run_no,temp_id,timestamp\n");
}


// ================================================
// VERHOEFF FOR AADHAAR
// ================================================
const Verhoeff = {
    d: [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
        [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
        [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
        [9,8,7,6,5,4,3,2,1,0]],
    p: [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
        [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
        [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]],
    inv: [0,4,3,2,1,5,6,7,8,9],

    generate(num) {
        let c = 0;
        for (let i = num.length - 1; i >= 0; i--) {
            c = this.d[c][this.p[(num.length - i) % 8][parseInt(num[i])]];
        }
        return this.inv[c];
    }
};


// ================================================
// SELENIUM TEST
// ================================================
describe("BNRC – Generate 25 TEMP IDs", function () {
    this.timeout(999999);
    let driver;

    before(async () => {
        driver = await createDriver();
        console.log("Driver started");
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    it("should generate 25 TEMP IDs", async function () {

        for (let i = 1; i <= 25; i++) {

            console.log(`\n=============== RUN ${i} STARTED ===============`);

            // Load homepage
            await driver.get("https://bnrc2.bihar.gov.in/home");

            // Wait for button
            const regBtn = await driver.wait(
                until.elementLocated(By.css("a.btn.btn-danger")),
                15000
            );
            await regBtn.click();
            await driver.sleep(2000);


            // ---------- Helpers ----------
            async function fillField(selector, value) {
                const el = await driver.wait(until.elementLocated(By.css(selector)), 10000);
                await driver.wait(until.elementIsVisible(el), 5000);
                await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", el);
                await el.clear();
                await el.sendKeys(value);
                await driver.sleep(1000);
            }

            async function selectDropdown(selector, value) {
                const el = await driver.wait(until.elementLocated(By.css(selector)), 10000);
                await el.click();
                const opts = await el.findElements(By.css("option"));
                for (const op of opts) {
                    const text = (await op.getText()).trim();
                    if (text === value.trim()) {
                        await op.click();
                        return;
                    }
                }
            }


            // ---------- FORM FILL ----------
            await fillField("input[formcontrolname='registrationNumber']", "REG" + Date.now());
            await fillField("input[formcontrolname='applicantName']", "TestProfessional");


            // DOB Datepicker
            const dob = await driver.findElement(By.css("input[formcontrolname='dob']"));
            await dob.click();

            await driver.findElement(By.xpath("//span[contains(text(),'2009')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'2004')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'May')]")).click();
            await driver.findElement(By.xpath("//span[normalize-space()='14']")).click();
            await driver.sleep(500);


            await selectDropdown("select[formcontrolname='gender']", "Male");
            await fillField("input[formcontrolname='email']", `test${Date.now()}@gmail.com`);
            await fillField("input[formcontrolname='mobNo']", faker.phone.phoneNumber("9#########"));
            await fillField("input[formcontrolname='fatherName']", "Father Test");
            await fillField("input[formcontrolname='nameAsPerAadhar']", "TestProfessional");

            // Birth year
            await driver.findElement(By.xpath("//input[@placeholder='YYYY']")).click();
            await driver.findElement(By.xpath("//*[text()='2004']")).click();

            // Aadhaar
            const seed = faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString();
            const aadhaar = seed + Verhoeff.generate(seed);
            await fillField("input[formcontrolname='aadharNumber']", aadhaar);


            // Demography
            await selectDropdown("select[formcontrolname='stateId']", "Bihar");
            await selectDropdown("select[formcontrolname='districtId']", "GAYA");
            await selectDropdown("select[formcontrolname='categoryId']", "Unreserved (GEN/UR)");


            // Education
            await selectDropdown("select[formcontrolname='qualification']", "ANM (Auxiliary Nurse Midwife)");
            await fillField("input[formcontrolname='institution']", "Nurse University");
            await fillField("input[formcontrolname='location']", "Patna");

            // Start Date
            const start = await driver.findElement(By.css("input[formcontrolname='startDate']"));
            await start.click();
            await driver.findElement(By.xpath("//span[contains(text(),'2025')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'2022')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'January')]")).click();
            await driver.findElement(By.xpath("//span[normalize-space()='13']")).click();

            // End Date
            const end = await driver.findElement(By.css("input[formcontrolname='endDate']"));
            await end.click();
            await driver.findElement(By.xpath("//span[contains(text(),'2025')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'2022')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'May')]")).click();
            await driver.findElement(By.xpath("//span[normalize-space()='10']")).click();

            await fillField("input[formcontrolname='specialization']", "General");
            await fillField("input[formcontrolname='grade']", "80");

            // Work
            await selectDropdown("select[formcontrolname='jobTitle']", "Registered Nurse");
            await fillField("input[formcontrolname='companyName']", "abcCompany");
            await fillField("input[formcontrolname='wrkLocation']", "abc");

            const ws = await driver.findElement(By.css("input[formcontrolname='wrkStartDate']"));
            await ws.click();
            await driver.findElement(By.xpath("//span[contains(text(),'2025')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'2024')]")).click();
            await driver.findElement(By.xpath("//span[contains(text(),'August')]")).click();
            await driver.findElement(By.xpath("//span[normalize-space()='15']")).click();

            const we = await driver.findElement(By.css("input[formcontrolname='wrkEndDate']"));
            await we.click();
            await driver.findElement(By.xpath("//span[normalize-space()='4']")).click();


            // Captcha + Checkbox
            await fillField("input[formcontrolname='captcha']", "1");
            await driver.findElement(By.id("flexCheckDefault")).click();


            // ---------- SUBMIT ----------
            const submit = await driver.findElement(By.css("button[type='submit'].btn-success"));
            await submit.click();


            // YES SAVE IT
            try {
                const yesBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Yes, save it!')]")), 8000);
                await yesBtn.click();
            } catch {}


            // ---------- CAPTURE TEMP ID ----------
            let tempId = "NOT_FOUND";
            try {
                const popup = await driver.wait(until.elementLocated(By.css("div.swal2-html-container")), 15000);
                const text = await popup.getText();
                const match = text.match(/TEMP\d+/);
                if (match) tempId = match[0];
            } catch {}


            // Save screenshot
            const shotPath = `tempid_run_${i}_${tempId}.png`;
            fs.writeFileSync(shotPath, (await driver.takeScreenshot()), "base64");


            // Close popup
            try {
                const okBtn = await driver.findElement(By.xpath("//button[contains(text(),'OK')]"));
                await okBtn.click();
            } catch {}


            // ---------- SAVE IN CSV ----------
            const timestamp = new Date().toISOString();
            fs.appendFileSync(csvPath, `${i},${tempId},${timestamp}\n`);

            console.log(`RUN ${i} DONE → TEMP ID = ${tempId}`);
        }

    });

});
