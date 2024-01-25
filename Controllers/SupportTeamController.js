const user=require('../models/Userschema')
const Ticket=require('../models/TicketSchema')
const SupportTeam = require('../models/SupportTeam')


const userDetailedStatus=async(req,res)=>{
    const tmid=req.authid
    const pending=await  Ticket.find({ AssignedUser:tmid}).countDocuments({Status:'Pending'})
    const solved=await  Ticket.find({ AssignedUser:tmid}).countDocuments({Status:'Solved'})
    const total=await  Ticket.find({ AssignedUser:tmid}).countDocuments({})
    
   
 
    console.log('a'+pending +"b"+solved+'c'+total)
   
const obj={
    Total:total,
    Pending:pending,
    Solved:solved,
   
}
    res.status(200).json(obj)


}

const supportuserTicketFilter=async(req,res)=>{
        const clintid= req.authid
       const filters=await req.params.filter
       console.log('30 hit'+filters+clintid)
     
        console.log(1)
       if(filters&&clintid){
        console.log(2)
        if(filters==='Solved'||filters==='Pending'){
            console.log("solved")
            const data=await Ticket.find({AssignedUser:clintid,Status:filters}).select('-Screenshots').populate('AssignedUser')
            if(data){
                res.status(200).json(data)
            }
           
       
       }else if(filters==='Total'){
        const data =await Ticket.find({AssignedUser:clintid}).select('-Screenshots').populate('AssignedUser')
        if(data){
            res.status(200).json(data)
        }
       }
       
       }
    
       else{
        res.status(400)
       }
}

 module.exports={userDetailedStatus,supportuserTicketFilter}