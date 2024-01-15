const mongoose=require('mongoose');

const Ticket=new mongoose.Schema({
    Create_User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true,
        index: true,
    },
    OccuredDate:{
     type:Date,
     required:true,

    },
    Subject:{
        type:String,
        required:true,
    },
    Message:{
        type:String,
        required:true,
    },
    Status:{
        type:String,
        default: 'Waiting To Assign', 
    },
    Opened:{
        type:Boolean,
        default:false,
    },
    AssignedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"no",
    },
    Screenshots:{
        type:String,
        required:true,
    },



})

module.exports=mongoose.model("Tickets",Ticket);