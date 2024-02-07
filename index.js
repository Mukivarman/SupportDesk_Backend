const express=require('express');
require('dotenv').config();
const db=require('./config/db')
const routes =require('./Router/ProjectRouter')
const chat=require('./Router/ChatRouter')
const cors=require('cors')
const app=express();
db();

app.use(express.json({limit:'5mb'}))

app.use("/api/",routes);

app.use(cors());

app.use((req,res,next)=>{
    next();
})


app.listen(process.env.Port,()=>{
    console.log("server start")
})