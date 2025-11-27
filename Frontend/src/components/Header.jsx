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
    <header 
      className="border-b transition-all duration-300"
      style={{ 
        backgroundColor: 'var(--background-color)', 
        borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)'
      }}
    >
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 
            className="text-xl font-semibold tracking-tight"
            style={{ color: 'var(--text-color)' }}
          >
            HabotApp
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border"
                style={{ 
                  backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)',
                  color: 'var(--primary-color)',
                  borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent)'
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span 
                className="font-medium text-sm"
                style={{ color: 'var(--text-color)' }}
              >
                {user.username}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                color: 'white'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;