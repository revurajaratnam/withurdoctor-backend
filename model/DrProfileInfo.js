const mongoose = require("mongoose");

const drProfileinfoSchema= mongoose.Schema({
        fullname:{
            type:String,
            required:true
        },
        about:{
            type:String,
            maxlength:350
        },
        address:{
            type:String,
            maxLength:100
        },
        experience:{
            type:String
        },
        qualification:{
            type:String
        },
        specialization:{
            type:String
        },
        surgeries:{
            type:String
        },
        consultation:{
            type:Number,

        },
        languages:{
            type:String
        },
        profilephoto:{
            type:String
        },
        gallery:[{
            type:String
        }],
        hfeed:{
            type:String
        },
        consult:{
            type:String
        }
});

const DrProfialInfoData = mongoose.model("DrprofileData",drProfileinfoSchema);

    module.exports = {DrProfialInfoData};