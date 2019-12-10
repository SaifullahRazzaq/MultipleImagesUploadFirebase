const express=require('express');
const bodyParser=require('body-parser');
const feed=require('./Routes/feed')
const app=express();





app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','OPTIONS,Get,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    next();
    
});

app.listen(3001),()=>{
    console.log('chal raha hai')
};
