// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../api/axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import StatCard from '../../components/common/StatCard';
// import Badge from '../../components/common/Badge';

// export default function MemberDashboard() {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([api.get('/tasks'), api.get('/projects')])
//       .then(([tRes, pRes]) => {
//         setTasks(tRes.data.data);
//         setProjects(pRes.data.data);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const overdue  = tasks.filter((t) => t.isOverdue);
//   const inProg   = tasks.filter((t) => t.status === 'in-progress');
//   const done     = tasks.filter((t) => t.status === 'done');

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold text-gray-900">
//           Welcome, {user?.name?.split(' ')[0]}
//         </h1>
//         <p className="text-sm text-gray-400 mt-0.5">
//           {overdue.length > 0
//             ? `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`
//             : 'You are all caught up'}
//         </p>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard label="My tasks"     value={tasks.length}    icon="checkbox" />
//         <StatCard label="In progress"  value={inProg.length}   icon="loader-2" subColor="text-blue-500" />
//         <StatCard label="Completed"    value={done.length}     icon="circle-check" subColor="text-green-600" />
//         <StatCard
//           label="Overdue"
//           value={overdue.length}
//           icon="alert-triangle"
//           subColor={overdue.length > 0 ? 'text-red-500' : 'text-green-600'}
//           sub={overdue.length > 0 ? 'Needs attention' : 'None overdue'}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* My active tasks */}
//         <div className="card">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-800">My active tasks</h2>
//             <Link to="/tasks" className="text-xs text-brand-600 hover:underline">View all</Link>
//           </div>
//           <div className="space-y-3">
//             {tasks.filter((t) => t.status !== 'done').slice(0, 6).map((t) => (
//               <div key={t._id} className="flex items-center justify-between gap-4">
//                 <div className="min-w-0">
//                   <p className={`text-sm font-medium truncate ${t.isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
//                     {t.isOverdue && <i className="ti ti-alert-circle mr-1 text-xs" />}
//                     {t.title}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-0.5">{t.project?.title}</p>
//                 </div>
//                 <div className="flex items-center gap-2 shrink-0">
//                   <Badge label={t.priority} />
//                   <Badge label={t.status} />
//                 </div>
//               </div>
//             ))}
//             {tasks.filter((t) => t.status !== 'done').length === 0 && (
//               <p className="text-sm text-gray-400 text-center py-4">No active tasks</p>
//             )}
//           </div>
//         </div>

//         {/* My projects */}
//         <div className="card">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-800">My projects</h2>
//             <Link to="/projects" className="text-xs text-brand-600 hover:underline">View all</Link>
//           </div>
//           <div className="space-y-3">
//             {projects.slice(0, 5).map((p) => (
//               <div key={p._id} className="flex items-center justify-between gap-4">
//                 <Link
//                   to={`/projects/${p._id}`}
//                   className="text-sm font-medium text-gray-800 hover:text-brand-600 truncate"
//                 >
//                   {p.title}
//                 </Link>
//                 <Badge label={p.status} />
//               </div>
//             ))}
//             {projects.length === 0 && (
//               <p className="text-sm text-gray-400 text-center py-4">Not in any projects yet</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import TaskLogs from '../../components/common/TaskLogs';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo','in-progress','review','done','blocked'];

