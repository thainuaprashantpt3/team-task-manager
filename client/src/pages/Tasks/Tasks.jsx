import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'review', 'done', 'blocked'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

export default function Tasks() {
  const { isAdmin, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [logModal, setLogModal] = useState(null); // task object for daily log
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', project: '', assignedTo: '',
    priority: 'medium', status: 'todo', dueDate: '',
  });
  const [logForm, setLogForm] = useState({
    reportText: '', hoursWorked: 0, statusUpdate: '',
  });

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    api.get('/projects').then(({ data }) => setProjects(data.data));
    if (isAdmin) api.get('/users').then(({ data }) => setMembers(data.data));
  }, [isAdmin]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created and assigned!');
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/tasks/${logModal._id}/logs`, logForm);
      toast.success('Daily log submitted!');
      setLogModal(null);
      setLogForm({ reportText: '', hoursWorked: 0, statusUpdate: '' });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Log submission failed');
    } finally {
      setSaving(false);
    }
  };

  const filtered = statusFilter === 'all'
    ? tasks
    : statusFilter === 'overdue'
      ? tasks.filter((t) => t.isOverdue)
      : tasks.filter((t) => t.status === statusFilter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {isAdmin ? 'All tasks' : 'My tasks'}
        </h1>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <i className="ti ti-plus" /> Assign task
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_OPTIONS, 'overdue'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
              ${statusFilter === s
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
          >
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <i className="ti ti-checkbox text-4xl text-gray-200" />
            <p className="text-gray-400 mt-3 text-sm">No tasks found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((t) => (
                <tr key={t._id} className={`hover:bg-gray-50 transition-colors ${t.isOverdue ? 'bg-red-50/40' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {t.isOverdue && (
                        <i className="ti ti-alert-circle text-red-400 text-sm shrink-0" title="Overdue" />
                      )}
                      <span className="font-medium text-gray-900">{t.title}</span>
                    </div>
                    {t.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{t.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {t.project?.title || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {t.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                          {t.assignedTo.name.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600">{t.assignedTo.name}</span>
                      </div>
                    ) : <span className="text-xs text-gray-300">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3.5"><Badge label={t.priority} /></td>
                  <td className="px-4 py-3.5">
                    {/* Member can change status inline */}
                    {!isAdmin && t.assignedTo?._id === user._id ? (
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusUpdate(t._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge label={t.status} />
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      {/* Member: submit daily log */}
                      {!isAdmin && t.assignedTo?._id === user._id && (
                        <button
                          onClick={() => setLogModal(t)}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Submit daily log"
                        >
                          <i className="ti ti-notes text-sm" />
                        </button>
                      )}
                      {/* Admin: delete */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete task"
                        >
                          <i className="ti ti-trash text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create task modal (admin) */}
      {showModal && (
        <Modal title="Assign new task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                required className="input" placeholder="Task title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} className="input resize-none" placeholder="Task details..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Project *</label>
                <select name="project" value={form.project} onChange={handleChange}
                  required className="input">
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Assign to</label>
                <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input">
                  <option value="">Unassigned</option>
                  {members.filter((m) => m.isActive && m.role === 'member').map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="input">
                  {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Due date</label>
                <input type="date" name="dueDate" value={form.dueDate}
                  onChange={handleChange} className="input" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-send" />}
                {saving ? 'Assigning...' : 'Assign task'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Daily log modal (member) */}
      {logModal && (
        <Modal title={`Daily log — ${logModal.title}`} onClose={() => setLogModal(null)}>
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">What did you work on? *</label>
              <textarea
                value={logForm.reportText}
                onChange={(e) => setLogForm((f) => ({ ...f, reportText: e.target.value }))}
                required rows={4} className="input resize-none"
                placeholder="Describe your progress today..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Hours worked</label>
                <input
                  type="number" min={0} max={24} step={0.5}
                  value={logForm.hoursWorked}
                  onChange={(e) => setLogForm((f) => ({ ...f, hoursWorked: Number(e.target.value) }))}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Update status</label>
                <select
                  value={logForm.statusUpdate}
                  onChange={(e) => setLogForm((f) => ({ ...f, statusUpdate: e.target.value }))}
                  className="input"
                >
                  <option value="">No change</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setLogModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-notes" />}
                {saving ? 'Submitting...' : 'Submit log'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}