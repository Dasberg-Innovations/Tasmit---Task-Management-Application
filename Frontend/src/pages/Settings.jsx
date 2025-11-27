import React, { useState, useEffect } from "react";

function Settings() {
  const [currentTheme, setCurrentTheme] = useState("default");

  const themes = {
    default: {
      name: "Blue",
      primary: "#3b82f6",
      background: "#f8fafc",
      text: "#1e293b"
    },
    dustyLavender: {
      name: "Lavender", 
      primary: "#a78bfa",
      background: "#fafafa",
      text: "#4c1d95"
    },
    purple: {
      name: "Purple",
      primary: "#8b5cf6",
      background: "#f5f3ff",
      text: "#4c1d95"
    },
    blue: {
      name: "Cyan",
      primary: "#06b6d4",
      background: "#ecfeff",
      text: "#164e63"
    },
    green: {
      name: "Green",
      primary: "#10b981",
      background: "#ecfdf5",
      text: "#064e3b"
    },
    orange: {
      name: "Orange",
      primary: "#f97316",
      background: "#fff7ed",
      text: "#7c2d12"
    },
    pink: {
      name: "Pink", 
      primary: "#ec4899",
      background: "#fdf2f8",
      text: "#831843"
    },
    dark: {
      name: "Dark",
      primary: "#6b7280",
      background: "#111827",
      text: "#f9fafb"
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--text-color', theme.text);

    document.documentElement.setAttribute('data-theme', themeName);
  };

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
    applyTheme(themeName);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-6 text-center">Settings</h2>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-medium mb-3">Theme</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose your color theme
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`flex flex-col items-center p-3 rounded border-2 transition-colors ${
                    currentTheme === key 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => handleThemeChange(key)}
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-2 border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-medium mb-4">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Task and goal reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-12 h-6 bg-gray-300 peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;