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
// image:{
// type : String,
// set: (v)=>v===""?"https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fd%2Fd1%2FRam_Janmbhoomi_Mandir%252C_Ayodhya_Dham.jpg&tbnid=Qvz3f5nRLAsBWM&vet=12ahUKEwjcw9GC2qGHAxUfwKACHXjADxEQMygAegQIARBq..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FAyodhya&docid=LKq8s-61qBLXvM&w=922&h=549&q=image%20of%20ayodhaya&ved=2ahUKEwjcw9GC2qGHAxUfwKACHXjADxEQMygAegQIARBq"
// : v,
// },
    
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
module.exports =mongoose.model("Listing", ListingSchema);