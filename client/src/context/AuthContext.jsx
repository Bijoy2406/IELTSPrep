import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from localStorage/cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get the user profile if we have a token
        const userData = await getProfile();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any invalid state
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Login functionality
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true // Important for cookie handling
      });

      const { success, data, message } = response.data;

      if (success && data) {
        // Store token in localStorage as a fallback
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        // Update user state
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, message: message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  // Register functionality
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true
      });

      const { success, data, message } = response.data;

      if (success && data) {
        // Store token in localStorage as a fallback
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        // Update user state
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, message: message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout functionality
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state regardless of API result
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      // Set up auth header from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/auth/profile`, {
        withCredentials: true
      });

      const { success, data } = response.data;

      if (success && data) {
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        withCredentials: true
      });

      const { success, data, message } = response.data;

      if (success && data) {
        // Update user state with new profile data
        setUser(prevUser => ({ ...prevUser, ...data }));
        return { success: true, user: data };
      } else {
        return { success: false, message: message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed. Please try again.'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        login,
        register,
        logout,
        getProfile,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};