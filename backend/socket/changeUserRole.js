// Assume you have a function that changes the role in your database
async function changeUserRole(userId, newRole) {
    // Update role in the database...

    // Emit an event to the specific user or all sessions of that user
    io.to(userId).emit("roleChanged", { role: newRole });
}
