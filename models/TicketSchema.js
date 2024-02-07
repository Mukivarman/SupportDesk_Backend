const mongoose=require('mongoose');

const Ticket=new mongoose.Schema({
    Create_User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true,
    },
    OccuredDate:{
     type:Date,
     required:true,

    },
    OccuredTime:{
        type:String,
        required:true
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
        ref:"SupportTeam",
        default:null
    },
    Screenshots:{
        type:String,
        required:true,
    },
    CreatedAt:{
        type:Date,
        required:true,
        default:Date.now
    }



})

module.exports=mongoose.model("Tickets",Ticket);