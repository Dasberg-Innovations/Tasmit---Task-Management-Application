import axios from 'axios';

const Url = 'https://tasmit-task-management-application-1.onrender.com';


export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${Url}/login`, {
      username,
      password
    }, {
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Login failed. Please try again.'
    );
  }
};

export const signupUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${Url}/register`, {
      username,
      email, 
      password
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Signup failed. Please try again.'
    );
  }
};

export const fetchUsers = async () => {
  try {
      const response = await axios.get(Url); 
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
};