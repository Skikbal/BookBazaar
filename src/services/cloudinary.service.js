import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../config/envConfig.js";
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  const { path, mimetype, size } = file;
  try {
    const response = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    const optimizedUrl = cloudinary.url(response.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });
    fs.unlinkSync(path);
    return { url: optimizedUrl, mimetype, size };
  }
  catch (error) {
    fs.unlinkSync(path);
    console.log(error);
    return null;
  }
};

export default uploadToCloudinary;
