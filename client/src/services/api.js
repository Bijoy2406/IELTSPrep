import axios from 'axios';

// Create an instance of axios with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This allows the browser to send cookies with the request
});

// Add a request interceptor to add the auth token to the headers
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response patterns
api.interceptors.response.use(
  (response) => {
    // Store the token in localStorage if it's in the response
    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response;
  },
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If the request was unauthorized, clear the token and redirect to login
      localStorage.removeItem('token');

      // Only redirect if we're in a browser environment
      if (typeof window !== 'undefined') {
        // We don't have access to React Router's history here, so we use window.location
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
