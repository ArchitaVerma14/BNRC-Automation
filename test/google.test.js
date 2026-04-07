const { Builder, By, Key, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

(async function googleTest() {
  // The MCP tool will start the Selenium server.
  // By default, it runs on localhost:4444.
  const seleniumServer = 'http://localhost:4444/wd/hub';

  // Configure Chrome options
  const chromeOptions = new Options();
  // You can add arguments here, for example, to run in headless mode:
  // chromeOptions.addArguments('--headless');

  let driver;

  try {
    console.log('Connecting to Selenium server...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .usingServer(seleniumServer)
      .build();

    console.log('Navigating to Google...');
    await driver.get('https://www.google.com');

    console.log('Finding search box and typing...');
    await driver.findElement(By.name('q')).sendKeys('selenium webdriver', Key.RETURN);

    console.log('Waiting for title to change...');
    await driver.wait(until.titleIs('selenium webdriver - Google Search'), 5000);

    console.log('Test finished successfully!');

  } catch (error) {
    console.error('An error occurred during the test:', error);
  } finally {
    if (driver) {
      console.log('Closing the browser.');
      await driver.quit();
    }
  }
})();