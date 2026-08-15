const nodemailer = require("nodemailer");

console.log("Mail service starting...");
console.log("BREVO USER exists:", !!process.env.BREVO_SMTP_USER);
console.log("BREVO KEY exists:", !!process.env.BREVO_SMTP_KEY);
console.log("EMAIL exists:", !!process.env.EMAIL);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

module.exports = transporter;