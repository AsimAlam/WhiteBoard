
const currentURL = window.location.href;
const redirectParam = currentURL.includes("/login") ? "http://localhost:3000/dashboard" : currentURL;
console.log("currentURL", encodeURIComponent(redirectParam), redirectParam);

const config = {

    BACKEND_URL: "http://localhost:5000",
    GOOGLE_AUTH_URL: `/auth/google?redirect=${encodeURIComponent(redirectParam)}`,
    DASHBOARD_URL: "/auth/dashboard",
    CREATE_BOARD_URL: "/whiteboard/create",
};

export default config;