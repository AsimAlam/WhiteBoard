import React, { useEffect, useState } from 'react';
import { _getDashboard } from "../../api/api";
import styled from "styled-components";
import RecentBoards from '../Boards/RecentBoards';

const DashboardWrapper = styled.div`
height: 90vh;
width: 100%;
display: flex;
flex-direction: column;
background-color: ${({ theme }) => theme.body};
`;
const DashboardHeader = styled.div`
height: 5%;
width: 100%;
display: flex;
flex-direction: row;
gap: 1rem;
`;
const HeaderItem = styled.div`
height: 100%;
width: 10%;
display: flex;
flex-direction: row;
`;

const DashboardBody = styled.div`
height: 95%;
width: 100%;
display: flex;
flex-direction: row;
`;

const Dashboard = () => {
  const [message, setMessage] = useState("Loading dashboard...");

  const fetchDashboardData = async () => {
    const response = await _getDashboard();
    console.log("response", response);
    if (response.ok) {
      const data = await response.json();
      setMessage(data.message);
    } else {
      setMessage('Failed to load dashboard');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderItem>
          filter
        </HeaderItem>
        <HeaderItem>
          search
        </HeaderItem>
      </DashboardHeader>
      <DashboardBody>
        <RecentBoards />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
