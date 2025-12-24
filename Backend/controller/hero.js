import HeroSlide from "../schema/HeroSlide.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

export default class HeroController {
    // Create new slide
    async createSlide(req, res) {
        try {
            const { image: bodyImage, title, subtitle, link, order } = req.body;

            const image = req.file ? req.file.path : bodyImage;

            const newSlide = new HeroSlide({
                image,
                title,
                subtitle,
                link,
                order
            });

            await newSlide.save();
            return res.status(201).json({ message: "Hero slide added", slide: newSlide });
        } catch (error) {
            if (req.file) await deleteFromCloudinary(req.file.path);
            return res.status(500).json({ message: "Error adding slide", error: error.message });
        }
    }

    // Get Active Slides
    async getSlides(req, res) {
        try {
            const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
            return res.json(slides);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching slides", error: error.message });
        }
    }

    // Update Slide
    async updateSlide(req, res) {
        try {
            const { id } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Slide ID is required" });

            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path;
            }

            const updatedSlide = await HeroSlide.findByIdAndUpdate(id, updateData, { new: true });
            return res.json({ message: "Slide updated", slide: updatedSlide });
        } catch (error) {
            if (req.file) await deleteFromCloudinary(req.file.path);
            return res.status(500).json({ message: "Error updating slide", error: error.message });
        }
    }

    // Delete Slide
    async deleteSlide(req, res) {
        try {
            const { id } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Slide ID is required" });

            const slide = await HeroSlide.findById(id);
            if (!slide) return res.status(404).json({ message: "Slide not found" });

            // Delete image from Cloudinary
            if (slide.image) {
                await deleteFromCloudinary(slide.image);
            }

            await HeroSlide.findByIdAndDelete(id);
            return res.json({ message: "Slide deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting slide", error: error.message });
        }
    }
}
