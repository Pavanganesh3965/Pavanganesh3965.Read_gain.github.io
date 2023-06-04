const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
var USER="";
mongoose.connect('mongodb://localhost:27017/Read_and_gain', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSignup = new mongoose.Schema({
    name: String,
    email: String,
    PhoneNumber: Number,
    age : Number,
    password: String
});

const feedback = new mongoose.Schema({
  email: String,
  title: String,
  author:String,
  summary: String
});

const Summary = new mongoose.model("Summary",feedback);

const UserDetails = new mongoose.model("User_Details",userSignup);

app.use(bodyParser.urlencoded({extended:true}));

app.get("",function(req,res){
    res.sendFile(__dirname + "/public/main1.html");
});

app.get("/home",(req,res)=>{
  const name1 = "yaswanth";
  res.render('book',{name:name1});
})

app.post("/home",(req,res)=>{
  const name1 = "yaswanth";
  res.render('book',{name:name1});
})

app.get('/read',(req,res)=>{
  res.render('read');
})

app.post('/read',(req,res)=>{
  res.render('read');
});

app.post('/summerize',(req,res)=>{
  res.render("summarize");
});

app.post('/submit_summary',async(req,res)=>{
  try{
    const title = req.body.title;
    const author = req.body.author;
    const summary = req.body.summary;
    const SUMMARY = new Summary({
      email: USER,
      title: title,
      author: author,
      summary: summary
    })
    SUMMARY.save();
    res.render('book',{name:USER});
  }
  catch(error){
    res.send(error);
  }
});

app.post('/back',(req,res)=>{
  res.sendFile(__dirname+"/public/main1.html");
})

app.post("/register",async(req,res)=>{
    try{
        const check_mail = req.body.email;
        const check_number = req.body.PhoneNumber;
        const cnumber = req.body.Conform_number;
        const user = await UserDetails.findOne({email:check_mail},{PhoneNumber: check_number});
        if(!user){
          const encryptedString = cryptr.encrypt(req.body.password);
          const userDetails = new UserDetails({
            name: req.body.Name,
            email: req.body.email,
            PhoneNumber: req.body.PhoneNumber,
            age : req.body.Age,
            password: encryptedString
           });
          userDetails.save();
          USER = req.body.email;
          // res.send("Success");
          res.render('book',{name:USER});
        }
        else{
          res.status(201).send("<body style='background-color:white;color:white;text-align:center;'><h2>This user already exists</h2></body>");
        }
      }
      catch(error){
        console.log(error);
        // res.send("Invalid details");
      }
});

app.post("/point",async(req,res)=>{
  res.render('points',{point: POINT});
})

app.post("/login",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        // const name = await UserDetails.findMany({})
        const useremail = await UserDetails.findOne({email: email});
        if(useremail){
          const decryptedString = cryptr.decrypt(useremail.password);
          if(decryptedString === password){
            // res.status(201).sendFile(__dirname+"/Public/Html_pages/sign/digisign.html");
            // res.send("Success");
            USER = email;
            res.render('book',{name:USER});
          }
          else{
            res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
          }
        }
        else{
          res.send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
        }
      }
      catch(error){
        res.status(400).send("<body style='background-color:black;color:white;text-align:center;'><h2>Invalid details has been entered</h2></body>");
      }
});

app.listen(8080,function(req,res){
    console.log("You website is running in localhost:8080");
});
