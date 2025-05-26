import axios from 'axios';

// Configure API URL based on environment
const getApiUrl = () => {
    if (import.meta.env.MODE === "development") {
        return "http://localhost:5000/api/auth";
    }
    return import.meta.env.VITE_API_URL;
};

const API_URL = getApiUrl();

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Use the same axios instance configured in authStore
export async function updateUser(data) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put("/api/auth/update", data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
} 