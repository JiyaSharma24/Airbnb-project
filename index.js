 if(process.env.NODE_ENV !== "production"){
   require('dotenv').config();
 }

const express = require( 'express');
const app= express();
const mongoose = require('mongoose');
const path = require("path");
const ejs= require("ejs-mate"); 
const methodOverride=  require("method-override");
const listingsRouter= require("./routes/listing");
const reviewRouter= require ("./routes/review");
const userRouter= require ("./routes/user");
const session = require('express-session');
const MongoStore = require('connect-mongo');


const  flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User= require("./models/user");

const dburl = process.env.MONGO_URL;
main()

.then(()=>{
  
console.log(" connected to db");})
.catch((err)=>{
    console.log (err);
});

async function main() {
  await mongoose.connect(dburl, {
    tls: true,       
    family: 4        
  });
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true }));
app.engine("ejs",ejs);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo Session store",err);
})
const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use((req, res, next) => {
  res.locals.currUser = req.user; // or whatever you're using to store the logged-in user
  next();
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
    console.log(res.locals.success);
    next();
})


app.use("/Listings",listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.get("/",(req,res)=>{
    res.send("hii i am root");
  });

  
 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});