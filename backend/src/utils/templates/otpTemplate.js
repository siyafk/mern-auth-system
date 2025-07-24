module.exports = function otpTemplate(name, otp) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50;">Hey ${name},</h2>
      <p style="font-size: 16px; color: #555;">
        We're glad you're here! To verify your email and activate your account, use the one-time password (OTP) below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background: #2ecc71; color: white; font-size: 28px; padding: 10px 30px; border-radius: 8px; letter-spacing: 4px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #888;">
        This OTP is valid for 10 minutes. If you didn’t request this, you can safely ignore this email.
      </p>
      <p style="margin-top: 40px; color: #999;">— The Dev Squad 💻</p>
    </div>
  </div>
  `;
}
