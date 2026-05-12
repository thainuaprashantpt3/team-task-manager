// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../../api/axiosInstance';
// import toast from 'react-hot-toast';

// export default function Signup() {
//   const [form, setForm] = useState({
//     name: '', email: '', password: '', department: '', role: 'member',
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post('/auth/register', form);
//       toast.success('Account created! Please log in.');
//       navigate('/login');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-brand-900">TaskFlow</h1>
//           <p className="text-sm text-gray-500 mt-1">Create your account</p>
//         </div>

//         <div className="card">
//           <h2 className="text-base font-semibold text-gray-900 mb-5">Register</h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {[
//               { name: 'name',       label: 'Full name',   type: 'text',     placeholder: 'Riya Sharma' },
//               { name: 'email',      label: 'Email',       type: 'email',    placeholder: 'you@company.com' },
//               { name: 'password',   label: 'Password',    type: 'password', placeholder: 'Min 8 chars, upper + number' },
//               { name: 'department', label: 'Department',  type: 'text',     placeholder: 'Engineering (optional)' },
//             ].map(({ name, label, type, placeholder }) => (
//               <div key={name}>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
//                 <input
//                   name={name}
//                   type={type}
//                   value={form[name]}
//                   onChange={handleChange}
//                   className="input"
//                   placeholder={placeholder}
//                   required={name !== 'department'}
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1.5">Role</label>
//               <select name="role" value={form.role} onChange={handleChange} className="input">
//                 <option value="member">Member</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary w-full justify-center flex items-center gap-2 mt-2"
//             >
//               {loading
//                 ? <><i className="ti ti-loader-2 animate-spin" /> Creating account...</>
//                 : <><i className="ti ti-user-plus" /> Create account</>
//               }
//             </button>
//           </form>

//           <p className="text-center text-xs text-gray-500 mt-4">
//             Already registered?{' '}
//             <Link to="/login" className="text-brand-600 font-medium hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }








import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Signup() {
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
      await api.post('/auth/register', { ...form, role: 'member' });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">TaskFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name',       label: 'Full name',  type: 'text',     placeholder: 'Riya Sharma' },
              { name: 'email',      label: 'Email',      type: 'email',    placeholder: 'you@company.com' },
              { name: 'password',   label: 'Password',   type: 'password', placeholder: 'Min 8 chars, upper + number' },
              { name: 'department', label: 'Department', type: 'text',     placeholder: 'Engineering (optional)' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  className="input"
                  placeholder={placeholder}
                  required={name !== 'department'}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                : <><i className="ti ti-user-plus" /> Create account</>
              }
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}