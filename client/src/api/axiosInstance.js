// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',
//   headers: { 'Content-Type': 'application/json' },
//   withCredentials: true,
//   timeout: 15000,
// });

// api.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem('user') || 'null');
//     if (user?.token) {
//       config.headers.Authorization = `Bearer ${user.token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err.response?.status;
//     if (status === 401) {
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     if (status === 403) {
//       window.location.href = '/dashboard';
//     }
//     if (status >= 500) {
//       console.error('Server error:', err.response?.data?.message || err.message);
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 15000,
});

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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    if (status === 403) {
      window.location.href = '/dashboard';
    }
    if (status >= 500) {
      console.error('Server error:', err.response?.data?.message || err.message);
    }
    return Promise.reject(err);
  }
);

export default api;