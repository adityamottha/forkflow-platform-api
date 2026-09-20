import { mailFrom, mailTransporter } from "../../config/mail.config.js";

interface SendRegistrationOTPParams {
  email: string;
  otp: string;
  expiresInMinutes: number;
}

class AuthNotification {
  private readonly applicationName = "ForkFlow";

  private generateRegistrationOTPEmail(otp: string, expiresInMinutes: number) {
    const subject = `Verify your ${this.applicationName} account`;

    const text = `
Welcome to ${this.applicationName}!

Your email verification code is:

${otp}

This code will expire in ${expiresInMinutes} minutes.

For your security, do not share this code with anyone.

If you did not request this code, you can safely ignore this email.

© ${new Date().getFullYear()} ${this.applicationName}
`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <meta name="color-scheme" content="light" />
  <title>${subject}</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f4f4f5; padding: 40px 16px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 520px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                padding: 28px 32px;
                text-align: center;
                border-bottom: 1px solid #e4e4e7;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #18181b;
                  font-size: 24px;
                "
              >
                ${this.applicationName}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px;">

              <h2
                style="
                  margin: 0 0 16px;
                  color: #18181b;
                  font-size: 22px;
                "
              >
                Verify your email
              </h2>

              <p
                style="
                  margin: 0 0 24px;
                  color: #52525b;
                  font-size: 15px;
                  line-height: 1.6;
                "
              >
                Welcome to ${this.applicationName}!
                Please use the verification code below to verify
                your email address.
              </p>

              <!-- OTP -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      padding: 24px;
                      background-color: #f4f4f5;
                      border-radius: 8px;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 10px;
                        color: #71717a;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Verification Code
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #18181b;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                      "
                    >
                      ${otp}
                    </p>
                  </td>
                </tr>
              </table>

              <p
                style="
                  margin: 24px 0 8px;
                  color: #52525b;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                This code will expire in
                <strong>${expiresInMinutes} minutes</strong>.
              </p>

              <p
                style="
                  margin: 0;
                  color: #71717a;
                  font-size: 14px;
                  line-height: 1.6;
                "
              >
                For your security, never share this code with anyone.
              </p>

              <p
                style="
                  margin: 24px 0 0;
                  color: #71717a;
                  font-size: 13px;
                  line-height: 1.6;
                "
              >
                If you did not request this verification code,
                you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 20px 32px;
                background-color: #fafafa;
                border-top: 1px solid #e4e4e7;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #a1a1aa;
                  font-size: 12px;
                "
              >
                © ${new Date().getFullYear()}
                ${this.applicationName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

    return {
      subject,
      text,
      html,
    };
  }

  async sendRegistrationOTP({
    email,
    otp,
    expiresInMinutes,
  }: SendRegistrationOTPParams): Promise<void> {
    const { subject, text, html } = this.generateRegistrationOTPEmail(
      otp,
      expiresInMinutes,
    );

    await mailTransporter.sendMail({
      from: mailFrom,
      to: email,
      subject,
      text,
      html,
    });
  }

  // FORGOT PASSWORD OTP
  async sendForgotPasswordOTP({
    email,
    otp,
    expiresInMinutes,
  }: {
    email: string;
    otp: string;
    expiresInMinutes: number;
  }): Promise<void> {
    await mailTransporter.sendMail({
      from: mailFrom,
      to: email,
      subject: "Your ForkFlow password reset code",

      // Plain-text fallback
      text: `
Hello,

We received a request to reset the password for your ForkFlow account.

Your password reset code is:

${otp}

This code will expire in ${expiresInMinutes} minutes.

For your security:
- Do not share this code with anyone.
- ForkFlow will never ask you to share your OTP.
- If you did not request a password reset, you can safely ignore this email.

This is an automated email. Please do not reply.

© ${new Date().getFullYear()} ForkFlow. All rights reserved.
    `.trim(),

      // HTML email
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>ForkFlow Password Reset</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f4f6f8; padding: 40px 16px;"
  >
    <tr>
      <td align="center">

        <!-- Main container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                padding: 28px 24px;
                background-color: #111827;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  line-height: 1.2;
                "
              >
                ForkFlow
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">

              <h2
                style="
                  margin: 0 0 16px;
                  font-size: 24px;
                  line-height: 1.3;
                  color: #111827;
                "
              >
                Reset your password
              </h2>

              <p
                style="
                  margin: 0 0 24px;
                  font-size: 16px;
                  line-height: 1.6;
                  color: #4b5563;
                "
              >
                We received a request to reset the password
                for your ForkFlow account.
              </p>

              <p
                style="
                  margin: 0 0 12px;
                  font-size: 15px;
                  color: #4b5563;
                "
              >
                Your verification code is:
              </p>

              <!-- OTP -->
              <div
                style="
                  margin: 0 0 24px;
                  padding: 20px;
                  background-color: #f3f4f6;
                  border-radius: 8px;
                  text-align: center;
                  letter-spacing: 8px;
                "
              >
                <span
                  style="
                    font-size: 32px;
                    font-weight: 700;
                    color: #111827;
                  "
                >
                  ${otp}
                </span>
              </div>

              <p
                style="
                  margin: 0 0 24px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #6b7280;
                "
              >
                This code will expire in
                <strong>${expiresInMinutes} minutes</strong>.
              </p>

              <!-- Security notice -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-bottom: 24px;
                  background-color: #fff7ed;
                  border-radius: 8px;
                "
              >
                <tr>
                  <td style="padding: 16px;">

                    <p
                      style="
                        margin: 0 0 8px;
                        font-size: 14px;
                        font-weight: 700;
                        color: #9a3412;
                      "
                    >
                      Security notice
                    </p>

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #7c2d12;
                      "
                    >
                      Never share this OTP with anyone.
                      ForkFlow will never ask you to provide
                      your password or OTP.
                    </p>

                  </td>
                </tr>
              </table>

              <p
                style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #6b7280;
                "
              >
                If you did not request a password reset,
                you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding: 24px 32px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
              "
            >
              <p
                style="
                  margin: 0 0 8px;
                  font-size: 13px;
                  color: #6b7280;
                "
              >
                This is an automated email. Please do not reply.
              </p>

              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  color: #9ca3af;
                "
              >
                © ${new Date().getFullYear()} ForkFlow.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
    });
  }
}

export const authNotification = new AuthNotification();
