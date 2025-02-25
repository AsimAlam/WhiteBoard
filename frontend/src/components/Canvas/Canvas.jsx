import React, { useState } from 'react';
import styled from 'styled-components';

const Toolbar = styled.div`
  height: 90vh;
  width: ${(props) => (props.collapsed ? '60px' : '200px')};
  background: ${({ theme }) => theme.toolbar};
  color: ${({ theme }) => theme.text};
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.collapsed ? 'center' : 'center')};
  border-top: 1px solid ${({ theme }) => theme.highlight};
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 20px;
  align-self: ${(props) => (props.collapsed ? 'center' : 'flex-end')};
`;

const ToolbarItem = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  width: 100%;
  margin: 5px 0;
  padding: ${(props) => (props.collapsed ? '10px 0' : '10px 20px')};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.toolbarHover}
  }
  transition: background 0.2s ease;
`;

const Icon = styled.span`
  margin-right: ${(props) => (props.collapsed ? '0' : '10px')};
  font-size: 20px;
`;

const ItemLabel = styled.span`
  display: ${(props) => (props.collapsed ? 'none' : 'inline')};
`;

const DrawingArea = styled.div`
  flex: 1;
  position: relative;
  background-color: #fff;
  margin: 10px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const Canvas = (props) => {
    const [toolbarCollapsed, setToolbarCollapsed] = useState(false);

    const toggleToolbar = () => {
        setToolbarCollapsed(!toolbarCollapsed);
    };

    const handleSelectTool = (tool) => {
        props.setTool(tool);
    };

    return (
        <Toolbar collapsed={toolbarCollapsed}>
            <ToggleButton onClick={toggleToolbar} collapsed={toolbarCollapsed}>
                {toolbarCollapsed ? '>>' : '<<'}
            </ToggleButton>
            <ToolbarItem collapsed={toolbarCollapsed} onClick={() => handleSelectTool('select')}>
                <Icon collapsed={toolbarCollapsed}>✏️</Icon>
                <ItemLabel collapsed={toolbarCollapsed}>Select</ItemLabel>
            </ToolbarItem>
            <ToolbarItem collapsed={toolbarCollapsed} onClick={() => handleSelectTool('pen')}>
                <Icon collapsed={toolbarCollapsed}>✏️</Icon>
                <ItemLabel collapsed={toolbarCollapsed}>Pen</ItemLabel>
            </ToolbarItem>
            <ToolbarItem collapsed={toolbarCollapsed} onClick={() => handleSelectTool('text')}>
                <Icon collapsed={toolbarCollapsed}>📝</Icon>
                <ItemLabel collapsed={toolbarCollapsed}>Text</ItemLabel>
            </ToolbarItem>
            <ToolbarItem collapsed={toolbarCollapsed} onClick={() => handleSelectTool('shape')}>
                <Icon collapsed={toolbarCollapsed}>⬛</Icon>
                <ItemLabel collapsed={toolbarCollapsed}>Shape</ItemLabel>
            </ToolbarItem>
            <ToolbarItem collapsed={toolbarCollapsed} onClick={() => handleSelectTool('eraser')}>
                <Icon collapsed={toolbarCollapsed}>🩹</Icon>
                <ItemLabel collapsed={toolbarCollapsed}>Eraser</ItemLabel>
            </ToolbarItem>
        </Toolbar>
    );
};

export default Canvas;
