const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { describe, it, before, after } = require('mocha');
const fs = require('fs');

describe('Login Flow Test with Custom Chrome Setup', function () {
  let driver;

  before(async function () {
    this.timeout(30000); // allow enough time for Chrome to start
    try {
      // ✅ Your working Chrome + ChromeDriver paths
      const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
      const chromedriverPath = 'D:/chromedriver-win64/chromedriver-win64/chromedriver.exe';

      if (!fs.existsSync(chromedriverPath)) {
        throw new Error(`ChromeDriver not found at path: ${chromedriverPath}`);
      }

      const options = new chrome.Options();
      options.setChromeBinaryPath(chromeBinaryPath);
      options.addArguments('--ignore-certificate-errors');
      options.addArguments('--disable-web-security');
      options.addArguments('--start-maximized');
      options.addArguments("--allow-running-insecure-content");
      options.addArguments("--ignore-certificate-errors");


      const service = new chrome.ServiceBuilder(chromedriverPath);

      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      console.log('✅ Chrome WebDriver started successfully.');
    } catch (err) {
      console.error('❌ Failed to initialize Chrome WebDriver:', err.message);
      throw err;
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('🛑 Chrome WebDriver closed.');
    }
  });

  it('should log in as Officer user', async function () {
    this.timeout(90000);
    try {
      await driver.get('https://68.233.110.246/bnrc_stg/home');
      console.log('🌐 Home page opened.');

      // Login button
      const loginBtn = await driver.wait(
        until.elementLocated(By.xpath("/html/body/app-root/app-home/div/app-website-header/header/div/div/div/div/a[2]")),
        10000
      );
      await loginBtn.click();

      // Switch tab
      const windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[windows.length - 1]);
      console.log('🔄 Switched to login tab.');

      // Dropdown
      const dropdown = await driver.wait(
        until.elementLocated(By.css('ng-select[formcontrolname="userType"]')),
        20000
      );
      await dropdown.click();

      const officerOption = await driver.wait(
        until.elementLocated(By.xpath("//div[@role='option' and contains(normalize-space(.), 'Officers')]")),
        10000
      );
      await officerOption.click();

      // User ID
      const userIdInput = await driver.findElement(By.id('userId'));
      await userIdInput.sendKeys('BNRC-000001');

      // Password
      const passwordInput = await driver.findElement(By.id('new-password'));
      await passwordInput.sendKeys('123456');

      // Captcha (fixed as 1)
      const captchaInput = await driver.findElement(By.css('input[formcontrolname="txtCaptchaVal"]'));
      await captchaInput.sendKeys('1');
      console.log('✅ Captcha entered.');

      // Submit
      const submitBtn = await driver.findElement(By.xpath("//button[contains(., 'Login')]"));
      await submitBtn.click();
      console.log('✅ Login button clicked.');

      // Confirm success
      await driver.sleep(3000);
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('Application/dashboard')) {
        console.log('🎉 Login successful, dashboard loaded.');
      } else {
        console.log('⚠️ Login might have failed, current URL:', currentUrl);
      }
    } catch (err) {
      console.error('❌ Error during login test:', err.message);
      throw err;
    }
  });
});