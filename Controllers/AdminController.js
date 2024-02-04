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
            const pending=await  Ticket.countDocuments({Status:'Pending'})||0
            const onhold=await Ticket.countDocuments({Status:'OnHold'})||0
            const solved=await Ticket.countDocuments({Status:'Solved'})||0
            const waiting=await Ticket.countDocuments({Status:'waiting'})||0
            const unassigned=await Ticket.countDocuments({AssignedUser:null})||0 
            const total=await Ticket.countDocuments({})||0
          console.log(onhold)
                const obj={
                    Total:total,
                    Solved:solved,
                    Pending:pending,
                    Waiting:waiting,
                    OnHold:onhold,
                    Unassigned:unassigned, 
                }
                res.status(200).json(obj)
            
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
    try{
        const adminsid=req.authid
        const power=req.authpower
        if(adminsid){
            if(power==='Admin'){
            const data=await SupportTeam.find({})
            if(data){
                res.status(200).json(data)
            }else{
                res.status(400).json({msg:'List Fetching failed'})
            }

            }else{
               res.status(400).json({msg:'Admin Only Required'})
            }
        }else{
            res.status(400).json({msg:'Admin id is Required'})
        }
    }catch(e){
        console.error(e)
    }    
      
}

/* Admin can ad members */

const Addmembers=async(req,res)=>{
    
    const adminid=req.authid
    const power=req.authpower
    const option=req.params.option
    if(adminid){
        if(power==='Admin'){
            if(option){
                try{
                    const {username,email,password}= req.body;
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
                           
                                        if(hashed){
                                            const newuser=new (option === 'Admin' ? AdminSchema : SupportTeam)({
                                                username:username,
                                                email:email,
                                                Password:hashed,
                                               })
                                             const create=await (option==='Admin'? AdminSchema:SupportTeam).create(newuser)
                                            
                                             if(create)(res.status(200).json({msg:`admin username= > ${username}   email => ${email}  created  Successfully  `}))
                                               else(res.status(400))
                
                                        }else{
                                            res.status(400).json({msg:'password hashing failed'})
                                        }
                                    
                
                                }else{
                                    res.status(400).json({msg:"username or email already exit"})
                                }
                
                            }else{
                                res.status(400).json({msg:"bad password request"})
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
                }catch(e){
                    console.log(e)
                }

        }else{
            res.status(400).json({msg:'options need who can add admin or support team'})
        }
    }else{
        res.status(400).json({msg:'admins only allowed'})
    }


   }else{
    res.status(400).json({msg:'Adminid required'})
   }
        

        
    }


    
const Allusers=async(req,res)=>{
   
    const adminid=req.authid
    const power=req.authpower
    const filters=req.params.filters
console.log(filters)
    if(adminid&&power&&power==='Admin'){
        if(filters){
            try{
let allusers;
                switch (filters) {
                    case 'User':
                      allusers = await user.find().select('-Password');
                      break;
                    case 'Admin':
                      allusers = await AdminSchema.find().select('-Password');
                      break;
                    case 'SupportTeam':
                      allusers = await SupportTeam.find().select('-Password');
                      break;
                    default:
                      res.status(400).json({ msg: 'Invalid filter' });
                      return;
                  }
                  if (allusers) {
                    res.status(200).json({ data: allusers });
                  } else {
                    res.status(404).json({ msg: 'Fetching failed' });
                  }
           
            }catch(e){
                console.log(e)
            }
            
             
        }else{
            res.status(400).json({msg:'filters need'})
        }



    }else{
        res.status(400).json({msg:'you are not Allowed'})
    }

}

const getTicketsListByUser=async(req,res)=>{
    const reqpower=req.params.power
    const requserid=req.params.userid
    const adminid=req.authid
    const power=req.authpower

    console.log(reqpower+requserid+adminid+power)


    if(reqpower&&requserid&&adminid&&power){
        if(power==='Admin'){

            try{
                let data;
                
                switch(reqpower){
                    case 'User':
                   data=   await Ticket.find({Create_User:requserid}).select('-Screenshots');
                      break;
                    case 'SupportTeam':
                 data= await Ticket.find({AssignedUser:requserid}).select('-Screenshots');
                        break;
                    default:
                            res.status(400).json({ msg: 'Invalid filter' });
                 return;
                }
                data?res.status(200).json(data):res.status(400).json({msg:'error while fething'})
            }
            catch(e){
                console.error(e)
            }
        }
    }




 }

 const deleteuser=async(req,res)=>{
    const reqpower=req.params.power
    const requserid=req.params.userid
    const adminid=req.authid
    const power=req.authpower

    console.log(reqpower+requserid+adminid+power)


    if(reqpower&&requserid&&adminid&&power){
        if(power==='Admin'){

            try{
                let data;
                
                switch(reqpower){
                    case 'User':
                   data=   await user.findByIdAndDelete({_id:requserid})
                      break;
                    case 'SupportTeam':
                 data= await await SupportTeam.findByIdAndDelete({_id:requserid})
                        break;
                    case 'Admin':
                        data=await AdminSchema.findByIdAndDelete({_id:requserid})
                        break;
                    default:
                            res.status(400).json({ msg: 'Invalid filter' });
                 return;
                }
                data?res.status(200).json(data):res.status(400).json({msg:'error while fething'})
            }
            catch(e){
                console.error(e)
            }
        }
    }



 }

module.exports={get_graph_details,SupportTeamList,Addmembers,Allusers,getTicketsListByUser,deleteuser}