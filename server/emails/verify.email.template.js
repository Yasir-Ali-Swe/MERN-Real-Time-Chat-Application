import { CLIENT_URL } from "../config/env.js";

export const verifyEmailTemplate = ({ name, token, expireIn }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }

      .email-wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .email-container {
        max-width: 520px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 6px;
        overflow: hidden;
      }

      .email-header {
        padding: 24px;
        text-align: center;
        background-color: #111827;
      }

      .email-header h1 {
        margin: 0;
        font-size: 20px;
        color: #ffffff;
      }

      .email-body {
        padding: 32px 24px;
        color: #374151;
        line-height: 1.6;
      }

      .email-footer {
        padding: 16px 24px;
        font-size: 12px;
        color: #6b7280;
        background-color: #f9fafb;
        text-align: center;
      }

      .email-footer a {
        color: #2563eb;
        text-decoration: none;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="email-header">
          <h1>NexTalk</h1>
        </div>

        <div class="email-body">
          <h2 style="margin:0 0 12px 0; font-size:18px; color:#111827;">
            Verify your email address
          </h2>

          <p style="margin:0 0 12px 0;">
            Hi ${name},
          </p>

          <p style="margin:0 0 20px 0;">
            Thanks for signing up. Please confirm your email address by clicking
            the button below.
          </p>

          <p style="text-align:center; margin:24px 0;">
            <a
              href="${CLIENT_URL}/verify-email/${token}"
              style="
                background-color:#2563eb;
                color:#ffffff;
                display:inline-block;
                text-decoration:none;
                padding:12px 20px;
                border-radius:4px;
                font-weight:bold;
              "
            >
              Verify Email
            </a>
          </p>

          <p style="margin:20px 0 12px 0;">
            If you didn’t create this account, you can safely ignore this email.
          </p>

          <p style="margin:0;">
            This link will expire in ${expireIn}.
          </p>
        </div>

        <div class="email-footer">
          <p style="margin:0 0 8px 0;">
            If the button doesn’t work, copy and paste this link into your
            browser:
          </p>
          <p style="margin:0 0 12px 0;">
            <a href="${CLIENT_URL}/verify-email/${token}">
              ${CLIENT_URL}/verify-email/${token}
            </a>
          </p>
          <p style="margin:0;">
            © 2026 NexTalk. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;