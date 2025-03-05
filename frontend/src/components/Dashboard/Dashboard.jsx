import React, { useEffect, useState } from 'react';
import { _getAllWhiteboard, _getDashboard } from "../../api/api";
import styled from "styled-components";
import NewBoard from '../Boards/NewBoard';
import RecentBoard from '../Boards/RecentBoard';
import { useUser } from '../../ContextProvider/UserProvider';
import { redirect, useNavigate } from 'react-router-dom';

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
  const { user, setUser } = useUser();
  const [allWhiteboard, setAllWhiteboard] = useState([]);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    const response = await _getDashboard();
    console.log("response", response);
    if (response.ok) {
      const data = await response?.json();
      console.log("data", data);
      console.log("uri", encodeURIComponent(window.location.href), window.location.href);
      if (data?.data) setUser(data?.data);
      if (data?.data && !window.location.href.includes("/dashboard")) {
        navigate(`${encodeURIComponent(window.location.href)}`);
      }
    } else {
      navigate("/login");
    }
  };

  const getAllWhiteboard = async () => {
    try {
      const response = await _getAllWhiteboard(user._id);
      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }
      console.log(response);
      setAllWhiteboard(response);
    } catch (error) {
      console.log(error);
    }
  }

  const Refresh = async () => {
    console.log("inside refresh");
    await getAllWhiteboard();
  }

  useEffect(() => {
    fetchDashboardData();
    getAllWhiteboard();
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
        {allWhiteboard.map((board, index) => (
          <RecentBoard data={board} Refresh={Refresh} />
        ))}
        {/* <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard />
        <RecentBoard /> */}
      </DashboardBody>
    </DashboardWrapper>
  );
};

export default Dashboard;
