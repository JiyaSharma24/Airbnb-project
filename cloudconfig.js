const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
cloudinary.config({
CLOUD_NAME:process.env.CLOUD_NAME,
CLOUD_KEY:process.env.CLOUD_KEY,
CLOUD_SECRET:process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wonderlust_dev',
    format: async (req, file) => ['png','jpg','jpeg' ],// supports promises as well
   
  },
});
module.exports={
    cloudinary,storage
}
