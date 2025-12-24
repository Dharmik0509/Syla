import mongoose, { Mongoose } from "mongoose";

export default  async function connectionDb(){
    try {
        await mongoose.connect(process.env.MONGO_URL)
        if(mongoose.connect){
            console.log("Connected to MongoDB")
        }

    } catch (error) {
        console.log(error.message)
    }
}