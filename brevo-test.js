require("dotenv").config();
const nodemailer = require("nodemailer");

async function test() {
  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

  try {
    await transporter.verify();
    console.log("SMTP Connected!");

    const info = await transporter.sendMail({
      from: '"VaultTX" <priyanshugupta1110@gmail.com>',
      to: "priyanshugupta1110@gmail.com",
      subject: "Brevo Test",
      text: "This is a test email.",
    });

    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

test();