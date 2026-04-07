const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const { Select } = require('selenium-webdriver/lib/select');
const chromedriver = require('chromedriver');
const faker = require('faker');


describe('Recognition of New Institute Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        try {
            const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const options = new chrome.Options();
            options.setChromeBinaryPath(chromeBinaryPath);
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

    it('should register a Recognition of New Institute with sample data', async function () {
        // 1. Open the website
        await driver.get('https://bnrc2.bihar.gov.in/home');
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
            until.elementLocated(By.xpath('//a[contains(text(), " Recognition of New Institute ")]')),
            10000
        );
        await driver.wait(until.elementIsVisible(certOption), 5000);
        await certOption.click();

        // Click on the body to close the dropdown
        await driver.findElement(By.css('body')).click();

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


        // 4. Fill out the registration form with random data
      //  await fillField(driver, "input[formcontrolname='registrationNumber']", 'REG' + Math.floor(Math.random() * 100000));
        await fillField(driver, "input[formcontrolname='emailId']", faker.internet.email());
        const panNumbers = [
            "BAJPC4350M","DAJPC4150P","XGZFE7225A","CTUGE1616I","PEVFV4506Y",
            "UWPCL6780T","LQDTD5444T","YUGFJ2046V","DDWCH0856B","NLXBC1905E","GFQJR7008X"
        ];

        // Pick a random PAN from the list
        const randomPAN = panNumbers[Math.floor(Math.random() * panNumbers.length)];
        await fillField(driver, "input[formcontrolname='panNumber']", randomPAN);
        console.log("Filled PAN:", randomPAN);
        await fillField(driver, "input[formcontrolname='authorizedName']", faker.name.findName());
        await fillField(driver, "input[formcontrolname='mobNo']", "7319722565");
        await driver.findElement(By.css("input[formcontrolname='mobNo']")).sendKeys(Key.TAB);
        const sendOtpButton = await driver.findElement(By.xpath("//button[contains(text(),'Send OTP')]" ));
        await safeClick(driver, sendOtpButton);
            
        const okButtonAfterSend = await driver.wait(until.elementLocated(By.xpath("//button[text()='OK']")), 10000);
        await safeClick(driver, okButtonAfterSend);
            
        const verifyOtpButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Verify OTP']")),10000);
        await safeClick(driver, verifyOtpButton);
        const okButtonAfterSend1 = await driver.wait(until.elementLocated(By.xpath("//button[text()='OK']")), 10000);
        await safeClick(driver, okButtonAfterSend1);

        
        await fillField(driver, "input[formcontrolname='captcha']", '1');

        // Wait for the "Register Now" button
        const registerBtn = await driver.wait(
            until.elementLocated(By.xpath("//button[normalize-space()='Register Now']")),
            10000
        );
        await driver.wait(until.elementIsVisible(registerBtn), 5000);
        await driver.wait(until.elementIsEnabled(registerBtn), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block:'center'});", registerBtn);

        console.log("Clicking 'Register Now' button...");
        await driver.wait(async () => {
            const overlays = await driver.findElements(By.css("div.swal2-container"));
            return overlays.length === 0;
        }, 10000);
        await registerBtn.click();
;

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
        require('fs').writeFileSync('C:\\Users\\Harsh\\Downloads\\new-course\\bnrc-tests\\BNRCscreenshots\\institute_recognition_success.png', image, 'base64');
    });
    await driver.executeScript("arguments[0].click();", okBtn);
    console.log("Clicked 'OK' to close popup.");
} catch (e) {
    console.error("'OK' button not found:", e);
}

await driver.sleep(3000);

    });
});    
