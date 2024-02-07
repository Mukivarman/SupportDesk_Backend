const user=require('../models/Userschema')
const Ticket=require("../models/TicketSchema")
const jwt=require("jsonwebtoken");
const SupportTeam = require('../models/SupportTeam');
const TicketSchema = require('../models/TicketSchema');
const {mailsend}=require('../supportTools/SupportTools')

require('dotenv').config();


const NewTicket=async(req,res)=>{
       const proofimg= await req.file.buffer;
       const Loginuser=req.authid
       const TicketDetails=req.body.ticketdetails;
       const NewTicket=JSON.parse(TicketDetails);
       try{
        
    if(proofimg&&Loginuser&&NewTicket){
   
        const newticket=new Ticket({
            Create_User:Loginuser,
            OccuredDate:NewTicket.date,
            OccuredTime:NewTicket.time,
            Subject:NewTicket.subject,
            Message:NewTicket.message,
            Screenshots:(proofimg.toString('base64')),

        });
        
        const createticket=await Ticket.create(newticket);
        const updateuser=await  user.findByIdAndUpdate(Loginuser,{$push:{CreatedTickets:createticket._id}})
    
        

        if(createticket &&updateuser){
            res.status(200).json({ticketID:createticket._id})
        }
        else(
            res.status(400).json({msg:"Ticket creation Failed"})
        )

       
    }else{
        res.status(400).json({msg:"input details are empty"})
    }

       }catch(e){
        console.error(e)
       }
    
    
}


const GetAllTickets = async (req, res) => {
   
    const clintid=req.authid
    const power=req.authpower
    try{
        if(clintid&&power){
      
            const data = await Ticket.find().select('-Screenshots').populate('AssignedUser');
    
          if(data)(  res.status(200).json(data))
          else(res.status(400).json({msg:'data fetch failed'}))

        }else{
            res.status(400).json({msg:'clintid and power require'})
        }

    }catch(e){
        console.log(e)
    }
      
};
  
const GetTicketsByUser=async(req,res)=>{

    const userId = req.authid;
    const power=req.authpower
    try{
         if(!userId&&!power){
        return res.status(400).json({msg:'userid power must'})
    }else{
        const data=await Ticket.find({Create_User:userId}).populate('AssignedUser')
        if(data){
            res.status(200).json(data);}
            else{
                res.status(400).json({msg:'internel errror'})
            }
    }
}catch(e){
    console.log(e)
}
}

const GetOneTicket=async(req,res)=>{
    const ticketid=req.params.Ticketid;
    try{
        if(!ticketid){
            return res.status(400).json({msg:'ticket id is must'})
        }
        else{
            const data=await Ticket.findById({_id:ticketid}).populate('AssignedUser')
            if(data)( res.status(200).json(data))
            else(res.status(400).json())
        }
    }catch(e){
        console.log(e)
    }
}

const AssignToTicket=async(req,res)=>{
    const clintid=await req.authid
    const power=await req.authpower
    const data=await req.body
    
try{
    if(clintid&&power&&data&&power==='Admin'&&data.supportteamid&&data.ticketid){

      
        const alreadyAssign=await Ticket.findOne({_id:data.ticketid}).select('AssignedUser')
        if(alreadyAssign&&alreadyAssign.AssignedUser){
             return res.status(400).json({msg:"Already thi Ticket Is Assingned "})
        }else{
            const assign=await Ticket.findByIdAndUpdate(data.ticketid,{AssignedUser:data.supportteamid,Status:'waiting'},{new:true})
            if(assign){
                const memberupdate=await SupportTeam.findByIdAndUpdate(data.supportteamid,{$push:{Assignedtickets:data.ticketid}},{new:true})
                if(memberupdate){
                         const getuser=await Ticket.findById(data.ticketid).select('Create_User').populate('Create_User')
                         const usernotyfy=await user.findByIdAndUpdate(getuser.Create_User._id,{$push:{Notification:{
                         alerts:`A New Ticket is Assigned to Support Team  Click to View Details `,
                         ticket:data.ticketid,
                         }}})
                         const emails=getuser.Create_User.email
                        const subject=`A New Ticket is Assigned to Support Team`
                        const txt=`A New Ticket is Assigned to Support Team  click to view details  https://main--fascinating-fudge-872a7e.netlify.app/ViewTicketDetails/${data.ticketid}`
                        mailsend(subject,txt,emails)

                    return res.status(200).json({msg:'Ticket Assigned Is Successful'})
                }
                else{
                    await Ticket.findByIdAndUpdate({AssignedUser:null})
                    return res.status(400).json({msg:'Ticket Assigned failed So,e Error'})
                }
            }
        }
        }
        else{
            return res.status(400).json({msg:'REquired Fields ARe Empty'})
        }
    
}catch(e){
    console.log(e)
}
   
}

