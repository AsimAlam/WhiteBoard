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

export const _loginWithGoogle = async (boardId, token, userId, canvasJSON) => {
    window.location.href = `${config.BACKEND_URL}${config.GOOGLE_AUTH_URL}`;
};

export const _saveCanvasToDB = async (whiteboardId, canvasJSON, userId, token) => {
    try {
        const response = await fetch(
            `${config.BACKEND_URL}${config.SAVE_DRAWING(whiteboardId)}?token=${token}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: userId
                },
                body: JSON.stringify({ canvas: canvasJSON })
            }
        );

        const result = await response.json();
        console.log("Save response:", result);
        return result;
    } catch (error) {
        console.error("Error saving canvas:", error);
        return { error: "Error saving canvas" };
    }
};

export const _getWhiteboard = async (whiteboardId, userId) => {

    try {
        const response = await fetch(`${config.BACKEND_URL}${config.GET_DRAWING(whiteboardId)}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: userId
            },
        });

        console.log("getting response", response);

        return response;
    } catch (error) {
        return error;
    }


}

