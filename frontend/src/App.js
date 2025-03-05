import { ThemeProvider } from "./ContextProvider/ThemeProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./Layout/Layout";
import ViewBoard from "./components/ViewBoard/ViewBoard";
import { UserProvider } from "./ContextProvider/UserProvider";
import Canvas from "./components/Canvas/Canvas";
import CanvasContainer from "./components/Canvas/CanvasContainer";

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/view/:id" element={<ViewBoard />} />
              <Route path="/whiteboard/:id" element={<CanvasContainer />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
