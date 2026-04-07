const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Select } = require('selenium-webdriver/lib/select');
const chromedriver = require('chromedriver'); // ✅ Use NPM chromedriver

describe('BNRC Login Automation', function () {
    this.timeout(90000); // Increase timeout for browser actions
    let driver;

    before(async function () {
        this.timeout(30000); // Timeout for driver creation
        try {
            // Path to your Chrome binary
            const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const options = new chrome.Options();
            options.setChromeBinaryPath(chromeBinaryPath);
            options.addArguments('--ignore-certificate-errors');
            options.addArguments('--disable-web-security');
            options.addArguments('--allow-running-insecure-content');

            // options.addArguments('--headless'); // Uncomment to run headless

            // Use chromedriver from NPM
            const service = new chrome.ServiceBuilder(chromedriver.path);

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .setChromeService(service)
                .build();

            console.log('✅ Chrome WebDriver started successfully.');
        } catch (err) {
            console.error('❌ Failed to initialize Chrome WebDriver:', err);
            throw err;
        }
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it('should login to BNRC', async function () {
        console.log('Starting test: should login to BNRC');

        // Navigate to staging site
        await driver.get('http://68.233.110.246/bnrc_stg/login');

        // Select role
        await driver.wait(until.elementLocated(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/div/ng-select/div/div/div[2]')), 10000);
        await driver.findElement(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/div/ng-select/div/div/div[2]')).click();

        await driver.wait(until.elementLocated(By.id('a201071625dc-2')), 10000);
        await driver.findElement(By.id('a201071625dc-2')).click();

        // Enter credentials
        await driver.wait(until.elementLocated(By.id('new-password')), 10000);
        await driver.findElement(By.id('userId')).sendKeys('DIRE_8452');
        await driver.findElement(By.id('new-password')).sendKeys('123456');

        // Show password
        await driver.findElement(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/div[3]/i')).click();

        // Enter captcha (for testing, fixed value "1")
        await driver.wait(until.elementLocated(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/div[4]/div/div/input')), 10000);
        await driver.findElement(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/div[4]/div/div/input')).sendKeys('1');

        // Click login
        await driver.findElement(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/button/i')).click();

        // Handle modal confirmation
        await driver.wait(until.elementLocated(By.xpath('/html/body/div/div/div[6]/button')), 10000);
        await driver.findElement(By.xpath('/html/body/div/div/div[6]/button')).click();

        // Final login confirm
        await driver.wait(until.elementLocated(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/button')), 10000);
        await driver.findElement(By.xpath('/html/body/app-root/app-login-landing/div/div[2]/div/div[2]/app-login/div/div/div/form/button')).click();

        console.log('✅ Test finished: Logged in to BNRC');
    });
});
