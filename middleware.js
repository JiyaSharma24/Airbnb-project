const Listing = require("./models/Listing");
const mongoose = require("mongoose");

module.exports.isLoggedin=(req,res,next)=>{
 
if(!req.isAuthenticated()){
  req.session.redirectUrl = req.originalUrl;
   console.log(req.path,"..",req.originalUrl);
    req.flash("error"," you must be logged in to create listing");
  return res.redirect("/login");
  }
  next()
};
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirect= req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner= async(req,res,next)=>{
const {id}= req.params;
 if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error("❌ Invalid Listing ID"));
  }
const listing = await Listing.findById(id);
 if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
if(!listing.owner.equals(req.user._id)){
req.flash("error", "you are not owner of this listing");
return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
const {id,reviewId}= req.params;
const review = await review.findById(reviewId);


 if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author || !review.author.equals(req.user._id)) {
  req.flash("error", "You are not the owner of this review");
  return res.redirect(`/listings/${id}`);
}


next();
};
