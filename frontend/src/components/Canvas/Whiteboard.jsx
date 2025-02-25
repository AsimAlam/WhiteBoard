import React, { useEffect, useRef } from 'react';
import { Canvas, PencilBrush, IText, Rect } from 'fabric';
import styled, { useTheme } from 'styled-components';

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

const FabricWhiteboard = ({ tool, lineWidth = 2 }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const theme = useTheme();

  // Undo/Redo stacks.
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const isUndoRedo = useRef(false); // flag to prevent saving state during undo/redo

  // Save the current state of the canvas.
  const saveState = (canvas) => {
    if (isUndoRedo.current) return;
    const state = canvas.toJSON();
    undoStack.current.push(state);
    // Clear redo history on new actions.
    redoStack.current = [];
    console.log('State saved. Undo stack size:', undoStack.current.length);
  };

  // Initialize the canvas once.
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvasEl = canvasRef.current;
    canvasEl.width = canvasEl.clientWidth;
    canvasEl.height = canvasEl.clientHeight;

    const fabricCanvas = new Canvas(canvasEl, {
      isDrawingMode: false,
      backgroundColor: theme.canvasBg,
    });

    // Set free drawing brush properties.
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineWidth;
      fabricCanvas.freeDrawingBrush.color = theme.text;
    }

    // Save state after a free-draw path is completed.
    fabricCanvas.on('path:created', () => {
      saveState(fabricCanvas);
    });
    // Also save after modifications or removals.
    fabricCanvas.on('object:modified', () => saveState(fabricCanvas));
    fabricCanvas.on('object:removed', () => saveState(fabricCanvas));

    // Save the initial state.
    undoStack.current.push(fabricCanvas.toJSON());

    fabricCanvasRef.current = fabricCanvas;
  }, [theme, lineWidth]);

  // Update canvas properties when theme changes.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.backgroundColor = theme.canvasBg;
    if (canvas.freeDrawingBrush && tool !== 'eraser') {
      canvas.freeDrawingBrush.color = theme.text;
    }
    canvas.getObjects().forEach((obj) => {
      if (obj.stroke) obj.set({ stroke: theme.text });
      if (obj.type === 'i-text' && obj.fill) obj.set({ fill: theme.text });
    });
    canvas.renderAll();
  }, [theme, tool]);

  // Set up tool-specific behavior.
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove any previous mouse event handlers.
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    // Reset default behavior.
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
    } else if (tool === 'eraser') {
      // Previous eraser behavior: remove the whole object on click.
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.getObjects().forEach((obj) => (obj.selectable = false));
      canvas.on('mouse:down', (opt) => {
        const target = canvas.findTarget(opt.e);
        if (target) {
          canvas.remove(target);
          canvas.renderAll();
          saveState(canvas);
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
      });
    } else if (tool === 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.getObjects().forEach((obj) => (obj.selectable = true));
    }
  }, [tool, lineWidth, theme]);

  // Helper function to update canvas background and object styles to the current theme.
  const updateObjectsToTheme = (canvas) => {
    // Update background.
    canvas.backgroundColor = theme.canvasBg;
    // Update each object's style.
    canvas.getObjects().forEach((obj) => {
      if (obj.stroke) {
        obj.set({ stroke: theme.text });
      }
      if (obj.type === 'i-text' && obj.fill) {
        obj.set({ fill: theme.text });
      }
    });
  };

  // Undo: load the previous state, update styles, and force re-render.
  const undo = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || undoStack.current.length <= 1) return;
    isUndoRedo.current = true;

    // Pop current state, push it to redo stack.
    const currentState = undoStack.current.pop();
    redoStack.current.push(currentState);
    // Get previous state.
    const prevState = undoStack.current[undoStack.current.length - 1];

    // Load previous state.
    canvas.loadFromJSON(prevState, () => {
      // Use a slight delay to ensure objects are loaded.
      setTimeout(() => {
        updateObjectsToTheme(canvas);
        canvas.calcOffset();
        canvas.requestRenderAll();
        isUndoRedo.current = false;
      }, 50);
    });
  };

  // Redo: load the next state, update styles, and force re-render.
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


  // // Undo: load the previous state.
  // const undo = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas || undoStack.current.length <= 1) return;
  //   isUndoRedo.current = true;
  //   const currentState = undoStack.current.pop();
  //   redoStack.current.push(currentState);
  //   const prevState = undoStack.current[undoStack.current.length - 1];
  //   canvas.loadFromJSON(prevState, () => {
  //     // Force a re-render. Sometimes wrapping in setTimeout helps.
  //     setTimeout(() => {
  //       canvas.calcOffset();
  //       canvas.renderAll();
  //       isUndoRedo.current = false;
  //     }, 0);
  //   });
  // };

  // // Redo: load the next state.
  // const redo = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas || redoStack.current.length === 0) return;
  //   isUndoRedo.current = true;
  //   const nextState = redoStack.current.pop();
  //   undoStack.current.push(nextState);
  //   canvas.loadFromJSON(nextState, () => {
  //     setTimeout(() => {
  //       canvas.calcOffset();
  //       canvas.renderAll();
  //       isUndoRedo.current = false;
  //     }, 0);
  //   });
  // };

  // For debugging: log the current canvas state.
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

export default FabricWhiteboard;
