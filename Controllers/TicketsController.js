const user=require('../models/Userschema')
const Ticket=require("../models/TicketSchema")
const jwt=require("jsonwebtoken");

require('dotenv').config();


const NewTicket=async(req,res)=>{
    const proofimg= await req.file.buffer;
    const authuser=req.body.authuser;
    const Loginuser=JSON.parse(authuser);
    const TicketDetails=req.body.ticketdetails;
    const NewTicket=JSON.parse(TicketDetails);
    
    if(proofimg&&Loginuser&&NewTicket){
        
        
        const newticket=new Ticket({
            Create_User:Loginuser.userid,
            OccuredDate:NewTicket.date,
            Subject:NewTicket.subject,
            Message:NewTicket.message,
            Screenshots:(proofimg.toString('base64')),

        });
        const createticket=await Ticket.create(newticket);
        console.log(createticket)
        

        if(createticket){
            res.status(200).json({msg:"Ticket is Created"})
        }
        else(
            res.status(400).json({msg:"Ticket creation Failed"})
        )

       
    }else{
        res.status(400).json({msg:"input details are empty"})
    }

}
const GetAllTickets = async (req, res) => {
   
  
      const data = await Ticket.find().maxTimeMS(30000);
      return res.status(200).json(data);
   
  };
  
const GetTicketsByUser=async(req,res)=>{
    const userId = req.params.userid;
    console.log(userId)
    const data=await Ticket.find({Create_User:userId}).maxTimeMS(30000)
    console.log(data)
    res.status(200).json(data);
    

}

const GetOneTicket=async(req,res)=>{
    const ticketid=req.params.Ticketid;
    const data=await Ticket.findById({_id:ticketid})
    res.status(200).json(data);

}




module.exports={NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket}