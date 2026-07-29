const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "VaultTX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log("📧 Email sent:", data);
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error);
    console.error("================================");
    throw error;
  }
};

module.exports = sendEmail;