import React, { useRef, useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';

const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem;
  background: ${({ theme }) => theme.canvasBg};
  border-radius: 10px;
  /* Ensure a minimum height so the canvas is visible */
  min-height: 400px;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const Whiteboard = ({ tool, lineWidth = 2 }) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const [commands, setCommands] = useState([]); // { tool: 'pen', points: [{x, y}, ...], lineWidth }

  const [currentCommand, setCurrentCommand] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      renderCommands();
    }
  }, []);

  useEffect(() => {
    renderCommands();
  }, [commands, theme]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const renderCommands = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    commands.forEach((cmd) => {
      if (cmd.tool === 'pen') {
        ctx.beginPath();
        ctx.strokeStyle = theme.text; // Use current theme text color.
        ctx.lineWidth = cmd.lineWidth;
        if (cmd.points.length > 0) {
          ctx.moveTo(cmd.points[0].x, cmd.points[0].y);
          for (let i = 1; i < cmd.points.length; i++) {
            ctx.lineTo(cmd.points[i].x, cmd.points[i].y);
          }
          ctx.stroke();
        }
      } else if (cmd.tool === 'eraser') {
        ctx.beginPath();

        ctx.strokeStyle = theme.canvasBg;
        ctx.lineWidth = cmd.lineWidth;
        if (cmd.points.length > 0) {
          ctx.moveTo(cmd.points[0].x, cmd.points[0].y);
          for (let i = 1; i < cmd.points.length; i++) {
            ctx.lineTo(cmd.points[i].x, cmd.points[i].y);
          }
          ctx.stroke();
        }
      } else if (cmd.tool === 'shape') {

        ctx.strokeStyle = theme.text;
        ctx.lineWidth = cmd.lineWidth;
        ctx.strokeRect(
          cmd.start.x,
          cmd.start.y,
          cmd.end.x - cmd.start.x,
          cmd.end.y - cmd.start.y
        );
      } else if (cmd.tool === 'text') {
        ctx.fillStyle = theme.text;
        ctx.font = `${cmd.fontSize}px Arial`;
        ctx.fillText(cmd.text, cmd.position.x, cmd.position.y);
      }
    });
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    if (tool === 'pen' || tool === 'eraser') {
      setCurrentCommand({ tool, points: [pos], lineWidth });
    } else if (tool === 'shape') {
      setCurrentCommand({ tool: 'shape', start: pos, end: pos, lineWidth });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentCommand((prev) => {
        const newCommand = { ...prev, points: [...prev.points, pos] };
        renderCommands();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        if (tool === 'pen') {
          ctx.strokeStyle = theme.text;
        } else {
          ctx.strokeStyle = theme.canvasBg;
        }
        ctx.lineWidth = lineWidth;
        if (newCommand.points.length > 0) {
          ctx.moveTo(newCommand.points[0].x, newCommand.points[0].y);
          newCommand.points.forEach((pt) => ctx.lineTo(pt.x, pt.y));
          ctx.stroke();
        }
        return newCommand;
      });
    } else if (tool === 'shape') {
      // For shape, update the end point.
      setCurrentCommand((prev) => {
        const newCommand = { ...prev, end: pos };
        renderCommands();
        // Draw preview for shape.
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(
          newCommand.start.x,
          newCommand.start.y,
          newCommand.end.x - newCommand.start.x,
          newCommand.end.y - newCommand.start.y
        );
        return newCommand;
      });
    }
  };

  // Mouse up: finalize the current command.
  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentCommand) {
      // Append the finished command to the commands array.
      setCommands((prev) => [...prev, currentCommand]);
      setCurrentCommand(null);
    }
  };

  // For text tool, handle click (if not drawing).
  const handleCanvasClick = (e) => {
    if (tool === 'text') {
      const pos = getMousePos(e);
      const inputText = prompt('Enter text:');
      if (inputText) {
        // Create a text command.
        const textCommand = {
          tool: 'text',
          text: inputText,
          position: pos,
          fontSize: lineWidth * 10, // example: font size based on lineWidth
        };
        setCommands((prev) => [...prev, textCommand]);
      }
    }
  };

  // --- Undo Functionality (Simple example) ---
  const handleUndo = () => {
    setCommands((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <CanvasWrapper>
      {/* Undo button */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
        <Button onClick={handleUndo}>Undo</Button>
      </div>
      <StyledCanvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      />
    </CanvasWrapper>
  );
};

export default Whiteboard;
