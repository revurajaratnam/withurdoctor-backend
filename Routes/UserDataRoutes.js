const Route = require("express").Router();
const multer = require("multer");
const { UserDataContoller }=require("../middlewares/UserAuth");
const { onetimepass, verifyOTP } = require("../Controllers/sendOtp");
const {  LoginInfo } = require("../Controllers/Login");
const verifyToken = require("../middlewares/verificationOfToken");
const {dashboard} = require("../Controllers/Dashboard");
const {drdata, getDoctorData} = require("../Controllers/drData");
const upload = require("../middlewares/gallary");
const { googleAuth } = require("../Controllers/googleAuth");
const { userLogin } = require("../Controllers/UserLogin");
const { doctorOnly } = require("../middlewares/dr-only");


Route.post("/signup",UserDataContoller,onetimepass);
Route.post("/VerifyEmail",verifyOTP);
Route.post("/resendOTP",onetimepass);
Route.get("/signup",LoginInfo);
Route.post("/Login",LoginInfo)
Route.get("/Profile",verifyToken,dashboard)
Route.get("/VerifyEmail",verifyOTP)
Route.post("/drData",upload.fields([
    {name:"profilephoto",maxCount:1},
    {name:"gallery", maxCount:10}
]),drdata);
Route.get("/drData",getDoctorData)
Route.post("/api/auth/google",googleAuth)
Route.get("/api/auth/google",googleAuth)
// Route.post("/userlogin",userLogin)




module.exports={Route}