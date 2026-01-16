import mongoose, { Mongoose } from "mongoose";

export default async function connectionDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        if (mongoose.connect) {
            console.log("Connected to MongoDB");

            // Fix: Drop lingering 'sku' index that causes duplicate key errors
            try {
                await mongoose.connection.collection('products').dropIndex('sku_1');
                console.log("Dropped lingering 'sku_1' index.");
            } catch (idxError) {
                // Ignore error if index doesn't exist
                if (idxError.code !== 27) {
                    // console.log("Index drop info:", idxError.message);
                }
            }
        }

    } catch (error) {
        console.log(error.message)
    }
}