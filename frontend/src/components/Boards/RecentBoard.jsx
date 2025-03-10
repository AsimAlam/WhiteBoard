import styled, { keyframes } from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as PreviewIcon } from "../../assets/codeIcon.svg";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { _deleteWhiteboard, _renameBoard } from "../../api/api";
import { useUser } from "../../ContextProvider/UserProvider";

const BoardWrapper = styled.div`
  position: relative;
  width: 14rem;
  max-height: 200px;
  margin: 1rem;
  border-radius: 10px;
  padding: 1rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.cardBg};

  &:hover .action-overlay {
    opacity: 1;
    visibility: visible;
  }
`;

const Ribbon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  transform: rotate(-15deg);
  background: linear-gradient(135deg, #F36F41, #D1503E);
  color: white;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 101;
`;

const PreviewBox = styled.div`
  width: 90%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.cardPreview};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled(PreviewIcon)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const BoardDetails = styled.div`
  width: 90%;
  height: 30%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AddText = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: bold;
  user-select: none;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditInput = styled.input`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  outline: none;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ActionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  animation: ${fadeIn} 0.3s forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 10px;
  z-index: 102;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  
  &:hover {
    background: ${({ theme }) => theme.primary || "#F36F41"};
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
  }
`;

const RecentBoard = ({ data, Refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(data.name);
  const boardDetailsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const handleClickOutsideBoardDetails = (event) => {
      if (
        boardDetailsRef.current &&
        !boardDetailsRef.current.contains(event.target)
      ) {
        if (isEditing) {
          setIsEditing(false);
          setEditedName(data.name);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutsideBoardDetails);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideBoardDetails);
    };
  }, [isEditing, data.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    try {
      const response = await _deleteWhiteboard(data._id, user._id);
      console.log("delete response", response);
      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      } else if (response.status === 200) {
        Refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRename = async () => {
    setIsEditing(false);
    try {
      const response = await _renameBoard(data._id, user._id, editedName);
      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      } else if (response.status === 200) {
        setIsEditing(false);
        Refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BoardWrapper>
      {data.ownerId === user._id && <Ribbon>Owner</Ribbon>}
      <PreviewBox>
        {data?.pages[0]?.thumbnail ? (
          <img
            src={data.pages[0].thumbnail}
            alt="Whiteboard Thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        ) : (
          <IconWrapper />
        )}
      </PreviewBox>
      <BoardDetails ref={boardDetailsRef}>
        {isEditing ? (
          <EditInput
            ref={inputRef}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
              }
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditedName(data.name);
              }
            }}
          />
        ) : (
          <AddText>{data.name}</AddText>
        )}
      </BoardDetails>
      <ActionOverlay className="action-overlay">
        <ActionButton
          onClick={() =>
            navigate(`/view/${data._id}`, { state: { boardData: data } })
          }
          title="Open"
        >
          <MdOpenInNew size={20} />
        </ActionButton>
        <ActionButton
          onClick={() => {
            setIsEditing(true);
            setEditedName(data.name);
          }}
          title="Rename"
        >
          <FaPen size={18} />
        </ActionButton>
        <ActionButton onClick={handleDelete} title="Delete">
          <FaTrashAlt size={18} />
        </ActionButton>
      </ActionOverlay>
    </BoardWrapper>
  );
};

export default RecentBoard;
