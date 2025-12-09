import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        // Convert relative path to absolute
        const absolutePath = path.resolve(localFilePath);
        // console.log("Uploading file from:", absolutePath);

        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto"
        });

        // console.log("Cloudinary uploaded:", response.secure_url);

        // Delete local file AFTER successful upload
        fs.unlinkSync(absolutePath);

        return response;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        // Remove the local file if exists
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
