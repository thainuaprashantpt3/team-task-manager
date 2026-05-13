import axios from 'axios';

// In dev: Vite proxy forwards /api → localhost:5000
// In prod: same domain, Express serves both API and React
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,           // 15s timeout — prevents hanging requests
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401) {
      // Token expired or invalid — force logout
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (status === 403) {
      // Role mismatch — redirect to dashboard (not login)
      window.location.href = '/dashboard';
    }

    if (status >= 500) {
      console.error('Server error:', err.response?.data?.message || err.message);
    }

    return Promise.reject(err);
  }
);

export default api;