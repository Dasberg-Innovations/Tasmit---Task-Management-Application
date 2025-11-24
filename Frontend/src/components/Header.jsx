import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">Habot App</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-gray-600">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;