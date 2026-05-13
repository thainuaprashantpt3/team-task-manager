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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.data.role !== 'admin') {
        toast.error('Access denied. Admins only.');
        return;
      }
      login(data.data);
      toast.success(`Welcome, ${data.data.name}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/40
                        rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/30
                        rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-up">
        {/* Shield icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30
                          rounded-3xl flex items-center justify-center mx-auto mb-4
                          backdrop-blur-sm">
            <i className="ti ti-shield-lock text-indigo-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-400 mt-2">
            Restricted access — Ethera AI administrators only
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50
                        rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400
                                uppercase tracking-wider mb-2">
                Admin email
              </label>
              <div className="relative">
                <i className="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2
                              text-gray-500 text-base" />
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required placeholder="admin@ethera.ai"
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl
                             pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                             focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400
                                uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2
                              text-gray-500 text-base" />
                <input type="password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required placeholder="••••••••"
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl
                             pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                             focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white
                         font-bold py-3 rounded-xl text-sm flex items-center
                         justify-center gap-2 transition-all duration-200
                         shadow-lg shadow-indigo-900/50 disabled:opacity-50 mt-2">
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Verifying...</>
                : <><i className="ti ti-login" /> Sign in as admin</>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              New admin?{' '}
              <Link to="/admin-1/register"
                className="text-indigo-400 font-bold hover:text-indigo-300">
                Register here →
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Member?{' '}
          <Link to="/login" className="text-gray-500 hover:text-gray-400 underline">
            Use member portal
          </Link>
        </p>
      </div>
    </div>
  );
}