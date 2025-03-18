require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const routes = require("./routes/routes");

const app = express();

// Trust the first proxy (Render uses a reverse proxy)
app.set("trust proxy", 1);

app.use(express.json());

// Configure CORS (must be before session middleware)
app.use(cors({
    origin: "https://whiteboard-frontend-zb1b.onrender.com", // Your frontend URL
    credentials: true,
}));

// Configure session middleware
app.use(session({
    secret: "your-secret-key",  // Use a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,         // Requires HTTPS; with trust proxy, Express sees the connection as secure
        httpOnly: true,
        sameSite: "None",     // Allows cross-site cookies
        domain: ".onrender.com" // Optional: ensures the cookie is available on all subdomains
    },
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Socket.io configuration
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-board", (boardId) => {
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    socket.on("canvas-update", (data) => {
        socket.to(data.boardId).emit("canvas-update", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    socket.on("permission-change", (data) => {
        console.log("permission", data);
        socket.to(data.boardId).emit("permission-change", data);
    });
});

routes(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
