

const mongoose = require('mongoose');
const Review = require("../models/Review.js");
   const Listing = require("../models/Listing.js");
//  to create review
module.exports.renderreview=(async(req,res)=>{
        const{id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
throw new ExpresssError(400,"Invdalid user Id");

        }
         const listing = await Listing.findById(id)
         .populate({
         path: "reviews",
    populate: { 
      path: "author",

    }  
  })
  .populate("owner");  
        
    if (!listing) throw new ExpressError(404, "Listing not found");

    const newReview = new Review({
     ...req.body,
     author:req.user._id
    });
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
 req.flash("success","new recview is created");
    res.redirect(`/listings/${listing._id}`);
});
//  to delete new review
    module.exports.destroy=(async (req, res) => {
    const { id, reviewId } = req.params;

    // ✅ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError(400, "❌ Invalid Listing or Review ID");
    }

    // Remove reference to review from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
 req.flash("success","review is deleted");
    res.redirect(`/listings/${id}`);
});