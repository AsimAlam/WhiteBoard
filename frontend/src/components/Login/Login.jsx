import styled from "styled-components";
import { ReactComponent as LogoImage } from "../../assets/logo.svg";
import { _loginWithGoogle } from "../../api/api";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../ContextProvider/UserProvider";

const LoginSpace = styled.div`
    height: 100vh;
    width: 100%;
    background-color: #040404;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const LoginForm = styled.div`
    position: relative;
    height: 70vh;
    width: 22vw;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    top: 15vh;
`;

const Ellipse = styled.div`
position: relative;
    z-index: 1;
    height: 9vh;
    min-height: 75px;
    width: 100%;
    background-color: #F36F41;
    border-radius: 55px;
`;

const LoginWrapper = styled.div`
height: 65vh;
    min-height: 300px;
    width: 100%;
    position: absolute;
    z-index: 2;
    top: 6px;
    border-radius: 40px;
    background-color: #181818;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 4vh 0;
`;

const Logo = styled.div`
border-radius: 50%;
    height: 12vh;
    min-height: 50px;
    min-width: 50px;
    width: 12vh;
    background-color: #333333;
    padding: 2vh;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledLogo = styled(LogoImage)`
  width: 60px;
  height: auto;
  fill: ${({ theme }) => theme.white};
`;

const Heading = styled.div`
color: white;
    z-index: 2;
    user-select: none;
`;

const LoginButton = styled.button`
    background-color: #F36F41;
    color: #ffffff;
    border: none;
    border-radius: 30px;
    padding: 12px 24px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #e55b38;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.98);
    }
`;

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    useEffect(() => {
        if (user && Object.keys(user).length !== 0) {
            console.log("inside login useEffect");
            const query = new URLSearchParams(location.search);
            const redirectUrl = query.get("redirect") || "/dashboard";
            console.log("login redirect", redirectUrl);
            navigate(redirectUrl);
        }
    }, [user, location, navigate]);

    const handleGoogleLogin = async () => {
        await _loginWithGoogle();
    };

    return (
        <LoginSpace>
            <LoginForm>
                <Ellipse></Ellipse>
                <LoginWrapper>
                    <Logo>
                        <StyledLogo />
                    </Logo>
                    <Heading>Welcome to WhiteBoard</Heading>
                    <LoginButton onClick={handleGoogleLogin}>
                        Login with Google
                    </LoginButton>
                </LoginWrapper>
            </LoginForm>
        </LoginSpace>
    );
};

export default Login;
