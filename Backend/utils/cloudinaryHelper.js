import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloudname,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

export const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return;

        // Extract public ID from URL
        // Example: https://res.cloudinary.com/demo/image/upload/v1/syla_uploads/sample.jpg
        // Public ID: syla_uploads/sample

        const splitUrl = imageUrl.split('/');
        const filename = splitUrl[splitUrl.length - 1];
        const folder = splitUrl[splitUrl.length - 2];
        const publicId = `${folder}/${filename.split('.')[0]}`;
        const extension = filename.split('.').pop().toLowerCase();

        // Determine resource type based on extension
        const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(extension);
        const resourceType = isVideo ? 'video' : 'image';

        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`Deleted from Cloudinary (${resourceType}): ${publicId}`);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
};
