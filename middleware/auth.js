const  jwt=require('jsonwebtoken');
const user=require('../models/Userschema')

const authuser=async(req,res,next)=>{
    try {
        const  authorization = req.headers.authorization;
    
        if (!authorization) {
          return res.status(400).json({ msg: "Authentication failed: No token provided" });
        }
    
        const token = authorization.split(" ")[1];
        const authuser = jwt.verify(token, process.env.SecretKey);
       
        console.log(authuser.id)
    
        const authdb = await user.findById({ _id: authuser.id });
        console.log(authdb)
        if (!authdb) {
          return res.status(401).json({ msg: "Authentication failed: Invalid user" });
        }else{
            next();
        }

    
    } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error" });
          }


}
module.exports=authuser