const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"No token provided",
        })
    }

    const token = authHeader.split(" ")[1];
    try {
        const verify = jwt.verify(token,"hello")
        console.log(verify);
        req.users = verify
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid expired token"
        })
    }

}

module.exports = verifyToken;