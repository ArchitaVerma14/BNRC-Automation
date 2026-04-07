const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { describe, it, before, after } = require('mocha');
const chromedriver = require('chromedriver'); // Use NPM chromedriver

describe('Foreign Login Flow Test', function () {
  let driver;

  before(async function () {
    this.timeout(30000); // allow enough time for Chrome to start
    try {
      // Your working Chrome path
      const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

      const options = new chrome.Options();
      options.setChromeBinaryPath(chromeBinaryPath);
      options.addArguments('--ignore-certificate-errors');
      options.addArguments('--disable-web-security');
      options.addArguments('--start-maximized');
      options.addArguments('--allow-running-insecure-content');

      // Use chromedriver from NPM instead of hardcoded path
      const service = new chrome.ServiceBuilder(chromedriver.path);

      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      console.log('Chrome WebDriver started successfully.');
    } catch (err) {
      console.error('Failed to initialize Chrome WebDriver:', err.message);
      throw err;
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log('Chrome WebDriver closed.');
    }
  });

  it('should log in and proceed to payment', async function () {
    this.timeout(90000);
    try {
      await driver.get('https://68.233.110.246/bnrc_stg/home');
      console.log('Home page opened.');

      // Login button
      const loginBtn = await driver.wait(
        until.elementLocated(By.xpath("/html/body/app-root/app-home/div/app-website-header/header/div/div/div/div/a[2]")),
        10000
      );
      await loginBtn.click();

      // Switch tab
      const windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[windows.length - 1]);
      console.log('Switched to login tab.');

      // Dropdown
      const dropdown = await driver.wait(
        until.elementLocated(By.css('ng-select[formcontrolname="userType"]')),
        20000
      );
      await dropdown.click();

      const temporaryOption = await driver.wait(
        until.elementLocated(By.xpath("//div[@role='option' and contains(normalize-space(.), 'Temporary')]")),
        10000
      );
      await temporaryOption.click();

      // User ID
      const userIdInput = await driver.findElement(By.id('userId'));
      await userIdInput.sendKeys('TEMP50731');

      // Password
      const passwordInput = await driver.findElement(By.id('new-password'));
      await passwordInput.sendKeys('Av@12345');

      // Captcha (fixed as 1)
      const captchaInput = await driver.findElement(By.css('input[formcontrolname="txtCaptchaVal"]'));
      await captchaInput.sendKeys('1');
      console.log('Captcha entered.');

      // Submit
      const submitBtn = await driver.findElement(By.xpath("//button[contains(., 'Login')]"));
      await submitBtn.click();
      console.log('Login button clicked.');

      // Handle the "logged in another system" popup
      const yesButton = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Yes']")),
        10000,
        'Could not find the "Yes" button on the popup.'
      );
      await yesButton.click();
      console.log('Clicked "Yes" on the confirmation popup.');

      console.log(await driver.getCurrentUrl());

      // Confirm success
      await driver.wait(until.urlContains('Application/dashboard'), 15000);
      console.log('Login successful, dashboard loaded.');

      // Click on E-Application
      const eApplicationLink = await driver.wait(
        until.elementLocated(By.xpath("//a[contains(., 'E-Application')]")),
        10000
      );
      await eApplicationLink.click();
      console.log('Clicked on E-Application.');

      // Click on Foreign Application
      const foreignApplicationLink = await driver.wait(
        until.elementLocated(By.xpath("//a[contains(., 'Foreign Application')]")),
        10000
      );
      await foreignApplicationLink.click();
      console.log('Clicked on Foreign Application.');

      // Click on Proceed to Payment
      const proceedToPaymentBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Proceed to Payment')]")),
        10000
      );
      await proceedToPaymentBtn.click();
      console.log('Clicked on Proceed to Payment.');

      // Handle popups
      const okButton = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='OK']")),
        10000,
        'Could not find the "OK" button on the popup.'
      );
      await okButton.click();
      console.log('Clicked "OK" on the success popup.');

    } catch (err) {
      console.error('Error during the process:', err.message);
      throw err;
    }
  });
});