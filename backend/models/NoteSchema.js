const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    whiteboardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Whiteboard",
        required: true
    },
    noteType: {
        type: String,
        enum: ["text", "link", "other"],
        default: "text"
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Note", NoteSchema);
