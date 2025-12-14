import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

function Settings() {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState("default");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const fetchUserSettings = async () => {
    if (!user) return;

    try {
      const response = await fetch(`https://tasmit-task-management-application.onrender.com/settings/${user.id}`);
      if (response.ok) {
        const settings = await response.json();
        if (settings.theme) {
          setCurrentTheme(settings.theme);
          applyTheme(settings.theme);
          localStorage.setItem('theme', settings.theme);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      const savedTheme = localStorage.getItem('theme') || 'default';
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  };
  const saveSettingsToDatabase = async (themeName) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('https://tasmit-task-management-application.onrender.com/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          theme: themeName
        }),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Using local storage.');
      setTimeout(() => setMessage(''), 3000);
      localStorage.setItem('theme', themeName);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSettings();
  }, [user]);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--text-color', theme.text);

    document.documentElement.setAttribute('data-theme', themeName);
  };

  const handleThemeChange = async (themeName) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
    await saveSettingsToDatabase(themeName);
  };

  return (
    <div className="p-6 bg-[#d4a5a5] dark:text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-6 text-center">Settings</h2>

        {message && (
          <div className={`mb-4 p-3 rounded text-center ${message.includes('Error')
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-medium mb-3">Theme</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose your color theme {loading && "(Saving...)"}
            </p>

            <div className="grid grid-cols-4 gap-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  disabled={loading}
                  className={`flex flex-col items-center p-3 rounded border-2 transition-colors ${currentTheme === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
          <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-medium mb-3">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                <span className="font-medium text-xs">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;