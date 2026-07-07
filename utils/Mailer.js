const nodemailer = require('nodemailer');
require('dotenv').config();
const User_Name = process.env.User_Name;
const User_Pass = process.env.User_Pass;
const transporter = nodemailer.createTransport({
host:"smtp.gmail.com",
port:587,
secure:false,
auth:{
user:User_Name,
pass:User_Pass

}
})

module.exports = transporter;