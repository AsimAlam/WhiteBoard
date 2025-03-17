const express = require("express");
const Whiteboard = require("../models/Whiteboard");
const NoteSchema = require("../models/NoteSchema");
const validateSessionToken = require("../middleware/validateSessionToken");
const checkRole = require("../middleware/checkRole");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/authCheck");
const User = require("../models/User");

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

router.get("/get-all-whiteboard", async (req, res) => {

  const { userId } = req.query;

  console.log("userid", userId);

  try {
    console.log("dfss");
    const allWhiteboard = await Whiteboard.find({
      $or: [
        { ownerId: userId },
        { "collaborators.userId": userId }
      ]
    });
    console.log(allWhiteboard);
    res.json(allWhiteboard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error });
  }
});

// Save a drawing
router.put("/:id/save-drawing", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { canvas, thumbnail } = req.body;

  console.log(id, token, canvas);

  try {

    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) return res.status(404).json({ message: "Whiteboard not found" });
    if (whiteboard.sessionToken !== token) {
      return res.status(403).json({ message: "Invalid session token" });
    }

    if (whiteboard.pages && whiteboard.pages.length > 0) {
      whiteboard.pages[0].canvasData = canvas;
      whiteboard.pages[0].thumbnail = thumbnail;
    } else {
      whiteboard.pages = [{ pageNumber: 1, canvasData: canvas, thumbnail: thumbnail }];
    }
    await whiteboard.save();
    res.json({ message: "Whiteboard updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving drawing" });
  }
});

router.put("/:id/add-collaborator", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  const { userId, role } = req.body;

  try {
    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) return res.status(404).json({ message: "Whiteboard not found" });
    if (whiteboard.sessionToken !== token) {
      return res.status(403).json({ message: "Invalid session token" });
    }

    console.log("collab whiteboard", whiteboard);

    const existing = whiteboard.collaborators.find(collab =>
      collab.userId.toString() === userId
    );

    if (existing) {
      if (existing.role !== role) {
        existing.role = role;
        await whiteboard.save();
        return res.json({ message: "Collaborator role updated successfully" });
      }
      return res.json({ message: "Collaborator already exists" });
    } else {
      whiteboard.collaborators.push({ userId, role });
      await whiteboard.save();
      return res.json({ message: "Collaborator added successfully" });
    }

  } catch (error) {
    res.status(500).json({ message: "Error adding collaborator", error: error });
  }

});

router.put("/:id/change-permission", async (req, res) => {
  const { id } = req.params;
  // const { token } = req.query;
  const { userId, role } = req.body;

  try {
    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) return res.status(404).json({ message: "Whiteboard not found" });
    // if (whiteboard.sessionToken !== token) {
    //   return res.status(403).json({ message: "Invalid session token" });
    // }

    console.log("collab whiteboard", whiteboard);

    const collaborator = whiteboard.collaborators.find(
      (collab) => collab.userId.toString() === userId
    );
    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }
    collaborator.role = role;
    await whiteboard.save();

    res.status(200).json({ message: "Whiteboard updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating collaborator", error: error });
  }

});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Whiteboard.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }
    res.status(200).json({ message: "Whiteboard deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const whiteboard = await Whiteboard.findByIdAndUpdate(
      id,
      { name },
      { new: true } // returns the updated document
    );
    if (!whiteboard) {
      return res.status(404).json({ message: "Whiteboard not found" });
    }
    res.status(200).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id/get-user", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Error getting Users", error: error });
  }

});

router.get("/:id/get-notes", async (req, res) => {

  const { id } = req.params;

  try {
    const notes = await NoteSchema.find({ whiteboardId: id });
    console.log("notes", notes);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error getting Notes", error: error });
  }
});

router.put("/:id/update-notes", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    let note = await NoteSchema.findOne({ whiteboardId: id });

    if (note) {
      note.content = content;
      note = await note.save();
      return res.status(200).json(note);
    } else {
      note = await NoteSchema.create({
        whiteboardId: id,
        content
      });
      return res.status(201).json(note);
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating or creating note", error: error.message });
  }
});




module.exports = router;
