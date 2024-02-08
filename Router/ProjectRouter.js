const express=require('express');
const router=express.Router()
const {Create_user,Login,profile_pic,userticketfilter,usernotification,deleteNotification,userStatus}=require('../Controllers/UserController')
const {NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket,AssignToTicket,ticketfilter,updateticket,taketickets}=require('../Controllers/TicketsController')
const {get_graph_details,SupportTeamList,Addmembers,Allusers,getTicketsListByUser,deleteuser}=require('../Controllers/AdminController')
const multer=require("multer")
const {userDetailedStatus,supportuserTicketFilter}=require('../Controllers/SupportTeamController')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authuser=require('../middleware/auth')
const authclint=require('../middleware/checkRelogin')
const otpsent=require('../middleware/Otpgenration')
const {SaveChat,GETchat,Live}=require('../Controllers/Chatbox')

router.post('/Register',Create_user);
router.post("/Login",Login);
router.get('/Alreadylogin',authclint)

router.post("/profilepic", upload.single('img'),authuser,profile_pic);
router.get('/userfilters/:filter',authuser,userticketfilter)
router.post("/NewTicket",upload.single("img"),authuser,NewTicket);
router.get("/GetAllTickets",authuser,GetAllTickets);
router.get("/GetTicketByUSer-All",authuser,GetTicketsByUser)
router.get("/GetOneTicket/:Ticketid",authuser,GetOneTicket)
router.get('/GetUserStatus',authuser,userStatus)

router.get('/status',authuser,get_graph_details)
router.get('/supportteamlist',authuser,SupportTeamList)
router.post('/Add/:option', authuser, Addmembers);
router.post('/Assign',authuser,AssignToTicket)
router.get("/filters/:filter",authuser,ticketfilter)
router.get('/AllUsersByAdmin/:filters',authuser,Allusers)

router.get('/SupportTeamMemberHomePage',authuser,userDetailedStatus)
router.get('/SupportTeamclintdetails/:filter',authuser,supportuserTicketFilter)
router.post('/updateTicket',authuser,updateticket)
router.post('/taketickets',authuser,taketickets)
router.post('/otpsent',otpsent)


router.get('/GetAllTicketsLISTby/:userid/:power',authuser,getTicketsListByUser)
router.delete('/DeleteUser/:userid/:power',authuser,deleteuser)



router.get('/getchats/:ticketid',authuser,GETchat)
router.post('/postchat',authuser,SaveChat)
router.get('/chatlive/:ticketid/:length',Live)
router.get('/getnotification',authuser,usernotification)
router.delete('/deletenotification/:notificationid',authuser,deleteNotification)

module.exports=router