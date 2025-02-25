import config from "./config";

export const _getDashboard = async () => {
    const response = await fetch(`${config.BACKEND_URL}${config.DASHBOARD_URL}`, {
        method: 'GET',
        credentials: 'include',
    });
    // console.log("response", response);

    return response;
};

export const _createNewBoard = async (userId, boardName) => {
    const response = await fetch(`${config.BACKEND_URL}${config.CREATE_BOARD_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: boardName,
            ownerId: userId,
        }),
    });
    console.log("response", response);

    return response;
}

export const _loginWithGoogle = async () => {
    window.location.href = `${config.BACKEND_URL}${config.GOOGLE_AUTH_URL}`;
};
