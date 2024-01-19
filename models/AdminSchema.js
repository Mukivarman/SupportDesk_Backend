const mongoose=require('mongoose')

const newadmin=mongoose.Schema({
    admin_username:{
   type:String,
   required:true,
   unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profile_img:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile_img'
    },
    power:{
        type:String,
        required:true,
        default:"Admin",
    },
  

})