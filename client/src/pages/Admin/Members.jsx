// import { useState, useEffect } from 'react';
// import api from '../../api/axiosInstance';
// import Badge from '../../components/common/Badge';
// import Modal from '../../components/common/Modal';
// import toast from 'react-hot-toast';

// export default function Members() {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     name: '', email: '', password: '', department: '',
//   });

//   const fetchMembers = async () => {
//     try {
//       const { data } = await api.get('/users');
//       setMembers(data.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchMembers(); }, []);

//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleAddMember = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await api.post('/users', form);
//       toast.success(`${form.name} added to the team!`);
//       setShowModal(false);
//       setForm({ name: '', email: '', password: '', department: '' });
//       fetchMembers();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to add member');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleToggle = async (id, currentStatus, name) => {
//     try {
//       await api.patch(`/users/${id}/toggle`);
//       toast.success(`${name} marked as ${currentStatus ? 'inactive' : 'active'}`);
//       fetchMembers();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Toggle failed');
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
//     </div>
//   );

//   const active = members.filter((m) => m.isActive);
//   const inactive = members.filter((m) => !m.isActive);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">Team members</h1>
//           <p className="text-sm text-gray-400 mt-0.5">
//             {active.length} active · {inactive.length} on leave
//           </p>
//         </div>
//         <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
//           <i className="ti ti-user-plus" /> Add member
//         </button>
//       </div>

//       {/* Members table */}
//       <div className="card p-0 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-gray-100 bg-gray-50">
//               <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
//               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
//               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
//               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
//               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
//               <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {members.map((m) => (
//               <tr key={m._id} className={`hover:bg-gray-50 transition-colors ${!m.isActive ? 'opacity-60' : ''}`}>
//                 <td className="px-5 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 shrink-0">
//                       {m.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{m.name}</p>
//                       <p className="text-xs text-gray-400">{m.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500">{m.department || '—'}</td>
//                 <td className="px-4 py-4"><Badge label={m.role} /></td>
//                 <td className="px-4 py-4">
//                   <div className="flex items-center gap-2">
//                     <div className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <span className="text-sm text-gray-600">
//                       {m.isActive ? 'Active' : 'On leave'}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-400">
//                   {new Date(m.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-4 text-right">
//                   <button
//                     onClick={() => handleToggle(m._id, m.isActive, m.name)}
//                     className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium
//                       ${m.isActive
//                         ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
//                         : 'border-green-200 text-green-700 hover:bg-green-50'
//                       }`}
//                   >
//                     {m.isActive ? 'Mark on leave' : 'Reactivate'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add member modal */}
//       {showModal && (
//         <Modal title="Add team member" onClose={() => setShowModal(false)}>
//           <form onSubmit={handleAddMember} className="space-y-4">
//             {[
//               { name: 'name',       label: 'Full name',  type: 'text',     placeholder: 'Aarav Mehta' },
//               { name: 'email',      label: 'Email',      type: 'email',    placeholder: 'aarav@company.com' },
//               { name: 'password',   label: 'Password',   type: 'password', placeholder: 'Temporary password' },
//               { name: 'department', label: 'Department', type: 'text',     placeholder: 'e.g. Engineering' },
//             ].map(({ name, label, type, placeholder }) => (
//               <div key={name}>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
//                 <input
//                   name={name} type={type} value={form[name]}
//                   onChange={handleChange} className="input"
//                   placeholder={placeholder}
//                   required={name !== 'department'}
//                 />
//               </div>
//             ))}
//             <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
//               <i className="ti ti-info-circle mr-1" />
//               New members are always added with the <strong>Member</strong> role.
//             </p>
//             <div className="flex gap-3 pt-2">
//               <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
//               <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
//                 {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-user-plus" />}
//                 {saving ? 'Adding...' : 'Add member'}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }







