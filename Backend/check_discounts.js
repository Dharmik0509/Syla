import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/syla_db')
    .then(async () => {
        console.log("Connected to DB");
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log("Total Products:", products.length);
        products.forEach(p => {
            console.log(`Product: ${p.title} | Price: ${p.price} | Discount: ${p.discountPercentage}%`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
