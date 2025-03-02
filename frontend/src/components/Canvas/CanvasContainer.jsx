import React, { useState } from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import Whiteboard from './Whiteboard';

const lightTheme = {
    body: '#ffffff',
    canvasBg: '#ffffff',
    toolbar: '#f0f0f0',
    toolbarHover: '#e0e0e0',
    text: '#000000'
};

const darkTheme = {
    body: '#222222',
    canvasBg: '#333333',
    toolbar: '#555555',
    toolbarHover: '#666666',
    text: '#ffffff'
};

const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  position: relative;
  height: 90vh;
  background-color: ${({ theme }) => theme.body};
  display: flex;
  flex-direction: row;
`;

const ToggleThemeButton = styled.button`
  margin: 10px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const CanvasContainer = () => {
    // Manage the current tool: 'pen', 'eraser', 'shape', or 'text'
    const [tool, setTool] = useState('pen');
    // Manage the pen color; default is black.
    const [penColor, setPenColor] = useState('#000000');


    return (
        <CanvasWrapper>
            <Canvas
                setTool={setTool}
                setPenColor={setPenColor}
                currentTool={tool}
            />
            <Whiteboard tool={tool} penColor={penColor} lineWidth={2} />
        </CanvasWrapper>
    );
};

export default CanvasContainer;
