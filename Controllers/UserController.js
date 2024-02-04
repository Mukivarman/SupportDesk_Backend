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
const Ticket=require('../models/TicketSchema');
const { notify, use } = require('../Router/ProjectRouter');

/*User registration process*/
const otpvaild=async(email,otp,pto,otpemail)=>{
    if(email===otpemail){
        const valid=  await bcrypt.compare(otp,pto);
        console.log(valid)
        if(valid){
            return true;
        }else{
            return false
        }

    }
    return false
}

const Create_user=async(req,res)=>{

    const {username,email,password,otp,pto,otpemail}= req.body;
    
    try{

        if(username!=""&&email!=""&&password!=""){
       if(!checkspace(username)&&emailcheck(email)&&!checkspace(password)){
        if(password.length>=8){
            if(checkpassword(password)){
                if(await otpvaild(email,otp,pto,otpemail)){
                    const user_name=await user.findOne({username})
                    const user_email=await user.findOne({email})
    
                    const admin_name=await admin.findOne({username})
                    const admin_email=await admin.findOne({email})
    
                    const support_name=await SupportTeam.findOne({username})
                    const support_email=await SupportTeam.findOne({email})
    
                  
    
                    if(!(user_name)&&!(user_email)&&!admin_name&&!admin_email&&!support_name&&!support_email){
                        const hashed= await passwordhash(password);
                    
                            if(hashed){
                                const newuser=new user({
                                    username:username,
                                    email:email,
                                    Password:hashed,
                                   })
                                 const create=await  user.create(newuser)
                                 if(create)(res.status(200).json({msg:"user created"}))
                                   else(res.status(400).json({msg:'failed to store data'}))
    
                            }else{
                                res.status(400).json({msg:'pasword hasing failed'})
                            }
                     
    
                    }else if(user_email||user_name){
                        res.status(400).json({msg:"username or email already exit"})
                    }
    
                }else{
                    res.status(400).json({msg:"otp not matched"})
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
    
}catch(e){
    console.log(e)
}
}


/* user Login process*/

const check=async(clintdb,userPassword,res,pro_img)=>{
   
    const valid=  await bcrypt.compare(userPassword,clintdb.Password);
   

        if(valid){
        
            const token=await jwt.sign({id:clintdb._id},process.env.SecretKey,{ expiresIn: '10d' });
            if(token){
                
            if(pro_img){
        
                const imgexist=await profileimg.findOne({profile_id:clintdb._id})
                console.log(clintdb.department+clintdb.EmployeeCode)
          const  Loginnewuser={
                user_name:clintdb.username,
                power:clintdb.power,
                pro_img:imgexist?true:false,
                image:imgexist?imgexist.image:null,
                jwttoken:token,
                dept:clintdb.department,
                empcode:clintdb.EmployeeCode,

                
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
    
    
            }
            else{
                rse.status(400).json({mdg:'jwt failed'})
            }
            
          
        }else{
           res.status(400).json({msg:"user not matched"})
        }
  
}


const Login=async(req,res)=>{
    const {log_detail,userPassword}=req.body;
    
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
                 
                           const pro_img=true;
                        await check(userdb,userPassword,res,pro_img);
            
                        }
                  else if(Supportdb)
                        {
                            const pro_img=false;
                            await check(Supportdb,userPassword,res,pro_img);

                        }else{
                            res.status(400).json({msg:'email not exist'})
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
                                    res.status(400).json({msg:"username or email not found"})
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
  const departmentinfo=JSON.parse(req.body.inputs)
  console.log(departmentinfo)
 
  const usersupdate=async(store_db,imgBase64)=>{


    const update_user_img=  await user.findByIdAndUpdate(userid,{
                profile_img:store_db._id,
                department:departmentinfo.department,
                EmployeeCode:departmentinfo.EMPcode},
                {new:true})
                
      if(update_user_img){
            res.status(200).json({msg:'imge stored',
            image:imgBase64,
            dept:update_user_img.department,
            empcode:update_user_img.EmployeeCode})
      }else{
            res.status(400).json({msg:'create failed'})
}
  }
      try{
            if(userid&&imgBuffer){
                const imgBase64 = imgBuffer.toString('base64');
                const imgexist=await profileimg.findOne({profile_id:userid})
                if(!imgexist){
                    const store_db=await profileimg.create({
                        profile_id:userid,
                        image:imgBase64,
                    })
                      if(store_db){
                      usersupdate(store_db,imgBase64)
                      }else{
                        res.status(400).json({msg:"creation failed"})
                      }
                      
      
                }
                else{
                  
                  const store_db=  await profileimg.findByIdAndUpdate(imgexist._id,{image:imgBase64},{new:true})
                   
                    if(store_db){
                       usersupdate(store_db,imgBase64)
                      }else{
                        res.status(400).json({msg:"img update failed"})
                      }
        
      
                }
            }else{
                res.status(400).json({msg:"datas required"})
            }

      }
catch(e)
    {
        console.error(e)
    }
    
  
   
}


const userticketfilter=async(req,res)=>{
        const userid=req.authid
       const filters= req.params.filter
       try{
        if(filters&&userid){
            if(filters==='Solved'||filters==='Pending'||filters==='waiting'||filters==='OnHold'){
                const data=await Ticket.find({Create_User:userid,Status:filters}).select('-Screenshots').populate('AssignedUser')
                if(data){
                    res.status(200).json(data)
                }
                else{
                    res.status(400).json({msg:"fetching faild"})
                }
               
           }else{
            res.status(400).json({msg:'unsopported filters'})
           }
           
           }
           else{
            res.status(400).json({msg:"user id filtets need"})
           }
       }catch(e){
        console.error(e)
       }
      
}

const usernotification=async(req,res)=>{
    const userid=req.authid
    const power=req.authpower

    if(userid&&power){
        if(power==='User'){
                const usernotifi=await user.findById(userid).select('Notification')
                console .log(usernotifi)
            if(usernotifi){
                res.status(200).json(usernotifi)
            }
            else{
                res.status(400).json({msg:'notification fetching failed'})
            }
        }
    }
    else{
        res.status(400).json({msg:'req details error'})
    }


}

const deleteNotification=async(req,res)=>{
    const userid=req.authid
    const power=req.authpower
    const notificationid=req.params.notificationid
    if(power==='User'){
        const deleteAlerts=await user.findByIdAndUpdate(userid,{$pull:{Notification:{_id:notificationid}}})
        res.status(200).json()
    }
}



const userStatus=async(req,res)=>{

    const tmid=req.authid
    const power=req.authpower 
    try{
        if(tmid&&power){
            if(power==='User'){
                
    const pending=await  Ticket.find({ Create_User: tmid}).countDocuments({ Status: 'Pending'});
    const solved=await  Ticket.find({ Create_User:tmid}).countDocuments({Status:'Solved'})
    const waiting=await Ticket.find({Create_User:tmid}).countDocuments({Status:'waiting'})
    const onhold=await Ticket.find({Create_User:tmid}).countDocuments({Status:'OnHold'})
    const total=await  Ticket.find({ Create_User:tmid}).countDocuments({})
    
                    
    const data={
        Total:total,
        Solved:solved,
        Pending:pending,
        Waiting:waiting,
        OnHold:onhold,
    }

    if(data)(res.status(200).json(data))
    else(res.status(400).json({msg:'data fetching failed'}))
    
            }else{
                res.status(400).json({msg:'you Request not allowed'})
            }
    
    
        }else{
            res.status(400).json({msg:'supporttm id is required'})
        }
    }catch(e){
        console.error(e)
    }

}


module.exports={Create_user,Login,profile_pic,userticketfilter,usernotification,deleteNotification,userStatus};