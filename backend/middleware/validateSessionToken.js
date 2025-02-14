// middleware/validateSessionToken.js
const Whiteboard = require("../models/Whiteboard");

const validateSessionToken = async (req, res, next) => {
    const { whiteboardId } = req.params;
    const { token } = req.query;

    try {
        const whiteboard = await Whiteboard.findById(whiteboardId);
        if (!whiteboard || whiteboard.sessionToken !== token) {
            return res.status(403).json({ message: "Invalid session token" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = validateSessionToken;
