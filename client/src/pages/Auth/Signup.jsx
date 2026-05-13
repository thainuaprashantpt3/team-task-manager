import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm]       = useState({
    name: '', email: '', password: '', department: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { ...form, role: 'member' });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30
                    flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center
                          mx-auto mb-4 shadow-lg shadow-indigo-200 animate-float">
            <i className="ti ti-brain text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Join Ethera AI
          </h1>
          <p className="text-gray-500 mt-2">
            Create your member account to get started.
          </p>
        </div>

        <div className="card shadow-lg border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',       label: 'Full name',  type: 'text',
                icon: 'user',     ph: 'Riya Sharma',          required: true },
              { key: 'email',      label: 'Work email', type: 'email',
                icon: 'mail',     ph: 'you@company.com',       required: true },
              { key: 'password',   label: 'Password',   type: 'password',
                icon: 'lock',     ph: 'Min 8 chars, upper + number', required: true },
              { key: 'department', label: 'Department', type: 'text',
                icon: 'building', ph: 'e.g. Engineering',      required: false },
            ].map(({ key, label, type, icon, ph, required }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <i className={`ti ti-${icon} absolute left-3.5 top-1/2 -translate-y-1/2
                                text-gray-400 text-base`} />
                  <input type={type} value={form[key]} placeholder={ph}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required} className="input pl-10" />
                </div>
              </div>
            ))}

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs text-indigo-700 flex items-start gap-2">
                <i className="ti ti-shield-check shrink-0 mt-0.5" />
                Your data is encrypted and never shared. Ethera AI is SOC2 compliant.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2">
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Creating account...</>
                : <><i className="ti ti-user-plus" /> Create account</>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login"
                className="text-indigo-600 font-bold hover:text-indigo-700">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}