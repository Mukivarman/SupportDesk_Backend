const mongoose=require('mongoose')

const newadmin=mongoose.Schema({
    username:{
   type:String,
   required:true,
   unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
    },
    power:{
        type:String,
        required:true,
        default:"Admin",
    },
  

})
module.exports=mongoose.model("AdminSchema",newadmin)