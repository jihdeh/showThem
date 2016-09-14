import cloudinary from "cloudinary";

cloudinary.config({ 
  cloud_name: "exponent",
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;