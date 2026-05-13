import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Login() {
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
      if (data.data.role === 'admin') {
        toast.error('Please use the admin portal to sign in.');
        setLoading(false);
        return;
      }
      login(data.data);
      toast.success(`Welcome back, ${data.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50
                    flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100
                        rounded-full opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100
                        rounded-full opacity-50 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600
                          rounded-2xl flex items-center justify-center mx-auto mb-4
                          shadow-lg shadow-indigo-200">
            <i className="ti ti-brain text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ethera AI</h1>
          <p className="text-sm text-gray-500 mt-1">Task Management Platform</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/60
                        rounded-2xl p-6 shadow-xl shadow-gray-200/50">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Sign in to your member account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email address
              </label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} required className="input"
                placeholder="you@ethera.ai" autoComplete="email" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} required className="input"
                placeholder="••••••••" autoComplete="current-password" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Signing in...</>
                : <><i className="ti ti-login" /> Sign in</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            New to Ethera AI?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2026 Ethera AI · All rights reserved
        </p>
      </div>
    </div>
  );
}

