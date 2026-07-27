const DrInfoData = require("../model/DrLoginInfo");

const drDataSignup = async (req,res) => {
    const drLoginData = new DrInfoData.create({
        fullname:req.body.fullname,
        email:req.body.email,
        pass:req.body.pass,
      })
      res.json({
        message:"its coming dont worry"
      })
}
module.exports = {drDataSignup};