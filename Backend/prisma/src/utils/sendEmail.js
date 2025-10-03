import { transporter } from "../config/email.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Eventure Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(" Email sent to", to);
  } catch (error) {
    console.error(" Email failed:", error);
    throw error;
  }
};
