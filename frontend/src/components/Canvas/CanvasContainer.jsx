import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import Whiteboard from './Whiteboard';
import { _changePermission } from '../../api/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

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
  const [role, setRole] = useState('read');
  const [boardId, setBoardId] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const socketRef = useRef(null);
  const [currUser, setCurrUser] = useState('');

  const handleChangePermission = async (id, newPermission) => {
    setCurrUser(id);
    socketRef.current = io("https://whiteboard-backend-sfp3.onrender.com");
    socketRef.current.emit("permission-change", { boardId: boardId, Permission: newPermission, userId: id });
    const response = await _changePermission(boardId, newPermission, id);
    newPermission === "write" ? toast.success("Permission Granted.") : toast.success("Permission Revoked");
    return response;
  }


  return (
    <CanvasWrapper>
      <Canvas
        setTool={setTool}
        setPenColor={setPenColor}
        currentTool={tool}
        role={role}
        boardId={boardId}
        collaborators={collaborators}
        handleChangePermission={handleChangePermission}
      />
      <Whiteboard tool={tool} penColor={penColor} lineWidth={2} Userrole={role} setRole={setRole} setBoardId={setBoardId} setCollaborators={setCollaborators} />
    </CanvasWrapper>
  );
};

export default CanvasContainer;
