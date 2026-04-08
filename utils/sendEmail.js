import nodemailer from "nodemailer";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

console.log("Preparing test report email...");

// 📁 Screenshot folder
const screenshotDir = "./BNRCscreenshots";

// 📊 Read test results
function getStatus(file) {
  try {
    const data = readFileSync(file, "utf-8");

    if (data.includes("0 failing")) return "PASS ✅";
    if (data.includes("failing")) return "FAIL ❌";

    return "UNKNOWN ⚠️";
  } catch {
    return "NOT RUN ⚠️";
  }
}

const certStatus = getStatus("cert.txt");
const transferStatus = getStatus("transfer.txt");
const foreignStatus = getStatus("foreign.txt");

// 📸 Attach screenshots
let attachments = [];

try {
  const files = readdirSync(screenshotDir);
  attachments = files.map(file => ({
    filename: file,
    path: join(screenshotDir, file)
  }));
} catch {
  console.log("No screenshots found");
}

// 📧 Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📊 Professional email body
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // or EMAIL_TO
  subject: `BNRC Automation Test Report - ${new Date().toLocaleString()}`,

  html: `
  <h2>📊 BNRC Automation Test Report</h2>

  <p><b>Execution Time:</b> ${new Date().toLocaleString()}</p>

  <table border="1" cellpadding="8" cellspacing="0">
    <tr>
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

  <p><b>Summary:</b></p>
  <ul>
    <li>Certificate: ${certStatus}</li>
    <li>Transfer: ${transferStatus}</li>
    <li>Foreign: ${foreignStatus}</li>
  </ul>

  <p>📎 Screenshots are attached for failed or executed steps.</p>

  <p>🔗 Check GitHub Actions logs for detailed execution.</p>

  <br/>
  <p>Regards,<br/>Automation QA System</p>
  `,

  attachments: attachments
};

// 📤 Send mail
await transporter.sendMail(mailOptions);

console.log("Email sent successfully");