import React, { useState, useEffect, useContext } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { jsPDF } from 'jspdf';
import styled, { ThemeContext, ThemeProvider, useTheme } from 'styled-components';

// Make sure this worker file is correctly placed in your public folder.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const ThumbnailWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: ${({ theme }) => theme.canvasBg};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Thumbnail = ({ data }) => {
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        if (data && data.pages && data.pages.length > 0) {
            const imageData = data.pages[0].thumbnail;
            if (imageData && imageData.startsWith('data:image/png')) {
                try {
                    const doc = new jsPDF({
                        orientation: 'landscape',
                        unit: 'px',
                        format: [500, 200] // New dimensions for a square PDF page
                    });
                    doc.addImage(imageData, 'PNG', 0, 0, 500, 200);

                    const generatedPdfDataUrl = doc.output('datauristring');
                    console.log("Generated PDF data URL:", generatedPdfDataUrl);

                    // For debugging: open the generated PDF in a new tab.
                    // window.open(generatedPdfDataUrl);

                    setPdfDataUrl(generatedPdfDataUrl);
                } catch (err) {
                    console.error("Error generating PDF:", err);
                    setError("Error generating PDF: " + err.toString());
                }
            } else {
                setError("Invalid or missing thumbnail image data.");
            }
        } else {
            setError("No page data available.");
        }
    }, [data]);

    if (error) {
        return (
            <ThumbnailWrapper>
                <p>Error: {error}</p>
            </ThumbnailWrapper>
        );
    }

    return (
        <ThumbnailWrapper>
            {pdfDataUrl ? (
                <Document
                    file={pdfDataUrl}
                    onLoadError={(err) => {
                        console.error("Error loading PDF:", err);
                        setError("Error loading PDF: " + err.toString());
                    }}
                >
                    <Page pageNumber={1} width={500} />
                </Document>
            ) : (
                <p>Loading PDF...</p>
            )}
        </ThumbnailWrapper>
    );
};

export default Thumbnail;
