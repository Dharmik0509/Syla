import Model from '../schema/Model.js';

class ModelController {

    // PUBLIC: Submit application (photo uploaded via multer/Cloudinary)
    async apply(req, res) {
        try {
            const { displayName, instagramUsername } = req.body;

            if (!displayName || !instagramUsername) {
                return res.status(400).json({ message: 'Display name and Instagram username are required.' });
            }

            // Check duplicate
            const existing = await Model.findOne({ instagramUsername: instagramUsername.toLowerCase().trim() });
            if (existing) {
                return res.status(409).json({ message: 'This Instagram account has already applied.' });
            }

            // Profile pic: either Cloudinary upload OR pre-fetched Instagram URL passed from frontend
            const profilePicUrl = req.file ? req.file.path : (req.body.profilePicUrl || '');

            const model = new Model({
                displayName: displayName.trim(),
                instagramUsername: instagramUsername.trim().toLowerCase(),
                profilePicUrl,
                isApproved: false
            });

            await model.save();
            res.status(201).json({ message: 'Application submitted! We will review it shortly.' });
        } catch (error) {
            console.error('Model Apply Error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // PUBLIC: Get all approved models
    async getApproved(req, res) {
        try {
            const models = await Model.find({ isApproved: true }).sort({ createdAt: -1 });
            res.json(models);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // ADMIN: Get all submissions (approved + pending)
    async getAll(req, res) {
        try {
            const models = await Model.find().sort({ createdAt: -1 });
            res.json(models);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // ADMIN: Approve a model
    async approve(req, res) {
        try {
            const { id } = req.body;
            const model = await Model.findByIdAndUpdate(id, { isApproved: true }, { new: true });
            if (!model) return res.status(404).json({ message: 'Model not found' });
            res.json({ message: 'Model approved!', model });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // ADMIN: Reject / unapprove
    async reject(req, res) {
        try {
            const { id } = req.body;
            const model = await Model.findByIdAndUpdate(id, { isApproved: false }, { new: true });
            if (!model) return res.status(404).json({ message: 'Model not found' });
            res.json({ message: 'Model unapproved.', model });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    // ADMIN: Delete submission
    async remove(req, res) {
        try {
            const { id } = req.body;
            await Model.findByIdAndDelete(id);
            res.json({ message: 'Model removed.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

export default ModelController;
