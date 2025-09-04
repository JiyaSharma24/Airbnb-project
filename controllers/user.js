
const User= require("../models/user.js");

module.exports.rendersignup = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderlogin = (req,res)=>{
    res.render("users/login.ejs");
};
module.exports.signup= async(req,res) => {
    try{
    let {username,email, password}=req.body;
    const newUser=new User({email,username});
   const registerUser =await User.register(newUser,password);
 console.log( registerUser);
  req.flash("success","welcome to Wanderlust");
  res.redirect("/Listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }

};

module.exports.login=async(req,res) => {
    // res.send("welcome to wonderlust you are logeed in");
let redirectUrl=req.session.redirectUrl ||"/Listings";

   delete req.session.redirectUrl;

    // redirect the user
    res.redirect(redirectUrl);

};
module.exports.logout=(req,res,next)=>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};
