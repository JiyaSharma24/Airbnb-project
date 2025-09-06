const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const  ListingSchema = new Schema({
title:{
        type: String,
        required:true
    },
description:{
    type: String,
    },
image:{
url:String,
filename:String,
},
price : {
    type :Number,
    min:0,
    required :true
},
location:{
    type:String,
    required: true,
},


   

  // other fields like owner, reviews, etc.

country:{
type: String,
  required: true,
},
geometry: {
  type: {
    type: String,
    enum: ['Point'],       // Only allow 'Point'
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],        // Array of Numbers: [longitude, latitude]
    required: true
  }
},

reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",

},
],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
required:true
}
});
ListingSchema.index({ geometry: '2dsphere' });
module.exports =mongoose.model("Listing", ListingSchema,"listings");