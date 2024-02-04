const  jwt=require('jsonwebtoken');
const user=require('../models/Userschema');
const AdminSchema = require('../models/AdminSchema');
const SupportTeam = require('../models/SupportTeam');


const authuser=async(req,res,next)=>{
    try {
        const  authorization = req.headers.authorization;
    
        if (!authorization) {
          return res.status(400).json({ msg: "Authentication failed: No token provided" });
        }
    
        const token = authorization.split(" ")[1];
      
        if(!token){
          res.status(400).json({msg:'token need'})
        }
        const authuser = jwt.verify(token, process.env.SecretKey);
       
        console.log(authuser.id+'auth 22')
    
        const authdb = await user.findById({ _id: authuser.id });
        

       if (!authdb) {
          const Support=await SupportTeam.findById({_id:authuser.id})
          if(!Support){
            const  admin=await AdminSchema.findById({_id:authuser.id})
              if(!admin){
                return res.status(401).json({ msg: "Authentication failed: Invalid user" });
              }else{
                req.authid=admin._id
                req.authpower=admin.power
                next();
              }
          }else{
            req.authid=Support._id
            req.authpower=Support.power
              next();

          }
          
        }else{
          req.authid=authdb._id
          req.authpower=authdb.power
            next();
        }

    
    } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error" });
          }


}
module.exports=authuser