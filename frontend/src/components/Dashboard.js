import React, { useEffect, useState } from 'react';
import { _getDashboard } from '../api/api';

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
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
