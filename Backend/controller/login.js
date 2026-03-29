import User from "../schema/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

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

    // FORGOT PASSWORD
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "There is no user with that email address." });
            }

            // Create reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            // Hash token and set to resetPasswordToken field
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            
            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

            await user.save();

            // Create reset URL
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

            const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Syla Password Reset',
                    message: message,
                    html: `
                        <h3>Password Reset Request</h3>
                        <p>You requested a password reset. Please click the link below to reset your password:</p>
                        <a href="${resetUrl}" style="padding:10px 15px; background:var(--primary); color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                        <p>This link is valid for 10 minutes.</p>
                    `
                });

                res.status(200).json({ message: 'Token sent to email!' });
            } catch (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
                console.error("Email sending error Details:", err);
                return res.status(500).json({ message: 'There was an error sending the email. Try again later.' });
            }

        } catch (error) {
            console.error("Forgot Password Error:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    // RESET PASSWORD
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Reset token is required' });
            }

            // Get hashed token
            const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpires: { $gt: Date.now() } // Ensure token has not expired
            });

            if (!user) {
                return res.status(400).json({ message: 'Token is invalid or has expired' });
            }

            // Set the new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            // Automatically log them in by sending token
            const authToken = generateToken(user);

            res.status(200).json({
                message: 'Password reset successful',
                token: authToken,
                user: {
                    _id: user._id,
                    personName: user.personName,
                    email: user.email,
                    role: user.user_type
                }
            });

        } catch (error) {
            console.error("Reset Password Error:", error);
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}
