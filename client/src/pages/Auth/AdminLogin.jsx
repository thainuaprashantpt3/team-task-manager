import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);

      // Only admin allowed here
      if (data.data.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        setLoading(false);
        return;
      }

      login(data.data);
      toast.success(`Welcome, ${data.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <i className="ti ti-shield-lock text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
          <p className="text-sm text-gray-400 mt-1">Admin portal</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
          <h2 className="text-base font-semibold text-white mb-1">Admin sign in</h2>
          <p className="text-xs text-gray-500 mb-5">Restricted access — admins only</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2
                           text-sm text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
                placeholder="admin@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2
                           text-sm text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
                         text-sm font-medium flex items-center justify-center gap-2
                         transition-colors disabled:opacity-50 mt-2"
            >
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Signing in...</>
                : <><i className="ti ti-login" /> Sign in as admin</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            New admin?{' '}
            <Link to="/admin-1/register"
              className="text-blue-500 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          Not an admin?{' '}
          <Link to="/login" className="text-gray-500 hover:text-gray-400 underline">
            Member login
          </Link>
        </p>
      </div>
    </div>
  );
}