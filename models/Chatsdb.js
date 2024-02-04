const mongoose=require('mongoose')


const chatdb=mongoose.Schema({
    ticketsid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tickets',
        required:true
    },
    chats:[{
        user:{
            type:String,
            require:true,
        },
        power:{
            type:String,
            require:true
        },
        time: {
            type: Date,
            default: Date.now
        },
        msg:{
            type:String,
            required:true
        },
    }]

})
module.exports=mongoose.model('chatbox',chatdb)