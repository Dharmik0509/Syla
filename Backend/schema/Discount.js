
import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'PERCENTAGE'
    },
    value: { type: Number, required: true }, // e.g., 20 for 20% or 500 for ₹500

    appliesTo: {
        type: String,
        enum: ['CATEGORY', 'PRODUCT', 'ALL'],
        required: true
    },

    // Array of Category IDs or Product IDs
    targetValues: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetRef'
    }],

    // Dynamic ref based on appliesTo (helper field, not strictly necessary if handled manually)
    targetRef: {
        type: String,
        enum: ['Category', 'Product']
    },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },

    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Helper to set valid ref
discountSchema.pre('save', async function () {
    if (this.appliesTo === 'CATEGORY') {
        this.targetRef = 'Category';
    } else if (this.appliesTo === 'PRODUCT') {
        this.targetRef = 'Product';
    }
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
