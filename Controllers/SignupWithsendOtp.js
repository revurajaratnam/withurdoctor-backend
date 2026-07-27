const DrInfoData = require('../model/DrLoginInfo');
const transporter = require('../utils/Mailer')
require('dotenv').config();
const User_Name = process.env.User_Name;
const OTPStore ={};
  const onetimepass = async (req,res) =>{
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        await transporter.verify();
        console.log('OTP server is Established');
        
        console.log(req.body);
        
        const {email} = req.body;

        // const {VerifyOTP} =req.body;
        // OTPStore[email]=OTP;
        console.log("Verify Email:", email);
        console.log("OTPStore:", OTPStore);
        console.log("Stored OTP:", OTPStore[email]);
        // console.log("Entered OTP:", VerifyOTP);
            
            

         await transporter.sendMail({
            from:`WithUrDoctor<{$User_Name}>`,
            to:email,
            subject : "One Time Password",
            // text : `Youre OTP is : ${OTP} OTP Valid for 10 min only`,
            html:  `
            <h2>Email Verification</h2>
    
            <p>Click the button below to verify your email.</p>
    
            <a href="http://localhost:4545/VerifyEmail?email=${email}">
              Verify Email
            </a>
          `,
        })
        res.status(200).json({
            // message:"OTP sent successfully",
            // OTP:OTP,
            message:"Verification link sent Successfuly"
        })
        // if(OTP===VerifyOTP){
        //     res.status(200).json({
        //         message:"OTP Verified Succussfuly"
        //     })
        // }
    } catch (error) {
        res.status(500).json({
            message:"Verification link send Failed"
            // message:"Failed to send OTP",
            // error: error.message,
        })
        // if(OTP!==VerifyOTP){
        //     res.status(500).json({
        //         message:"Invalid OTP "
        //     })
        // }
        // console.log("OTP Verification is failed",err);
        
    }
  }

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
