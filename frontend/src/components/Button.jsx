import styled from "styled-components";

const ButtonWrapper = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
`;

export default function Button() {
    return <ButtonWrapper>Click Me</ButtonWrapper>;
}
