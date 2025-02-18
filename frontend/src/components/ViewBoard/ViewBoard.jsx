import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import BoardDetails from "./BoardDetails";
import BoardOperations from "./BoardOperations";

const ViewBoardWrapper = styled.div`
    height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color:  ${({theme}) => theme.body};
`;

const ThumbnailContainer = styled.div`
    height: 100%;
    width: 70%;
    display: flex;
    flex-direction: column;
`;

const DetailWrapper = styled.div`
    height: 100%;
    width: 30%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
`;


const ViewBoard = () => {
    return(
        <ViewBoardWrapper>
            <ThumbnailContainer>
                <Thumbnail />
            </ThumbnailContainer>
            <DetailWrapper>
                <BoardDetails name = "TimeStamp/Name" notes = "lorem imsum"/>
                <BoardOperations/>
            </DetailWrapper>
        </ViewBoardWrapper>
    );
};

export default ViewBoard;
