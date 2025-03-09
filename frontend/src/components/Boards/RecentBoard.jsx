import styled, { keyframes } from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as PreviewIcon } from "../../assets/codeIcon.svg";
import { FaEllipsisV, FaPen, FaTrashAlt } from "react-icons/fa";
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.cardBg};
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

const OptionsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const VerticalDots = styled(FaEllipsisV)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: ${({ theme }) => theme.dropdownBg || "#fff"};
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 100;
  animation: ${fadeIn} 0.3s forwards;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 10px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent ${({ theme }) => theme.dropdownBg || "#fff"} transparent;
  }
`;

const DropdownItem = styled.div`
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.dropdownText || "#333"};
  transition: background 0.3s, color 0.3s;
  &:hover {
    background: ${({ theme }) => theme.dropdownHover || "#f0f0f0"};
    color: ${({ theme }) => theme.primary || "#F36F41"};
  }
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const RecentBoard = ({ data, Refresh }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(data.name);
  const dropdownRef = useRef(null);
  const boardDetailsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    // Close dropdown if clicking outside
    const handleClickOutsideDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

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
        setShowDropdown(false);
        navigate("/login");
        return;
      } else if (response.status === 200) {
        setShowDropdown(false);
        Refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRename = async () => {
    console.log("inside handle rename");
    setIsEditing(false);
    try {
      const response = await _renameBoard(data._id, user._id, editedName);
      if (response.status === 401 || response.status === 403) {
        setShowDropdown(false);
        navigate("/login");
        return;
      } else if (response.status === 200) {
        setShowDropdown(false);
        setIsEditing(false);
        Refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BoardWrapper>
      {/* Conditionally render the ribbon if the user is the owner */}
      {data.ownerId === user._id && <Ribbon>Owner</Ribbon>}
      <PreviewBox>
        {data?.pages[0]?.thumbnail ? (
          <img
            src={data?.pages[0]?.thumbnail}
            alt="Whiteboard Thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px'
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
        <OptionsContainer ref={dropdownRef}>
          <VerticalDots onClick={toggleDropdown} />
          {showDropdown && (
            <DropdownContainer>
              <DropdownItem
                onClick={() =>
                  navigate(`/view/${data._id}`, { state: { boardData: data } })
                }
              >
                <MdOpenInNew size={20} />
                Open
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setIsEditing(true);
                  setEditedName(data.name);
                  setShowDropdown(false);
                }}
              >
                <FaPen size={18} />
                Rename
              </DropdownItem>
              <DropdownItem onClick={handleDelete}>
                <FaTrashAlt size={18} />
                Delete
              </DropdownItem>
            </DropdownContainer>
          )}
        </OptionsContainer>
      </BoardDetails>
    </BoardWrapper>
  );
};

export default RecentBoard;
