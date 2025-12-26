
import Announcement from "../schema/Announcement.js";

class AnnouncementController {

    // Get active announcements for Frontend
    async getActiveAnnouncements(req, res) {
        try {
            const announcements = await Announcement.find({ isActive: true }).sort({ updatedAt: -1 });
            res.json(announcements);
        } catch (error) {
            res.status(500).json({ message: "Error fetching announcements", error: error.message });
        }
    }

    // Get all announcements for Admin
    async getAllAnnouncements(req, res) {
        try {
            const announcements = await Announcement.find().sort({ updatedAt: -1 });
            res.json(announcements);
        } catch (error) {
            res.status(500).json({ message: "Error fetching announcements", error: error.message });
        }
    }

    // Create new announcement
    async createAnnouncement(req, res) {
        try {
            const { text, link, isActive } = req.body;
            const announcement = new Announcement({ text, link, isActive });
            await announcement.save();
            res.json({ message: "Announcement created", announcement });
        } catch (error) {
            res.status(500).json({ message: "Error creating announcement", error: error.message });
        }
    }

    // Update announcement
    async updateAnnouncement(req, res) {
        try {
            const { id } = req.body; // Expect ID in body for simplicity or params
            const { text, link, isActive } = req.body;

            const announcement = await Announcement.findByIdAndUpdate(
                id,
                { text, link, isActive, updatedAt: Date.now() },
                { new: true }
            );

            if (!announcement) {
                return res.status(404).json({ message: "Announcement not found" });
            }

            res.json({ message: "Announcement updated", announcement });
        } catch (error) {
            res.status(500).json({ message: "Error updating announcement", error: error.message });
        }
    }

    // Delete announcement
    async deleteAnnouncement(req, res) {
        try {
            const { id } = req.body;
            await Announcement.findByIdAndDelete(id);
            res.json({ message: "Announcement deleted" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting announcement", error: error.message });
        }
    }
}

export default AnnouncementController;
