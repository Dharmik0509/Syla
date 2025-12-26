
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const checkIndexes = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection('products');
        const indexes = await collection.indexes();

        console.log("Current Indexes:");
        indexes.forEach(idx => {
            console.log(`- Name: ${idx.name}, Key: ${JSON.stringify(idx.key)}, Sparse: ${idx.sparse || false}, Unique: ${idx.unique || false}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

checkIndexes();
