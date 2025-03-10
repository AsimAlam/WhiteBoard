require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const routes = require("./routes/routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error(err));

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-board", (boardId) => {
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    socket.on("canvas-update", (data) => {
        // Broadcast update to all other users in the same board.
        socket.to(data.boardId).emit("canvas-update", data);
        // Optionally, persist data.canvas to the database.
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    // socket.on("register", (userId) => {
    //     socket.join(userId);
    //     console.log(`User ${userId} joined their personal room`);
    // });

    socket.on("permission-change", (data) => {
        console.log("permission", data);
        // Emit only to the target user's room
        socket.to(data.boardId).emit("permission-change", data);
    });

});

// Load routes
routes(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
