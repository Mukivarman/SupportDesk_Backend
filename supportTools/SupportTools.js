const bcrypt=require('bcrypt')

/*pssword hash*/
const passwordhash=async(password)=>{
    try{
   const saltround=parseInt(process.env.salt);
   const salt=await bcrypt.genSalt(saltround);
   const hash= await bcrypt.hash(password,salt);
   return hash;
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

module.exports={passwordhash,checkspace,checkpassword,emailcheck}