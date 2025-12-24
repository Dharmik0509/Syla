import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // Self-reference for nesting
    description: { type: String },
    image: { type: String }, // Optional category image
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
