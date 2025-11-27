import React from "react"; 
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  return (
    <div className="flex flex-col w-1/4 h-full p-5 bg-white shadow-md">
      <h1 className="flex items-center gap-1 mb-6">
        <span className="text-blue-600 text-2xl">📋</span>
        <span className="text-2xl font-bold">Menu</span>
      </h1>
      <div className="flex flex-col gap-5">
        <Link
          to="hero"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "tasks" ? "bg-blue-700 text-white" : ""}`}
        >Dashboard</Link>
        <Link
          to="tasks"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "tasks" ? "bg-blue-700 text-white" : ""}`}
        >Tasks</Link>
        <Link
          to="goals"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "personal-goals" ? "bg-blue-700 text-white" : ""}`}
        >Personal Goals</Link>
        <Link
          to="calendar"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "calendar" ? "bg-blue-700 text-white" : ""}`}
        >Calendar</Link>
        <Link
          to="account"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "account" ? "bg-blue-700 text-white" : ""}`}
        >Account</Link>
        <Link
          to="settings"
          className={`flex items-center gap-2 p-2 rounded-full text-gray-800 hover:bg-blue-200 ${path === "settings" ? "bg-blue-700 text-white" : ""}`}
        >Settings</Link>
      </div>
    </div>
  );
};

export default Sidebar;