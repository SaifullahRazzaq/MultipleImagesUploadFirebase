const express=require('express');
const feedController=require('../Controller/feed');
const app=express.Router();
const {body}=require('express-validator/check')

app.get('/posts',feedController.getPosts);

app.post('/post',[body('title').trim().isLength({min:5}),body('content').trim().isLength({min:5})] ,feedController.createPost);

 
module.export=app;