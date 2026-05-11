import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: '',
  });

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users', form);
      toast.success(`${form.name} added to the team!`);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', department: '' });
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id, currentStatus, name) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      toast.success(`${name} marked as ${currentStatus ? 'inactive' : 'active'}`);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
    </div>
  );

  const active = members.filter((m) => m.isActive);
  const inactive = members.filter((m) => !m.isActive);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team members</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {active.length} active · {inactive.length} on leave
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <i className="ti ti-user-plus" /> Add member
        </button>
      </div>

      {/* Members table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((m) => (
              <tr key={m._id} className={`hover:bg-gray-50 transition-colors ${!m.isActive ? 'opacity-60' : ''}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{m.department || '—'}</td>
                <td className="px-4 py-4"><Badge label={m.role} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-600">
                      {m.isActive ? 'Active' : 'On leave'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-400">
                  {new Date(m.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleToggle(m._id, m.isActive, m.name)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium
                      ${m.isActive
                        ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                      }`}
                  >
                    {m.isActive ? 'Mark on leave' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add member modal */}
      {showModal && (
        <Modal title="Add team member" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddMember} className="space-y-4">
            {[
              { name: 'name',       label: 'Full name',  type: 'text',     placeholder: 'Aarav Mehta' },
              { name: 'email',      label: 'Email',      type: 'email',    placeholder: 'aarav@company.com' },
              { name: 'password',   label: 'Password',   type: 'password', placeholder: 'Temporary password' },
              { name: 'department', label: 'Department', type: 'text',     placeholder: 'e.g. Engineering' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input
                  name={name} type={type} value={form[name]}
                  onChange={handleChange} className="input"
                  placeholder={placeholder}
                  required={name !== 'department'}
                />
              </div>
            ))}
            <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
              <i className="ti ti-info-circle mr-1" />
              New members are always added with the <strong>Member</strong> role.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-user-plus" />}
                {saving ? 'Adding...' : 'Add member'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}