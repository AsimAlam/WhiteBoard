import React, { useEffect, useState } from 'react';
import { _getDashboard } from '../api/api';
import styled from "styled-components";

const DashboardWrapper = styled.div`
height: 92vh;
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
`;
const DashboardHeader = styled.h1``;
const DashboardMessage = styled.p``;

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
      <DashboardHeader>Dashboard</DashboardHeader>
      <DashboardMessage>{message}</DashboardMessage>
    </DashboardWrapper>
  );
};

export default Dashboard;
