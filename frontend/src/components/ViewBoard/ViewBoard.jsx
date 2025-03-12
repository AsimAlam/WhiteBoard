import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import BoardDetails from "./BoardDetails";
import BoardOperations from "./BoardOperations";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { _getDashboard } from "../../api/api";
import { useUser } from "../../ContextProvider/UserProvider";
import toast from "react-hot-toast";

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
    const navigate = useNavigate();

    const boardData = Location?.state?.boardData;

    useEffect(() => {
        console.log("inside", boardData);
        if (!boardData) {
            toast.error("No board data found. Redirecting to dashboard.");
            navigate("/dashboard");
        }
    }, [boardData, navigate]);

    useEffect(() => {
        if (!boardData) {
            navigate("/dashboard");
        }
    }, []);

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
                <BoardDetails boardData={data.current} />
                <BoardOperations boardData={data.current} />
            </DetailWrapper>
        </ViewBoardWrapper>
    );
};

export default ViewBoard;
