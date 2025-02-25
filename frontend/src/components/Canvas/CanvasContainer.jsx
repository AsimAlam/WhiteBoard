import React, { useState } from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import Whiteboard from './Whiteboard';

const CanvasWrapper = styled.div`
  flex: 1;
  position: relative;
  height: 90vh;
  background-color: ${({ theme }) => theme.body};
  display: flex;
  flex-direction: row;
`;

const CanvasContainer = () => {
    // Manage the current tool: 'pen', 'eraser', 'shape', or 'text'
    const [tool, setTool] = useState('pen');


    return (
        <CanvasWrapper>
            <Canvas setTool={setTool} />
            <Whiteboard tool={tool} lineWidth={2} />
        </CanvasWrapper>
    );
};

export default CanvasContainer;
