// middleware/checkRole.js
const Whiteboard = require("../models/Whiteboard");

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const { whiteboardId } = req.params;
            const userId = req.user.id; // Assume req.user is set after authentication
            const whiteboard = await Whiteboard.findById(whiteboardId);

            // Allow the owner full access
            if (whiteboard.ownerId.toString() === userId) {
                return next();
            }

            const collaborator = whiteboard.collaborators.find(collab => collab.userId.toString() === userId);
            if (!collaborator) {
                return res.status(403).json({ message: "Access denied" });
            }

            // If requiredRole is "write" but the collaborator is only "read"
            if (requiredRole === "write" && collaborator.role !== "write") {
                return res.status(403).json({ message: "Insufficient permissions" });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    };
};

module.exports = checkRole;
