import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can swap with Outlook, SMTP, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Don't verify transporter on startup to avoid SMTP timeout errors
// transporter.verify((error, success) => {
//   if (error) console.log("Email transporter error:", error);
//   else console.log("Email transporter ready");
// });

export default transporter;
