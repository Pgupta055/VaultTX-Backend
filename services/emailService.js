// emailservice.js

const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is missing in environment variables!");
    throw new Error("Email service misconfigured: Missing BREVO_API_KEY");
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "VaultTX",
          email: process.env.EMAIL_USER || "priyanshugupta1110@gmail.com",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("========== BREVO API ERROR ==========");
      console.error(data);
      console.error("=====================================");
      throw new Error(data.message || "Failed to send email via Brevo API");
    }

    console.log(`📧 Email sent successfully to ${to} (Message ID: ${data.messageId})`);
    return data;
  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error(error.message);
    console.error("=================================");
    throw error;
  }
};

module.exports = sendEmail;