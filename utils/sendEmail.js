import nodemailer from "nodemailer";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

console.log("Preparing test report email...");

// ===============================
// ✅ FUNCTION: Get test status from Playwright JSON
// ===============================
function getStatus(file) {
  try {
    const data = JSON.parse(readFileSync(file, "utf-8"));

    let results = [];

    function extractSuites(suites) {
      for (const suite of suites || []) {
        if (suite.specs) {
          for (const spec of suite.specs) {
            for (const test of spec.tests || []) {
              for (const result of test.results || []) {
                results.push(result.status);
              }
            }
          }
        }
        if (suite.suites) {
          extractSuites(suite.suites);
        }
      }
    }

    extractSuites(data.suites);

    if (results.length === 0) return "NOT RUN ⚠️";

    if (results.every(r => r === "passed")) return "PASS ✅";
    if (results.some(r => r === "failed")) return "FAIL ❌";

    return "UNKNOWN ⚠️";

  } catch (err) {
    console.log(`Error reading ${file}:`, err.message);
    return "NOT RUN ⚠️";
  }
}
// ===============================
// ✅ READ TEST RESULTS
// ===============================
const certStatus = getStatus("cert-report.json");
const transferStatus = getStatus("transfer-report.json");
const foreignStatus = getStatus("foreign-report.json");
// ===============================
// ✅ ATTACH ONLY LATEST SCREENSHOTS
// ===============================
const screenshotDir = "./BNRCscreenshots";
let attachments = [];

try {
  const files = readdirSync(screenshotDir)
    .map(file => ({
      name: file,
      time: statSync(join(screenshotDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 5); // latest 5 screenshots

  attachments = files.map(file => ({
    filename: file.name,
    path: join(screenshotDir, file.name)
  }));

} catch (err) {
  console.log("No screenshots found:", err.message);
}

// ===============================
// ✅ EMAIL CONFIGURATION
// ===============================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===============================
// ✅ EMAIL BODY (PROFESSIONAL)
// ===============================
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO || process.env.EMAIL_USER,

  subject: `BNRC Automation Test Report - ${new Date().toLocaleString()}`,

  html: `
    <h2>📊 BNRC Automation Test Report</h2>

    <p><b>Execution Time:</b> ${new Date().toLocaleString()}</p>

    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
      <tr style="background-color:#f2f2f2;">
        <th>Test Module</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Certificate Verification</td>
        <td>${certStatus}</td>
      </tr>
      <tr>
        <td>Transfer Certificate</td>
        <td>${transferStatus}</td>
      </tr>
      <tr>
        <td>Foreign Certificate</td>
        <td>${foreignStatus}</td>
      </tr>
    </table>

    <br/>

    <h3>📌 Summary</h3>
    <ul>
      <li>Certificate: ${certStatus}</li>
      <li>Transfer: ${transferStatus}</li>
      <li>Foreign: ${foreignStatus}</li>
    </ul>

    <p>📎 Latest screenshots are attached for reference.</p>
    <p>🔗 Check GitHub Actions logs for detailed execution.</p>

    <br/>
    <p>Regards,<br/><b>Automation QA System</b></p>
  `,

  attachments: attachments
};

// ===============================
// ✅ SEND EMAIL
// ===============================
try {
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
} catch (err) {
  console.error("Email error:", err);
}