
const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const passport= require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {saveRedirectUrl}= require("../middleware.js")
const userController= require("../controllers/user");
const user = require("../models/user.js");

//  signup route
router
.route("/signup")
.get((userController.rendersignup))
.post( wrapAsync(userController.signup));

router
.route("/login")
.get((userController.renderlogin))
.post(
     saveRedirectUrl,
      passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true
    }),
   (userController.login)
);


router.get("/logout",((userController.logout)));
   
module.exports = router;