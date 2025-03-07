import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import * as fabric from 'fabric';

const Thumbnail = ({ data }) => {
    const { id } = useParams();
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const didGenerate = useRef(false);

    const fetchAndGeneratePdf = () => {
        if (didGenerate.current) return; // Prevent multiple runs
        didGenerate.current = true;

        if (!data || !data.pages || data.pages.length === 0) {
            console.error('No page data available');
            setLoading(false);
            return;
        }
        const canvasData = data.pages[0].canvasData;
        if (!canvasData) {
            console.error('No canvas data available');
            setLoading(false);
            return;
        }

        // Create an offscreen canvas element with desired dimensions.
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 800;
        offCanvas.height = 600;

        // Create a StaticCanvas instance.
        // Use the saved background if provided (or fallback to white).
        const fabricCanvas = new fabric.StaticCanvas(offCanvas, {
            backgroundColor: canvasData.background || '#fff'
        });

        console.log("Loading canvas data using loadFromJSON...");
        // Use loadFromJSON to load and render the canvas from saved JSON.
        fabricCanvas.loadFromJSON(canvasData, () => {
            console.log("loadFromJSON callback triggered.");
            fabricCanvas.renderAll();
            console.log("Rendered canvas objects:", fabricCanvas.getObjects());

            // Wait to ensure everything (especially asynchronous elements) is rendered.
            setTimeout(() => {
                const dataURL = offCanvas.toDataURL({ format: 'png' });
                console.log('Generated dataURL:', dataURL);

                // Create a PDF (landscape mode) and add the image.
                const pdf = new jsPDF({ orientation: 'landscape' });
                pdf.addImage(
                    dataURL,
                    'PNG',
                    0,
                    0,
                    pdf.internal.pageSize.getWidth(),
                    pdf.internal.pageSize.getHeight()
                );
                const pdfDataUrl = pdf.output('datauristring');
                console.log('Generated PDF Data URL:', pdfDataUrl);

                setPdfUrl(pdfDataUrl);
                setLoading(false);
            }, 1000); // Adjust delay if necessary (increase if your canvas contains async objects)
        });
    };

    useEffect(() => {
        if (data && !pdfUrl) {
            fetchAndGeneratePdf();
        }
    }, [data, pdfUrl]);

    if (loading) return <div>Loading PDF...</div>;

    return (
        <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title="Whiteboard PDF"
            style={{ border: 'none' }}
        />
    );
};

export default Thumbnail;
