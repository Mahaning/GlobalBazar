import mongoose from "mongoose";
import colors from "colors";


const connectDB=async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to DB ${conn.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`DB connection faild error :${err}`.bgRed.white);
    }
}

export default connectDB;