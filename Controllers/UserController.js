const {passwordhash,
    checkspace,
    checkpassword,
    emailcheck}=require('../supportTools/SupportTools');

    const bcrypt=require('bcrypt');
    const jwt=require('jsonwebtoken')
    const profileimg=require('../models/ProfileImgSchema')
    

const user=require('../models/Userschema');
const admin = require('../models/AdminSchema');
const SupportTeam = require('../models/SupportTeam');
const Ticket=require('../models/TicketSchema')

/*User registration process*/
const Create_user=async(req,res)=>{
    const {username,email,password}= req.body;
    console.log("line-6"+username+email+password)
        if(username!=""&&email!=""&&password!=""){
      if(!checkspace(username)&&emailcheck(email)&&!checkspace(password)){
        if(password.length>=8){
            if(checkpassword(password)){
                const user_name=await user.findOne({username})
                const user_email=await user.findOne({email})

                const admin_name=await admin.findOne({username})
                const admin_email=await admin.findOne({email})

                const support_name=await SupportTeam.findOne({username})
                const support_email=await SupportTeam.findOne({email})

              

                if(!(user_name)&&!(user_email)&&!admin_name&&!admin_email&&!support_name&&!support_email){
                    const hashed= await passwordhash(password);
                    try{
                        if(hashed){
                            const newuser=new user({
                                username:username,
                                email:email,
                                Password:hashed,
                               })
                             const create=await  user.create(newuser)
                             if(create)(res.status(200).json({msg:"user created"}))
                               else(res.status(400))

                        }
                    }catch(e){
                        console.error(e);
                    }

                }else if(user_email||user_name){
                    res.status(400).json({msg:"username or email already exit"})
                }

            }else{
                res.status(400).json({msg:"bad request"})
            }


        }else{
            return res.status(400).json({msg:"password too short"});
           }

        } else{
            return res.status(400).json({msg:"input details contain space or  enter valid email "});
        }
       
} else{
    return res.status(400).json({msg:"please enter valis details"});
    };
}


/* user Login process*/

const check=async(clintdb,userPassword,res,pro_img)=>{
    console.log(clintdb.Password+userPassword)
    
    const valid=  await bcrypt.compare(userPassword,clintdb.Password);
    
    console.log(valid)
    if(valid){
        
        const token=await jwt.sign({id:clintdb._id},process.env.SecretKey,{ expiresIn: '10d' });
        console.log(token)
        
        if(pro_img){
            console.log('jfnj')
            const imgexist=await profileimg.findOne({profile_id:clintdb._id})

      const  Loginnewuser={
            user_name:clintdb.username,
            power:clintdb.power,
            pro_img:imgexist?true:false,
            image:imgexist?imgexist.image:null,
            jwttoken:token
        }
        res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})
    }
        else{
          const  Loginnewuser={
                user_name:clintdb.username,
                power:clintdb.power,
                jwttoken:token,


        }
        res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})
    }

      
    }else{
       res.status(400).json({msg:"user not matched"})
    }
}


const Login=async(req,res)=>{
    const {log_detail,userPassword}=req.body;
    console.log(log_detail+" line 65 "+userPassword)
        if(log_detail!==""&&userPassword!==""){
            try{
    /*check if using  email tologin*/ 
             if(emailcheck(log_detail)){
                    const userdb=await user.findOne({email:log_detail});
                    const admindb=await admin.findOne({email:log_detail})
                    const Supportdb=await SupportTeam.findOne({email:log_detail})
                    
                    if(admindb){
                        const pro_img=false;
                       await check(admindb,userPassword,res,pro_img);
                    }
                   
                    else if(userdb){
                    console.log('user')
                           const pro_img=true;
                        await check(userdb,userPassword,res,pro_img);
            
                        }
                        else if(Supportdb)
                        {
                            const pro_img=false;
                            await check(Supportdb,userPassword,res,pro_img);

                        }
                    }
                       
                     else{
                            const userdb=await user.findOne({username:log_detail});
                            const admindb=await admin.findOne({username:log_detail})
                            const Supportdb=await SupportTeam.findOne({username:log_detail})

                            if(admindb){
                                const pro_img=false;
                               await check(admindb,userPassword,res,pro_img);
                            }
                           
                            else if(userdb){
                            console.log('user')
                                   const pro_img=true;
                                await check(userdb,userPassword,res,pro_img);
                    
                                }
                                else if(Supportdb){
                                    const pro_img=false;
                                    await check(Supportdb,userPassword,res,pro_img);

                                }else{
                                    res.status(400).json({msg:"email not found"})
                                          }
                
                                        }
            
          
            }catch(e){
                console.error(e);
            }

        }


}



/*handle profile pic updaate*/


const profile_pic=async(req,res)=>{
  const userid=req.authid
  
    const imgBuffer = req.file.buffer;
    const imgBase64 = imgBuffer.toString('base64');
    


      try{
          const imgexist=await profileimg.findOne({profile_id:userid})
          
          if(!imgexist){
              const store_img_db=await profileimg.create({
                  profile_id:userid,
                  image:imgBase64,
              })
              console.log(store_img_db +553)
                if(store_img_db){
                  const userupdateimg=  await user.findByIdAndUpdate(userid,{profile_img:store_img_db._id},{new:true})
                    if(userupdateimg){
                        res.status(200).json({msg:'imge stored',image:imgBase64})
                    }
                }
                
                
             
          

          }
          else{
            
            const imgupdate=  await profileimg.findByIdAndUpdate(imgexist._id,{image:imgBase64},{new:true})
             
              if(imgupdate){
                  res.status(200).json({msg:"img Updated",image:imgBase64})
                }else{
                  res.status(400).json({msg:"img update failed"})
                }
  

          }

          console.log(store_img_db)
         
         

      }
catch(e)
    {

    }
    
  
   
}


const userticketfilter=async(req,res)=>{
    console.log('hit')
        const userid=req.authid
       const filters= req.params.filter
       
       if(filters&&userid){
        if(filters==='Solved'||filters==='Pending'){
            console.log("solved")
            const data=await Ticket.find({Create_User:userid,Status:filters}).select('-Screenshots').populate('AssignedUser')
            if(data){
                res.status(200).json(data)
            }
           
       }
       
       }
       else{
        res.status(400)
       }
}


module.exports={Create_user,Login,profile_pic,userticketfilter};