exports.getPosts=(req,res,next)=>{
res.status(200).json({
    post:[{title:'First Post', content:'this is the first Post' ,imageUrl:'images/duck.jpg'}]
});
};
exports.createPost=(req,res,next)=>{
    const title=req.body.title;
    const content=req.body.content;
    
    res.status(201).json({
        message:'Post Created Successfully!',
        post:{id:new Date().toISOString(),title:title,content:content}
    });
};