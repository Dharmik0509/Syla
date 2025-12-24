import User from "../schema/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.user_type, email: user.email },
        process.env.JWT_SECRET || "default_secret_key",
        { expiresIn: "7d" }
    );
};

export default class Login {
    // LOGIN (Authenticate)
    async authenticate(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            if (user.status !== 1) {
                return res.status(403).json({ message: "Account suspended." });
            }

            // Update Last Login
            await User.updateOne({ _id: user._id }, { $set: { last_login: new Date() } });

            const token = generateToken(user);

            return res.json({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    personName: user.personName,
                    email: user.email,
                    role: user.user_type
                }
            });

        } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    // SIGNUP (Create User)
    // Note: User asked to put signup logic in login.js for now, though typically separated.
    async createuser(req, res) {
        try {
            const { personName, email, password, user_type } = req.body;

            if (!personName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                personName,
                email,
                password: hashedPassword,
                user_type: user_type || 'customer',
                status: 1
            });

            await newUser.save();

            const token = generateToken(newUser);

            return res.status(201).json({
                message: "User registered successfully",
                token,
                user: {
                    _id: newUser._id,
                    personName: newUser.personName,
                    email: newUser.email,
                    role: newUser.user_type
                }
            });

        } catch (error) {
            console.error("Signup Error:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}
