import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    instagramUsername: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    // Profile picture URL — fetched from Instagram via backend
    profilePicUrl: {
        type: String,
        default: ''
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Model = mongoose.model('Model', ModelSchema);
export default Model;
