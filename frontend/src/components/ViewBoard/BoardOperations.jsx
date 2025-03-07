import styled from "styled-components";
import ExportButton from "../Buttons/ExportButton";
import { FaFileDownload } from "react-icons/fa";
import { RiDownloadCloudLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const BoardOperationsWrapper = styled.div`
    height: 30%;
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.lineBorder};
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const BoardOperations = ({ boardData }) => {

    console.log("boarData", boardData);

    const navigate = useNavigate();

    const handleRedirect = () => {
        const boardUrl = `/whiteboard/${boardData._id}?token=${boardData.sessionToken}`;
        navigate(boardUrl);
    }

    return (
        <BoardOperationsWrapper>
            <ExportButton data="Copy to Canvas" onClick={handleRedirect} />
            <ExportButton data="Download Pdf" icon={<FaFileDownload />} />
            <ExportButton data="Download Image" icon={<RiDownloadCloudLine />} />
        </BoardOperationsWrapper>
    );
};

export default BoardOperations;