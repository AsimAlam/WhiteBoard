import React, { useEffect, useState } from 'react';
import { _getDashboard } from "../../api/api";
import styled from "styled-components";
import NewBoard from '../Boards/NewBoard';
import RecentBoard from '../Boards/RecentBoard';

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
flex-wrap: wrap;
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
        <NewBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
