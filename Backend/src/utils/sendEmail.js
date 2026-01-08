// ...existing code...
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  console.warn('EMAIL_USER or EMAIL_PASS not set in .env — email may fail.');
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user,
    pass,
  },
});

// optional quick verify at startup (does not throw, only logs)
// Optional verify at startup is noisy on platforms that block outbound SMTP.
// Keep it disabled to avoid startup timeout errors; errors will surface when sending.
// transporter.verify()
//   .then(() => console.log('Email transporter ready'))
//   .catch((err) => console.warn('Email transporter verify failed:', err));

// ...existing code...
/**
 * Send an email using the configured transporter.
 * @param {Object} options - { to, subject, text, html, from }
 * @returns {Promise<any>}
 */
export const sendEmail = async ({ to, subject, text, html, from }) => {
  if (!transporter) {
    console.warn('Email transporter not configured');
    return null;
  }

  const mailOptions = {
    from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.warn('sendEmail failed:', err?.message || err);
    return null;
  }
};
// ...existing code...