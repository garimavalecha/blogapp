var express=require("express");
var app=express();
var expressSanitizer=require("express-sanitizer");
var methodOverride=require("method-override");
var bp=require("body-parser");
var mon=require("mongoose");



mon.connect("mongodb://localhost/blogapp");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose model config
var blogSchema=new mon.Schema({
    title:String,
    image:String, 
    body:String,
    created:{type:Date,default:Date.now}
});
var blog=mon.model("blog",blogSchema );


//restful routes

//index route
app.get("/",function(req,res){
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs)
    {
        if(err)
           console.log(err);
        else
            res.render("index.ejs",{blogs:blogs});
    })
});

//new route
app.get("/blogs/new",function(req,res)
{
    res.render("new.ejs");
});

//create route
app.post("/blogs",function(req,res)
{   
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err)
           res.render("new.ejs");
        else
           res.redirect("/blogs");
            
    })
});


//show route
app.get("/blogs/:id", function(req,res){
     blog.findById(req.params.id,function(err,foundblog){
         if(err)
          res.redirect("/blogs");
         else 
         {
           res.render("show",{blog:foundblog});
}
}); 
});

//edit route
app.get("/blogs/:id/edit",function(req,res)
{   blog.findById(req.params.id,function(err,foundblog){
         if(err)
          res.redirect("/blogs");
         else 
         {
           res.render("edit.ejs",{blog:foundblog});
}
})
});


//update route
app.put("/blogs/:id",function(req,res)
{    
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+req.params.id);
    })
});


//delete route
app.delete("/blogs/:id",function(req,res){
   blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
       
   }) 
});


app.listen(process.env.PORT ,process.env.IP,function(){
    console.log("server has started");
});