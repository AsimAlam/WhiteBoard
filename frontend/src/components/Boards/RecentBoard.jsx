import styled, { keyframes } from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as PreviewIcon } from "../../assets/codeIcon.svg";
import { FaEllipsisV, FaPen, FaTrashAlt } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BoardWrapper = styled.div`
  width: 15rem;
  max-height: 200px;
  margin: 1rem;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.cardBg};
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

/* --- Options (Vertical Dots) and Dropdown Styling --- */

const OptionsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

/* Use React Icon for vertical dots */
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

/* Dropdown fade-in animation */
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

/* Dropdown container styling with arrow pointer */
const DropdownContainer = styled.div`
  position: absolute;
  top: 120%; /* Adjust this to position the dropdown below the icon */
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

/* Dropdown item styling */
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

const RecentBoard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <BoardWrapper>
      <PreviewBox>
        <IconWrapper />
      </PreviewBox>
      <BoardDetails>
        <AddText>Name/TimeStamp</AddText>
        <OptionsContainer ref={dropdownRef}>
          <VerticalDots onClick={toggleDropdown} />
          {showDropdown && (
            <DropdownContainer>
              <DropdownItem onClick={() => navigate("/view")}>
                <MdOpenInNew size={20} />
                Open
              </DropdownItem>
              <DropdownItem onClick={() => console.log("Rename board")}>
                <FaPen size={18} />
                Rename
              </DropdownItem>
              <DropdownItem onClick={() => console.log("Delete board")}>
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
