const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const pollRoutes = require("./routes/pollRoutes");

const io = new Server(server, {
    cors :{
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinPollRoom", (pollId) => {
    socket.join(pollId);
    console.log(`Socket ${socket.id} joined room ${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("io", io);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://real-time-poll-room-lovat.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());


app.use("/api/polls", pollRoutes);

app.get("/", (req, res) => {
  res.send("Poll Room API Running...");
});

mongoose.connect(process.env.MONGO_URL)
         .then(() => console.log("MongoDB Connected"))
         .catch((err) => console.error(err));


const PORT = process.env.PORT || 8080;    

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});