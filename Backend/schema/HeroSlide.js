import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema({
    image: { type: String, required: true }, // URL
    title: { type: String },
    subtitle: { type: String },
    link: { type: String }, // Optional CTA link
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);
export default HeroSlide;
