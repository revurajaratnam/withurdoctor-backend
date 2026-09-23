const nodemailer = require('nodemailer');
require('dotenv').config();

const User_Name =
  process.env.User_Name ||
  process.env.USER_NAME ||
  process.env.EMAIL ||
  process.env.GMAIL_USER;

const User_Pass =
  process.env.User_Pass ||
  process.env.USER_PASS ||
  process.env.EMAIL_PASSWORD ||
  process.env.GMAIL_APP_PASSWORD ||
  process.env.EMAIL_PASS ||
  process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: User_Name,
    pass: User_Pass,
  },
});

module.exports = transporter;