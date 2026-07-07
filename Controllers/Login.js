const DrInfoData = require("../model/DrLoginInfo");
const jwt = require('jsonwebtoken')

const LoginInfo = async (req, res) => {
  try {
    const { email, pass } = req.body;


    const user = await DrInfoData.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Your email verification is still pending. Please verify your email first.",
      });
    }

    if (user.pass !== pass) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = jwt.sign({id:user._id, email:user.email,role:"doctor" }, "hello", { expiresIn: "1h" });  
    return res.json({
      success: true,
      message: "Login Successful",
      token,
      user:{
        email:user.email,
        role: "doctor",
      }
      
    });
    console.log(token);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  LoginInfo,
};