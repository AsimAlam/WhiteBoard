import styled from "styled-components";

const ButtonWrapper = styled.div`
    padding: 10px;
    height: 20px;
    margin: 10px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.buttonBg};
    color: ${({ theme }) => theme.buttonText};
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: ${({ theme }) => theme.buttonHover};
    }
    &:active {
        transform: scale(0.98);
    };
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    user-select: none;
    text-align: center;
`;

const ExportButton = (data) => {
    return (
        <ButtonWrapper onClick={data.onClick} title={data.title}>
            {data.icon}
            {/* {data.data} */}
        </ButtonWrapper>
    );
};

export default ExportButton;
