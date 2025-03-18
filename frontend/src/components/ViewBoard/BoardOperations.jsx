import styled from "styled-components";
import ExportButton from "../Buttons/ExportButton";
import { FaFileDownload } from "react-icons/fa";
import { RiDownloadCloudLine } from "react-icons/ri";
import { TiArrowRepeat } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";


const BoardOperationsWrapper = styled.div`
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    // flex-wrap: wrap;
    // background-color: red;

`;

const BoardOperations = ({ boardData }) => {

    // console.log("boarData", boardData);

    const navigate = useNavigate();

    const handleRedirect = () => {
        const boardUrl = `/whiteboard/${boardData._id}?token=${boardData.sessionToken}`;
        navigate(boardUrl);
    }

    const downloadPdf = () => {
        const page = boardData.pages && boardData.pages[0];
        if (!page || !page.thumbnail) {
            toast.error("No thumbnail available");
            // console.error("No thumbnail available");
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
            toast.success("Pdf Downloaded Successfully");
        };
        img.onerror = () => {
            toast.error("Failed to Download Pdf");
            // console.error("Failed to load image");
        };
    };

    const downloadImage = () => {
        const page = boardData.pages && boardData.pages[0];
        if (!page || !page.thumbnail) {
            toast.error("No thumbnail available");
            // console.error("No thumbnail available");
            return;
        }
        const link = document.createElement('a');
        link.href = page.thumbnail;
        link.download = 'whiteboard.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Image Downloaded Successfully");
    };

    return (
        <BoardOperationsWrapper>
            <ExportButton title="Copy to Canvas" icon={<TiArrowRepeat />} onClick={handleRedirect} />
            <ExportButton title="Download Pdf" icon={<FaFileDownload />} onClick={downloadPdf} />
            <ExportButton title="Download Image" icon={<RiDownloadCloudLine />} onClick={downloadImage} />
        </BoardOperationsWrapper>
    );
};

export default BoardOperations;