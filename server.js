
const express=require('express');
const mongoose=require('mongoose');
const app= express();
// config env
require('dotenv').config()
const port =process.env.port||5000;
const dbLink=process.env.MONGO_URL
// The Connecting MONGO
mongoose.connect(dbLink)
.then(()=>{
    console.log('connected to mongodb');
    app.listen(port,()=>{
        console.log(`server is at:${port}`);
    });
}).catch((err)=>{
    console.log("Error:Mongodb is not connected");
    console.log(err);
});



app.get('/',(req,res)=>{
    res.send('My server is Running');
});

app.listen(port,()=>{
    console.log(`Server is good at:${port}`);
});