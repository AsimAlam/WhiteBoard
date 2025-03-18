import styled from "styled-components";
import { useUser } from "../../ContextProvider/UserProvider";
import { useEffect, useState } from "react";
import { _getNotes, _updateNotes } from "../../api/api";
import toast from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import BoardOperations from "./BoardOperations";

const BoardDetailsWrapper = styled.div`
    height: 90%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BoardTitle = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    // background-color: yellow;
    // padding: 0rem 0rem 0rem 1.5rem;
`;

const BoardName = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 1.8rem;
    font-weight: bold;
    margin: 1rem;
    user-select: none;
    padding: 1rem;
    width: 40%;
    display: flex;
    justify-content: flex-start;
    // background-color: blue;
`;

const BoardNotes = styled.div`
    width: 90%;
    height: 65%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background: ${({ theme }) => theme.notesBg};
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    padding: 1.5rem 0 1.5rem 1.5rem;
`;

const NotesHeading = styled.span`
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
`;

const BoardSpan = styled.span`
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
`;

const BoardParagraph = styled.p`
    color: ${({ theme }) => theme.sortByColor};
    font-size: 1rem;
    line-height: 1.6;
    text-align: justify;
    margin: 0;
    overflow-y: auto;
    padding: 0 0.5rem 0.5rem 0.5rem;
`;

const BoardTextarea = styled.textarea`
    max-width: 90%;
    width: 90%;
    height: 60%;
    font-size: 1rem;
    padding: 0 0.5rem 0.5rem 0.5rem;
    margin-bottom: 1rem;
    margin-right: 2rem;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 8px;
    background: ${({ theme }) => theme.notesBg};
    color: ${({ theme }) => theme.text};
    transition: border-color 0.3s ease;
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.accent};
    }
`;

const EditButton = styled.button`
    background: ${({ theme }) => theme.primary};
    color: #fff;
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    transition: background 0.3s ease, transform 0.2s ease;
    &:hover {
        background: ${({ theme }) => theme.accent};
        transform: scale(1.03);
    }
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`;

const SaveButton = styled(EditButton)`
    display: flex;
    background: ${({ theme }) => theme.saveButtonBg};
    &:hover {
        background: ${({ theme }) => theme.successHover};
    }
`;

const CancleButton = styled(EditButton)`
    display: flex;
    background: ${({ theme }) => theme.cancleButtonBg};
    &:hover {
        background: ${({ theme }) => theme.cancleHover};
    }
`;


const BoardDetails = ({ boardData }) => {
    const { user } = useUser();
    const [paragraph, setParagraph] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState("");

    const handleGetNotes = async () => {
        const response = await _getNotes(boardData?._id);

        if (response.status !== 200) {
            toast.error("Problem in fetching notes. Please refresh the page!");
            return;
        }
        if (response.status === 200) {
            const result = await response.json();
            const content = result[0]?.content || "";
            setParagraph(content);
            setTempContent(content);
        }
    };

    const handleNotesUpdate = async (data) => {
        const response = await _updateNotes(boardData?._id, data, user?._id);
        if (response.status === 200) {
            toast.success("Notes updated successfully!");
            setParagraph(data);
        } else {
            toast.error("Failed to update notes. Please try again.");
        }
        const result = await response.json();
        // console.log("handle notes update", result);
        setIsEditing(false);
    };

    useEffect(() => {
        // console.log("ids", boardData?.ownerId, user?._id)
        handleGetNotes();
    }, []);

    return (
        <BoardDetailsWrapper>
            <BoardTitle>
                <BoardName>{boardData?.name}</BoardName>
                <BoardOperations boardData={boardData} />
            </BoardTitle>
            <BoardNotes>
                <NotesHeading>
                    <BoardSpan>Notes:</BoardSpan>
                    {boardData?.ownerId === user?._id && (
                        <GrEdit style={{ cursor: "pointer" }} onClick={() => setIsEditing(true)} />
                    )}

                </NotesHeading>
                {isEditing ? (
                    <>
                        <BoardTextarea
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                        />
                        <Buttons>

                            <SaveButton onClick={() => handleNotesUpdate(tempContent)}>
                                Save
                            </SaveButton>
                            <CancleButton onClick={() => setIsEditing(false)}>
                                Cancle
                            </CancleButton>
                        </Buttons>
                    </>
                ) : (
                    <>
                        <BoardParagraph>
                            {paragraph}
                        </BoardParagraph>
                    </>
                )}
            </BoardNotes>
        </BoardDetailsWrapper>
    );
};

export default BoardDetails;
