const { pathname } = window.location;

const currentURL = window.location.href;
const redirectParam = (currentURL.includes("/login") || pathname === '/') ? "http://https://whiteboard-frontend-zb1b.onrender.com/dashboard" : currentURL;
console.log("currentURL", encodeURIComponent(redirectParam), redirectParam);

const config = {

    BACKEND_URL: "https://whiteboard-backend-sfp3.onrender.com",
    GOOGLE_AUTH_URL: `/auth/google?redirect=${encodeURIComponent(redirectParam)}`,
    DASHBOARD_URL: "/auth/dashboard",
    LOGOUT: "/auth/logout",
    CREATE_BOARD_URL: "/whiteboard/create",
    SAVE_DRAWING: (whiteboardId) => `/whiteboard/${whiteboardId}/save-drawing`,
    GET_DRAWING: (whiteboardId) => `/whiteboard/${whiteboardId}`,
    GET_ALL_WHITEBOARD: "/whiteboard/get-all-whiteboard",
    DELETE_BOARD: (whiteboardId) => `/whiteboard/${whiteboardId}`,
    RENAME_BOARD: (whiteboardId) => `/whiteboard/${whiteboardId}`,
    ADD_COLLABORATOR: (whiteboardId) => `/whiteboard/${whiteboardId}/add-collaborator`,
    CHANGE_PERMISSION: (whiteboardId) => `/whiteboard/${whiteboardId}/change-permission`,
    GET_USER: (userId) => `/whiteboard/${userId}/get-user`,
    GET_NOTES: (whiteboardId) => `/whiteboard/${whiteboardId}/get-notes`,
    UPDATE_NOTES: (whiteboardId) => `/whiteboard/${whiteboardId}/update-notes`,
};

export default config;