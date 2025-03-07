import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import BoardDetails from "./BoardDetails";
import BoardOperations from "./BoardOperations";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const ViewBoardWrapper = styled.div`
    height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color:  ${({ theme }) => theme.body};
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
    border-left: 1px solid ${({ theme }) => theme.lineBorder};
`;


const ViewBoard = () => {

    const Location = useLocation();
    const { boardData } = Location.state;

    const data = useRef(boardData);

    useEffect(() => {
        console.log(boardData, data.current);
    }, [boardData]);


    return (
        <ViewBoardWrapper>
            <ThumbnailContainer>
                <Thumbnail data={data.current} />
            </ThumbnailContainer>
            <DetailWrapper>
                <BoardDetails name="TimeStamp/Name" notes="lorem imsum" />
                <BoardOperations boardData={data.current} />
            </DetailWrapper>
        </ViewBoardWrapper>
    );
};

export default ViewBoard;
