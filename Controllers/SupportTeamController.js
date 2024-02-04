const user=require('../models/Userschema')
const Ticket=require('../models/TicketSchema')
const SupportTeam = require('../models/SupportTeam')



const userDetailedStatus=async(req,res)=>{

    const tmid=req.authid
    const power=req.authpower 
    try{
        if(tmid&&power){
            if(power==='SupportTeam'){
                
    const pending=await  Ticket.find({ AssignedUser: tmid}).countDocuments({ Status: 'Pending'});
    const solved=await  Ticket.find({ AssignedUser:tmid}).countDocuments({Status:'Solved'})
    const waiting=await Ticket.find({AssignedUser:tmid}).countDocuments({Status:'waiting'})
    const onhold=await Ticket.find({AssignedUser:tmid}).countDocuments({Status:'OnHold'})
    const total=await  Ticket.find({ AssignedUser:tmid}).countDocuments({})
    
                    
    const data={
        Total:total,
        Solved:solved,
        Pending:pending,
        Waiting:waiting,
        OnHold:onhold,
    }

    if(data)(res.status(200).json(data))
    else(res.status(400).json({msg:'data fetching failed'}))
    
            }else{
                res.status(400).json({msg:'you Request not allowed'})
            }
    
    
        }else{
            res.status(400).json({msg:'supporttm id is required'})
        }
    }catch(e){
        console.error(e)
    }

}

const supportuserTicketFilter=async(req,res)=>{
        const clintid= req.authid
        const power=req.authpower
        const filters=await req.params.filter
        console.log('hit' +clintid+power+filters)
        try{
      
        if(clintid&&filters&&power==='SupportTeam'){
            console.log('hit1')
         if(filters==='Solved'||filters==='Pending'||filters==='OnHold'||filters==='waiting'){
                  const data=await Ticket.find({AssignedUser:clintid,Status:filters})
                    .select('-Screenshots')
                    .populate('AssignedUser')
                if(data){
                    res.status(200).json(data)
                }else{
                    res.status(400).json({msg:'data fetching faild'})
                } 
           
           }
           else if(filters==='Total'){

            const data =await Ticket.find({AssignedUser:clintid})
                        .select('-Screenshots')
                        .populate('AssignedUser')
            if(data){
                res.status(200).json(data)
            }
           }else{
            res.status(400).json({msg:'data fetching faild'})
        } 
           
        }
        else{
         res.status(400)
        }}
        catch(e){
            console.error(e)
        }
}

 module.exports={userDetailedStatus,supportuserTicketFilter}