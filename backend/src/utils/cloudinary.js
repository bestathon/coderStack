import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: 'di6xvldto', 
    api_key: '391161524182548', 
    api_secret: '0bx3zXyTI37Vc9_ZE7ai1WlfbPA' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)  
        return null;
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return response;
    } catch (error) {
        console.error("Error deleting asset from Cloudinary:", error.message);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };