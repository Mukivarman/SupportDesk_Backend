const user=require('../models/Userschema')
const Ticket=require('../models/TicketSchema')
const AssistTm=require('../models/SupportTeam')
const Chatsdb = require('../models/Chatsdb')


const SaveChat=async(req,res)=>{
        const authuser=req.authid
        const Power=req.authpower
        const {ticketid,chat,user_name,}=req.body
        console.log(Power+'line11')
      
        if(authuser&&Power&&ticketid&&chat&&user_name){
         
            try{
                const chatexist=await Chatsdb.findOne({ticketsid:ticketid})
                console.log(chatexist)
                if(!chatexist){
                    console.log('hit2')
                    const newChatbox = await Chatsdb.create({
                        ticketsid: ticketid,
                        chats: [{ user: user_name,power:Power, msg: chat,}],
                    });
    
                    if (newChatbox) {
                        res.status(200).json({ message: 'Chatbox created and chat added successfully' });
                    } else {
                        res.status(500).json({ error: 'Failed to create chatbox and add chat' });
                    }

                }else{
                        const addchat=await Chatsdb.findByIdAndUpdate(chatexist._id,{$push :{ chats: [{ user: user_name,power:Power, msg: chat }]}},{new:true})
                        if(addchat){
                            res.status(200).json({ message: 'chat added successfully' });

                        } else {
                            res.status(500).json({ error: 'Failed to add chat' });
                        }
                }

            }catch(e){
                console.error(e)
            }

            
        }

}

const GETchat=async(req,res)=>{
           const ticketid=req.params.ticketid
           const userid=req.authid
        
   
    if(ticketid){
        const chatexist=await Chatsdb.findOne({ticketsid:ticketid})
        if(chatexist){
            const msgs=await Chatsdb.findOne({_id:chatexist._id}).select('chats')
           
            res.status(200).json(msgs)
        }
        else{
            res.status(400).json({msg:'no res'})
        }
    }

}

const Live=async(req,res)=>{
    const tkid=req.params.ticketid
    const length=req.params.length
    if(tkid&&length){
  console.log(length)

            const chatexist=await Chatsdb.findOne({ticketsid:tkid})
            if(chatexist){
               const chatsdata= chatexist.chats
             console.log(chatsdata.length)
                if(length<chatsdata.length){
                    console.log('enter')
                    res.status(200).json()
                }
                else{
                    res.status(404).json()
                }
              
            }else{
                res.status(400).json()
            }
        


    }else{
        res.status(400).json()
    }
   
}

module.exports={SaveChat,GETchat,Live}