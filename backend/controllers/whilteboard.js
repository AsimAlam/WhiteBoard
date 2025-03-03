const express = require("express");
const Whiteboard = require("../models/Whiteboard");
const Drawing = require("../models/Drawing");
const validateSessionToken = require("../middleware/validateSessionToken");
const checkRole = require("../middleware/checkRole");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/authCheck");

const router = express.Router();

// Create a new whiteboard
router.post("/create", async (req, res) => {
  try {
    const sessionToken = uuidv4();
    const { name, ownerId } = req.body;
    const whiteboard = new Whiteboard({ name, ownerId, sessionToken });
    await whiteboard.save();
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Error creating whiteboard" });
  }

});

// Save a drawing
router.put("/:id/save-drawing", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { canvas } = req.body;

  console.log(id, token, canvas);

  try {

    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) return res.status(404).json({ message: "Whiteboard not found" });
    if (whiteboard.sessionToken !== token) {
      return res.status(403).json({ message: "Invalid session token" });
    }

    if (whiteboard.pages && whiteboard.pages.length > 0) {
      whiteboard.pages[0].canvasData = canvas;
    } else {
      whiteboard.pages = [{ pageNumber: 1, canvasData: canvas }];
    }
    await whiteboard.save();
    res.json({ message: "Whiteboard updated successfully" });
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
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) return res.status(404).json({ message: "Whiteboard not found" });
    // Optionally add the user as a collaborator if not present.
    // if (!whiteboard.collaborators.some(c => c.userId.equals(req.user._id))) {
    //   whiteboard.collaborators.push({ userId: req.user._id, role: "write" });
    //   await whiteboard.save();
    // }
    res.json(whiteboard);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
