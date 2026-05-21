import nodemailer from "nodemailer";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

console.log("Preparing test report email...");

// ===============================
// ✅ FUNCTION: Get test status from Playwright JSON
// ===============================
function getStatus(file) {
  try {
    const raw = readFileSync(file, "utf-8");
    if (!raw || raw.trim().length === 0) {
      console.log(`Report ${file} is empty`);
      return "NOT RUN ⚠️";
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      console.log(`Error parsing ${file}: ${parseErr.message}`);
      console.log(`Preview (${file}):`, raw.slice(0, 800));
      return "NOT RUN ⚠️";
    }

    // Support simple CI-generated status JSON.
    if (typeof data.status === "string") {
      const normalized = data.status.trim().toUpperCase();
      if (normalized === "PASS" || normalized === "PASSED") return "PASS ✅";
      if (normalized === "FAIL" || normalized === "FAILED") return "FAIL ❌";
      if (normalized === "NOT RUN") return "NOT RUN ⚠️";
    }

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
const testSuites = [
  { label: "Certificate Verification", summaryLabel: "Certificate", reportFile: "cert-report.json" },
  { label: "Transfer Certificate", summaryLabel: "Transfer", reportFile: "transfer-report.json" },
  { label: "PRERNA Events", summaryLabel: "PRERNA Events", reportFile: "prerna-report.json" },
];

console.log("Looking for report files in working directory...");
for (const s of testSuites) {
  if (existsSync(s.reportFile)) {
    try {
      const stats = statSync(s.reportFile);
      console.log(`Found ${s.reportFile} (${stats.size} bytes)`);
    } catch (err) {
      console.log(`Found ${s.reportFile}`);
    }
  } else {
    console.log(`Missing ${s.reportFile}`);
  }
}

const suiteStatuses = testSuites.map((suite) => ({
  ...suite,
  exists: existsSync(suite.reportFile),
  status: existsSync(suite.reportFile) ? getStatus(suite.reportFile) : "NOT RUN ⚠️ (report missing)",
}));

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
const currentTimeIST = new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short"
});
// ===============================
// ✅ EMAIL BODY (PROFESSIONAL)
// ===============================
const mailOptions = {
  from: process.env.EMAIL_USER,to: process.env.EMAIL_TO,
  

  subject: `BNRC Automation Test Report - ${currentTimeIST}`,

  html: `
    <h2>📊 BNRC Automation Test Report</h2>

    <p><b>Execution Time:</b> ${currentTimeIST}</p>

    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
      <tr style="background-color:#f2f2f2;">
        <th>Test Module</th>
        <th>Status</th>
      </tr>
      ${suiteStatuses
        .map(
          (suite) => `
      <tr>
        <td>${suite.label}</td>
        <td>${suite.status}</td>
      </tr>`
        )
        .join("")}
    </table>

    <br/>

    <h3>📌 Summary</h3>
    <ul>
      ${suiteStatuses
        .map((suite) => `<li>${suite.summaryLabel}: ${suite.status}</li>`)
        .join("")}
    </ul>

    <p>📎 Latest screenshots are attached for reference.</p>
    <p>🔗 <a href="https://github.com/ArchitaVerma14/BNRC-Automation/actions" target="_blank">
    Check GitHub Actions logs
    </a> for detailed execution.</p>
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