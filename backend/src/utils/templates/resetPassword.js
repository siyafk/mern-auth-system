module.exports = function resetPasswordTemplate(name, otp) {
  return `
  <!DOCTYPE html>
  <html lang="en" style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f4f7" style="padding: 40px 0;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 30px 20px;">
                  <h2 style="color: #333;">🔐 Password Reset Request</h2>
                  <p style="font-size: 16px; color: #555;">Hi <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; color: #555; line-height: 1.6;">
                    We received a request to reset your account password. Use the following OTP to proceed:
                  </p>
                  <div style="margin: 30px 0;">
                    <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #2f54eb; background-color: #f0f5ff; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                      ${otp}
                    </span>
                  </div>
                  <p style="font-size: 14px; color: #777;">
                    This OTP is valid for <strong>10 minutes</strong>. If you didn’t request this, please ignore this email or contact support.
                  </p>
                  <p style="font-size: 14px; color: #999; margin-top: 40px;">
                    Stay safe,<br />
                    <strong>Your App Team</strong>
                  </p>
                </td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #aaa; margin-top: 20px;">© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
