const nodemailer=require('nodemailer')
const { emailcheck, passwordhash } = require('../supportTools/SupportTools')
require('dotenv').config()


const sentOtpAndConfirmation=async(req,res)=>{
   const reqemail= req.body
    const email=reqemail.email
   console.log('hit'+reqemail.email)
   try{
    if(email){
     if(emailcheck(email)){
         const  transport=nodemailer.createTransport({
             host: "smtp.gmail.com",
             port: 587,
             auth: {
               user:process.env.gmail,
               pass:process.env.gmailkey,
             }
     })
     const otp=Math.round( Math.random()*1000000)
     console.log()
     const hashedotp=await passwordhash(otp.toString())
     if(hashedotp){
 
         const options={
             from: process.env.gmail,
             to: email,
             subject: 'OTP for Registration new User',
             text: `hello ${email} user Your  registration OTP is: ${otp} . please Enter the otp for submission `,
         }
        
         const sentmail=await transport.sendMail(options)
         console.log(sentmail)
         if(sentmail){
            
             const createotp={
                 Email:email,
                 Otp:hashedotp
             }
             res.status(200).json(createotp)
         }else{
             res.status(400).json({msg:'otp genration failed'})
         }
 
     }
 
     }else{
         res.status(400).json({msg:'enter valid email'})
     }
 
    }
    else{
     res.status(400).json({msg:'emailis required '})
    }
    
 

   }catch(e){
console.error(e)
   }
}
module.exports=sentOtpAndConfirmation