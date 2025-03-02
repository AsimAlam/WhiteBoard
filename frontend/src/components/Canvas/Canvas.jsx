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
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.toolbarHover};
  padding: 10px;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 20px;
`;

const ToolbarItem = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  width: 100%;
  margin: 5px 0;
  padding: 10px 20px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.toolbarHover};
  }
  transition: background 0.2s ease;
`;

const Icon = styled.span`
  margin-right: 10px;
  font-size: 20px;
`;

const ItemLabel = styled.span``;

const ColorSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  width: 100%;
`;

const ColorButton = styled.button`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: ${(props) => (props.selected ? '2px solid black' : '1px solid #ccc')};
  background-color: ${(props) => props.color};
  cursor: pointer;
`;

const Canvas = ({ setTool, currentTool, setPenColor }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleToolbar = () => setCollapsed(!collapsed);

  const handleSelectTool = (tool) => {
    setTool(tool);
  };

  const penColors = ['#000000', '#FF0000', '#00FF00', '#0000FF'];
  const [selectedPenColor, setSelectedPenColor] = useState('#000000');

  const handlePenColorSelect = (color) => {
    setSelectedPenColor(color);
    setPenColor(color);
  };

  return (
    <Toolbar collapsed={collapsed}>
      <ToggleButton onClick={toggleToolbar}>
        {collapsed ? '>>' : '<<'}
      </ToggleButton>
      <ToolbarItem onClick={() => handleSelectTool('select')}>
        <Icon>🖱️</Icon>
        {!collapsed && <ItemLabel>Select</ItemLabel>}
      </ToolbarItem>
      <ToolbarItem onClick={() => handleSelectTool('pen')}>
        <Icon>✏️</Icon>
        {!collapsed && <ItemLabel>Pen</ItemLabel>}
      </ToolbarItem>
      <ToolbarItem onClick={() => handleSelectTool('text')}>
        <Icon>📝</Icon>
        {!collapsed && <ItemLabel>Text</ItemLabel>}
      </ToolbarItem>
      <ToolbarItem onClick={() => handleSelectTool('shape')}>
        <Icon>⬛</Icon>
        {!collapsed && <ItemLabel>Shape</ItemLabel>}
      </ToolbarItem>
      <ToolbarItem onClick={() => handleSelectTool('eraser')}>
        <Icon>🩹</Icon>
        {!collapsed && <ItemLabel>Eraser</ItemLabel>}
      </ToolbarItem>
      {currentTool === 'pen' && !collapsed && (
        <ColorSelector>
          {penColors.map((color) => (
            <ColorButton
              key={color}
              color={color}
              selected={selectedPenColor === color}
              onClick={() => handlePenColorSelect(color)}
            />
          ))}
        </ColorSelector>
      )}
    </Toolbar>
  );
};

export default Canvas;
