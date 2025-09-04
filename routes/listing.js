const express= require("express");
const router= express.Router();
const Listing= require("../models/Listing.js");
const  wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const mongoose = require('mongoose');
const {isLoggedin,isOwner}=require("../middleware.js");
const listingController= require("../controllers/listings");
const multer = require('multer')
const {storage}= require("../cloudconfig.js");
const upload= multer({storage});
//  Middleware 
const validateListing=(req,res,next) => {
  let{error}= listingSchema.validate(req.body);
if (error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg); 
}
else{
  next();
}
}
//  combining indexand create route as request is goin on same "/"
router.route("/")
.get (wrapAsync(listingController.index))
 .post(isLoggedin,  upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


 router.get("/new", isLoggedin, listingController.renderNewForm);

 router.route("/:id")
 .get (wrapAsync(listingController.show))
.put ( isLoggedin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
 .delete (isLoggedin, isOwner, wrapAsync(listingController.destroy));
 
router.get("/:id/edit", 
  isLoggedin, 
  isOwner,
   wrapAsync(listingController.renderEditForm));


module.exports= router;