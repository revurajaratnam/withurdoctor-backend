const {DrProfialInfoData} = require("../model/DrProfileInfo");
const sharp = require('sharp');
const fs = require('fs');


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
    const dr= await DrProfialInfoData.find();
    res.status(200).json(dr);
   } catch (error) {
        console.log(error);
        res.json(
            {error:error}
        )
   }
}
// 1781694557646-390000729-01.jpg
module.exports = {drdata,getDoctorData}