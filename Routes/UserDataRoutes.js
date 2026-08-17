const Route = require("express").Router();
const multer = require("multer");
const { UserDataContoller }=require("../middlewares/UserAuth");
const { onetimepass, verifyOTP } = require("../Controllers/SignupWithsendOtp");
const {  LoginInfo } = require("../Controllers/Login");
const verifyToken = require("../middlewares/verificationOfToken");
const {dashboard} = require("../Controllers/Dashboard");
const {drdata, getDoctorData} = require("../Controllers/drData");
const upload = require("../middlewares/gallary");
const { googleAuth } = require("../Controllers/googleAuth");
const { userLogin } = require("../Controllers/UserLogin");
const { doctorOnly } = require("../middlewares/dr-only");
const {drDataSignup} = require("../Controllers/Signup")





Route.post("/signup",UserDataContoller,onetimepass);
Route.post("/VerifyEmail",verifyOTP);
Route.post("/resendOTP",onetimepass);
Route.get("/signup",drDataSignup);
Route.post("/Login",LoginInfo)
// Route.post("/userLogin",LoginInfo)
Route.get("/Profile",verifyToken,dashboard)
Route.get("/VerifyEmail",verifyOTP)
Route.post("/drData",upload.fields([
    {name:"profilephoto",maxCount:1},
    {name:"gallery", maxCount:10}
]),drdata);
Route.get("/drData",getDoctorData)
Route.get("/drdata",getDoctorData)
Route.post("/api/auth/google",googleAuth)
Route.get("/api/auth/google",googleAuth)
// Route.post("/userlogin",userLogin)
Route.get("/", (req, res) => {
    res.send("Server is running");
  });

const bookApp = require("../Controllers/BookAppointment");
const DrSignup = require("../Controllers/Signup");
  
  Route.post("/appointmentBooking", (req, res, next) => {
    console.log("Appointment payload before auth:", req.body);
    next();
  }, verifyToken, bookApp);

  
  
  module.exports = {Route }; 