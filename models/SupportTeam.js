const mongoose=require('mongoose')

const supportteam=mongoose.Schema({
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
             default:"SupportTeam",
         },
         Assignedtickets:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tickets',
            unique:true,
            default:[]
         }]
})

module .exports=mongoose.model('SupportTeam',supportteam)