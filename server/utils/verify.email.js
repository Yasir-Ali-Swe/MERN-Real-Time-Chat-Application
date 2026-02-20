import nodemailer from "nodemailer";
import { Email, EMAIL_PASSWORD } from "../config.js";
import { verifyEmailTemplate } from "../emails/verify.email.template.js";

export const sendVerificationEmail = async ({ name, email, token }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: Email,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: Email,
    to: email,
    subject: "Verify Your Email Address",
    html: verifyEmailTemplate({ name, token }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error);
  }
};


