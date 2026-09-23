const { Resend } = require("resend");

const apiKey = process.env.RESEND_API_KEY;

let transporter = null;

if (apiKey) {
  transporter = new Resend(apiKey);
} else {
  console.warn(
    "RESEND_API_KEY is not configured. Email sending is disabled until a valid key is added to the environment."
  );
}

const sendEmail = async ({ from, to, subject, html }) => {
  if (!transporter) {
    const error = new Error(
      "RESEND_API_KEY is missing. Add RESEND_API_KEY to your .env file to enable email sending."
    );
    error.code = "RESEND_API_KEY_MISSING";
    throw error;
  }

  return transporter.emails.send({
    from,
    to,
    subject,
    html,
  });
};

module.exports = {
  transporter,
  sendEmail,
};