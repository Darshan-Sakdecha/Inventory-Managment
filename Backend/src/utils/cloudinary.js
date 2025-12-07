import { v2 as cloudinary } from 'cloudinary'
import { log } from 'console';
import fs from 'fs'
import { url } from 'inspector';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("Cloudinary Response is : ", response);

        // file has been uploaded successfull
        console.log("File is uploaded on cloudinary ", response.url);
        return response;

    } catch (error) {
        fs.unlink(localFilePath);
        //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary };