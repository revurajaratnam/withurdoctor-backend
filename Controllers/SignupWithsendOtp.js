const DrInfoData = require('../model/DrLoginInfo');
const transporter = require('../utils/Mailer');
require('dotenv').config();

const User_Name =
  process.env.User_Name ||
  process.env.USER_NAME ||
  process.env.EMAIL ||
  process.env.GMAIL_USER;

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://withurdoctor.vercel.app';

const onetimepass = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!User_Name || !process.env.User_Pass && !process.env.USER_PASS && !process.env.GMAIL_APP_PASSWORD && !process.env.EMAIL_PASS && !process.env.APP_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Email configuration is missing. Add Gmail SMTP credentials in Render environment variables.',
      });
    }

    await transporter.verify();
    console.log('SMTP server is established');

    await transporter.sendMail({
      from: User_Name,
      to: email,
      subject: 'Verify your WithUrDoctor account',
      html: `
        <h2>Email Verification</h2>
        <p>Click the button below to verify your email.</p>
        <a href="${FRONTEND_URL}/Login?email=${encodeURIComponent(email)}">
          Verify Email
        </a>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Verification link sent successfully',
    });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Verification link send failed',
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email } = req.query;

    await DrInfoData.updateOne(
      { email },
      { $set: { isVerified: true } }
    );

    return res.redirect(`${FRONTEND_URL}/Login`);
  } catch (error) {
    console.error('Verification failed:', error);
    return res.send('Verification Failed');
  }
};

module.exports = { onetimepass, verifyOTP };
