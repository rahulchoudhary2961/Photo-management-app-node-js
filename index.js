const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/user_details");

const userRoute = require('./routes/userRoute')

const express = require('express');


const app = express();



//for users route

app.use(userRoute);


app.listen(8000, ()=>{
    console.log("server running");
})