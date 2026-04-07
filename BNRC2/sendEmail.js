import nodemailer from "nodemailer";

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
  text: "Your Selenium tests have completed. Check GitHub Actions for details.",
};

await transporter.sendMail(mailOptions);
console.log("Email sent");