const DrInfoData = require("../model/DrLoginInfo");
const jwt = require('jsonwebtoken')

const LoginInfo = async (req, res) => {
  try {
    const { email, pass  } = req.body;
    

    const user = await DrInfoData.findOne({ email:email.trim() });

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
    const token = jwt.sign({id:user._id, email:user.email,name:user.fullname ,role:user.role}, process.env.JWT_SECRET, { expiresIn: "12h" });  
    return res.json({
      success: true,
      message: "Login Successful",
      token,
      user:{
        _id : user._id,
        name:user.fullname,
        email:user.email,
        role: user.role,
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