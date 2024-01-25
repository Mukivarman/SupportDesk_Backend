const user=require('../models/Userschema')
const Ticket=require("../models/TicketSchema")
const jwt=require("jsonwebtoken");
const SupportTeam = require('../models/SupportTeam');
const TicketSchema = require('../models/TicketSchema');


require('dotenv').config();


const NewTicket=async(req,res)=>{
    const proofimg= await req.file.buffer;
    const Loginuser=req.authid
    const TicketDetails=req.body.ticketdetails;
    const NewTicket=JSON.parse(TicketDetails);
    
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
        console.log(createticket._id)
        

        if(createticket){
            res.status(200).json({ticketID:createticket._id})
        }
        else(
            res.status(400).json({msg:"Ticket creation Failed"})
        )

       
    }else{
        res.status(400).json({msg:"input details are empty"})
    }

}
const GetAllTickets = async (req, res) => {
   
    console.log('hit')
      const data = await Ticket.find().select('-Screenshots').populate('AssignedUser');
      if(data){
       
      return res.status(200).json(data);
      }else{
        return res.status(400).json({msg:'error'})
      }
  };
  
const GetTicketsByUser=async(req,res)=>{
    const userId = req.authid;
    if(!userId){
        return res.status(400).json({msg:'userid must'})
    }
    console.log(userId)
    const data=await Ticket.find({Create_User:userId}).maxTimeMS(30000)
    console.log('ujh')
    if(data){
    res.status(200).json(data);}
    else{
        res.status(400).json({msg:'internel errror'})
    }
    

}

const GetOneTicket=async(req,res)=>{
    const ticketid=req.params.Ticketid;
    if(!ticketid){
        return res.status(400).json({msg:'ticket id is must'})
    }
    console.log(ticketid)
    const data=await Ticket.findById({_id:ticketid}).populate('AssignedUser')
    



    res.status(200).json(data);

}
const AssignToTicket=async(req,res)=>{

    const data=await req.body
    console.log(data)
    if(data){
        console.log("shdn")
        const memberupdate=await SupportTeam.findByIdAndUpdate(data.supportteamid,{$push:{Assignedtickets:data.ticketid}},{new:true})
        if(memberupdate){
        const ticketupdate=await Ticket.findByIdAndUpdate(data.ticketid,{AssignedUser:data.supportteamid})
      
        if(ticketupdate){

            res.status(200).json({msg:'update'})
        }

    }
       
    }else{
        res.status(400)
    }

}
const ticketfilter=async(req,res)=>{
    console.log('hit')
       const filters= req.params.filter
       
       if(filters){
        if(filters==='Solved'||filters==='Pending'){
            console.log("solved")
            const data=await Ticket.find({Status:filters}).select('-Screenshots').populate('AssignedUser')
            if(data){
                res.status(200).json(data)
            }
           
       } else if(filters==='Unassigned'){
        const data=await Ticket.find({AssignedUser:null}).select('-Screenshots')
        if(data){
            res.status(200).json(data)
        }

       }else if(filters==='Total'){
        const data =await Ticket.find().select('-Screenshots').populate('AssignedUser')
        if(data){
            res.status(200).json(data)
        }
       }
       
       }
       else{
        res.status(400)
       }
}

const updateticket=async(req,res)=>{
    const assistid=req.authid
    const  power=req.authpower
    const data=req.body

    if(assistid,power,data){
        if(power==='SupportTeam'){
                console.log(data)
               const ticketassigneduser= await  Ticket.findById({_id:data.ticketid})
               console.log(ticketassigneduser.AssignedUser)
               if(ticketassigneduser.AssignedUser.equals(assistid)){
                console.log('match')
                const updateticket=await Ticket.findByIdAndUpdate(data.ticketid,{Status:data.status},{new:true})
                if(updateticket){
                    console.log('updated')
                    res.status(200).json({msg:'ticket updated'})
                }
                else{
                    res.status(400).json({msg:'update failed'})
                }
               }
        }else{
            res.status(400).json()
        }
    }

}


const  taketickets=async(req,res)=>{
    const assistid=await req.authid
    const id=await req.body
    console.log(assistid+id.Ticketid+'l170')

    if(assistid&&id.Ticketid){
        console.log('1')
        const memberupdate=await SupportTeam.findByIdAndUpdate(assistid,{$push:{Assignedtickets:id.Ticketid}},{new:true})
        if(memberupdate){
            console.log('2')
        const ticketupdate=await Ticket.findByIdAndUpdate(id.Ticketid,{AssignedUser:assistid})
      
        if(ticketupdate){

            console.log('3')
            res.status(200).json({msg:'update'})
        }


    }
}
}
module.exports={NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket,AssignToTicket,ticketfilter,updateticket,taketickets}