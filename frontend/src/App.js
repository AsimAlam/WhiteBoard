import { ThemeProvider } from "./ContextProvider/ThemeProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./Layout/Layout";
import ViewBoard from "./components/ViewBoard/ViewBoard";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/view" element={<ViewBoard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
