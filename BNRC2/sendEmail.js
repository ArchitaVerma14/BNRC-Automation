import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: "CI Test Results",
  text: "Your Playwright tests have completed. Check GitHub Actions for details.",
};

try {
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
} catch (err) {
  console.error("Email error:", err);
}
