const mongoose=require('mongoose');
require('dotenv').config()

const connect=async()=>{
    try{
        const db=  await mongoose.connect(process.env.mongodb);
        if(db){
            console.log("db connected");
        }
    }catch(e){
        console.error(e);
        process.exit(1);
        
    }
}
module.exports=connect;