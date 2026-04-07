import { By, until } from 'selenium-webdriver';
import { ModelContextProtocol } from '../../types/modelcontextprotocol';

export async function foreignVerification_AfterTempID(
  this: ModelContextProtocol,
  tempId: string
) {
  const driver = this.driver;

  // 1. Login with Temporary ID
  await driver.get('http://68.233.110.246/bnrc_stg/home');
  const loginLink = await driver.wait(
    until.elementLocated(By.xpath("//a[contains(text(),'Login')]")),
    10000
  );
  await loginLink.click();

  await driver.wait(until.elementLocated(By.css("input[formcontrolname='username']")), 10000).sendKeys(tempId);
  await driver.findElement(By.css("input[formcontrolname='password']")).sendKeys('123456');
  await driver.findElement(By.css("input[formcontrolname='captcha']")).sendKeys('1');
  await driver.findElement(By.css("button[type='submit']")).click();

  // 2. Force Password Change
  const newPasswordInput = await driver.wait(until.elementLocated(By.css("input[formcontrolname='newPassword']")), 10000);
  await newPasswordInput.sendKeys('Av@12345');
  await driver.findElement(By.css("input[formcontrolname='confirmPassword']")).sendKeys('Av@12345');
  await driver.findElement(By.css("button[type='submit']")).click();

  // Wait for the success message and click OK
  const okButtonPassword = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'OK')]")),
    10000
  );
  await driver.wait(until.elementIsVisible(okButtonPassword), 5000);
  await okButtonPassword.click();


  // 3. Re-login with the new password
  const usernameField = await driver.wait(until.elementLocated(By.css("input[formcontrolname='username']")), 10000);
  await usernameField.clear();
  await usernameField.sendKeys(tempId);
  await driver.findElement(By.css("input[formcontrolname='password']")).sendKeys('Av@12345');
  await driver.findElement(By.css("input[formcontrolname='captcha']")).sendKeys('1');
  await driver.findElement(By.css("button[type='submit']")).click();

  // 4. Navigate to E-Application -> Foreign Verification
  const eAppDropdown = await driver.wait(
      until.elementLocated(By.xpath("//a[contains(text(),'E-Application')]")),
      20000
  );
  await driver.wait(until.elementIsVisible(eAppDropdown), 5000);
  const actions = driver.actions({ bridge: true });
  await actions.move({ origin: eAppDropdown }).perform();
  const certOption = await driver.wait(
      until.elementLocated(By.css('a.dropdown-item[href="/bnrc_stg/Website/foreign-verification"]')),
      10000
  );
  await driver.wait(until.elementIsVisible(certOption), 5000);
  await certOption.click();


  // 5. Click the payment button
  const paymentButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'Make Payment')]")),
    10000
  );
  await driver.wait(until.elementIsVisible(paymentButton), 5000);
  await paymentButton.click();

  console.log('Successfully completed foreign verification steps after temporary ID generation.');
}
