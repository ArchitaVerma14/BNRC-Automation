const { Builder, By, until } = require('selenium-webdriver');
const axios = require('axios');

(async function openPageAfterApiLogin() {
    // 1. Send POST request to login API
    let loginResponse;
    try {
        loginResponse = await axios.post(
            'http://68.233.110.246:8000/bnrcAuthPreLogin/login',
            {
                s: "4c47e7a735e1699b",
                ct: "pVmEKapts+UBZtPparC/EP30rUBAHQs8gzz+O+G6O6Sr/t1QJSaJ2/31Vons4WfWJCPikkfP5MnbqrfjzgdQDdjNd5QP5NFfDPuKOqXT9yr+2ij8SsD6SAvXuRkp/O3+LsTmABe0RTAr9UXGsGc/tA==",
                iv: "a350fc08012e4040eae9c73e6f3ec766"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'http://68.233.110.246',
                    'Referer': 'http://68.233.110.246/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
                }
            }
        );
        console.log('Login success', loginResponse.data);
    } catch (err) {
        console.error('Login API failed:', err.response ? err.response.status : err.message);
        return;
    }

    // 2. Extract tokens from the API response
    const jwtToken = loginResponse.data.jwtToken;
    const accessToken = loginResponse.data.access_token;

    // 3. Open Selenium browser
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 4. Navigate to the main page (after login)
        await driver.get('http://68.233.110.246/bnrc_stg/Application/dashboard');

        // 5. Inject tokens into sessionStorage
        await driver.executeScript(`sessionStorage.setItem('jwtToken', '${jwtToken}');`);
        await driver.executeScript(`sessionStorage.setItem('access_token', '${accessToken}');`);

        // 6. Refresh the page to apply the session
        await driver.navigate().refresh();

        // 7. Wait for a page element to confirm page loaded
        await driver.wait(until.elementLocated(By.css('body')), 10000);

        console.log('Page opened after API login successfully!');
    } finally {
        // await driver.quit(); // keep browser open for debugging
    }
})();
