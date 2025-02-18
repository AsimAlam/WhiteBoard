import styled from "styled-components";

const BoardDetailsWrapper = styled.div`
    height: 70%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
`;

const BoardName = styled.div`
    color: ${({ theme }) => theme.text};
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem;
    user-select: none;
    padding: 1rem;
`;

const BoardNotes = styled.div`
    width: 90%;
    height: 30%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    color: ${({ theme }) => theme.text};
`;

const BoardDetails = (board) => {
    return (
        <BoardDetailsWrapper>
            <BoardName>{board.name}</BoardName>
            <BoardNotes>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat unde vero in ipsa sed enim animi nesciunt, deleniti soluta commodi laborum cum, nostrum, temporibus incidunt quos nobis. Maiores, perferendis asperiores!
            </BoardNotes>
        </BoardDetailsWrapper>
    );
};

export default BoardDetails;