import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from '../../../Backend/Controllers/LoginController';
import { useAuth } from '../components/AuthContext';
import DesktopImage from '../../src/assets/Landing_Page.jpg';

function ForgotPassword() {
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
      <div className="flex items-center justify-center flex-col w-full max-w-md p-8 bg-white shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form className="flex flex-col" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            className="p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
          <p className="mt-4 text-center">
          Forgot Password?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;