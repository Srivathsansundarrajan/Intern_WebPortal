const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const port = 8080;


const session = require('express-session');





const app = express();

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));



const connection = "mongodb://localhost:27017/";
mongoose.connect(connection,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.once("open",()=>{
    console.log("MongoDB Connected Succesfully");
});

db.on("error",(err)=>{
    console.log("MongoDB Connection Error",err);
});

// defininf schema :

const schema = new mongoose.Schema({
    email : String,
    psd : String,
    user: String
    
});

const user_login = mongoose.model("user",schema);

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","studentLogin.html"));

});

app.get("/getUserSession", (req, res) => {
    res.json({ userEmail: req.session.userEmail || null });
});

app.post("/logon",async(req,res)=>{
    const {email,psd,user} = req.body;

    try{
        const newUser = new user_login({email,psd,user});
        await newUser.save();
        res.send("Hello the form has been submitted");
        // res.sendFile(path.join(__dirname,"public","form.html"));
    }

    catch (err) {
        console.error("Error saving user:", err);
        
       
        res.sendFile(path.join(__dirname,"public","studentLogin.html"));

    }
});

app.post("/stu_login",async(req,res)=>{
    const {email,psd,user} = req.body;
    const result = await user_login.findOne({email:email,psd:psd,user:user}); 
    
    try{
        if(result){
             // Assume user successfully logs in and `userEmail` is retrieved from backend
            req.session.userEmail = email; 
            res.sendFile(path.join(__dirname,"public","form.html"));
    
        }
        else{
            res.redirect("/studentLogin.html?login_error=1")
        }
           }
    catch(err){
        console.error("Error during login:", err);
        res.status(500).send("Internal Server Error");
    }
   
});

app.post("/admin_login",async(req,res)=>{
    const {email,psd,user} = req.body;
    const result = await user_login.findOne({email:email,psd:psd,user:user});

    
    try{
        if(result){
            // res.send("Hello");
            res.sendFile(path.join(__dirname,"public","adminPage.html"));
    
        }
        else{
            res.redirect("/adminLogin.html?login_error=1")
        }
           }
    catch(err){
        console.error("Error during login:", err);
        res.status(500).send("Internal Server Error");
    }
   
});
app.post("/change_password",async(req,res)=>{
    const {email,new_psd,re_psd} = req.body;

    const result = await user_login.findOne({email:email}); 

    if(new_psd != re_psd){
        res.redirect("/forgotPassword.html?psd_error=1");
    }
    else if(result.psd == new_psd){
        res.redirect("/forgotPassword.html?psd_error=2");
    }
    else{
        try{
            result.psd = new_psd ;
            await result.save();
        }

        catch(err){
            res.send("Error in changing the password. Try Again!!");
        }
        
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

