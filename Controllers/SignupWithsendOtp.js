const DrInfoData = require("../model/DrLoginInfo");
const transporter = require("../utils/Mailer");

const User_Name = process.env.EMAIL;

const SERVER_PORT = process.env.PORT || 3500;

// Production URL
const SERVER_HOST =
  process.env.SERVER_HOST || "https://withurdoctor.onrender.com";

const onetimepass = async (req, res) => {
  try {
    console.log("Signup request:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    console.log("Sending verification email to:", email);

    const info = await transporter.sendMail({
      from: `"WithUrDoctor" <${User_Name}>`,
      to: email,
      subject: "Verify your WithUrDoctor account",

      html: `
        <h2>Email Verification</h2>

        <p>Click the button below to verify your email.</p>

        <a href="${SERVER_HOST}/VerifyEmail?email=${encodeURIComponent(email)}">
          Verify Email
        </a>
      `,
    });

    console.log("Email sent successfully:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Verification link sent successfully",
    });

  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Verification link send failed",
      error: error.message,
    });
  }
};


const verifyOTP = async (req, res) => {
  try {
    const { email } = req.query;

    await DrInfoData.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
        },
      }
    );

    return res.redirect(
      "https://withurdoctor.vercel.app/Login"
    );

  } catch (error) {
    console.error("Verification failed:", error);

    return res.status(500).send("Verification Failed");
  }
};


module.exports = {
  onetimepass,
  verifyOTP,
};