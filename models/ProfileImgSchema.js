const mongoose=require("mongoose");




const imgdb=mongoose.Schema

const newimgdb=new imgdb({
    profile_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
      } ,
    image:{
            type:String,
            required:true,
        }

})
const profileimg=mongoose.model("profile_img",newimgdb);

module.exports=profileimg;