import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ENV } from '../constant/index.js';

// Configuration
cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export const uploadOnCloudinary = async (LocalFilePath) => {
    try {
        if (!LocalFilePath) return null;
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("file uploaded successfully", response.url);
        fs.unlinkSync(LocalFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(LocalFilePath); // remove the locally saved temporary file as the upload operation got failed
        console.log(error);
        return null
    }
}