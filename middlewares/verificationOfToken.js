const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{

    console.log("===== TOKEN CHECK =====");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Authorization:", req.headers.authorization);
    console.log("Request body:", req.body);

    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer")){
        console.log("Token missing or malformed. Request blocked before controller.");
        return res.status(401).json({
            success:false,
            message:"No token provided",
        })
    }

    const token = authHeader.split(" ")[1];
    try {
        const verify = jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token:", verify);
        req.user = verify
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        return res.status(401).json({
            message:"Invalid expired token"
        })
    }

}

module.exports = verifyToken;