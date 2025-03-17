import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import LightModeToggle from "../../assets/light-mode-toggle.svg";
import DarkModeToggle from "../../assets/dark-mode-toggle.svg";
import AvatarImage from "../../assets/avatars/below-25-boy.svg";
import { useTheme } from "../../ContextProvider/ThemeProvider";
import { ReactComponent as LogoImage } from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../ContextProvider/UserProvider";
import { _logout } from "../../api/api";

const NavbarWrapper = styled.div`
  height: 10vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.navbarBg};
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10rem;
`;

const StyledLogo = styled(LogoImage)`
  width: 60px;
  height: auto;
  fill: ${({ theme }) => theme.logo};
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding-right: 10rem;
`;

const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ToggleIcon = styled.img`
  width: 40px;
  height: auto;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
`;

const Avatar = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.avatarBorder};
  transition: border 0.2s ease-in-out;
  &:hover {
    border-color: ${({ theme }) => theme.highlight};
  }
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

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [profileUrl, setProfileUrl] = useState('');

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    setProfileUrl(JSON.parse(localStorage.getItem('user'))?.profilePic);
    // console.log("inside navbar", JSON.parse(localStorage.getItem('user')).profilePic);
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    console.log("inside logout");
    setUser({});
    localStorage.removeItem('user');
    console.log("user logout", user);
    const response = await _logout();
    if (response.status === 200) {
      navigate("/");
    }
    console.log("logout", response);
  }

  return (
    <NavbarWrapper>
      <Logo>
        <StyledLogo />
      </Logo>
      <NavItems>
        <ToggleButton onClick={toggleTheme}>
          <ToggleIcon
            src={theme === "light" ? DarkModeToggle : LightModeToggle}
            alt="Toggle"
          />
        </ToggleButton>
        <AvatarContainer>
          <Avatar onClick={handleAvatarClick}>
            <AvatarImg src={user.profilePic} alt="Avatar"
              onError={(e) => {
                console.error("Image failed to load:", e);
                e.target.src = AvatarImage;
              }}
            />
          </Avatar>
          {showDropdown && (
            <DropdownContainer ref={dropdownRef}>
              <DropdownItem onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownItem>
              <DropdownItem>
                Settings
              </DropdownItem>
              <DropdownItem
                onClick={handleLogout}
              >
                Logout
              </DropdownItem>
            </DropdownContainer>
          )}
        </AvatarContainer>
      </NavItems>
    </NavbarWrapper>
  );
};

export default Navbar;
