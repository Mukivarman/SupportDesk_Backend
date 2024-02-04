
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
      department:{
        type:String,
        default:'update Department'
      },
      EmployeeCode:{
        type:String,
        default:'update code'
      },
      power: {
        type: String,
        default: 'User', 
            },
      profile_img:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'profileimg',
      },
      CreatedTickets:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tickets',
        default:[]
      }
      ],
      CreatedAT:{
        type:Date,
        required:true,
        default:Date.now,
      },
      Notification: [
        {
          alerts: {
            type: String,
            required: true,
          },
          read: {
            type: Boolean,
            default: false,
          },
          ticket: {
           type:String,
            required: true,
          },
        },
      ],

})
const user=mongoose.model("user",newschema);
module.exports=user
