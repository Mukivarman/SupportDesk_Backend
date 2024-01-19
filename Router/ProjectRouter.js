const express=require('express');
const router=express.Router()
const {Create_user,Login,profile_pic}=require('../Controllers/UserController')
const {NewTicket,GetAllTickets,GetTicketsByUser,GetOneTicket}=require('../Controllers/TicketsController')
const multer=require("multer")
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authuser=require('../middleware/auth')

router.post('/Register',Create_user);
router.post("/Login",Login);

router.post("/profilepic", upload.single('img'),authuser,profile_pic);
router.post("/NewTicket",authuser,upload.single("img"),authuser,NewTicket);
router.get("/GetAllTickets",authuser,GetAllTickets);
router.get("/GetTicketByUSer-All/:userid",authuser,GetTicketsByUser)
router.get("/GetOneTicket/:Ticketid",authuser,GetOneTicket)


module.exports=router