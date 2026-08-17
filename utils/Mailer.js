const { Resend } = require("resend");

const transporter = new Resend(
  process.env.RESEND_API_KEY
);

module.exports = transporter;