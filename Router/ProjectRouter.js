const express=require('express');
const router=express.Router()
const {Create_user,Login,profile_pic}=require('../Controllers/UserController')
const {NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket}=require('../Controllers/TicketsController')
const multer=require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/Register',Create_user);
router.post("/Login",Login);

router.post("/profilepic", upload.single('img'),profile_pic);
router.post("/NewTicket",upload.single("img"),NewTicket);
router.get("/GetAllTickets",GetAllTickets);
router.get("/GetTicketByUSer-All/:userid",GetTicketsByUser)
router.get("/GetOneTicket/:Ticketid",GetOneTicket)


module.exports=router