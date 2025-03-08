import styled from "styled-components";
import ExportButton from "../Buttons/ExportButton";
import { FaFileDownload } from "react-icons/fa";
import { RiDownloadCloudLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";


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

    const downloadPdf = () => {
        const page = boardData.pages && boardData.pages[0];
        if (!page || !page.thumbnail) {
            console.error("No thumbnail available");
            return;
        }
        const imageData = page.thumbnail;

        const img = new Image();
        img.src = imageData;
        img.onload = () => {
            const originalWidth = img.width;
            const originalHeight = img.height;

            const doc = new jsPDF({
                orientation: originalWidth > originalHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [originalWidth, originalHeight]
            });
            doc.addImage(imageData, 'PNG', 0, 0, originalWidth, originalHeight);
            doc.save('whiteboard.pdf');
        };
        img.onerror = () => {
            console.error("Failed to load image");
        };
    };

    const downloadImage = () => {
        const page = boardData.pages && boardData.pages[0];
        if (!page || !page.thumbnail) {
            console.error("No thumbnail available");
            return;
        }
        const link = document.createElement('a');
        link.href = page.thumbnail;
        link.download = 'whiteboard.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <BoardOperationsWrapper>
            <ExportButton data="Copy to Canvas" onClick={handleRedirect} />
            <ExportButton data="Download Pdf" icon={<FaFileDownload />} onClick={downloadPdf} />
            <ExportButton data="Download Image" icon={<RiDownloadCloudLine />} onClick={downloadImage} />
        </BoardOperationsWrapper>
    );
};

export default BoardOperations;