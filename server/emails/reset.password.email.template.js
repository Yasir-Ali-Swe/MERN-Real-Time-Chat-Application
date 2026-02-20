import { CLIENT_URL } from "../config/env.js";
export const forgotPasswordTemplate = ({ name, token, expireIn }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
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

      .email-body h2 {
        margin-top: 0;
        font-size: 18px;
        color: #111827;
      }

      .email-footer {
        padding: 16px 24px;
        font-size: 12px;
        color: #6b7280;
        background-color: #f9fafb;
        text-align: center;
      }

      .email-footer a {
        color: #dc2626;
        text-decoration: none;
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
          <h2>Reset your password</h2>

          <p>Hi ${name},</p>

          <p>
            We received a request to reset your password. Click the button below
            to set a new password.
          </p>

          <p style="text-align: center;">
            <a
              href="${CLIENT_URL}/reset-password/${token}"
              style="
                background-color:#dc2626;
                color:#ffffff;
                display:inline-block;
                text-decoration:none;
                padding:12px 20px;
                border-radius:4px;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            If you didn’t request a password reset, you can safely ignore this
            email. Your password will not be changed.
          </p>

          <p>
            This link will expire in ${expireIn}.
          </p>
        </div>

        <div class="email-footer">
          <p>
            If the button doesn’t work, copy and paste this link into your
            browser:
          </p>
          <p>
            <a href="${CLIENT_URL}/reset-password/${token}">
              ${CLIENT_URL}/reset-password/${token}
            </a>
          </p>
          <p>
            © 2026 NexTalk. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
