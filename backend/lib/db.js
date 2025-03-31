import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (error) {
        console.log(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};