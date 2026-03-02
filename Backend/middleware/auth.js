const jwt=require("jsonwebtoken")
function requireAuth(req,res,next){
    const token=req.cookies?.token
    if (!token) return res.status(401).json({message:"Not logged in"});
    try {
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        req.user=payload;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid Token"});
    }
}
module.exports={requireAuth};