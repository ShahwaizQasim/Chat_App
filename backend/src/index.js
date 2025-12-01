import express from "express";
import DBConnect from "./db/dbConnect.js";
import { ENV } from "./constant/index.js";
import "dotenv/config";
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { messageModel } from "./models/userMessage.modal.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ya apna frontend URL, ex: "http://localhost:3000"
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form-data ke liye
app.use(cors());
app.use(helmet());

DBConnect();

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User apna khud ka room join karega (userId)
  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`${userId} joined their private room`);
  });

  // Private message send
  socket.on("private_message", async ({ message, receiverId }) => {
    console.log("Private Message:", message, "To:", receiverId);

    // message save in mongodb
    let SavedMessage = await messageModel.create({
      senderId: message.senderId,
      recieverId: receiverId,
      text: message.text,
      time: message.time,
    });

// SEND TO RECEIVER (REAL TIME)
    io.to(receiverId).emit("private_message", SavedMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(ENV.PORT || 3000, () => {
  console.log(`server running on 3000`);
});
