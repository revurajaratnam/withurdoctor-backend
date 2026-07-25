const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            message:"No token provided",
        })
    }

    const token = authHeader.split(" ")[1];
    try {
        const verify = jwt.verify(token,process.env.JWT_SECRET);
        console.log(verify);
        req.user = verify
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid expired token"
        })
    }

}

module.exports = verifyToken;