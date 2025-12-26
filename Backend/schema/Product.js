import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },

    // Pricing & Inventory
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },

    // Discounts
    discountPercentage: { type: Number, default: 0 },
    discountStartDate: { type: Date },
    discountEndDate: { type: Date },

    // Categorization
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Optional specific sub-cat
    tags: [{ type: String }],

    // Media
    images: [{ type: String }], // Array of image URLs (Cloudinary)
    thumbnail: { type: String },

    // Meta
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }, // New field
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update `updatedAt` on save
productSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
