const express = require("express");
const Whiteboard = require("../models/Whiteboard");
const Drawing = require("../models/Drawing");
const validateSessionToken = require("../middlewares/validateSessionToken");

const router = express.Router();

// Create a new whiteboard
router.post("/create", async (req, res) => {
    const { name, ownerId } = req.body;
    const whiteboard = new Whiteboard({ name, ownerId });
    await whiteboard.save();
    res.json(whiteboard);
});

// Save a drawing
router.post("/:whiteboardId/save-drawing", checkRole("write"), async (req, res) => {
    const { whiteboardId, data } = req.body;
    try {
        const drawing = new Drawing({ whiteboardId, data });
        await drawing.save();
        res.json({ message: "Drawing saved successfully", drawing });
    } catch (error) {
        res.status(500).json({ message: "Error saving drawing" });
    }
});

router.post("/generate-session-link", async (req, res) => {
    const { whiteboardId } = req.body;
    try {
        const sessionToken = uuidv4();

        // Assume you add a field "sessionToken" in your Whiteboard schema:
        const whiteboard = await Whiteboard.findByIdAndUpdate(
            whiteboardId,
            { sessionToken },
            { new: true }
        );

        // Construct the URL (adjust the domain as needed)
        const sessionLink = `https://yourapp.com/whiteboard/${whiteboardId}?token=${sessionToken}`;
        res.json({ sessionLink });
    } catch (error) {
        res.status(500).json({ message: "Error generating session link" });
    }
});

// Get drawings of a whiteboard
router.get("/:whiteboardId/drawings", validateSessionToken, async (req, res) => {
    const drawings = await Drawing.find({ whiteboardId: req.params.whiteboardId });
    res.json(drawings);
});

module.exports = router;
