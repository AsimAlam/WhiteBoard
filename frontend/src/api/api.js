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

export const _logout = async () => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.LOGOUT}`, {
            method: 'GET',
            credentials: 'include',
        });

        return response;

    } catch (error) {
        return error;
    }
};

export const _saveCanvasToDB = async (whiteboardId, canvasJSON, thumbnail, userId, token) => {
    try {
        const response = await fetch(
            `${config.BACKEND_URL}${config.SAVE_DRAWING(whiteboardId)}?token=${token}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: userId
                },
                body: JSON.stringify({ canvas: canvasJSON, thumbnail: thumbnail })
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

export const _getAllWhiteboard = async (userId) => {
    console.log("getallwhiteboard", userId);
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.GET_ALL_WHITEBOARD}?userId=${userId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        // console.log(result);
        return result;

    } catch (error) {
        return error;
    }
}

export const _deleteWhiteboard = async (whiteboardId, userId) => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.DELETE_BOARD(whiteboardId)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                Authorization: userId
            },
        });
        console.log("delete response", response);
        return response;

    } catch (error) {
        console.log("error", error);
        return error;
    }
}

export const _renameBoard = async (whiteboardId, userId, name) => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.RENAME_BOARD(whiteboardId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                Authorization: userId
            },
            body: JSON.stringify({ name: name })
        });

        console.log("rename api response", response);
        return response;

    } catch (error) {
        return error;
    }
}

export const _addCollaborator = async (whiteboardId, sessionToken, ownerId, role, userId) => {
    try {

        const response = await fetch(`${config.BACKEND_URL}${config.ADD_COLLABORATOR(whiteboardId)}?token=${sessionToken}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                Authorization: ownerId
            },
            body: JSON.stringify({ userId: userId, role: role })
        });

        console.log("response from add collaboarator", response);

        return response;

    } catch (error) {
        return error;
    }
}

export const _changePermission = async (whiteboardId, role, userId) => {
    console.log("in api", whiteboardId, role, userId);
    try {

        const response = await fetch(`${config.BACKEND_URL}${config.CHANGE_PERMISSION(whiteboardId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({ userId: userId, role: role })
        });

        console.log("response from add collaboarator", response);

        return response;

    } catch (error) {
        return error;
    }
}

export const _getUser = async (userId) => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.GET_USER(userId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        });

        return response;

    } catch (error) {
        return error;
    }
}

export const _getNotes = async (whiteboardId) => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.GET_NOTES(whiteboardId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        });

        return response;

    } catch (error) {
        return error;
    }
}

export const _updateNotes = async (whiteboardId, data, userId) => {
    try {
        const response = await fetch(`${config.BACKEND_URL}${config.UPDATE_NOTES(whiteboardId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/json',
                Authorization: userId
            },
            body: JSON.stringify({ content: data })
        });

        console.log("update res", response);

        return response;

    } catch (error) {
        return error;
    }
}

