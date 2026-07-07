const mongoose = require("mongoose");
                 require("dotenv").config();
const DbURL= process.env.DB_URL
const dns = require('dns')
dns.setServers(['4.4.4.4','8.8.8.8'])
const dbconnect = mongoose.connect(process.env.DB_URL)
                  .then(()=>{
                    console.log("Connection Established");
                   
                  }).catch((err)=>{
                    console.log("Connection error",err);
                   
                  })

module.exports = {dbconnect};