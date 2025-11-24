import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HeroPage from "./pages/HeroPage";
import Settings from "./pages/Settings";
import TaskManager from "./pages/Tasks";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col h-screen from-gray-50 to-gray-100">
      <Header />
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar isLoggedIn={isLoggedIn} />}
        <main className="flex-1 p-5 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hero" element={<HeroPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<TaskManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;