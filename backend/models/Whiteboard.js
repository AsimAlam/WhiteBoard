const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
    pageNumber: { type: Number, required: true },
    canvasData: { type: Object, default: {} },
    thumbnail: { type: String, default: "" }
});

const CollaboratorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["read", "write"], default: "read" }
});

const WhiteboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pages: [PageSchema],
    collaborators: [CollaboratorSchema],
    sessionToken: { type: String }, // Unique token used for secure session links
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Whiteboard", WhiteboardSchema);
