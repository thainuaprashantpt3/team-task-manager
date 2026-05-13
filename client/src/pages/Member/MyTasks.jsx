import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ProgressBar from '../../components/common/ProgressBar';
import TaskLogs from '../../components/common/TaskLogs';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'review', 'done', 'blocked'];

export default function MyTasks() {
  const { user } = useAuth();
  const [tasks,    setTasks]    = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [expandedLogs, setExpandedLogs] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', project: '',
    priority: 'medium', dueDate: '',
  });
  const [logState, setLogState] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);
      setTasks(tRes.data.data);
      setProjects(pRes.data.data);

      const init = {};
      tRes.data.data.forEach(t => {
        init[t._id] = { status: t.status, progress: t.progress || 0, notes: '' };
      });
      setLogState(init);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/tasks', form);
      toast.success('Task created!');
      setShowModal(false);
      setForm({ title: '', description: '', project: '', priority: 'medium', dueDate: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally { setSaving(false); }
  };

  const handleLogWork = async (taskId) => {
    const ls = logState[taskId];
    if (!ls) return;
    try {
      await api.patch(`/tasks/${taskId}`, {
        status:   ls.status,
        progress: ls.progress,
        notes:    ls.notes,
      });
      toast.success('Work logged!');
      setLogState(prev => ({ ...prev, [taskId]: { ...prev[taskId], notes: '' } }));
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const filtered =
    filter === 'all'     ? tasks :
    filter === 'overdue' ? tasks.filter(t => t.isOverdue) :
                           tasks.filter(t => t.status === filter);

  const overdue = tasks.filter(t => t.isOverdue);
  const done    = tasks.filter(t => t.status === 'done');

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-indigo-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {tasks.length} total · {done.length} done
            {overdue.length > 0 && (
              <span className="text-red-500 ml-2 font-medium">
                · {overdue.length} overdue
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2">
          <i className="ti ti-plus" /> Add task
        </button>
      </div>

      {/* Overdue banner */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100
                        rounded-2xl px-4 py-3 animate-fade-in">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <i className="ti ti-alert-triangle text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700">
              {overdue.length} overdue task{overdue.length > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-500">
              Please update your progress and log your work
            </p>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_OPTIONS, 'overdue'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
              ${filter === s
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}>
            {s === 'all' ? 'All tasks' : s.replace('-', ' ')}
            {s === 'overdue' && overdue.length > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                {overdue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center
                          justify-center mx-auto mb-3">
            <i className="ti ti-checkbox text-3xl text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No tasks found</p>
          <button onClick={() => setShowModal(true)}
            className="btn-primary mt-4 inline-flex items-center gap-2">
            <i className="ti ti-plus" /> Create your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, i) => {
            const ls       = logState[t._id] || { status: t.status, progress: t.progress || 0, notes: '' };
            const isLogOpen = expandedLogs === t._id;

            return (
              <div key={t._id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm
                             animate-fade-in hover:shadow-md transition-all duration-200
                             ${t.isOverdue ? 'border-red-200' : 'border-gray-100'}`}
                style={{ animationDelay: `${i * 0.04}s` }}>

                <div className={`p-4 ${t.isOverdue ? 'bg-red-50/30' : ''}`}>
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {t.isOverdue && (
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center
                                          justify-center shrink-0">
                            <i className="ti ti-alert-circle text-red-500 text-xs" />
                          </div>
                        )}
                        <p className={`text-sm font-semibold truncate
                          ${t.isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                          {t.title}
                        </p>
                      </div>
                      {t.description && (
                        <p className="text-xs text-gray-400 line-clamp-1 mb-1.5">
                          {t.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge label={t.priority} />
                        {t.project?.title && (
                          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5
                                           rounded-full font-medium">
                            {t.project.title}
                          </span>
                        )}
                        {t.dueDate && (
                          <span className={`text-xs flex items-center gap-1
                            ${t.isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                            <i className="ti ti-calendar text-xs" />
                            {new Date(t.dueDate).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge label={t.status} />
                  </div>

                  {/* Progress */}
                  <ProgressBar value={ls.progress} size="md" overdue={t.isOverdue} className="mb-3" />

                  {/* Log work inline */}
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <i className="ti ti-edit text-indigo-500" />
                      Log today's work
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <select value={ls.status}
                        onChange={e => setLogState(prev => ({
                          ...prev, [t._id]: { ...prev[t._id], status: e.target.value },
                        }))}
                        className="text-xs border border-gray-200 rounded-xl px-2.5 py-2
                                   bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>

                      <div className="flex items-center gap-2 bg-white border border-gray-200
                                      rounded-xl px-2.5 py-2">
                        <input type="range" min={0} max={100} step={5}
                          value={ls.progress}
                          onChange={e => setLogState(prev => ({
                            ...prev, [t._id]: { ...prev[t._id], progress: Number(e.target.value) },
                          }))}
                          className="flex-1 h-1 accent-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 w-8 text-right shrink-0">
                          {ls.progress}%
                        </span>
                      </div>
                    </div>

                    <textarea value={ls.notes}
                      onChange={e => setLogState(prev => ({
                        ...prev, [t._id]: { ...prev[t._id], notes: e.target.value },
                      }))}
                      rows={2} placeholder="What did you work on today? Any blockers?"
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2
                                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400
                                 resize-none placeholder-gray-400" />

                    <button onClick={() => handleLogWork(t._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs
                                 font-medium py-2 rounded-xl flex items-center justify-center
                                 gap-2 transition-colors">
                      <i className="ti ti-send text-sm" /> Submit today's log
                    </button>
                  </div>

                  {/* View logs */}
                  {(t.logs || []).length > 0 && (
                    <button onClick={() => setExpandedLogs(isLogOpen ? null : t._id)}
                      className="mt-2.5 flex items-center gap-1.5 text-xs text-indigo-600
                                 hover:text-indigo-700 font-medium">
                      <i className={`ti ti-chevron-${isLogOpen ? 'up' : 'down'} text-sm`} />
                      {isLogOpen ? 'Hide logs' : `View ${t.logs.length} log${t.logs.length > 1 ? 's' : ''}`}
                    </button>
                  )}
                </div>

                {isLogOpen && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <TaskLogs logs={t.logs || []} isAdmin={false} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create task modal */}
      {showModal && (
        <Modal title="Create new task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Task title *
              </label>
              <input value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="What needs to be done?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Description
              </label>
              <textarea value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none"
                placeholder="Task details..." />
            </div>

            {/* Project selector — only assigned projects */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Project *
              </label>
              <select value={form.project}
                onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                required className="input">
                <option value="">Select your project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
              {projects.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  You are not assigned to any projects yet.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Priority
                </label>
                <select value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="input">
                  {['low','medium','high','critical'].map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Due date
                </label>
                <input type="date" value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="input"
                  min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5">
              <p className="text-xs text-indigo-700 flex items-center gap-1.5">
                <i className="ti ti-info-circle" />
                Task will be assigned to you and visible to your admin.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                  : <><i className="ti ti-plus" /> Create task</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}