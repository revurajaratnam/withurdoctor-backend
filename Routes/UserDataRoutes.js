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
Route.post("/api/auth/google",googleAuth)
Route.get("/api/auth/google",googleAuth)
// Route.post("/userlogin",userLogin)

const {
    getDoctorFee,
    getAvailabilitySummary,
    getSlotsForDate,
    createAppointment,
    cancelAppointment,
  } = require("../claudeAi/appointmentController");
const bookApp = require("../Controllers/BookAppointment");
const DrSignup = require("../Controllers/Signup");
  
  
  
  Route.get(
    "/doctors/:doctorId/fee",
    getDoctorFee
  );
  
  Route.get(
    "/doctors/:doctorId/availability",
    getAvailabilitySummary
  );
  
  Route.get(
    "/doctors/:doctorId/slots",
    getSlotsForDate
  );
  
  Route.post(
    "/appointments",
    createAppointment
  );
  
  Route.patch(
    "/appointments/:id/cancel",
    cancelAppointment
  );
  Route.post("/appointmentBooking",verifyToken,bookApp);

  
  // Named export to match your existing `const {Route} = require("./Routes/UserDataRoutes")` pattern
  module.exports = {Route }; //, AppointmentRoutes: Route