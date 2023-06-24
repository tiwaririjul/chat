const express = require('express');
//Import Files
const Users= require('./models/Users');
//Connection to Database
require('./db/connection');

//app use
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));


const port= process.env.PORT || 8000;
//Routes
app.get('/',(req,res)=>{
    res.write('Welcome..')
});

app.listen(port,()=>{
    console.log('Server is Listening on port '+ port);
})