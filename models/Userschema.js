
const mongoose=require('mongoose');



const userschema=mongoose.Schema;
 const newschema=new userschema({
    username:{
        type:String,
        required:true,
        unique:true,
      },
      Password:{
        type:String,
        required:true,
      },
      email:{
        type:String,
        required:true,
        unique:true,
      },
      power: {
        type: String,
        default: 'user', 
            },
      profile_img:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'profileimg',
      },


})
const user=mongoose.model("user",newschema);
module.exports=user
