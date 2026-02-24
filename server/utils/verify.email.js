import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../config/env.js";
import { verifyEmailTemplate } from "../emails/verify.email.template.js";
import { forgotPasswordTemplate } from "../emails/reset.password.email.template.js";

export const sendVerificationEmail = async ({
  name,
  email,
  token,
  expireIn,
  subject,
  purpose,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
  sendVerificationEmail;
  let htmlContent;
  if (purpose === 1) {
    htmlContent = verifyEmailTemplate({ name, token, expireIn });
  } else {
    htmlContent = forgotPasswordTemplate({ name, token, expireIn });
  }
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error);
  }
};
