import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionDb from "./connection.js";
import router from "./router.js";

dotenv.config();

const app = express();

app.use(express.json()); // Essential for parsing JSON bodies

const allowedOrigins = [
    "https://syla-official.vercel.app",
    "https://syla-official.vercel.app/",
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
})); // Allow specific access

connectionDb();

app.use("/api", router); // User auth at /api/login, /api/signup

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});