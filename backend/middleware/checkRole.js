// const Whiteboard = require("../models/Whiteboard");

// const checkRole = (requiredRole) => {
//     return async (req, res, next) => {
//         try {
//             const { whiteboardId } = req.params;
//             const userId = req.user.id;
//             const whiteboard = await Whiteboard.findById(whiteboardId);

//             if (whiteboard.ownerId.toString() === userId) {
//                 return next();
//             }

//             const collaborator = whiteboard.collaborators.find(collab => collab.userId.toString() === userId);
//             if (!collaborator) {
//                 return res.status(403).json({ message: "Access denied" });
//             }

//             if (requiredRole === "write" && collaborator.role !== "write") {
//                 return res.status(403).json({ message: "Insufficient permissions" });
//             }

//             next();
//         } catch (error) {
//             res.status(500).json({ message: "Server error" });
//         }
//     };
// };

// module.exports = checkRole;
