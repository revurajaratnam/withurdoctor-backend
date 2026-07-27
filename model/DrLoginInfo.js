const mongoose  = require('mongoose');

    const DrInfo = new  mongoose.Schema({
            fullname:{
                type:String,
                required:true,
                maxlength:[30,"Name cannot be more than 30 charact"]
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            pass:{
                type:String,
                required:true,
                maxlength:[15],
            },
            isVerified:{
                type:Boolean,
                default:false
            },
            // expireAt:{
            //     type:Date,
            //     default:new Date(Date.now() + 10*60*100),
            //     expires:0,
            // }
    });

    const DrInfoData = mongoose.model("DrData",DrInfo);
    module.exports = DrInfoData;