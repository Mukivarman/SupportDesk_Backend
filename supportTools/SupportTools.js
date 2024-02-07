const bcrypt=require('bcrypt');
const { error } = require('console');
require('dotenv').config()
const nodemailer=require('nodemailer')

/*pssword hash*/
const passwordhash=async(password)=>{
    try{
   const saltround=parseInt(process.env.salt);
   const salt=await bcrypt.genSalt(saltround);
   const hash= await bcrypt.hash(password,salt);
   if(hash){
    return hash;
   }
   else{
    return false
   }
  
    }catch(e){
        console.log(e)
    }

}


/*email check*/
const emailcheck=(email)=>{
    const emailregex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailregex.test(email)?true:false;
}


/*password check*/
const checkpassword=(word)=>{
    const upper=/[A-Z]/;
    const lower=/[a-z]/;
    const digit=/[0-9]/;
    const symbol=/[@#$?&*]/
    if(upper.test(word)&&lower.test(word)&&digit.test(word)&&symbol.test(word)){
        return true;
}
    else{
        return false;
}}

/*check Space*/

    const checkspace=(word)=>{
        const space=/\s/
    return space.test(word)? true:false;
}
/*sent mail*/
const mailsend=async(subject,text,email)=>{

try{
    const transport=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        auth:{
            user:process.env.gmail,
            pass:process.env.gmailkey,
        }
    })

    const options={
        from:process.env.gmail,
        to:email,
        subject:subject,
        text:text
    }
    const sendmail=await transport.sendMail(options)

}
catch(e){
    console.error(e)
}
}
module.exports={passwordhash,checkspace,checkpassword,emailcheck,mailsend}