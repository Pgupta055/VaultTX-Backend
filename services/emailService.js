const nodemailer = require("nodemailer");

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);

const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: port,
  // Port 465 uses secure: true, Port 587/2525 uses secure: false
  secure: port === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Timeouts prevent Render from hanging indefinitely
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false, // Helps bypass SSL certificate strictness on cloud servers
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP VERIFY ERROR:", err);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"VaultTX" <${process.env.EMAIL_USER || "priyanshugupta1110@gmail.com"}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("================================");
    throw error;
  }
};

module.exports = sendEmail;