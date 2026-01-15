import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.cloudname,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine resource type based on mime type
        const isVideo = file.mimetype.startsWith('video/');

        // Dynamic Folder: Read from req.body (if available) or default
        // Note: 'uploadFolder' must be appended to FormData BEFORE 'images' on frontend
        let folder = 'syla_uploads';
        if (req.body && req.body.uploadFolder) {
            folder = req.body.uploadFolder;
        }

        // Use the filename provided by frontend (Category_Title_Index) as public_id
        const public_id = file.originalname.split('.').slice(0, -1).join('.');

        return {
            folder: folder,
            public_id: public_id,
            unique_filename: false, // Trust our custom unique name
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mov', 'avi', 'mkv'],
            resource_type: isVideo ? 'video' : 'image',
        };
    },
});

const upload = multer({ storage: storage });

export default upload;
