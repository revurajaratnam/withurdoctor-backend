    const drData= require("../model/DrLoginInfo");

    const UserDataContoller= async (req,res,next) =>{
       try {
        const { 
            fullname,
            email,
            pass,
            cpass,
        }   = req.body;
       
        if(pass!==cpass){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"

            });
        }
        const existingUser = await drData.findOne({email});
        if(existingUser){
            return res.json({
                success:false,
                message:"This email address already exists in your account."
            });
        }
        const user = new drData(req.body);
        await user.save();
        console.log(req.body);
            next()
       } catch (error) {
            res.status(500).json({
                success:false,
                message:"Server Error"
            })
       }
           
          
    }


    module.exports={UserDataContoller}