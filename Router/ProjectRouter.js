const express=require('express');
const router=express.Router()
const {Create_user,Login,profile_pic,userticketfilter}=require('../Controllers/UserController')
const {NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket,AssignToTicket,ticketfilter,updateticket,taketickets}=require('../Controllers/TicketsController')
const {get_graph_details,SupportTeamList,Addmembers}=require('../Controllers/AdminController')
const multer=require("multer")
const {userDetailedStatus,supportuserTicketFilter}=require('../Controllers/SupportTeamController')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authuser=require('../middleware/auth')
const authclint=require('../middleware/checkRelogin')

router.post('/Register',Create_user);
router.post("/Login",Login);

router.post("/profilepic", upload.single('img'),authuser,profile_pic);
router.post("/NewTicket",upload.single("img"),authuser,NewTicket);
router.get("/GetAllTickets",authuser,GetAllTickets);
router.get("/GetTicketByUSer-All",authuser,GetTicketsByUser)
router.get("/GetOneTicket/:Ticketid",authuser,GetOneTicket)

router.get('/status',authuser,get_graph_details)
router.get('/supportteamlist',authuser,SupportTeamList)
router.post('/Assign',AssignToTicket)
router.get("/filters/:filter",authuser,ticketfilter)

router.get('/Alreadylogin',authclint)
router.post('/Add/:option', authuser, Addmembers);
router.get('/SupportTeamMemberHomePage',authuser,userDetailedStatus)
router.get('/SupportTeamclintdetails/:filter',authuser,supportuserTicketFilter)
router.post('/updateTicket',authuser,updateticket)
router.post('/taketickets',authuser,taketickets)
router.get('/userfilters/:filter',authuser,userticketfilter)

module.exports=router