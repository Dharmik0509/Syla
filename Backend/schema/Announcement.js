
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    link: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

// Use a singleton pattern conceptually - we will always fetch the first document
const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
