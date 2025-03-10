import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CollabProfile from './CollabProfile';

const Toolbar = styled.div`
  height: 87vh;
  width: ${(props) => (props.collapsed ? '60px' : '200px')};
  background: ${({ theme }) => theme.toolbar};
  color: ${({ theme }) => theme.text};
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.toolbarHover};
  padding: 10px;
  position: relative;
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

const DrawerWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.expanded ? '500px' : '50px'};
  overflow: hidden;
  transition: height 1s ease;
  z-index: 20;
`;

const ToggleCollaboratorsButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  background: ${({ theme }) => theme.toolbarHover};
  color: ${({ theme }) => theme.text};
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 21;
  transition: background 0.3s ease;
  display: flex;
  justify-content:center;
  align-Item: center;
  self-align: center;
`;

const CollaboratorsContainer = styled.div`
  position: absolute;
  bottom: 50px; /* positioned above the toggle button */
  left: 0;
  width: 100%;
  top: 0;
  overflow-y: auto;
  background: ${({ theme }) => theme.toolbarHover};
  transition: transform 1s ease, opacity 1s ease;
  transform: ${props => props.expanded ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${props => props.expanded ? '1' : '0'};
  z-index: 20;
`;

const Canvas = ({ setTool, currentTool, setPenColor, role, boardId, collaborators = [], handleChangePermission }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [collabExpanded, setCollabExpanded] = useState(false);
  const penColors = ['#000000', '#FF0000', '#00FF00', '#0000FF'];
  const [selectedPenColor, setSelectedPenColor] = useState('#000000');
  const [currRole, setCurrRole] = useState(role);

  useEffect(() => {
    console.log("role props", role);
    setCurrRole(role);
    setTool('select');
  }, [role]);

  const toggleToolbar = () => {
    setCollapsed(!collapsed);
    if (!collapsed) setCollabExpanded(false);
  };

  const handleSelectTool = (tool) => {
    setTool(tool);
  };

  const handlePenColorSelect = (color) => {
    setSelectedPenColor(color);
    setPenColor(color);
  };

  return (
    <Toolbar collapsed={collapsed}>
      {currRole === "read" ? (
        "You are in read only mode. Contact the board owner for editing permission."
      ) : (
        <>
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

          {boardId && (
            <DrawerWrapper expanded={collabExpanded}>
              <ToggleCollaboratorsButton
                onClick={() => {
                  setCollapsed(false);
                  setCollabExpanded(!collabExpanded);
                }}>
                {collabExpanded ? 'Hide Collaborators' : 'Show Collaborators'}
              </ToggleCollaboratorsButton>
              <CollaboratorsContainer expanded={collabExpanded}>
                {collaborators.map((collab) => (
                  <CollabProfile
                    key={collab.id}
                    collab={collab}
                    handleChangePermission={handleChangePermission}
                  />
                ))}
              </CollaboratorsContainer>
            </DrawerWrapper>
          )}
        </>
      )}
    </Toolbar>
  );
};

export default Canvas;
