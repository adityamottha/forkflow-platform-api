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
}

export const authNotification = new AuthNotification();
