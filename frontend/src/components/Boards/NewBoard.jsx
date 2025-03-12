import styled from "styled-components";
import React, { useEffect } from "react";
import { ReactComponent as AddIcon } from "../../assets/addIcon.svg";
import { useUser } from "../../ContextProvider/UserProvider";
import { useNavigate } from "react-router-dom";
import { _createNewBoard } from "../../api/api";
import toast from "react-hot-toast";

const AddBoardsWrapper = styled.div`
    width: 14rem;
    max-height: 200px;
    margin: 1rem;
    border-radius: 10px;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    transition: transform 0.2s ease-in-out;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.cardBg};
`;

const AddBox = styled.div`
    width: 90%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.cardPreview};
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: scale(1.05);
    }
    &:active {
        transform: scale(0.98);
    };
    cursor: pointer;
`;

const IconWrapper = styled(AddIcon)`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AddText = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 1.2rem;
    font-weight: bold;
    // margin-top: 1rem;
    user-select: none;
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;


const NewBoard = () => {

    const { user } = useUser();
    const navigate = useNavigate();

    const handleNewCanvas = async () => {

        try {
            const response = await _createNewBoard(user._id, "New Board");
            const data = await response.json();
            console.log("data", data);
            const { _id, sessionToken } = data;
            // Construct the unique URL for the new whiteboard
            const boardUrl = `/whiteboard/${_id}?token=${sessionToken}`;
            // Navigate to the new whiteboard page
            toast.success("Welcome to Your New Board");
            navigate(boardUrl);
        } catch (error) {
            toast.error("Unable to create New Board.")
            console.error("Error creating new board:", error);
        }
    }

    return (
        <AddBoardsWrapper>
            <AddBox onClick={handleNewCanvas}>
                <IconWrapper />
            </AddBox>
            <AddText>Create new board</AddText>
        </AddBoardsWrapper>
    );
};

export default NewBoard;
