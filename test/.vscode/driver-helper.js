const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const chromedriver = require('chromedriver');

// Centralize your paths and options here
const CHROME_BINARY_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/**
 * Creates and configures a new Selenium WebDriver instance for Chrome.
 * @returns {Promise<WebDriver>} A promise that resolves to a WebDriver instance.
 */
async function createDriver() {
  const options = new chrome.Options();
  if (fs.existsSync(CHROME_BINARY_PATH)) {
    options.setChromeBinaryPath(CHROME_BINARY_PATH);
  } else {
    console.warn(`Chrome binary not found at ${CHROME_BINARY_PATH}, using default system installation.`);
  }

  options.addArguments(
    '--ignore-certificate-errors',
    '--disable-web-security',
    '--allow-running-insecure-content',
    '--start-maximized'
  );

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(service).build();
}

module.exports = { createDriver };