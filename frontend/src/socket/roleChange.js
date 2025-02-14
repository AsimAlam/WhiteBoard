import io from "socket.io-client";
const socket = io("http://yourserver.com");

// Listen for role change events
socket.on("roleChanged", ({ role }) => {
    // Update the UI based on the new role
    if (role === "read") {
        // Disable editing tools
        disableEditingTools();
    } else if (role === "write") {
        // Enable editing tools
        enableEditingTools();
    }
});

const disableEditingTools = () => {
    // Example: Hide the drawing toolbar
    document.getElementById("drawing-toolbar").style.display = "none";
};

const enableEditingTools = () => {
    // Show the drawing toolbar
    document.getElementById("drawing-toolbar").style.display = "block";
};