export default function MemberDashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  // UI state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [expandedProject,  setExpandedProject]  = useState(null);
  const [expandedLogs,     setExpandedLogs]     = useState(null);
  const [saving,           setSaving]           = useState(false);
  const [logState,         setLogState]         = useState({}); // taskId → {status,progress,notes}

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', deadline: '', status: 'planning',
  });

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
      ]);
      setProjects(pRes.data.data);
      setTasks(tRes.data.data);

      // Init log state for each task
      const init = {};
      tRes.data.data.forEach(t => {
        init[t._id] = {
          status:   t.status,
          progress: t.progress || 0,
          notes:    '',
        };
      });
      setLogState(init);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Create project (member's own project) ─────────────────────────
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/projects', projectForm);
      toast.success('Project created! Admin will assign members.');
      setShowProjectModal(false);
      setProjectForm({ title: '', description: '', deadline: '', status: 'planning' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  // ── Log daily work on a task ───────────────────────────────────────
  const handleLogWork = async (taskId) => {
    const ls = logState[taskId];
    if (!ls) return;
    setSaving(true);
    try {
      await api.patch(`/tasks/${taskId}`, {
        status:   ls.status,
        progress: ls.progress,
        notes:    ls.notes,
      });
      toast.success('Work logged successfully!');
      setLogState(prev => ({ ...prev, [taskId]: { ...prev[taskId], notes: '' } }));
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log');
    } finally { setSaving(false); }
  };

  // ── Derived ────────────────────────────────────────────────────────
  const activeTasks  = tasks.filter(t => t.status !== 'done');
  const doneTasks    = tasks.filter(t => t.status === 'done');
  const overdueTasks = tasks.filter(t => t.isOverdue);
  const inProgTasks  = tasks.filter(t => t.status === 'in-progress');

  // Group tasks by project for project view
  const tasksByProject = tasks.reduce((acc, t) => {
    const pid = t.project?._id || t.project;
    if (!pid) return acc;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(t);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-blue-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            My workspace — {user?.name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {overdueTasks.length > 0
              ? `⚠ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} — log your progress`
              : 'All caught up — keep up the good work!'}
          </p>
        </div>
        <button onClick={() => setShowProjectModal(true)}
          className="btn-primary flex items-center gap-2 text-sm">
          <i className="ti ti-folder-plus" /> Create project
        </button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Assigned tasks"  value={tasks.length}  icon="checkbox" />
        <StatCard label="In progress"     value={inProgTasks.length}
          icon="loader-2" subColor="text-blue-500" />
        <StatCard label="Completed"       value={doneTasks.length}
          icon="circle-check" subColor="text-green-600" />
        <StatCard label="Overdue"         value={overdueTasks.length}
          sub={overdueTasks.length > 0 ? 'Update your logs' : 'All on time'}
          subColor={overdueTasks.length > 0 ? 'text-red-500' : 'text-green-600'}
          icon="alert-triangle" />
      </div>

      {/* ── Projects + Tasks view ────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">
          My projects & tasks
        </h2>

        {projects.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
            <i className="ti ti-folder-off text-5xl text-gray-200" />
            <p className="text-gray-500 text-sm font-medium mt-3">
              Not assigned to any projects yet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Your admin will assign you to projects, or you can create your own
            </p>
            <button onClick={() => setShowProjectModal(true)}
              className="btn-primary mt-4 inline-flex items-center gap-2">
              <i className="ti ti-folder-plus" /> Create a project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(p => {
              const pTasks     = tasksByProject[p._id] || [];
              const myTasks    = pTasks.filter(t =>
                t.assignedTo?._id === user._id || t.assignedTo === user._id
              );
              const isExpanded = expandedProject === p._id;
              const overdue    = p.isOverdue;

              return (
                <div key={p._id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-sm
                    ${overdue ? 'border-red-200' : 'border-gray-100'}`}>

                  {/* Project header */}
                  <div className={`p-4 ${overdue ? 'bg-red-50/20' : ''}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {p.title}
                          </h3>
                          <Badge label={overdue ? 'overdue' : p.status} />
                          {p.owner?._id !== user._id && p.owner?.name && (
                            <span className="text-xs text-gray-400">
                              by {p.owner.name}
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {p.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : p._id)}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border
                                   border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50
                                   transition-colors shrink-0">
                        <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'} text-sm`} />
                        {myTasks.length} my task{myTasks.length !== 1 ? 's' : ''}
                      </button>
                    </div>

                    {/* Project progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {pTasks.filter(t => t.status === 'done').length}/{pTasks.length} complete
                        </span>
                        {p.deadline && (
                          <span className={overdue ? 'text-red-400 font-medium' : 'text-gray-400'}>
                            Due {new Date(p.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <ProgressBar value={p.progress || 0} showLabel size="md" overdue={overdue} />
                    </div>

                    {/* Team members */}
                    {(p.assignedMembers || []).length > 0 && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex -space-x-1.5">
                          {p.assignedMembers.slice(0, 5).map(m => (
                            <div key={m._id} title={m.name}
                              className={`w-5 h-5 rounded-full border-2 border-white
                                          flex items-center justify-center text-xs font-bold
                                          ${m._id === user._id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                          }`}>
                              {m.name?.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {p.assignedMembers.length} member{p.assignedMembers.length !== 1 ? 's' : ''}
                          {myTasks.length > 0 && (
                            <span className="text-blue-500 ml-1 font-medium">
                              · {myTasks.length} assigned to you
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expanded tasks */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {myTasks.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs text-gray-400">
                            No tasks assigned to you in this project yet.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {myTasks.map(t => (
                            <MemberTaskCard
                              key={t._id}
                              task={t}
                              logState={logState[t._id] || { status: t.status, progress: t.progress || 0, notes: '' }}
                              onLogChange={(field, val) =>
                                setLogState(prev => ({
                                  ...prev,
                                  [t._id]: { ...prev[t._id], [field]: val },
                                }))
                              }
                              onLogWork={() => handleLogWork(t._id)}
                              saving={saving}
                              expandedLogs={expandedLogs}
                              setExpandedLogs={setExpandedLogs}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Create Project Modal ───────────────────────────────────── */}
      {showProjectModal && (
        <Modal title="Create project" onClose={() => setShowProjectModal(false)}>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <i className="ti ti-info-circle text-sm shrink-0 mt-0.5" />
              Your project will be visible to admins who can assign other team members and tasks to it.
            </p>
          </div>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input value={projectForm.title}
                onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="Project title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea value={projectForm.description}
                onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none" placeholder="What is this project about?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select value={projectForm.status}
                  onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}
                  className="input">
                  {['planning','active','on-hold'].map(s => (
                    <option key={s} value={s}>{s.replace('-',' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Deadline</label>
                <input type="date" value={projectForm.deadline}
                  onChange={e => setProjectForm(f => ({ ...f, deadline: e.target.value }))}
                  className="input" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowProjectModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                  : <><i className="ti ti-folder-plus" /> Create project</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Member task card with inline log ──────────────────────────────────────
function MemberTaskCard({
  task, logState, onLogChange, onLogWork, saving, expandedLogs, setExpandedLogs,
}) {
  const isLogsOpen = expandedLogs === task._id;
  const overdue    = task.isOverdue;
  const logsCount  = (task.logs || []).length;

  return (
    <div className={`p-4 ${overdue ? 'bg-red-50/20' : 'bg-white'}`}>

      {/* Task title + priority + status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {overdue && <i className="ti ti-alert-circle text-red-400 text-sm shrink-0" />}
            <p className={`text-sm font-semibold truncate
              ${overdue ? 'text-red-700' : 'text-gray-900'}`}>
              {task.title}
            </p>
          </div>
          {task.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge label={task.priority} />
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1
                ${overdue ? 'text-red-400 font-medium' : 'text-gray-400'}`}>
                <i className="ti ti-calendar text-xs" />
                {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Current progress display */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 font-medium">Progress</span>
          <span className={`font-semibold ${overdue ? 'text-red-500' : 'text-gray-700'}`}>
            {logState.progress}%
          </span>
        </div>
        <ProgressBar value={logState.progress} showLabel={false} size="md" overdue={overdue} />
      </div>

      {/* Log work section */}
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-3">
        <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
          <i className="ti ti-edit text-sm" />
          Log today's work
        </p>

        {/* Status + progress */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select
              value={logState.status}
              onChange={e => onLogChange('status', e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white
                         focus:outline-none focus:ring-1 focus:ring-blue-500">
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Progress — {logState.progress}%
            </label>
            <input type="range" min={0} max={100} step={5}
              value={logState.progress}
              onChange={e => onLogChange('progress', Number(e.target.value))}
              className="w-full h-1.5 accent-blue-600 mt-1" />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Notes (optional)</label>
          <textarea
            value={logState.notes}
            onChange={e => onLogChange('notes', e.target.value)}
            rows={2}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white
                       focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="What did you work on? Any blockers?" />
        </div>

        {/* Submit */}
        <button
          onClick={onLogWork}
          disabled={saving}
          className="w-full btn-primary flex items-center justify-center gap-2 text-xs py-2">
          {saving
            ? <><i className="ti ti-loader-2 animate-spin" /> Logging...</>
            : <><i className="ti ti-send" /> Submit today's log</>
          }
        </button>
      </div>

      {/* View past logs */}
      {logsCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpandedLogs(isLogsOpen ? null : task._id)}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <i className={`ti ti-chevron-${isLogsOpen ? 'up' : 'down'} text-sm`} />
            {isLogsOpen ? 'Hide logs' : `Tap to expand ▼ — ${logsCount} log${logsCount !== 1 ? 's' : ''} recorded`}
          </button>

          {isLogsOpen && (
            <div className="mt-2">
              <TaskLogs logs={task.logs || []} isAdmin={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}