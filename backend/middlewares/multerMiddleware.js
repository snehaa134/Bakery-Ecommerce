
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary= require("../config/cloudinary")

const storage = new CloudinaryStorage({
   cloudinary:cloudinary,
   params:{
    folder:"BakeryBliss",
    allowed_formats:["jpg","jpeg","png","webp"]
   }
});

const uploads = multer({
    storage: storage
})

module.exports = uploads;