const ticketfilter=async(req,res)=>{

       const filters= req.params.filter
       try{
        if(filters){
            if(filters==='Solved'||filters==='Pending'||filters==="waiting"||filters==="OnHold"){
                
                const data=await Ticket.find({Status:filters}).select('-Screenshots').populate('AssignedUser')
                if(data){
                    res.status(200).json(data)
                }
                else{
                    res.status(400).json(
                        {msg:'data fetch faailed'}
                    )
                }
               
           } 
            else if(filters==='Unassigned'){
                 const data=await Ticket.find({AssignedUser:null}).select('-Screenshots')
              if(data){
                res.status(200).json(data)
              }else{   
              res.status(400).json( {msg:'data fetch faailed'} )
            }
            }
            else if(filters==='Total'){
               const data =await Ticket.find().select('-Screenshots').populate('AssignedUser')
                if(data){
                    res.status(200).json(data)
                }else{   
                    res.status(400).json( {msg:'data fetch faailed'} )
                }
           }
           
           }else{
            res.status(400).json({msg:'Filters Required'})
           }
       }catch(e){
        console.error(e)
       }
      
      
}

const updateticket=async(req,res)=>{
    const assistid=req.authid
    const  power=req.authpower
    const data=req.body

    try{
        if(assistid&&power&&data){
            if(power==='SupportTeam'){
                   const ticketassigneduser= await  Ticket.findById({_id:data.ticketid})
            if(ticketassigneduser.AssignedUser.equals(assistid)){
                   
                 const updateticket=await Ticket.findByIdAndUpdate(data.ticketid,{Status:data.status},{new:true})
                    
                 if(updateticket){
                                const getuser=await Ticket.findById(data.ticketid).select('Create_User').populate('Create_User')
                                console.log(getuser)
                                const usernotyfy=await user.findByIdAndUpdate(getuser.Create_User._id,{$push:{Notification:{
                                alerts:`Ticket is UPDATED to ${data.status} By Support Team  `,
                                ticket:data.ticketid,
                            }}})

                            const email=getuser.Create_User.email
                            const subject=`A New Ticket is Updated`
                            const txt=`A New Ticket is Updated by Support Team  member click to view details  https://main--fascinating-fudge-872a7e.netlify.app/ViewTicketDetails/${data.ticketid}`
                             mailsend(subject,txt,email)

                        res.status(200).json({msg:'ticket updated'})
                    }
                    else{
                        res.status(400).json({msg:'update failed'})
                    }
                   }else{
                    res.status(400).json({msg:'only ticket assigned user olnly update'})
                   }
            }else{
                res.status(400).json()
            }
        }

    }catch(e){
        console.error(e);
    }

   

}


const  taketickets=async(req,res)=>{
    const assistid=await req.authid
    const power=await req.authpower
    const id=await req.body
    
    try{
        if(assistid&&power&&id&&id.Ticketid){
            const existassign=await TicketSchema.find({_id:id.Ticketid}).select('AssignedUser')
           
            if(existassign&&existassign[0].AssignedUser){
                return res.status(400).json({msg:'alredy teked'})
            }
            const memberupdate=await SupportTeam.findByIdAndUpdate(assistid,{$push:{Assignedtickets:id.Ticketid}},{new:true})
        if(memberupdate){
           const ticketupdate=await Ticket.findByIdAndUpdate(id.Ticketid,{AssignedUser:assistid,Status:'waiting'})
        if(ticketupdate){
                const getuser=await Ticket.findById(id.Ticketid).select('Create_User').populate('Create_User')
                const usernotyfy=await user.findByIdAndUpdate(getuser.Create_User._id,{$push:{Notification:{
                alerts:"The New Ticket is Assigned to Support Team  Click to View Details",
                ticket:id.Ticketid,
            }}})
            const email=getuser.Create_User.email
            const subject=`A New Ticket is Assigned to Support Team`
            const txt=`A New Ticket is Assigned to Support Team  click to view details  https://main--fascinating-fudge-872a7e.netlify.app/ViewTicketDetails/${data.ticketid}`
            mailsend(subject,txt,email)

            res.status(200).json({msg:'update'})
        }else{
            res.status(400).json({msg:'update failed'})
        }

        }else{
            res.status(400).json({msg:"inputs must"})
        }
    }
    }catch(e){
        console.error(e)
    }
}



module.exports={NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket,AssignToTicket,ticketfilter,updateticket,taketickets}