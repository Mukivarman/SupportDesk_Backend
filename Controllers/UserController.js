const {passwordhash,
    checkspace,
    checkpassword,
    emailcheck}=require('../supportTools/SupportTools');

    const bcrypt=require('bcrypt');
    const jwt=require('jsonwebtoken')
    const profile_img=require('../models/ProfileImgSchema')
    

const user=require('../models/Userschema')


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
                if(!(user_name)&&!(user_email)){
                    const hashed= await passwordhash(password);
                    try{
                        if(hashed){
                            const newuser=new user({
                                username:username,
                                email:email,
                                Password:hashed,
                               })
                             const create=await  user.create(newuser).then(res.status(200).json({msg:"user created"}))
                               

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

const check=async(dbuser,userPassword,res)=>{
    
    const valid=  await bcrypt.compare(userPassword,dbuser.Password);

    if(valid){
        console.log(dbuser._id+" uygfu "+dbuser)
        const token=await jwt.sign({id:dbuser._id},process.env.SecretKey,{ expiresIn: '10d' });
        console.log(token)
        const Loginnewuser={
            userid:dbuser._id,
            user_name:dbuser.username,
            emial:dbuser.email,
            power:dbuser.power,
            jwttoken:token

        }
       res.status(200).json({msg:"You Are Loggin",loginnewuser:Loginnewuser})
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
                    const dbuser=await user.findOne({email:log_detail});
                        if(dbuser){
                           
                        await check(dbuser,userPassword,res);
            
                        }else{
                            res.status(400).json({msg:"email not found"})
                                  }
                            }
                else{
                    const dbuser=await user.findOne({username:log_detail});
                    if(dbuser){
                    
                    await  check(dbuser,userPassword,res);
                
                    }else{
                        res.status(400).json({msg:"username not found"})
                        
                    }
                
            
            }
            }catch(e){
                console.error(e);
            }

        }


}



/*handle profile pic updaate*/


const profile_pic=async(req,res)=>{
  
  
    const imgBuffer = req.file.buffer;
    const imgBase64 = imgBuffer.toString('base64');
    const authuser=req.body.authuser;
    const Loginuser=JSON.parse(authuser)
      try{
          const imgexist=await profile_img.findOne({profile_id:Loginuser.userid})
          if(!imgexist){

              const store_img_db=await profile_img.create({
                  profile_id:Loginuser.userid,
                  image:imgBase64,
              }).then(await user.findByIdAndUpdate(Loginuser.userid,{profile_img:store_img_db})).then(res.status(200).json({msg:"img stored"})).then()
             
           console.log(store_img_db)

          }
          else{
            
            const imgupdate=  await profile_img.findByIdAndUpdate(imgexist._id,{image:imgBase64},{new:true})
             
              if(imgupdate){
                  res.status(200).json({msg:"img Updated"})
                }else{
                  res.status(400).json({msg:"img update failed"})
                }
  

          }

          console.log(store_img_db)
         
         

      }
catch(e)
    {

    }
    console.log(JSON.parse(authuser))
  
   
}



module.exports={Create_user,Login,profile_pic};