import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function Members() {
  const [members,   setMembers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [tab,       setTab]       = useState('active'); // 'active' | 'leave'

  const [form, setForm] = useState({
    name: '', email: '', password: '', department: '',
  });

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => {
    setEditMember(null);
    setForm({ name: '', email: '', password: '', department: '' });
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditMember(m);
    setForm({ name: m.name, email: m.email, password: '', department: m.department || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMember) {
        await api.patch(`/users/${editMember._id}`, {
          name: form.name, email: form.email, department: form.department,
        });
        toast.success('Member updated!');
      } else {
        await api.post('/users', form);
        toast.success(`${form.name} added!`);
      }
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleToggle = async (m) => {
    try {
      await api.patch(`/users/${m._id}/toggle`);
      toast.success(`${m.name} marked as ${m.isActive ? 'on leave' : 'active'}`);
      fetchMembers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // Active members only shown in active tab
  // On-leave shown in separate tab
  const activeMembers = members.filter(m => m.isActive);
  const leaveMembers  = members.filter(m => !m.isActive);
  const displayed     = tab === 'active' ? activeMembers : leaveMembers;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-indigo-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Team members</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {activeMembers.length} active
            {leaveMembers.length > 0 && (
              <span className="ml-2 text-amber-500">
                · {leaveMembers.length} on leave
              </span>
            )}
          </p>
        </div>
        <button onClick={openAdd}
          className="btn-primary flex items-center gap-2">
          <i className="ti ti-user-plus" /> Add member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'active', label: `Active (${activeMembers.length})` },
          { key: 'leave',  label: `On leave (${leaveMembers.length})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all
              ${tab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Members grid */}
      {displayed.length === 0 ? (
        <div className="card text-center py-14">
          <i className="ti ti-users text-5xl text-gray-200" />
          <p className="text-gray-500 text-sm font-medium mt-3">
            {tab === 'active' ? 'No active members' : 'No members on leave'}
          </p>
          {tab === 'active' && (
            <button onClick={openAdd}
              className="btn-primary mt-4 inline-flex items-center gap-2">
              <i className="ti ti-user-plus" /> Add first member
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((m, i) => (
            <div key={m._id}
              className={`bg-white border rounded-2xl p-4 shadow-sm
                           hover:shadow-md transition-all duration-200 animate-fade-in
                           ${!m.isActive ? 'opacity-75 border-amber-100' : 'border-gray-100'}`}
              style={{ animationDelay: `${i * 0.05}s` }}>

              {/* Avatar + name */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400
                                  to-purple-500 flex items-center justify-center
                                  text-base font-bold text-white shadow-sm shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                <Badge label={m.role} />
              </div>

              {/* Department */}
              {m.department && (
                <div className="flex items-center gap-1.5 mb-3">
                  <i className="ti ti-building text-gray-400 text-xs" />
                  <span className="text-xs text-gray-500">{m.department}</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${m.isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span className="text-xs text-gray-500">
                  {m.isActive ? 'Active' : 'On leave'}
                </span>
                <span className="text-xs text-gray-300 ml-auto">
                  Joined {new Date(m.createdAt).toLocaleDateString('en-IN', {
                    month: 'short', year: 'numeric',
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(m)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs
                             font-medium text-gray-600 border border-gray-200 rounded-xl
                             py-2 hover:bg-gray-50 transition-colors">
                  <i className="ti ti-edit text-sm" /> Edit
                </button>
                <button onClick={() => handleToggle(m)}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs
                               font-medium rounded-xl py-2 border transition-colors
                               ${m.isActive
                                 ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                 : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                               }`}>
                  <i className="ti ti-refresh text-sm" />
                  {m.isActive ? 'Mark leave' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {showModal && (
        <Modal
          title={editMember ? `Edit — ${editMember.name}` : 'Add team member'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',       label: 'Full name *',  type: 'text',     ph: 'Riya Sharma' },
              { key: 'email',      label: 'Email *',      type: 'email',    ph: 'riya@ethera.ai' },
              { key: 'department', label: 'Department',   type: 'text',     ph: 'Engineering' },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input type={type} value={form[key]} placeholder={ph}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  required={key !== 'department'} className="input" />
              </div>
            ))}

            {!editMember && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Password *
                </label>
                <input type="password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required className="input"
                  placeholder="Min 8 chars, upper + number" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Saving...</>
                  : <><i className="ti ti-check" /> {editMember ? 'Save' : 'Add member'}</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}