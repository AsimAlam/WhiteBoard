import styled from "styled-components";

const CardWrapper = styled.div`
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.cardText};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default function Card() {
    return (
        <CardWrapper>
            <h2>Styled Components Theming</h2>
        </CardWrapper>
    );
}
