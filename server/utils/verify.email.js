import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/env.js";
import { verifyEmailTemplate } from "../emails/verify.email.template.js";

export const sendVerificationEmail = async ({
  name,
  email,
  token,
  expireIn,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: verifyEmailTemplate({ name, token, expireIn }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error);
  }
};
