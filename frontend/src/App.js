import { ThemeProvider } from "./ContextProvider/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
