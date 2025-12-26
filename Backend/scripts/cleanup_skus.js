
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const cleanupSkus = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection('products');

        // Count bad docs
        const count = await collection.countDocuments({ sku: "" });
        console.log(`Found ${count} documents with empty SKU.`);

        if (count > 0) {
            const result = await collection.updateMany(
                { sku: "" },
                { $unset: { sku: "" } }
            );
            console.log(`✅ Unset SKU field for ${result.modifiedCount} documents.`);
        } else {
            console.log("No cleanup needed.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error cleaning SKUs:", error);
        process.exit(1);
    }
};

cleanupSkus();
