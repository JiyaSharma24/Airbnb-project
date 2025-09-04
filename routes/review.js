const express= require("express");
const router = express.Router({mergeParams:true});
const Listing= require("../models/Listing.js");
const  wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const mongoose = require('mongoose');
const Review = require("../models/Review.js");
const {isLoggedin,isReviewAuthor}=require("../middleware.js");
const reviewController= require("../controllers/review");
const validatereview=(req,res,next) => {
  let{error}= reviewSchema.validate(req.body);
if (error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg); 
}
else{
  next();
}
}
  router.post("/",isLoggedin,validatereview,wrapAsync(reviewController.renderreview))
      // delete review route

     router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.destroy));
    //agr puri listing hi delete kr tu kya hoga
      
    // error handling
// router.use((err,req,res,next)=>{
// res.send("something went wrong");
//  })   
// router.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"page not found"));
// })
// router.use((err,req,res,next)=>{
//   let {statusCode=500,message ="something went wrong"}=err;

//   res.status(statusCode).render("Listings/error",{statusCode,message});
// })
module.exports =router;