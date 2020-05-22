const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// starting a new express app
const app = express();

// Seting up connection with mongo
mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true });

//Making sure if we got connection
mongoose.connection.on("connected", err => {
    if (err) throw err;
    console.log("Connected to the Database...");
    

});
// Mongoose-schema
const PostSchema = mongoose.Schema({
    title: String,
    content: String,
    author: String,
    timestamp: String
});

//Creating a model for mongoose schema
const PostModel = mongoose.model("post",PostSchema);


// creating a Middleware for nodejs
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Api- routes for adding or posting
app.post("/api/post/new",(req,res)=> {
    let payload = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        timestamp: new Date().getTime() 
    }

    let newPost = new PostModel(payload);

    newPost.save((err, result) => {
        if(err) res.send({success:false,msg: err});

        res.send({success: true, result: result});
    });

});


//Api routes to get or fetch results
app.get("/api/posts/all",(req,res) => {
    PostModel.find((err,result) => {
        if (err) res.send({success: false, msg:err});

        res.send({success:true, result: result});
    });
});

// To make Changes or Edit Update
app.post("/api/post/update",(req,res) =>{
    let id = req.body._id;
    let payload = req.body;
    PostModel.findByIdAndUpdate(id,payload,(err, result) => {
        if (err) res.send({success: false, msg:err });
        res.send({success: true, result: result});

    });
});
// Api Delete or Remove operations
app.post("/api/post/remove",(req,res) =>{
    let id = req.body._id;

    PostModel.findById(id).remove((err,result) => {
        if(err) res.send({success: false, msg:err});
        res.send({success:true,result:result});

    });

});
app.listen(process.env.PORT || 3000,err => {
    if(err) console.error(err);
    console.log("Server has started on port %s",process.env.PORT || 3000);
    
});
