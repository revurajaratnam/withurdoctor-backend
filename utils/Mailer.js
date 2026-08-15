const nodemailer = require('nodemailer');
require('dotenv').config();
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
const transporter = nodemailer.createTransport({
host:"smtp.gmail.com",
port:587,
secure:true,
auth:{
user:process.env.EMAIL,
pass:process.env.EMAIL_PASSWORD

}
})

module.exports = transporter;