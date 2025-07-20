import express from "express"
import DBConnect from "./db/dbConnect.js";
import { ENV } from "./constant/index.js";
import 'dotenv/config';

const app = express();

DBConnect();

app.get("/",(req, res)=>{
    res.send("Hello World");
})

app.listen(ENV.PORT,()=>{
    console.log(`server running on 3000`);
})