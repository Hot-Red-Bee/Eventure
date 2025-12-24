import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can swap with Outlook, SMTP, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
