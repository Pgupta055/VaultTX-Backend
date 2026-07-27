const otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border:1px solid #ddd; border-radius:8px;">

      <h2 style="color:#2563eb;">
        SecureVault Email Verification
      </h2>

      <p>Hello,</p>

      <p>
        Use the following One-Time Password (OTP) to continue:
      </p>

      <div
        style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          text-align:center;
          padding:20px;
          background:#f5f5f5;
          border-radius:8px;
          margin:20px 0;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP will expire in
        <strong>${process.env.OTP_EXPIRE_MINUTES} minutes</strong>.
      </p>

      <p>
        If you did not request this code, please ignore this email.
      </p>

      <hr>

      <p style="font-size:12px;color:gray;">
        © SecureVault Password Manager
      </p>

    </div>
  `;
};

module.exports = otpTemplate;