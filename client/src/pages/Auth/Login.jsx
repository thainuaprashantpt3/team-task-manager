import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: 'brain',         text: 'AI-powered task insights' },
  { icon: 'chart-bar',     text: 'Real-time progress analytics' },
  { icon: 'users',         text: 'Seamless team collaboration' },
  { icon: 'shield-check',  text: 'Enterprise-grade security' },
];

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.data.role === 'admin') {
        toast.error('Please use the admin portal.');
        return;
      }
      login(data.data);
      toast.success(`Welcome back, ${data.data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col
                      justify-between p-10 xl:p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500
                          rounded-full opacity-40" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600
                          rounded-full opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] bg-indigo-700 rounded-full opacity-20" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl
                            flex items-center justify-center border border-white/30">
              <i className="ti ti-brain text-white text-2xl" />
            </div>
            <div>
              <p className="font-extrabold text-white text-xl tracking-tight">
                Ethera AI
              </p>
              <p className="text-indigo-200 text-xs font-medium">Task Management</p>
            </div>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white
                         leading-tight tracking-tight mb-6">
            Work smarter,<br />
            <span className="text-indigo-200">not harder.</span>
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
            Ethera AI helps your team track projects, assign tasks,
            and hit deadlines — all in one intelligent workspace.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {FEATURES.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center
                              justify-center border border-white/20 shrink-0">
                <i className={`ti ti-${icon} text-white text-sm`} />
              </div>
              <span className="text-indigo-100 text-sm font-medium">{text}</span>
            </div>
          ))}
          <p className="text-indigo-300 text-xs mt-6 pt-4 border-t border-white/10">
            © 2025 Ethera AI · Trusted by 500+ teams worldwide
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center
                      bg-gradient-to-br from-slate-50 to-indigo-50/30
                      px-6 py-12 lg:py-0">
        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center
                            justify-center shadow-md shadow-indigo-200">
              <i className="ti ti-brain text-white text-xl" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900">Ethera AI</p>
              <p className="text-xs text-indigo-500 font-medium">Task Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to your member account to continue.
            </p>
          </div>

          <div className="card shadow-lg shadow-gray-100/80 border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">
                  Email address
                </label>
                <div className="relative">
                  <i className="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2
                                text-gray-400 text-base" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                    className="input pl-10"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <i className="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2
                                text-gray-400 text-base" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2">
                {loading
                  ? <><i className="ti ti-loader-2 animate-spin" /> Signing in...</>
                  : <><i className="ti ti-login" /> Sign in</>
                }
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                New to Ethera AI?{' '}
                <Link to="/register"
                  className="text-indigo-600 font-bold hover:text-indigo-700">
                  Create account →
                </Link>
              </p>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-100
                          rounded-xl flex items-start gap-2.5">
            <i className="ti ti-info-circle text-amber-600 text-sm mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-bold">Demo:</span> Use your registered member
              credentials. Admins use the separate admin portal at <code>/admin-1</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}