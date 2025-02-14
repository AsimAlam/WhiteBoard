import styled from "styled-components";
import LightModeToggle from "../../assets/light-mode-toggle.svg";
import DarkModeToggle from "../../assets/dark-mode-toggle.svg";
import AvatarImage from "../../assets/avatars/below-25-boy.svg";
import { useTheme } from "../../ContextProvider/ThemeProvider";
import { ReactComponent as LogoImage } from "../../assets/logo.svg";


const NavbarWrapper = styled.div`
height: 8vh;
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
padding: 0 8%;
`;

const StyledLogo = styled(LogoImage)`
  width: 60px;
  height: auto;
  fill: ${({ theme }) => theme.logo};
`;

const NavItems = styled.div`
width: 15%;
display: flex;
flex-direction: row;
justify-content: space-between;
padding: 0 8%;
`;
const ToggleButton = styled.div`
display: flex;
flex-direction: row;
align-items: center;
cursor: pointer;
`;

const ToggleIcon = styled.img`
  width: 40px;
  height: auto;
`;

const Avatar = styled.div`
display: flex;
align-items: center;
`;

const AvatarImg = styled.img`
  width: 50px;
    height: auto;
  `;

const Navbar = () => {

    const { theme, toggleTheme } = useTheme();

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
                <Avatar>
                    <AvatarImg
                        src={AvatarImage}
                        alt="Avatar"
                    />
                </Avatar>
            </NavItems>
        </NavbarWrapper>
    );
}

export default Navbar;