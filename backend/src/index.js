import express from "express"
import DBConnect from "./db/dbConnect.js";
import { ENV } from "./constant/index.js";
import 'dotenv/config';
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form-data ke liye
app.use(cors());
app.use(helmet());


DBConnect();

app.use("/api", router);

app.get("/",(req, res)=>{
    res.send("Hello World");
})

app.listen(ENV.PORT,()=>{
    console.log(`server running on 3000`);
})