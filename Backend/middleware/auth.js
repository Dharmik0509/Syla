import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

        // Remove "Bearer " if present
        const tokenString = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

        const verified = jwt.verify(tokenString, process.env.JWT_SECRET || "default_secret_key");
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
