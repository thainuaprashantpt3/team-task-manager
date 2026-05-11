import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'review', 'done', 'blocked'];

export default function MyTasks() {
useAuth();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [logModal, setLogModal] = useState(null);
  const [logForm, setLogForm]   = useState({
    reportText: '', hoursWorked: 0, statusUpdate: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
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
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    filter === 'all'     ? tasks :
    filter === 'overdue' ? tasks.filter((t) => t.isOverdue) :
                           tasks.filter((t) => t.status === filter);

  // Summary counts
  const done     = tasks.filter((t) => t.status === 'done').length;
  const overdue  = tasks.filter((t) => t.isOverdue).length;
  const inProg   = tasks.filter((t) => t.status === 'in-progress').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My tasks</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {tasks.length} total · {done} done · {inProg} in progress
          {overdue > 0 && (
            <span className="text-red-500 ml-1">· {overdue} overdue</span>
          )}
        </p>
      </div>

      {/* Overdue alert banner */}
      {overdue > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <i className="ti ti-alert-triangle text-red-500 text-lg shrink-0" />
          <p className="text-sm text-red-700">
            You have <strong>{overdue}</strong> overdue task{overdue > 1 ? 's' : ''}.
            Please update your progress or contact your admin.
          </p>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_OPTIONS, 'overdue'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${filter === s
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
          >
            {s === 'all' ? 'All' : s.replace('-', ' ')}
            {s === 'overdue' && overdue > 0 && (
              <span className="ml-1 bg-red-100 text-red-600 rounded-full px-1.5 py-0.5 text-xs">
                {overdue}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task cards — card layout better than table for member view */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <i className="ti ti-checkbox text-5xl text-gray-200" />
          <p className="text-gray-400 mt-3 text-sm">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t._id}
              className={`card flex flex-col sm:flex-row sm:items-center gap-4
                ${t.isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}
            >
              {/* Left: task info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {t.isOverdue && (
                    <i className="ti ti-alert-circle text-red-400 text-sm shrink-0" />
                  )}
                  <h3 className={`text-sm font-semibold truncate
                    ${t.isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                    {t.title}
                  </h3>
                </div>

                {t.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{t.description}</p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <i className="ti ti-folder text-sm" />
                    {t.project?.title || '—'}
                  </span>
                  {t.dueDate && (
                    <span className={`text-xs flex items-center gap-1
                      ${t.isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                      <i className="ti ti-calendar text-sm" />
                      {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <Badge label={t.priority} />
                </div>
              </div>

              {/* Right: status select + log button */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Inline status update */}
                <select
                  value={t.status}
                  onChange={(e) => handleStatusUpdate(t._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white
                             focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>

                {/* Daily log button */}
                <button
                  onClick={() => setLogModal(t)}
                  title="Submit daily log"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                             border border-brand-200 text-brand-600 rounded-lg
                             hover:bg-brand-50 transition-colors"
                >
                  <i className="ti ti-notes text-sm" />
                  Log
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily log modal */}
      {logModal && (
        <Modal
          title={`Daily log — ${logModal.title}`}
          onClose={() => {
            setLogModal(null);
            setLogForm({ reportText: '', hoursWorked: 0, statusUpdate: '' });
          }}
        >
          <form onSubmit={handleLogSubmit} className="space-y-4">

            {/* Task info chip */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <i className="ti ti-folder text-gray-400 text-sm" />
              <span className="text-xs text-gray-500">{logModal.project?.title || 'Project'}</span>
              <span className="text-gray-300">·</span>
              <Badge label={logModal.status} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                What did you work on today? *
              </label>
              <textarea
                value={logForm.reportText}
                onChange={(e) =>
                  setLogForm((f) => ({ ...f, reportText: e.target.value }))
                }
                required
                rows={4}
                className="input resize-none"
                placeholder="Describe progress, blockers, or what you completed..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Hours worked today
                </label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={logForm.hoursWorked}
                  onChange={(e) =>
                    setLogForm((f) => ({ ...f, hoursWorked: Number(e.target.value) }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Update task status
                </label>
                <select
                  value={logForm.statusUpdate}
                  onChange={(e) =>
                    setLogForm((f) => ({ ...f, statusUpdate: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">Keep current</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <i className="ti ti-info-circle mr-1 text-amber-500" />
              One log per task per day. Submitting again today will show a duplicate error.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setLogModal(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Submitting...</>
                  : <><i className="ti ti-send" /> Submit log</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}