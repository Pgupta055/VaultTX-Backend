const nodemailer = require("nodemailer");

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
});
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP VERIFY ERROR:", err);
  } else {
    console.log("SMTP SERVER READY");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"VaultTX" <priyanshugupta1110@gmail.com>',
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("================================");
    throw error;
  }
};

module.exports = sendEmail;