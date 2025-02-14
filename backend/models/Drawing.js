const mongoose = require("mongoose");

const DrawingSchema = new mongoose.Schema({
    whiteboardId: { type: mongoose.Schema.Types.ObjectId, ref: "Whiteboard", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who performed the action (if needed)
    data: { type: Object, required: true }, // Drawing data (e.g., paths, shapes, text)
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Drawing", DrawingSchema);
