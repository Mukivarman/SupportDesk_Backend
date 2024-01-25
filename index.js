const express=require('express');
require('dotenv').config();
const db=require('./config/db')
const routes =require('./Router/ProjectRouter')

const app=express();
db();

app.use(express.json())

app.use("/api/",routes);


app.use((req,res,next)=>{
    next();
})


app.listen(process.env.Port,()=>{
    console.log("server start")
})