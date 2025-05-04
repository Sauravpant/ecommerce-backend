import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { asyncHandler } from './AsyncHandler';

cloudinary.config({
  cloud_name: 'my_cloud_name',
  api_key: 'my_key',
  api_secret: 'my_secret'
});

export const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "ecommerce",
    });
    fs.unlinkSync(filePath);
    return response;
  } catch (err) {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    throw null;
  }
};
