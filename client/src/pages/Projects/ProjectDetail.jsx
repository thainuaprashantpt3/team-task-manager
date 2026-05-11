import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in-progress', 'review', 'done', 'blocked'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'critical'];

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]   = useState(null);
  const [tasks, setTasks]       = useState([]);
  const [members, setMembers]   = useState([]); // all team members for assignment
  const [loading, setLoading]   = useState(true);

  // Modals
  const [showEditProject, setShowEditProject] = useState(false);
  const [showAddTask, setShowAddTask]         = useState(false);
  const [showAddMember, setShowAddMember]     = useState(false);
  const [logModal, setLogModal]               = useState(null);
  const [saving, setSaving]                   = useState(false);

  // Forms
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', deadline: '', status: 'active',
  });
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', assignedTo: '',
    priority: 'medium', status: 'todo', dueDate: '',
  });
  const [logForm, setLogForm] = useState({
    reportText: '', hoursWorked: 0, statusUpdate: '',
  });
  const [memberToAdd, setMemberToAdd] = useState('');

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
      setProjectForm({
        title:       data.data.title,
        description: data.data.description || '',
        deadline:    data.data.deadline
          ? new Date(data.data.deadline).toISOString().split('T')[0]
          : '',
        status: data.data.status,
      });
    } catch {
      toast.error('Project not found');
      navigate('/projects');
    }
  };

  const fetchTasks = async () => {
    const { data } = await api.get(`/tasks?project=${id}`);
    setTasks(data.data);
  };

  const fetchMembers = async () => {
    if (!isAdmin) return;
    const { data } = await api.get('/users');
    setMembers(data.data.filter((m) => m.isActive && m.role === 'member'));
  };

  useEffect(() => {
    Promise.all([fetchProject(), fetchTasks(), fetchMembers()])
      .finally(() => setLoading(false));
  }, [id]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Edit project
  const handleEditProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/projects/${id}`, projectForm);
      toast.success('Project updated!');
      setShowEditProject(false);
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Add task (admin only)
  const handleAddTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      toast.success('Task added!');
      setShowAddTask(false);
      setTaskForm({
        title: '', description: '', assignedTo: '',
        priority: 'medium', status: 'todo', dueDate: '',
      });
      fetchTasks();
      fetchProject(); // refresh progress
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
    } finally {
      setSaving(false);
    }
  };

  // Add member to project (admin only)
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberToAdd) return;
    setSaving(true);
    try {
      const currentMembers = project.members.map((m) => m._id);
      if (currentMembers.includes(memberToAdd)) {
        toast.error('Member already in project');
        setSaving(false);
        return;
      }
      await api.patch(`/projects/${id}`, {
        members: [...currentMembers, memberToAdd],
      });
      toast.success('Member added to project!');
      setShowAddMember(false);
      setMemberToAdd('');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  // Remove member from project (admin only)
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      const updatedMembers = project.members
        .map((m) => m._id)
        .filter((mid) => mid !== memberId);
      await api.patch(`/projects/${id}`, { members: updatedMembers });
      toast.success('Member removed');
      fetchProject();
    } catch {
      toast.error('Failed to remove member');
    }
  };

  // Update task status inline
  const handleTaskStatusUpdate = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      toast.success('Status updated');
      fetchTasks();
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  // Delete task (admin)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchTasks();
      fetchProject();
    } catch {
      toast.error('Delete failed');
    }
  };

  // Submit daily log (member)
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

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return <Spinner className="h-64" />;
  if (!project) return null;

  const overdueTasks = tasks.filter((t) => t.isOverdue);
  const doneTasks    = tasks.filter((t) => t.status === 'done');

  return (
    <div className="p-6 space-y-6">

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link to="/projects" className="hover:text-brand-600 transition-colors">
          Projects
        </Link>
        <i className="ti ti-chevron-right text-xs" />
        <span className="text-gray-700 font-medium truncate">{project.title}</span>
      </div>

      {/* ── Project header ──────────────────────────────────── */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-xl font-semibold text-gray-900">{project.title}</h1>
              <Badge label={project.isOverdue ? 'overdue' : project.status} />
            </div>
            {project.description && (
              <p className="text-sm text-gray-500 mb-3">{project.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <i className="ti ti-user text-sm" />
                Owner: <span className="text-gray-600 font-medium ml-1">{project.owner?.name}</span>
              </span>
              {project.deadline && (
                <span className={`flex items-center gap-1 ${project.isOverdue ? 'text-red-500 font-medium' : ''}`}>
                  <i className="ti ti-calendar text-sm" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <i className="ti ti-checkbox text-sm" />
                {doneTasks.length}/{tasks.length} tasks done
              </span>
              {overdueTasks.length > 0 && (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <i className="ti ti-alert-triangle text-sm" />
                  {overdueTasks.length} overdue
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAddMember(true)}
                className="btn-secondary flex items-center gap-2 text-xs"
              >
                <i className="ti ti-user-plus text-sm" /> Add member
              </button>
              <button
                onClick={() => setShowEditProject(true)}
                className="btn-secondary flex items-center gap-2 text-xs"
              >
                <i className="ti ti-edit text-sm" /> Edit
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Overall progress</span>
            <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} showLabel={false} />
        </div>
      </div>

      {/* ── Main content grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tasks — takes 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              Tasks
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({tasks.length})
              </span>
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowAddTask(true)}
                className="btn-primary flex items-center gap-1.5 text-xs"
              >
                <i className="ti ti-plus text-sm" /> Add task
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="card text-center py-10">
              <i className="ti ti-checkbox text-4xl text-gray-200" />
              <p className="text-gray-400 mt-3 text-sm">No tasks yet</p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddTask(true)}
                  className="btn-primary mt-3 inline-flex items-center gap-2 text-xs"
                >
                  <i className="ti ti-plus" /> Add first task
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t._id}
                  className={`card flex flex-col sm:flex-row sm:items-center gap-3 py-3 px-4
                    ${t.isOverdue ? 'border-red-200 bg-red-50/20' : ''}`}
                >
                  {/* Task info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {t.isOverdue && (
                        <i className="ti ti-alert-circle text-red-400 text-xs shrink-0" />
                      )}
                      <p className={`text-sm font-medium truncate
                        ${t.isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                        {t.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <Badge label={t.priority} />
                      {t.assignedTo ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <div className="w-4 h-4 rounded-full bg-brand-100 flex items-center justify-center
                                          text-xs font-bold text-brand-700">
                            {t.assignedTo.name?.charAt(0)}
                          </div>
                          {t.assignedTo.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Unassigned</span>
                      )}
                      {t.dueDate && (
                        <span className={`text-xs flex items-center gap-0.5
                          ${t.isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                          <i className="ti ti-calendar text-xs" />
                          {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Admin: full select | Member assigned: select | else: badge */}
                    {isAdmin || t.assignedTo?._id === user._id ? (
                      <select
                        value={t.status}
                        onChange={(e) => handleTaskStatusUpdate(t._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white
                                   focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge label={t.status} />
                    )}

                    {/* Member: daily log button */}
                    {!isAdmin && t.assignedTo?._id === user._id && (
                      <button
                        onClick={() => setLogModal(t)}
                        title="Submit daily log"
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50
                                   rounded-lg transition-colors border border-gray-200"
                      >
                        <i className="ti ti-notes text-sm" />
                      </button>
                    )}

                    {/* Admin: delete */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteTask(t._id)}
                        title="Delete task"
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50
                                   rounded-lg transition-colors"
                      >
                        <i className="ti ti-trash text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — 1/3 width: members + stats */}
        <div className="space-y-4">

          {/* Task status breakdown */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Task breakdown</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => {
                const count = tasks.filter((t) => t.status === s).length;
                const pct   = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <Badge label={s} />
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Members */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Members
                <span className="ml-1 text-xs font-normal text-gray-400">
                  ({project.members?.length || 0})
                </span>
              </h3>
            </div>

            {project.members?.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">No members assigned yet</p>
            ) : (
              <div className="space-y-2.5">
                {project.members?.map((m) => (
                  <div key={m._id} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center
                                    justify-center text-xs font-semibold text-brand-700 shrink-0">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                    {isAdmin && m._id !== project.owner?._id && (
                      <button
                        onClick={() => handleRemoveMember(m._id)}
                        title="Remove from project"
                        className="p-1 text-gray-300 hover:text-red-400 rounded transition-colors shrink-0"
                      >
                        <i className="ti ti-x text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Project info</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-gray-400">Status</dt>
                <dd><Badge label={project.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Progress</dt>
                <dd className="font-medium text-gray-700">{project.progress}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Total tasks</dt>
                <dd className="font-medium text-gray-700">{tasks.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Completed</dt>
                <dd className="font-medium text-green-600">{doneTasks.length}</dd>
              </div>
              {overdueTasks.length > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-400">Overdue</dt>
                  <dd className="font-medium text-red-500">{overdueTasks.length}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Created</dt>
                <dd className="text-gray-600">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ── MODALS ──────────────────────────────────────────── */}

      {/* Edit project */}
      {showEditProject && (
        <Modal title="Edit project" onClose={() => setShowEditProject(false)}>
          <form onSubmit={handleEditProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input
                value={projectForm.title}
                onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                rows={3} className="input resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm((f) => ({ ...f, status: e.target.value }))}
                  className="input"
                >
                  {['planning', 'active', 'on-hold', 'completed'].map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Deadline</label>
                <input
                  type="date"
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm((f) => ({ ...f, deadline: e.target.value }))}
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowEditProject(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-check" />}
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add task */}
      {showAddTask && (
        <Modal title="Add task to project" onClose={() => setShowAddTask(false)}>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input
                value={taskForm.title}
                onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="Task title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm((f) => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none" placeholder="Task details..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Assign to</label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm((f) => ({ ...f, assignedTo: e.target.value }))}
                  className="input"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm((f) => ({ ...f, priority: e.target.value }))}
                  className="input"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Due date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddTask(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-plus" />}
                {saving ? 'Adding...' : 'Add task'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add member */}
      {showAddMember && (
        <Modal title="Add member to project" onClose={() => setShowAddMember(false)}>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Select team member
              </label>
              <select
                value={memberToAdd}
                onChange={(e) => setMemberToAdd(e.target.value)}
                required className="input"
              >
                <option value="">Choose a member...</option>
                {members
                  .filter((m) => !project.members?.some((pm) => pm._id === m._id))
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} — {m.department || m.email}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddMember(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving || !memberToAdd} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-user-plus" />}
                {saving ? 'Adding...' : 'Add to project'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Daily log (member) */}
      {logModal && (
        <Modal
          title={`Daily log — ${logModal.title}`}
          onClose={() => {
            setLogModal(null);
            setLogForm({ reportText: '', hoursWorked: 0, statusUpdate: '' });
          }}
        >
          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <i className="ti ti-folder text-gray-400 text-sm" />
              <span className="text-xs text-gray-500">{project.title}</span>
              <span className="text-gray-300">·</span>
              <Badge label={logModal.status} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                What did you work on today? *
              </label>
              <textarea
                value={logForm.reportText}
                onChange={(e) => setLogForm((f) => ({ ...f, reportText: e.target.value }))}
                required rows={4} className="input resize-none"
                placeholder="Describe your progress, blockers, what you completed..."
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
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setLogModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
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