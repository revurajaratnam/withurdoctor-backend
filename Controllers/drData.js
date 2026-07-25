const DrProfialInfoData = require("../model/DrProfileInfo");
const sharp = require('sharp');
const fs = require('fs');
const mongoose = require("mongoose");


const drdata = async (req,res) =>{
   const drprofileDB= new DrProfialInfoData({
            fullname:req.body.fullname,
            about:req.body.about,
            address:req.body.address,
            experience:req.body.experience,
            qualification:req.body.qualification,
            specialization:req.body.specialization,
            surgeries:req.body.surgeries,
            consultation:req.body.consultation,
            languages:req.body.languages,
            profilephoto:req.files.profilephoto ? req.files.profilephoto[0].filename : null,
            gallery:req.files.gallery ? req.files.gallery.map(file => file.filename) : [],
            hfeed:req.body.hfeed,
            consult:req.body.consult

   });
   if (req.files && req.files.profilephoto) {
    try {
        const uploadedFilePath = req.files.profilephoto[0].path;
        const watermarkedPath = uploadedFilePath + '-watermarked.jpg';

        const svgWatermark = `
            <svg width="200" height="200">
                <text x="10" y="180" font-size="24" fill="rgba(255,255,255,0.5)" font-weight="bold">
                    WithUrDoctor
                </text>
            </svg>
        `;

        await sharp(uploadedFilePath)
            .composite([{ input: Buffer.from(svgWatermark), gravity: 'southeast' }])
            .toFile(watermarkedPath);

        fs.unlinkSync(uploadedFilePath);
        fs.renameSync(watermarkedPath, uploadedFilePath);
    } catch (error) {
        console.log("Watermark error:", error);
    }
}
   const savedData = await drprofileDB.save();
    console.log(req.files.gallery);
    console.log(req.body);

    res.json({
        message:"Ruko jara "
    })
}

const getDoctorData = async (req,res)=>{
   try {
  const limit = 10;
  const {cursor , search , location , phone , id, gender , experienceMin , experienceMax ,consultationFeeMin ,consultationFeeMax} = req.query;
  const filter = {};
  if(cursor) filter._id = {$gt:cursor};
  
  if (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid doctor id" });
    }
    filter._id = id;
  }
  if(phone) filter.phone = phone;
  if(location) filter.address = {$regex: location , $options: "i"};
  if(gender) filter.gender ={$regex: `^${gender}$`,$options:"i"}
  if(experienceMin || experienceMax) {
    filter.experience ={};
  if(experienceMin) filter.experience.$gte= Number(experienceMin)
  if(experienceMax) filter.experience.$lte= Number(experienceMax)
  }
 if(consultationFeeMin || consultationFeeMax){
    filter.consultationFee ={};
    if(consultationFeeMin) filter.consultationFee.$gte =Number(consultationFeeMin)
        if(consultationFeeMax) filter.consultationFee.$lte =Number(consultationFeeMax)
 }

  if(search){
    filter.$or =[
      {fullname:{$regex:search , $options:"i"}},
      {specialization:{$regex:search, $options:"i"}}
    ];
  }
  const doctors = await DrProfialInfoData.find(filter).sort({_id:1}).limit(limit);
  const nextCursor = doctors.length > 0 ? doctors[doctors.length-1]._id:null;


  res.status(200).json({
    data:doctors,
    nextCursor,
    hasMore : doctors.length === limit
  })

   
   }  catch (error) {
    console.log(error); 
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
// 1781694557646-390000729-01.jpg
module.exports = {drdata,getDoctorData}