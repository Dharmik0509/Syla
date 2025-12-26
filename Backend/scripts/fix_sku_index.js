
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("❌ MONGO_URL not found in environment variables.");
    process.exit(1);
}

const fixIndex = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.collection('products');

        // List indexes
        const indexes = await collection.indexes();
        console.log("Existing Indexes:", indexes.map(i => i.name));

        // Attempt to drop sku_1
        const skuIndex = indexes.find(i => i.key.sku);
        if (skuIndex) {
            console.log(`Found SKU index: ${skuIndex.name}. Dropping...`);
            await collection.dropIndex(skuIndex.name);
            console.log("✅ Dropped SKU index.");
        } else {
            console.log("ℹ️ No SKU index found.");
        }

        console.log("🔄 Index dropped. Mongoose should recreate it as sparse on next app start.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing index:", error);
        process.exit(1);
    }
};

fixIndex();
