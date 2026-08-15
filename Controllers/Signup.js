const DrInfoData = require("../model/DrLoginInfo");

const drDataSignup = async (req, res) => {
  try {
    const drLoginData = await DrInfoData.create({
      fullname: req.body.fullname,
      email: req.body.email,
      pass: req.body.pass,
    });

    res.status(201).json({
      success: true,
      message: "Doctor signup created successfully.",
      doctor: {
        id: drLoginData._id,
        email: drLoginData.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Signup failed.",
      error: error.message,
    });
  }
};

module.exports = {drDataSignup};