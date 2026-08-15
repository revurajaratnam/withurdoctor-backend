const DrInfoData = require('../model/DrLoginInfo');
const transporter = require('../utils/Mailer');
require('dotenv').config();
const User_Name = process.env.User_Name;
const SERVER_PORT = process.env.PORT || 3500;
const SERVER_HOST = process.env.SERVER_HOST || `http://localhost:${SERVER_PORT}`;
const OTPStore = {};

const onetimepass = async (req, res) => {
  try {
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    await transporter.verify();
    console.log('OTP server is Established');

    console.log(req.body);

    const { email } = req.body;

    console.log('Verify Email:', email);
    console.log('OTPStore:', OTPStore);
    console.log('Stored OTP:', OTPStore[email]);

    await transporter.sendMail({
      from: `WithUrDoctor <${User_Name}>`,
      to: email,
      subject: 'One Time Password',
      html: `
            <h2>Email Verification</h2>
            <p>Click the button below to verify your email.</p>
            <a href="${SERVER_HOST}/VerifyEmail?email=${email}">
              Verify Email
            </a>
          `,
    });

    res.status(200).json({
      message: 'Verification link sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Verification link send failed',
      error: error.message,
    });
  }
};

  const verifyOTP = async (req,res) =>{
    try {
        const {email}= req.query;

    await DrInfoData.updateOne(
        {email},
        {
            $set:{
                isVerified:true,
            }
        }
    )
    return res.redirect("http://localhost:5173/Login");
    } catch (error) {
        res.send("Verification Failed")
    }

  }
  



  module.exports ={ onetimepass,verifyOTP}
