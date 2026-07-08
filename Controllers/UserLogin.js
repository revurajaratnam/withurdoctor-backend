const DrInfoData = require("../model/DrLoginInfo")
const jwt = require("jsonwebtoken")

const userLogin = async (req , res )=>{
    const {email, pass} = req.body
    console.log(req.body);
    const user = await DrInfoData.findOne({email});
        try {
            
           if(!user){
            res.json({
                message:"User Not Found"
            })
        }
            if(user.pass !== pass){
           res.json({
            message:"Invalid password"
           })
            }
            const token = jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:"1hr"});
            return res.json({
                id:user._id,
                token,
                success:true,
                message:"Login Successful",
                user:{
                    email:user.email,
                    role:"user"
                }

            })
           
        } catch (error) {
            res.json({
                message:"Error Occurred"
            
        })
}
}

module.exports = {userLogin}