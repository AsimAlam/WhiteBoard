import React, { useEffect, useState, useRef } from 'react';
import { _getAllWhiteboard, _getDashboard } from "../../api/api";
import styled, { keyframes } from "styled-components";
import NewBoard from '../Boards/NewBoard';
import RecentBoard from '../Boards/RecentBoard';
import { useUser } from '../../ContextProvider/UserProvider';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSortAmountUp } from 'react-icons/fa';

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

const DashboardWrapper = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.body};
  overflow-y: auto;
`;

const DashboardHeader = styled.div`
  height: 10%;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  position: relative;
`;

const DashboardBody = styled.div`
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  color: ${({ theme }) => theme.searchIcon}
`;

const SearchInput = styled.input`
  border: 1px solid ${({ theme }) => theme.lineBorder};
  background: ${({ theme }) => theme.inputBackground};
  padding: 0.5rem;
  border-radius: 10px;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.lineBorder};
  background: ${({ theme }) => theme.dropdownBg};
  border-radius: 5px;
  color: ${({ theme }) => theme.sortByColor};
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: ${({ theme }) => theme.dropdownBg};
  border-radius: 10px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  animation: ${fadeIn} 0.3s forwards;

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 15px;
    border-width: 0 10px 10px 10px;
    border-style: solid;
    border-color: transparent transparent ${({ theme }) => theme.dropdownBg} transparent;
  }
`;

const DropdownItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.dropdownText};
  transition: background 0.3s, color 0.3s;
  &:hover {
    background: ${({ theme }) => theme.dropdownHover};
    color: ${({ theme }) => theme.dropdownTextHover};
  }
`;

const Dashboard = () => {
  const { user, setUser } = useUser();
  const [allWhiteboard, setAllWhiteboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("timestamp-desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchDashboardData = async () => {
    const response = await _getDashboard();
    console.log("response", response);
    if (response.ok) {
      const data = await response?.json();
      // console.log("data", data?.data);
      // console.log("uri", encodeURIComponent(window.location.href), window.location.href);
      if (data?.data) {
        // console.log("data parse", JSON.stringify(data.data));
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data?.data);
      }
      if (data?.data && !window.location.href.includes("/dashboard")) {
        navigate(`${encodeURIComponent(window.location.href)}`);
      }
    } else {
      navigate("/login");
    }
  };

  const getAllWhiteboard = async () => {
    console.log("user.id", user._id);
    try {
      const response = await _getAllWhiteboard(user._id);
      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }
      console.log(response);
      if (response?.message !== "Server error") setAllWhiteboard(response);
    } catch (error) {
      console.log(error);
    }
  }

  const Refresh = async () => {
    // console.log("inside refresh");
    await getAllWhiteboard();
  };

  useEffect(() => {
    getAllWhiteboard();
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  let filteredBoards = allWhiteboard?.filter((board) =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOption === "name-asc") {
    filteredBoards.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "name-desc") {
    filteredBoards.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === "timestamp-asc") {
    filteredBoards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOption === "timestamp-desc") {
    filteredBoards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const sortOptions = [
    { value: "name-asc", label: "Name Ascending" },
    { value: "name-desc", label: "Name Descending" },
    { value: "timestamp-asc", label: "Least Recent" },
    { value: "timestamp-desc", label: "Most Recent" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSelect = (option) => {
    setSortOption(option.value);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    sortOptions.find(opt => opt.value === sortOption)?.label || "Most Recent";

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderContainer ref={dropdownRef}>
          <DropdownButton onClick={toggleDropdown}>
            <FaSortAmountUp />
            {selectedLabel}
          </DropdownButton>
          {isDropdownOpen && (
            <DropdownContainer>
              {sortOptions.map((option, index) => (
                <DropdownItem key={index} onClick={() => handleSelect(option)}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownContainer>
          )}
        </HeaderContainer>
        <HeaderContainer>
          <FaSearch />
          <SearchInput
            type="text"
            placeholder="Search Boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </HeaderContainer>
      </DashboardHeader>
      <DashboardBody>
        <NewBoard />
        {filteredBoards.map((board, index) => (
          <RecentBoard key={board._id || index} data={board} Refresh={Refresh} />
        ))}
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
