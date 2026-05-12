import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminSignup() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { ...form, role: 'admin' });
      toast.success('Admin account created! Please log in.');
      navigate('/admin-1');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <p className="text-sm text-gray-400 mt-1">Admin registration</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
          <h2 className="text-base font-semibold text-white mb-1">Create admin account</h2>
          <p className="text-xs text-gray-500 mb-5">Restricted — do not share this URL</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name',       label: 'Full name',  type: 'text',     placeholder: 'Admin Name' },
              { name: 'email',      label: 'Email',      type: 'email',    placeholder: 'admin@company.com' },
              { name: 'password',   label: 'Password',   type: 'password', placeholder: 'Min 8 chars, upper + number' },
              { name: 'department', label: 'Department', type: 'text',     placeholder: 'Management (optional)' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== 'department'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2
                             text-sm text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-transparent transition"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg
                         text-sm font-medium flex items-center justify-center gap-2
                         transition-colors disabled:opacity-50 mt-2"
            >
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                : <><i className="ti ti-user-shield" /> Create admin account</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            Already registered?{' '}
            <Link to="/admin-1"
              className="text-blue-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}