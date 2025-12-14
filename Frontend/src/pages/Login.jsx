import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../../../Backend/Controllers/LoginController';
import { useAuth } from '../components/AuthContext';
import DesktopImage from '../../src/assets/Landing_Page.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(username, password);
      console.log('Login successful', data);
      if (data.user && data.user.id) {
        login(data.user);
        navigate('/hero', { replace: true });
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${DesktopImage})` }}
      />
      <div className="flex items-center justify-center flex-col w-full max-w-md p-8 bg-[#34312D] shadow-md">
        <h2 className="mb-8 text-2xl font-bold text-center text-white">Login</h2>
        {error && <p className="mb-6 text-red-500 text-center">{error}</p>}
        
        <form className="w-full space-y-8" onSubmit={handleLogin}>
          <div className="relative w-full">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="floating-input peer w-full px-4 pt-6 pb-2 h-14 text-base font-normal 
                bg-[#4a4a4a]/10 border-0 border-b-2 border-white text-white 
                transition-all duration-200 ease-in-out 
                focus:bg-[#4a4a4a]/20 focus:outline-none focus:border-[#0077FF]
                hover:bg-[#4a4a4a]/20 hover:border-gray-300
                rounded-t"
              required
            />
            <label 
              className="floating-label absolute left-4 top-5 text-base text-gray-400 
                pointer-events-none transition-all duration-200 ease-in-out
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0077FF]
                peer-[:not(:placeholder-shown)]:top-2 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:text-[#0077FF]"
            >
              Username or Email
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="floating-input peer w-full px-4 pt-6 pb-2 h-14 text-base font-normal 
                bg-[#4a4a4a]/10 border-0 border-b-2 border-white text-white 
                transition-all duration-200 ease-in-out 
                focus:bg-[#4a4a4a]/20 focus:outline-none focus:border-[#0077FF]
                hover:bg-[#4a4a4a]/20 hover:border-gray-300
                rounded-t"
              required
            />
            <label 
              className="floating-label absolute left-4 top-5 text-base text-gray-400 
                pointer-events-none transition-all duration-200 ease-in-out
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0077FF]
                peer-[:not(:placeholder-shown)]:top-2 
                peer-[:not(:placeholder-shown)]:text-xs 
                peer-[:not(:placeholder-shown)]:text-[#0077FF]"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#0077FF] text-white rounded font-medium 
              hover:bg-[#005ECC] transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <div className="w-full mt-8 space-y-4 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-white hover:underline font-medium">Register</Link>
          </p>
          <p className="text-white">
            Forgot Password?{" "}
            <Link to="/forgot-password" className="text-white hover:underline font-medium">Forgot Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;