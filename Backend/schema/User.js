import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    personName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    status: { type: Number, default: 1 }, // 1 = Active, 0 = Suspended
    createdAt: { type: Date, default: Date.now },
    last_login: { type: Date }
});

const User = mongoose.model("User", userSchema);
export default User;
