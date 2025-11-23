import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Habit Hero</h1>
      <nav className="flex space-x-6">
        <Link to="/" className="text-white hover:text-blue-300 transition duration-200">
          Login
        </Link>
        <Link to="/hero" className="text-white hover:text-blue-300 transition duration-200">
          Hero
        </Link>
        <Link to="/settings" className="text-white hover:text-blue-300 transition duration-200">
          Settings
        </Link>
      </nav>
    </header>
  );
}

export default Header;