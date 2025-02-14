import config from "./config";

export const _getDashboard = async () => {
    const response = await fetch(`${config.BACKEND_URL}${config.DASHBOARD_URL}`, {
        method: 'GET',
        credentials: 'include',
    });
    console.log("response", response);

    return response;
};

export const _loginWithGoogle = async () => {
    window.location.href = `${config.BACKEND_URL}${config.GOOGLE_AUTH_URL}`;
};
