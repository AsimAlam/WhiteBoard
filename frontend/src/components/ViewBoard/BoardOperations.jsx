import styled from "styled-components";
import ExportButton from "../Buttons/ExportButton";
import { FaFileDownload } from "react-icons/fa";
import { RiDownloadCloudLine } from "react-icons/ri";

const BoardOperationsWrapper = styled.div`
    height: 30%;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const BoardOperations = ({ boardId }) => {
    return (
        <BoardOperationsWrapper>
            <ExportButton data="Copy to Canvas" />
            <ExportButton data="Download Pdf" icon={<FaFileDownload />} />
            <ExportButton data="Download Image" icon={<RiDownloadCloudLine />} />
        </BoardOperationsWrapper>
    );
};

export default BoardOperations;