const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    whiteboardId: { type: mongoose.Schema.Types.ObjectId, ref: "Whiteboard", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastActive: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Session", SessionSchema);
