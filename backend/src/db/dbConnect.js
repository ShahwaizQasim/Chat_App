import mongoose from "mongoose"
import { ENV } from "../constant/index.js";
import 'dotenv/config';

const DBConnect = async () => {
    try {
        const url = `mongodb+srv://${ENV.DB_NAME}:${ENV.DB_PASSWORD}@lms.fdc0y.mongodb.net/${ENV.DB_DATABASE_NAME}?retryWrites=true&w=majority&appName=LMS`
        await mongoose.connect(url);
        console.log("MongoDb is connected");
    } catch (error) {
        console.log("Mongo DB Connection Failed");
    }
}

export default DBConnect;