import React, { useEffect, useRef, useState } from 'react';
import { Canvas, PencilBrush, IText, Rect } from 'fabric';
import io from "socket.io-client";
import styled, { useTheme } from 'styled-components';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../ContextProvider/UserProvider";
import { _addCollaborator, _getDashboard, _getWhiteboard, _saveCanvasToDB } from '../../api/api';
import { toast } from "react-hot-toast";
import { IoIosRedo, IoIosSave, IoIosUndo } from "react-icons/io";
import { HiLink } from "react-icons/hi";

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  margin: 1rem;
  background: ${({ theme }) => theme.canvasBg};
  border-radius: 10px;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const SaveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 5px 10px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const UndoButton = styled.button`
  position: absolute;
  top: 90px;
  right: 10px;
  z-index: 10;
  padding: 5px 10px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const RedoButton = styled.button`
  position: absolute;
  top: 130px;
  right: 10px;
  z-index: 10;
  padding: 5px 10px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 50px;
  right: 10px;
  z-index: 10;
  padding: 5px 10px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const UPDATE_THROTTLE_MS = 100; // You can adjust this if needed

const Whiteboard = ({ tool, penColor, lineWidth = 2, Userrole, setRole, setBoardId, setCollaborators }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const socketRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isUndoRedo = useRef(false);
  const lastRemoteUpdateRef = useRef(0);
  const pendingRemoteUpdateRef = useRef(null);

  const theme = useTheme();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [canvasData, setCanvasData] = useState(null);

  const query = new URLSearchParams(location.search);
  const sessionToken = query.get("token");

  // Helper to update the canvas background to the current theme.
  const updateCanvasBackground = (canvas) => {
    canvas.backgroundColor = theme.canvasBg;
    canvas.renderAll();
  };

  // Helper to get only the canvas objects (excluding background info).
  const getCanvasStateWithoutBg = (canvas) => {
    return { objects: canvas.getObjects().map(obj => obj.toObject()) };
  };

  // When emitting changes, include the current user's id.
  const emitCanvasUpdate = (canvas) => {
    const state = getCanvasStateWithoutBg(canvas);
    if (socketRef.current && user && user._id) {
      socketRef.current.emit("canvas-update", { boardId: id, canvas: state, userId: user._id });
    }
  };

  // Remote update (throttled)
  const updateRemoteCanvas = (remoteState) => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.loadFromJSON(remoteState, () => {
        updateCanvasBackground(canvas);
        canvas.requestRenderAll();
      });
    }
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("URL copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  // Fetch user details if missing.
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      (async () => {
        const response = await _getDashboard();
        // console.log("getdashboard", response);
        const data = await response?.json();
        // console.log("whiteboard", data);
        if (data.message === 'Unauthorized') {
          toast.error("Please Login First");
          navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`);
        } else {
          // console.log("Data", data?.data);
          setUser(data?.data);
        }
      })();
    }
  }, [navigate]);

  // Fetch saved whiteboard data.
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) return;
    const fetchWhiteboard = async () => {
      try {
        const response = await _getWhiteboard(id, user._id)
        // console.log("getWhiteboard", response, id, user._id);
        if (response.status === 401 || response.status === 403 || response.status === 400) {
          toast.error("Please Login First");
          localStorage.removeItem('user');
          navigate("/login");
          return;
        }
        const data = await response.json();
        if (data.pages && data.pages.length > 0) {
          // console.log("canvas data", data.pages[0].canvasData);
          setCanvasData(data.pages[0].canvasData);
        }

        if (data.ownerId !== user._id) {
          const collaborators = data.collaborators.find(collab => collab.userId === user._id);
          // console.log("collaborator", collaborators, data, user);
          if (!collaborators) {
            await _addCollaborator(data._id, data.sessionToken, data.ownerId, 'read', user._id);
          } else {
            // console.log("role", collaborators.role);
            setRole(collaborators.role);
          }
        } else {
          // console.log("inside owner", data, user);
          setBoardId(data._id);
          setCollaborators(data.collaborators);
          setRole('write');
        }

      } catch (error) {
        toast.error("Unable to Fetch Whiteboard. Please try again.")
        // console.error("Error fetching whiteboard:", error);
      }
    };
    fetchWhiteboard();
  }, [id, sessionToken, user]);

  // Initialize Fabric canvas.
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    const fabricCanvas = new Canvas(canvasEl, {
      backgroundColor: theme.canvasBg,
    });
    fabricCanvasRef.current = fabricCanvas;

    if (canvasData) {
      // Load saved state (assumed stored without background).
      fabricCanvas.loadFromJSON(canvasData, () => {
        updateCanvasBackground(fabricCanvas);
        fabricCanvas.renderAll();
      });
    }

    // Save the initial state (only objects).
    undoStack.current.push(getCanvasStateWithoutBg(fabricCanvas));

    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [canvasData]);

  // Set up Socket.io for collaboration.
  useEffect(() => {
    socketRef.current = io("https://whiteboard-backend-sfp3.onrender.com");
    socketRef.current.emit("join-board", id);

    socketRef.current.on("permission-change", (data) => {
      if (data.boardId !== id) return;
      if (user && data.userId !== user._id) return;

      toast.success("Permission Updated");

      setRole(data.Permission);

    })

    socketRef.current.on("canvas-update", (data) => {
      // Only process if the board id matches.
      if (data.boardId !== id) return;
      // Ignore updates that originated from this user.
      if (user && data.userId === user._id) return;

      const now = Date.now();
      const elapsed = now - lastRemoteUpdateRef.current;
      if (elapsed < UPDATE_THROTTLE_MS) {
        if (pendingRemoteUpdateRef.current) {
          clearTimeout(pendingRemoteUpdateRef.current);
        }
        pendingRemoteUpdateRef.current = setTimeout(() => {
          lastRemoteUpdateRef.current = Date.now();
          updateRemoteCanvas(data.canvas);
          pendingRemoteUpdateRef.current = null;
        }, UPDATE_THROTTLE_MS - elapsed);
      } else {
        lastRemoteUpdateRef.current = now;
        updateRemoteCanvas(data.canvas);
      }
    });

    return () => {
      if (pendingRemoteUpdateRef.current) {
        clearTimeout(pendingRemoteUpdateRef.current);
      }
      socketRef.current.disconnect();
    };
  }, [id, theme, user]);

  // Listen to changes on the canvas and emit updates.
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    const handleUpdate = () => {
      emitCanvasUpdate(fabricCanvas);
    };

    fabricCanvas.on("object:modified", handleUpdate);
    fabricCanvas.on("object:added", handleUpdate);
    fabricCanvas.on("object:removed", handleUpdate);

    return () => {
      fabricCanvas.off("object:modified", handleUpdate);
      fabricCanvas.off("object:added", handleUpdate);
      fabricCanvas.off("object:removed", handleUpdate);
    };
  }, [id]);

  // When the theme changes, update only the background.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    updateCanvasBackground(canvas);
  }, [theme]);

  // Save state for undo/redo.
  const saveState = (canvas) => {
    if (isUndoRedo.current) return;
    const state = getCanvasStateWithoutBg(canvas);
    undoStack.current.push(state);
    redoStack.current = [];
  };

  // Set up tool-specific behavior.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Clear previous handlers.
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.getObjects().forEach((obj) => (obj.selectable = true));

    if (tool === 'pen') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.getObjects().forEach((obj) => (obj.selectable = false));
      if (!canvas.freeDrawingBrush || canvas.freeDrawingBrush.type === 'eraser') {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.type = 'pen';
      }
      canvas.freeDrawingBrush.width = lineWidth;
      canvas.freeDrawingBrush.color = penColor;

      canvas.on('path:created', () => {
        saveState(canvas);
        emitCanvasUpdate(canvas);
      });
    } else if (tool === 'eraser') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.getObjects().forEach((obj) => (obj.selectable = false));
      canvas.on('mouse:down', (opt) => {
        const target = canvas.findTarget(opt.e);
        if (target) {
          canvas.remove(target);
          canvas.renderAll();
          saveState(canvas);
          emitCanvasUpdate(canvas);
        }
      });
    } else if (tool === 'text') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.getObjects().forEach((obj) => (obj.selectable = true));
      canvas.on('mouse:down', (opt) => {
        if (canvas.findTarget(opt.e)) return;
        const pointer = canvas.getPointer(opt.e);
        const text = new IText('Type here', {
          left: pointer.x,
          top: pointer.y,
          fill: penColor,
          fontSize: lineWidth * 10,
        });
        canvas.add(text);
        saveState(canvas);
        emitCanvasUpdate(canvas);
      });
    } else if (tool === 'shape') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.getObjects().forEach((obj) => (obj.selectable = false));
      let rect, isDown = false, origX, origY;
      canvas.on('mouse:down', (opt) => {
        isDown = true;
        const pointer = canvas.getPointer(opt.e);
        origX = pointer.x;
        origY = pointer.y;
        rect = new Rect({
          left: origX,
          top: origY,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: penColor,
          strokeWidth: lineWidth,
        });
        canvas.add(rect);
      });
      canvas.on('mouse:move', (opt) => {
        if (!isDown) return;
        const pointer = canvas.getPointer(opt.e);
        if (origX > pointer.x) rect.set({ left: pointer.x });
        if (origY > pointer.y) rect.set({ top: pointer.y });
        rect.set({
          width: Math.abs(origX - pointer.x),
          height: Math.abs(origY - pointer.y)
        });
        canvas.renderAll();
      });
      canvas.on('mouse:up', () => {
        isDown = false;
        saveState(canvas);
        emitCanvasUpdate(canvas);
      });
    } else if (tool === 'select' && Userrole === "write") {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.getObjects().forEach((obj) => (obj.selectable = true));
    }
  }, [tool, lineWidth, penColor]);

  // Undo: load previous state and reapply current background.
  const undo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStack.current.length <= 1) return;
    isUndoRedo.current = true;
    const currentState = undoStack.current.pop();
    redoStack.current.push(currentState);
    const prevState = undoStack.current[undoStack.current.length - 1];
    canvas.loadFromJSON(prevState, () => {
      updateCanvasBackground(canvas);
      canvas.calcOffset();
      canvas.requestRenderAll();
      isUndoRedo.current = false;
    });
  };

  // Redo: load next state and reapply current background.
  const redo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || redoStack.current.length === 0) return;
    isUndoRedo.current = true;
    const nextState = redoStack.current.pop();
    undoStack.current.push(nextState);
    canvas.loadFromJSON(nextState, () => {
      updateCanvasBackground(canvas);
      canvas.calcOffset();
      canvas.requestRenderAll();
      isUndoRedo.current = false;
    });
  };

  const saveCanvasState = async () => {
    if (Userrole === "read") {
      toast.error("Ask for Permission");
      return;
    }
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const json = canvas.toJSON();
    // console.log('Canvas state:', json);

    const thumbnail = canvas.toDataURL({ format: 'png', multiplier: 0.25 });
    // console.log('Thumbnail generated:', thumbnail);

    const response = await _saveCanvasToDB(id, json, thumbnail, user._id, sessionToken);

    if (response.status === 401 || response.status === 403) {
      toast.error("Please Login First");
      localStorage.removeItem('user');
      navigate("/login");
      return;
    }

    // console.log("save response", response);

    return json;
  };


  return (


    <CanvasWrapper>
      <CopyButton onClick={handleCopyUrl} title='Copy Link'><HiLink /></CopyButton>
      <RedoButton onClick={redo} title='Redo'><IoIosRedo /></RedoButton>
      <UndoButton onClick={undo} title='Undo'><IoIosUndo /></UndoButton>
      <SaveButton onClick={saveCanvasState} title='Save Canvas'><IoIosSave /></SaveButton>
      <StyledCanvas ref={canvasRef} />
    </CanvasWrapper>
  );
};

export default Whiteboard;
