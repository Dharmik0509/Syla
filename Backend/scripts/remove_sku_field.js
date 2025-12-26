
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const removeSkuField = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection('products');

        console.log("Removing 'sku' field from all products...");
        const result = await collection.updateMany(
            {},
            { $unset: { sku: "" } }
        );

        console.log(`✅ Removed 'sku' from ${result.modifiedCount} documents.`);

        // Also drop the index if it still exists
        try {
            await collection.dropIndex("sku_1");
            console.log("✅ Dropped sku_1 index.");
        } catch (e) {
            console.log("ℹ️ No sku_1 index found or already dropped.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error cleaning SKUs:", error);
        process.exit(1);
    }
};

removeSkuField();
