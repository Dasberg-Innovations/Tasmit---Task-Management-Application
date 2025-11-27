import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HeroPage from "./pages/HeroPage";
import Settings from "./pages/Settings";
import TaskManager from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import PersonalGoalsPage from "./pages/PersonalGoalsPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? <Navigate to="/hero" replace /> : children;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!isAuthPage && <Header />}
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 p-5 overflow-y-auto">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/hero"
              element={
                <ProtectedRoute>
                  <HeroPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals" 
              element={
                <ProtectedRoute>
                  <PersonalGoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                user ? <Navigate to="/hero" replace /> : <Navigate to="/login" replace />
              }
            />
            <Route path="*" element={<Navigate to={user ? "/hero" : "/login"} replace />} />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;