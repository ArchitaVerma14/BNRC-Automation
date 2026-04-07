const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function bypassLogin() {
  const chromeBinaryPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const chromedriverPath = 'D:/chromedriver-win64/chromedriver-win64/chromedriver.exe';

  const options = new chrome.Options()
    .setChromeBinaryPath(chromeBinaryPath)
    .addArguments('--ignore-certificate-errors')
    .addArguments('--disable-web-security')
    .addArguments('--start-maximized');

  const service = new chrome.ServiceBuilder(chromedriverPath);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  try {
    // Step 1: Open base site
    await driver.get('http://68.233.110.246/bnrc_stg/home');

    // Step 2: Inject tokens into sessionStorage
    await driver.executeScript(() => {
      sessionStorage.setItem("access_token", "4OFpRMlIgdf2n0tJV0a8keo7lvV53Q");
      sessionStorage.setItem("expires_in", "1756394627");
      sessionStorage.setItem("jwtToken", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4wLjQwL2JucmNfbHVtZW4vYm5yYy1hdXRoL2xvZ2luIiwiaWF0IjoxNzU2Mzc2NjI3LCJleHAiOjE3NTYzOTQ2MjcsIm5iZiI6MTc1NjM3NjYyNywianRpIjoiempPRnFtWVZvcUZET1JMVyIsInN1YiI6IjExIiwicHJ2IjoiOTUxNjdkODdmMzFmNzJiNTUzODIxZjM2NWQzMGZkMGJlNjI4NWMzMyIsImtpZCI6ImdtNFJXMU9ISW96blJNR1lDMDF2Y1FHVnlLazJNY0lCIiwidXNlcklkIjoiZXlKcGRpSTZJbms0UlRSTVZHSnpNWGxJT1cxMlRtbGpaRnBqUzJjOVBTSXNJblpoYkhWbElqb2lkbmxGTm5kaVFsTmxhVGxsYzB4Tk1XVjBUak0wWnowOUlpd2liV0ZqSWpvaU1UZzRaREpoWkRGbE1UTmhZMll4T0RnMk1XTXhabUZsTURFMlpUWTNPRE5sTUdZMVl6STNZVFV6WWpZMU1HWTBNVEZpWVdNM056Y3laVFV3WmpGaVpTSXNJblJoWnlJNklpSjkiLCJ1c2VyVHlwZSI6ImV5SnBkaUk2SWxsYVpIcGFlVlo0UWtaNlMwcENOMnBCZVVjeVVsRTlQU0lzSW5aaGJIVmxJam9pWVRNemJtZDBTa2h0VGpOU2JFaGlSRmxXVTFoTVVUMDlJaXdpYldGaklqb2lOR0prTXpnMU1XTXlZVGhsWkdZek1EbGhPRGt3TmpBek9EY3dZVFV6Tnpnek1ESTVZMk0xTTJGbU5HWTBNREJqTW1ObFlqZ3paVEJrT1RZM05UZzJZeUlzSW5SaFp5STZJaUo5IiwiYXV0aGVudGljYXRlZF91c2VyaWQiOiJleUpwZGlJNkluazRSVFJNVkdKek1YbElPVzEyVG1salpGcGpTMmM5UFNJc0luWmhiSFZsSWpvaWRubEZObmRpUWxObGFUbGxjMHhOTVdWMFRqTTBaejA5SWl3aWJXRmpJam9pTVRnNFpESmhaREZsTVROaFkyWXhPRGcyTVdNeFptRmxNREUyWlRZM09ETmxNR1kxWXpJM1lUVXpZalkxTUdZME1URmlZV00zTnpjeVpUVXdaakZpWlNJc0luUmhaeUk2SWlKOSIsImNsaWVudF9pZCI6bnVsbCwiY2xpZW50X3NlY3JldCI6bnVsbCwicHJvdmlzaW9uX2tleSI6bnVsbCwiZ3JhbnRfdHlwZSI6bnVsbCwic2Vzc2lvblRpbWVvdXQiOjEyMH0.WtMNMlb1k4Lj31S7vP-Y4Y6gR2WygrLrDeKT2lq8-AM"); // <-- paste full value
      sessionStorage.setItem("other_token", "eyJpdiI6IjNSWEhrL0dOM2RCd05EWElqbSs3NkE9PSIsInZhbHVlIjoiS2xoVGZEejVIZXhDOUhxaGRzSU1BbVFJWGIrUDI1TDJnMFNKWDR0VGVGZ2ZIU2tlOGF3OUxEdm81ZlVOdVkyakk3UUtMc1YzbzA2eFZJY1MvemM0WjhyTzQwQXQ4YkJLWk1uVFNFTHprd2JXNXZuWlAxL0d3OXF6eGdPVXByZ1YzMXQ5ZVlyZ1libnZmSWQ2VTRKTUc1MTZHcW5SOVFRZGVWcHFwbGxEcTIyU0t1TGRuWXBWRmNycnFLSWpGdDBWOTV1alNwMW8yeGVTQUV2ZUJjbWZGMDQxZkhOd0xjdUdodU9abElsOHNzWTlOS1JCeGNNY3kxeU5FUFBWTnplZkR2TWEvRlFmRHdheWc4Y2hEeEZHV0w0NkZ5SloxRFNMcFdBeGdkSGF6Y0t2dEY0U2JCWEdQK2Rxck5rNzJPdnpVOGJWUGdLL292UW9vOEFiZzhickl5eTNvSHQ1dm02djNBaTF1NXZqZ0NveW1rQStJMFc1UWxoRGZKcHE4NFF6UjR1dEdmbTZMUVpsUnhYRFU0cE4yQ282Uk1NdEZGMEE4SEQ1KzhQZUw0QlpsQXRPUXlSMzhzUmhKYldFUi9Md0ppSkNaajI3TklCdVR1cU1yM285TStnbUhZajRGbXJCV2J1RWNvQi9ta3g4bi9PU3U5ZlkrTG5SaXZiOHhqOU93WGE2OU1SZ1hrODBDdFJEUHNDYnRxOE4wU01oM3BEUU03RlBPMGZPWCtjPSIsIm1hYyI6IjQ4NzU5ZWQ1OWU5YjFiNWQwMjlhNzBmZTc4N2U0M2EyM2FmYWFlOTVkYWI1ZGRlMzRlNTcwZmVlNjU1NTEwMjYiLCJ0YWciOiIifQ=="); // <-- paste full value
      sessionStorage.setItem("refresh_token", "8ON8bDFRsKu7tgsT4RDHaqTz0xB017h");
      sessionStorage.setItem("userMenus", '[{"g_id":"9","g1_name":"Competency Passbook","g1_path":"/Application/competency"}]');
      sessionStorage.setItem("userProfile", '{"userRoleId":50,"userRole":"eyJpdiI6IthNDUva0FxB3FfTDlqMmJKeDQ..."}');
    });

    console.log("✅ Tokens injected into sessionStorage");

    // Step 3: Redirect directly to dashboard
    await driver.get("http://68.233.110.246/bnrc_stg/Application/dashboard");

    // Step 4: Confirm dashboard loaded
    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'Dashboard')]")), 15000);
    console.log("🎉 Bypass successful — Dashboard loaded!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    // await driver.quit(); // keep browser open for debugging
  }
})();
