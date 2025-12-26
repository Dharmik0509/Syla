import mongoose from "mongoose";

const giveawaySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    instagramId: {
        type: String,
        required: true,
    },
    isWinner: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Giveaway = mongoose.model("Giveaway", giveawaySchema);

export default Giveaway;
