import React, { useEffect, useRef, useState } from 'react';
import { Canvas, PencilBrush, IText, Rect } from 'fabric';
import io from "socket.io-client";
import styled, { useTheme } from 'styled-components';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../ContextProvider/UserProvider";
import { _getDashboard } from '../../api/api';

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
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
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const UndoButton = styled.button`
  position: absolute;
  top: 10px;
  right: 120px;
  z-index: 10;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const RedoButton = styled.button`
  position: absolute;
  top: 10px;
  right: 230px;
  z-index: 10;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const Whiteboard = ({ tool, lineWidth = 2 }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const socketRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isUndoRedo = useRef(false);

  const theme = useTheme();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [canvasData, setCanvasData] = useState(null);

  const query = new URLSearchParams(location.search);
  const sessionToken = query.get("token");

  // Helper: update canvas objects to current theme.
  const updateObjectsToTheme = (canvas) => {
    canvas.backgroundColor = theme.canvasBg;
    canvas.getObjects().forEach((obj) => {
      if (obj.stroke) {
        obj.set({ stroke: theme.text });
      }
      if (obj.type === 'i-text' && obj.fill) {
        obj.set({ fill: theme.text });
      }
    });
  };

  // Helper: emit canvas update via socket.
  const emitCanvasUpdate = (canvas) => {
    const json = canvas.toJSON();
    if (socketRef.current) {
      socketRef.current.emit("canvas-update", { boardId: id, canvas: json });
    }
  };

  // Get user details if not present.
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      (async () => {
        const response = await _getDashboard();
        const data = await response?.json();
        if (data.message === 'Unauthorized') {
          navigate(`/login?redirect=${encodeURIComponent(window.location.href)}`);
        } else {
          console.log("user detail", data?.data);
          setUser(data?.data);
        }
      })();
    }
  }, [user, navigate, setUser]);

  // Fetch whiteboard data from backend.
  useEffect(() => {
    if (!user) return;
    const fetchWhiteboard = async () => {
      try {
        const response = await fetch(`/api/whiteboard/${id}?token=${sessionToken}`, {
          headers: { Authorization: user.token },
        });
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        const data = await response.json();
        // Assume canvas data is stored in pages[0].canvasData.
        if (data.pages && data.pages.length > 0) {
          setCanvasData(data.pages[0].canvasData);
        }
      } catch (error) {
        console.error("Error fetching whiteboard:", error);
      }
    };
    fetchWhiteboard();
  }, [id, sessionToken, user, navigate]);

  // Initialize the Fabric canvas.
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;
    const fabricCanvas = new Canvas(canvasEl, {
      backgroundColor: theme.canvasBg,
    });
    fabricCanvasRef.current = fabricCanvas;

    // Load initial canvas data if available.
    if (canvasData) {
      fabricCanvas.loadFromJSON(canvasData, () => {
        updateObjectsToTheme(fabricCanvas);
        fabricCanvas.renderAll();
      });
    }

    // Save initial state.
    undoStack.current.push(fabricCanvas.toJSON());

    return () => {
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [canvasData, theme]);

  // Set up Socket.io for real-time collaboration.
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join-board", id);

    socketRef.current.on("canvas-update", (data) => {
      if (data.boardId !== id) return;
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.loadFromJSON(data.canvas, () => {
          updateObjectsToTheme(canvas);
          // Force a render after loading.
          setTimeout(() => {
            canvas.requestRenderAll();
          }, 50);
        });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id, theme]);

  // Listen to canvas changes and emit updates.
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

  // Update canvas theme when it changes.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.backgroundColor = theme.canvasBg;
    canvas.getObjects().forEach((obj) => {
      if (obj.stroke) obj.set({ stroke: theme.text });
      if (obj.type === 'i-text' && obj.fill) obj.set({ fill: theme.text });
    });
    canvas.renderAll();
  }, [theme]);

  // Save the current canvas state for undo/redo.
  const saveState = (canvas) => {
    if (isUndoRedo.current) return;
    const state = canvas.toJSON();
    undoStack.current.push(state);
    // Clear redo history.
    redoStack.current = [];
  };

  // Set up tool-specific behavior.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove previous event handlers.
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
      canvas.freeDrawingBrush.color = theme.text;

      // Save state and emit update after drawing a path.
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
          fill: theme.text,
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
          stroke: theme.text,
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
    } else if (tool === 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.getObjects().forEach((obj) => (obj.selectable = true));
    }
  }, [tool, lineWidth, theme]);

  // Undo functionality.
  const undo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStack.current.length <= 1) return;
    isUndoRedo.current = true;
    const currentState = undoStack.current.pop();
    redoStack.current.push(currentState);
    const prevState = undoStack.current[undoStack.current.length - 1];
    canvas.loadFromJSON(prevState, () => {
      setTimeout(() => {
        updateObjectsToTheme(canvas);
        canvas.calcOffset();
        canvas.requestRenderAll();
        isUndoRedo.current = false;
      }, 50);
    });
  };

  // Redo functionality.
  const redo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || redoStack.current.length === 0) return;
    isUndoRedo.current = true;
    const nextState = redoStack.current.pop();
    undoStack.current.push(nextState);
    canvas.loadFromJSON(nextState, () => {
      setTimeout(() => {
        updateObjectsToTheme(canvas);
        canvas.calcOffset();
        canvas.requestRenderAll();
        isUndoRedo.current = false;
      }, 50);
    });
  };

  // Debug: log the current canvas state.
  const saveCanvasState = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const json = canvas.toJSON();
    console.log('Canvas state:', json);
    return json;
  };

  return (
    <CanvasWrapper>
      <RedoButton onClick={redo}>Redo</RedoButton>
      <UndoButton onClick={undo}>Undo</UndoButton>
      <SaveButton onClick={saveCanvasState}>Save Canvas</SaveButton>
      <StyledCanvas ref={canvasRef} />
    </CanvasWrapper>
  );
};

export default Whiteboard;
