const AdminSchema = require('../models/AdminSchema')
const user=require('../models/Userschema')
const Ticket=require('../models/TicketSchema')
const SupportTeam = require('../models/SupportTeam')
const bcrypt=require('bcrypt');

const {
    passwordhash,
    checkspace,
    checkpassword,
    emailcheck     }=require('../supportTools/SupportTools');

/*Graph details fetcing*/

const get_graph_details=async(req,res)=>{
    const adminid=req.authid
    const power=req.authpower

    if(adminid){
        if(power==='Admin'){
        try{
            const pending=await  Ticket.countDocuments({Status:'Pending'})
            const solved=await Ticket.countDocuments({Status:'Solved'})
            const unassigned=await Ticket.countDocuments({AssignedUser:null}) 
            const total=await Ticket.countDocuments({})
            if(pending&&solved&&unassigned&&total){
                const obj={
                    Total:total,
                    Pending:pending,
                    Solved:solved,
                    Unassigned:unassigned, 
                }
                res.status(200).json(obj)
            }else{
                res.status(400).json({msg:"error at fetcing"})
            }
            

        }catch(e){
            console.error(e)

        }
    }else{
        res.status(400).json({msg:'Admins Only Allowed'})
    }
    }else{
        res.status(400).json({msg:'admin id required'})
    }
        
}


/*Admin get  Support Team List*/

const SupportTeamList=async(req,res)=>{
    
        const data=await SupportTeam.find({})
        console.log(data)
        res.status(200).json(data)
}
const Addmembers=async(req,res)=>{
   
    const option=req.params.option
console.log(option)
    if(option){
 
       
        const power= req.authpower
        
        if(power==='Admin'){

            const {username,email,password}= req.body;
            console.log("line-6"+username+email+password)
                if(username!=""&&email!=""&&password!=""){
              if(!checkspace(username)&&emailcheck(email)&&!checkspace(password)){
                if(password.length>=8){
                    if(checkpassword(password)){
                        
                const user_name=await user.findOne({username})
                const user_email=await user.findOne({email})

                const admin_name=await AdminSchema.findOne({username})
                const admin_email=await AdminSchema.findOne({email})

                const support_name=await SupportTeam.findOne({username})
                const support_email=await SupportTeam.findOne({email})
                        
                if(!(user_name)&&!(user_email)&&!admin_name&&!admin_email&&!support_name&&!support_email){
                    const hashed= await passwordhash(password);
                            try{
                                if(hashed){
                                    const newuser=new (option === 'Admin' ? AdminSchema : SupportTeam)({
                                        username:username,
                                        email:email,
                                        Password:hashed,
                                       })
                                     const create=await (option==='Admin'? AdminSchema:SupportTeam).create(newuser)
                                     if(create)(res.status(200).json({msg:"admin created"}))
                                       else(res.status(400))
        
                                }
                            }catch(e){
                                console.error(e);
                            }
        
                        }else{
                            res.status(400).json({msg:"username or email already exit"})
                        }
        
                    }else{
                        res.status(400).json({msg:"bad request"})
                    }
        
        
                }else{
                    return res.status(400).json({msg:"password too short"});
                   }
        
                } else{
                    return res.status(400).json({msg:"input details contain space or  enter valid email "});
                }
               
        } else{
            return res.status(400).json({msg:"please enter valis details"});
            };
        }}
        

        
    }



module.exports={get_graph_details,SupportTeamList,Addmembers}