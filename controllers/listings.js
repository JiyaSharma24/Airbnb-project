
const Listing = require("../models/Listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");
const axios= require("axios");
// INDEX
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    console.log("Fetched Listings:", allListings);  
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error("Error loading listings:", err);  
    req.flash("error", "Cannot load listings");
    res.status(500).send("Cannot load listings at the moment");
  }
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// CREATE
module.exports.createListing = async (req, res, next) => {
 try{
  let url =req.file.path;
  let filename= req.file.filename;
  const{location}= req.body.listing;
  const geoResponse=await axios.get("https://nominatim.openstreetmap.org/search",{
    params:{
      q:location,
      format:"json",
      limit:1,
    },
     headers: {  "User-Agent": "Wanderlust App" // Nominatim requires a valid User-Agen
      }
  })
 if (geoResponse.data.length === 0) {
      throw new ExpressError(400, "❌ Location not found");
    }

    const coords = [
      parseFloat(geoResponse.data[0].lon),
      parseFloat(geoResponse.data[0].lat)
    ];

  const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
   newListing.image = {url,filename};
   newListing.geometry={
    type:"Point",
    coordinates:coords,
   };
  await newListing.save();

  req.flash("success", "New Listing is Created");
  res.redirect(`/listings/${newListing._id}`);
  }
catch(err){
  next(err);
}
 }

// SHOW
module.exports.show = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError(400, "❌ Invalid Listing ID"));
  }
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing, currentUser: req.user });
  } catch (err) {
    next(err);
  }
};

// EDIT FORM
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError(400, "❌ Invalid Listing ID"));
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
let originalimage =listing.image.url;
originalimage=originalimage.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit", { originalimage});
};

// UPDATE
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError(400, "❌ Invalid Listing ID"));
  }

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!==undefined){
let url =req.file.path;
  let filename= req.file.filename;
listing.image={url,filename};
listing.save();
  }
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroy = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Listing ID");
  }

  try {
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).send("❌ Listing not found");
    }

    req.flash("success", "Listing is deleted");
    res.redirect("/listings");
  } catch (err) {
    console.error("🔥 Error deleting listing:", err);
    res.status(500).send("Internal Server Error");
  }
};