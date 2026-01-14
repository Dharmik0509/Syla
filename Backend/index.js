import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionDb from "./connection.js";
import router from "./router.js";

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
    "https://syla-official.vercel.app",
    "https://www.syla-official.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Dynamic check for any local development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('BLOCKED ORIGIN:', origin); // Log the blocked origin for debugging
            var msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
})); // Allow specific access

// Debug logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Connect to Database with error handling
try {
    connectionDb();
} catch (err) {
    console.error("Database connection failed:", err);
}

app.use("/api", router);

// --- KEEP ALIVE MECHANISM FOR RENDER FREE TIER ---
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;

const reloadWebsite = () => {
    // Only ping if RENDER_EXTERNAL_URL is set (Production) to avoid local noise
    if (process.env.RENDER_EXTERNAL_URL) {
        console.log("RENDER_EXTERNAL_URL:", process.env.RENDER_EXTERNAL_URL);
        const url = `${process.env.RENDER_EXTERNAL_URL}/health`;
        fetch(url)
            .then(response => console.log(`[Keep-Alive] Pinged ${url}: ${response.status}`))
            .catch(error => console.error(`[Keep-Alive] Ping failed: ${error.message}`));
    } else {
        console.log("RENDER_EXTERNAL_URL is not set. Keep-Alive skipped (Dev Mode).");
    }
};

// Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
setInterval(reloadWebsite, 14 * 60 * 1000);
// -------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("RENDER_EXTERNAL_URL:", process.env.RENDER_EXTERNAL_URL || "Not Set (Dev Mode)");
}).on('error', (err) => {
    console.error("Server failed to start:", err);
});