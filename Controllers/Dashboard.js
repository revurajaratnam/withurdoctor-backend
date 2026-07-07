
const dashboard = (req,res)=>{
    res.json({
        message:"dashboard",
        user:req.user,
       
    })
}

module.exports = {dashboard}; 