const  jwt=require('jsonwebtoken');
const user=require('../models/Userschema');
const AdminSchema = require('../models/AdminSchema');
const SupportTeam = require('../models/SupportTeam');


const authclint=async(req,res,next)=>{
    try {
        const  authorization = req.headers.authorization;
    
        if (!authorization) {
          return res.status(400).json({ msg: "Authentication failed: No token provided" });
        }
    
        const token = authorization.split(" ")[1];
        const authuser = jwt.verify(token, process.env.SecretKey);
       
        console.log(authuser.id)
    
        const authdb = await user.findById({ _id: authuser.id });
        

       if (!authdb) {
          const Support=await SupportTeam.findById({_id:authuser.id})
          if(!Support){
            const  admin=await AdminSchema.findById({_id:authuser.id})
              if(!admin){
                return res.status(401).json({ msg: "Authentication failed: Invalid user" });
              }else{
                const  Loginnewuser={
                    user_name:admin.username,
                    power:admin.power,
                    jwttoken:token,
    
    
            }
            res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})
              }
          }else{
           
            const  Loginnewuser={
                user_name:Support.username,
                power:Support.power,
                jwttoken:token,


        }
        res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})

          }
          
        }else{
            const  Loginnewuser={
                user_name:authdb.username,
                power:authdb.power,
                jwttoken:token,
                pro_img:false


        }
        res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})

        }

    
    } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal server error" });
          }


}
module.exports=authclint