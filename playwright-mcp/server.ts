import { Server } from "@modelcontextprotocol/sdk/dist/esm/server/index.js";
import { chromium, Browser, Page, BrowserContext } from "playwright";
import fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;

const server = new Server(
    { name: "playwright-mcp", version: "2.0.0" },
    { capabilities: {} }
);

/* ----------------- Browser Management ------------------ */

server.action("openPage", async ({ url }) => {
    if (!browser) browser = await chromium.launch({ headless: false });
    if (!context) context = await browser.newContext();
    if (!page) page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    return { success: true };
});

server.action("closeBrowser", async () => {
    if (browser) await browser.close();
    browser = null;
    context = null;
    page = null;
    return { success: true };
});

/* ----------------- Navigation Tools ------------------ */

server.action("goto", async ({ url }) => {
    await page.goto(url);
    return { success: true };
});

server.action("reload", async () => {
    await page.reload();
    return { success: true };
});

/* ----------------- Element Actions ------------------ */

server.action("click", async ({ selector }) => {
    await page.click(selector);
    return { success: true };
});

server.action("dblclick", async ({ selector }) => {
    await page.dblclick(selector);
    return { success: true };
});

server.action("type", async ({ selector, text }) => {
    await page.type(selector, text);
    return { success: true };
});

server.action("fill", async ({ selector, text }) => {
    await page.fill(selector, text);
    return { success: true };
});

server.action("press", async ({ selector, key }) => {
    await page.press(selector, key);
    return { success: true };
});

server.action("selectOption", async ({ selector, value }) => {
    await page.selectOption(selector, value);
    return { success: true };
});

server.action("waitForSelector", async ({ selector }) => {
    await page.waitForSelector(selector, { timeout: 15000 });
    return { success: true };
});

server.action("isVisible", async ({ selector }) => {
    const visible = await page.isVisible(selector);
    return { visible };
});

/* ----------------- Page Tools ------------------ */

server.action("screenshot", async ({ path }) => {
    const p = path || "screenshot.png";
    await page.screenshot({ path: p, fullPage: true });
    return { success: true, file: p };
});

server.action("getHtml", async () => {
    const html = await page.content();
    return { html };
});

server.action("evaluate", async ({ js }) => {
    const result = await page.evaluate(js);
    return { result };
});

/* ----------------- File Handling ------------------ */

server.action("uploadFile", async ({ selector, filepath }) => {
    await page.setInputFiles(selector, filepath);
    return { success: true };
});

/* ----------------- BNRC Automation ------------------ */

server.action("bnrcLogin", async ({ username, password }) => {
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click("#loginBtn");
    await page.waitForNavigation();
    return { success: true };
});

server.action("bnrcSelectState", async ({ state }) => {
    await page.selectOption("#stateDropdown", state);
    return { success: true };
});

server.action("bnrcOpenModule", async ({ moduleName }) => {
    await page.click(`text=${moduleName}`);
    return { success: true };
});

server.start();
