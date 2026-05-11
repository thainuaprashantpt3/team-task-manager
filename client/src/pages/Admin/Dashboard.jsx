// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../api/axiosInstance';
// import { useAuth } from "../../context/AuthContext";
// import StatCard from '../../components/common/StatCard';
// import Badge from '../../components/common/Badge';
// import ProgressBar from '../../components/common/ProgressBar';

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [pRes, tRes, mRes] = await Promise.all([
//           api.get('/projects'),
//           api.get('/tasks'),
//           api.get('/users'),
//         ]);
//         setProjects(pRes.data.data);
//         setTasks(tRes.data.data);
//         setMembers(mRes.data.data);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const overdueTasks  = tasks.filter((t) => t.isOverdue);
//   const doneTasks     = tasks.filter((t) => t.status === 'done');
//   const activeProjects = projects.filter((p) => p.status === 'active');
//   const inactiveMembers = members.filter((m) => !m.isActive);
//   const completionRate = tasks.length
//     ? Math.round((doneTasks.length / tasks.length) * 100)
//     : 0;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">
//             Good day, {user?.name?.split(' ')[0]}
//           </h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             {overdueTasks.length > 0
//               ? `⚠ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need attention`
//               : 'Everything is on track today'}
//           </p>
//         </div>
//         <Link to="/projects" className="btn-primary flex items-center gap-2">
//           <i className="ti ti-plus text-base" />
//           New project
//         </Link>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           label="Total projects"
//           value={projects.length}
//           sub={`${activeProjects.length} active`}
//           subColor="text-green-600"
//           icon="folder"
//         />
//         <StatCard
//           label="Total tasks"
//           value={tasks.length}
//           sub={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'None overdue'}
//           subColor={overdueTasks.length > 0 ? 'text-red-500' : 'text-green-600'}
//           icon="checkbox"
//         />
//         <StatCard
//           label="Team members"
//           value={members.length}
//           sub={inactiveMembers.length > 0 ? `${inactiveMembers.length} on leave` : 'All active'}
//           subColor={inactiveMembers.length > 0 ? 'text-yellow-600' : 'text-green-600'}
//           icon="users"
//         />
//         <StatCard
//           label="Completion rate"
//           value={`${completionRate}%`}
//           sub={`${doneTasks.length} of ${tasks.length} done`}
//           subColor="text-gray-400"
//           icon="chart-bar"
//         />
//       </div>

//       {/* Main content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Project progress */}
//         <div className="card">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-sm font-semibold text-gray-800">Project progress</h2>
//             <Link to="/projects" className="text-xs text-brand-600 hover:underline">
//               View all
//             </Link>
//           </div>
//           <div className="space-y-4">
//             {projects.slice(0, 6).map((p) => (
//               <div key={p._id}>
//                 <div className="flex items-center justify-between mb-1">
//                   <div className="flex items-center gap-2">
//                     <Link
//                       to={`/projects/${p._id}`}
//                       className="text-sm font-medium text-gray-800 hover:text-brand-600 transition-colors"
//                     >
//                       {p.title}
//                     </Link>
//                     {p.isOverdue && (
//                       <span className="badge bg-red-50 text-red-600">overdue</span>
//                     )}
//                   </div>
//                   <Badge label={p.status} />
//                 </div>
//                 <ProgressBar value={p.progress} />
//               </div>
//             ))}
//             {projects.length === 0 && (
//               <p className="text-sm text-gray-400 text-center py-4">No projects yet</p>
//             )}
//           </div>
//         </div>

//         {/* Overdue tasks + recent members */}
//         <div className="space-y-4">
//           {/* Overdue alert */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//                 <i className="ti ti-alert-triangle text-red-500" />
//                 Overdue tasks
//                 {overdueTasks.length > 0 && (
//                   <span className="badge bg-red-100 text-red-700">{overdueTasks.length}</span>
//                 )}
//               </h2>
//               <Link to="/tasks?status=overdue" className="text-xs text-brand-600 hover:underline">
//                 View all
//               </Link>
//             </div>

//             {overdueTasks.length === 0 ? (
//               <div className="flex items-center gap-2 text-sm text-green-600 py-2">
//                 <i className="ti ti-circle-check text-lg" />
//                 No overdue tasks — great job!
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {overdueTasks.slice(0, 4).map((t) => (
//                   <div key={t._id} className="flex items-start justify-between gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-800">{t.title}</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {t.project?.title} ·{' '}
//                         {t.assignedTo?.name || 'Unassigned'}
//                       </p>
//                     </div>
//                     <Badge label="overdue" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Team members snapshot */}
//           <div className="card">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-sm font-semibold text-gray-800">Team</h2>
//               <Link to="/admin/members" className="text-xs text-brand-600 hover:underline">
//                 Manage
//               </Link>
//             </div>
//             <div className="space-y-3">
//               {members.slice(0, 5).map((m) => (
//                 <div key={m._id} className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
//                       {m.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-800">{m.name}</p>
//                       <p className="text-xs text-gray-400">{m.department || m.role}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <div className={`w-1.5 h-1.5 rounded-full ${m.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
//                     <span className="text-xs text-gray-400">
//                       {m.isActive ? 'Active' : 'On leave'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
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

export default function AdminDashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks,    setTasks]    = useState([]);
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  // UI state
  const [showMemberModal,  setShowMemberModal]  = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal,    setShowTaskModal]    = useState(false);
  const [editMember,       setEditMember]       = useState(null);
  const [expandedProject,  setExpandedProject]  = useState(null);
  const [expandedTask,     setExpandedTask]     = useState(null);
  const [saving,           setSaving]           = useState(false);

  // Forms
  const [memberForm, setMemberForm] = useState({
    name: '', email: '', password: '', department: '',
  });
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', deadline: '', status: 'planning', assignedMembers: [],
  });
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', project: '', assignedTo: '',
    priority: 'medium', status: 'todo', dueDate: '',
  });

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/users'),
      ]);
      setProjects(pRes.data.data);
      setTasks(tRes.data.data);
      setMembers(mRes.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Member handlers ────────────────────────────────────────────────
  const openAddMember = () => {
    setEditMember(null);
    setMemberForm({ name: '', email: '', password: '', department: '' });
    setShowMemberModal(true);
  };
  const openEditMember = (m) => {
    setEditMember(m);
    setMemberForm({ name: m.name, email: m.email, password: '', department: m.department || '' });
    setShowMemberModal(true);
  };
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMember) {
        await api.patch(`/users/${editMember._id}`, {
          name: memberForm.name, email: memberForm.email, department: memberForm.department,
        });
        toast.success('Member updated!');
      } else {
        await api.post('/users', memberForm);
        toast.success(`${memberForm.name} added!`);
      }
      setShowMemberModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };
  const handleToggleMember = async (m) => {
    try {
      await api.patch(`/users/${m._id}/toggle`);
      toast.success(`${m.name} → ${m.isActive ? 'inactive' : 'active'}`);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  // ── Project handlers ───────────────────────────────────────────────
  const toggleAssignedMember = (id) => {
    setProjectForm(f => ({
      ...f,
      assignedMembers: f.assignedMembers.includes(id)
        ? f.assignedMembers.filter(m => m !== id)
        : [...f.assignedMembers, id],
    }));
  };
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/projects', projectForm);
      toast.success('Project created!');
      setShowProjectModal(false);
      setProjectForm({ title: '', description: '', deadline: '', status: 'planning', assignedMembers: [] });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project and ALL its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  // ── Task handlers ──────────────────────────────────────────────────
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/tasks', taskForm);
      toast.success('Task created and assigned!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', project: '', assignedTo: '', priority: 'medium', status: 'todo', dueDate: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  // ── Derived stats ──────────────────────────────────────────────────
  const overdueTasks   = tasks.filter(t => t.isOverdue);
  const doneTasks      = tasks.filter(t => t.status === 'done');
  const activeProjects = projects.filter(p => p.status === 'active');
  const activeMembers  = members.filter(m => m.isActive);
  const completionRate = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

  // Tasks per project map for quick lookup
  const tasksByProject = tasks.reduce((acc, t) => {
    const pid = t.project?._id || t.project;
    if (!pid) return acc;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(t);
    return acc;
  }, {});

  // Members of selected project (for task assignment)
  const selectedProject   = projects.find(p => p._id === taskForm.project);
  const projectMemberList = selectedProject?.assignedMembers || [];

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
            Dashboard — {user?.name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {overdueTasks.length > 0
              ? `⚠ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} require attention`
              : 'All projects on track'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={openAddMember}
            className="btn-primary flex items-center gap-2 text-sm">
            <i className="ti ti-user-plus" /> Add member
          </button>
          <button onClick={() => setShowProjectModal(true)}
            className="btn-secondary flex items-center gap-2 text-sm">
            <i className="ti ti-folder-plus" /> New project
          </button>
          <button onClick={() => setShowTaskModal(true)}
            className="btn-secondary flex items-center gap-2 text-sm">
            <i className="ti ti-plus" /> Assign task
          </button>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total projects" value={projects.length}
          sub={`${activeProjects.length} active`} subColor="text-green-600" icon="folder" />
        <StatCard label="Total tasks" value={tasks.length}
          sub={overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : 'None overdue'}
          subColor={overdueTasks.length > 0 ? 'text-red-500' : 'text-green-600'} icon="checkbox" />
        <StatCard label="Team members" value={members.length}
          sub={`${activeMembers.length} active`} subColor="text-green-600" icon="users" />
        <StatCard label="Completion" value={`${completionRate}%`}
          sub={`${doneTasks.length} / ${tasks.length} tasks done`}
          subColor="text-gray-400" icon="chart-bar" />
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Projects + tasks — 2/3 */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              All projects
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({projects.length})
              </span>
            </h2>
            <Link to="/projects" className="text-xs text-blue-600 hover:underline">
              Full view
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-10 text-center">
              <i className="ti ti-folder-off text-4xl text-gray-200" />
              <p className="text-gray-400 text-sm mt-2">No projects yet</p>
              <button onClick={() => setShowProjectModal(true)}
                className="btn-primary mt-3 inline-flex items-center gap-2 text-sm">
                <i className="ti ti-plus" /> Create first project
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => {
                const pTasks     = tasksByProject[p._id] || [];
                const isExpanded = expandedProject === p._id;

                return (
                  <div key={p._id}
                    className={`bg-white border rounded-xl overflow-hidden shadow-sm
                      ${p.isOverdue ? 'border-red-200' : 'border-gray-100'}`}>

                    {/* Project header */}
                    <div className={`p-4 ${p.isOverdue ? 'bg-red-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link to={`/projects/${p._id}`}
                              className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {p.title}
                            </Link>
                            <Badge label={p.isOverdue ? 'overdue' : p.status} />
                          </div>

                          {/* Creator */}
                          <p className="text-xs text-gray-400 mt-0.5">
                            Created by
                            <span className="font-medium text-gray-600 ml-1">{p.owner?.name}</span>
                            {p.deadline && (
                              <span className={`ml-3 ${p.isOverdue ? 'text-red-400 font-medium' : ''}`}>
                                · Due {new Date(p.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setExpandedProject(isExpanded ? null : p._id)}
                            className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg
                                       text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                            <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'} text-sm`} />
                            {pTasks.length} task{pTasks.length !== 1 ? 's' : ''}
                          </button>
                          <button onClick={() => handleDeleteProject(p._id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                            title="Delete project">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">
                            {pTasks.filter(t => t.status === 'done').length}/{pTasks.length} tasks complete
                          </span>
                          <span className={`text-xs font-semibold
                            ${p.isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
                            {p.progress || 0}%
                          </span>
                        </div>
                        <ProgressBar value={p.progress || 0} showLabel={false}
                          size="md" overdue={p.isOverdue} />
                      </div>

                      {/* Assigned members avatars */}
                      {(p.assignedMembers || []).length > 0 && (
                        <div className="flex items-center gap-2 mt-2.5">
                          <div className="flex -space-x-1.5">
                            {p.assignedMembers.slice(0, 6).map(m => (
                              <div key={m._id} title={`${m.name}${m.department ? ` · ${m.department}` : ''}`}
                                className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white
                                           flex items-center justify-center text-xs font-bold text-blue-700">
                                {m.name?.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {p.assignedMembers.length > 6 && (
                              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white
                                              flex items-center justify-center text-xs font-bold text-gray-500">
                                +{p.assignedMembers.length - 6}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {p.assignedMembers.length} member{p.assignedMembers.length !== 1 ? 's' : ''} assigned
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expanded task list */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        {pTasks.length === 0 ? (
                          <div className="px-4 py-4 text-xs text-gray-400 text-center">
                            No tasks yet —
                            <button
                              onClick={() => {
                                setTaskForm(f => ({ ...f, project: p._id }));
                                setShowTaskModal(true);
                              }}
                              className="text-blue-600 hover:underline ml-1">
                              assign one
                            </button>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {pTasks.map(t => (
                              <TaskRow
                                key={t._id}
                                task={t}
                                expandedTask={expandedTask}
                                setExpandedTask={setExpandedTask}
                                onDelete={handleDeleteTask}
                                isAdmin
                              />
                            ))}
                          </div>
                        )}
                        <div className="px-4 py-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setTaskForm(f => ({ ...f, project: p._id }));
                              setShowTaskModal(true);
                            }}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <i className="ti ti-plus text-sm" /> Add task to this project
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column — overdue + members */}
        <div className="space-y-5">

          {/* Overdue tasks */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <i className="ti ti-alert-triangle text-red-500" />
                Overdue tasks
                {overdueTasks.length > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {overdueTasks.length}
                  </span>
                )}
              </h2>
              <Link to="/tasks" className="text-xs text-blue-600 hover:underline">All tasks</Link>
            </div>

            {overdueTasks.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-600 py-2">
                <i className="ti ti-circle-check" /> No overdue tasks — all good!
              </div>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map(t => (
                  <div key={t._id}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-red-700 truncate">{t.title}</p>
                        <p className="text-xs text-gray-400">
                          {t.project?.title}
                          {t.assignedTo && ` · ${t.assignedTo.name}`}
                        </p>
                      </div>
                      <Badge label={t.priority} />
                    </div>
                    <ProgressBar value={t.progress || 0} size="sm" overdue />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members panel */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Team members
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({activeMembers.length} active)
                </span>
              </h2>
              <button onClick={openAddMember}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <i className="ti ti-user-plus text-sm" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {members.map(m => {
                // Count tasks assigned to this member
                const myTasks    = tasks.filter(t => t.assignedTo?._id === m._id || t.assignedTo === m._id);
                const myProjects = projects.filter(p =>
                  p.assignedMembers?.some(am => am._id === m._id || am === m._id)
                );

                return (
                  <div key={m._id}
                    className={`flex items-center gap-3 p-2 rounded-lg border
                      ${!m.isActive ? 'opacity-60 border-gray-100 bg-gray-50' : 'border-transparent hover:bg-gray-50'}
                      transition-colors`}>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center
                                    text-xs font-bold text-blue-700 shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-gray-800 truncate">{m.name}</p>
                        {!m.isActive && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium shrink-0">
                            On leave
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {m.department || m.email}
                        {m.isActive && (
                          <span className="ml-2 text-gray-300">
                            · {myProjects.length}p · {myTasks.length}t
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditMember(m)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit member">
                        <i className="ti ti-edit text-sm" />
                      </button>
                      <button onClick={() => handleToggleMember(m)}
                        className={`p-1 rounded transition-colors
                          ${m.isActive
                            ? 'text-yellow-500 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                          }`}
                        title={m.isActive ? 'Mark on leave' : 'Reactivate'}>
                        <i className="ti ti-refresh text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Add/Edit Member Modal ──────────────────────────────────── */}
      {showMemberModal && (
        <Modal
          title={editMember ? `Edit — ${editMember.name}` : 'Add team member'}
          onClose={() => setShowMemberModal(false)}
        >
          <form onSubmit={handleMemberSubmit} className="space-y-4">
            {[
              { key: 'name',       label: 'Full name *',  type: 'text',     placeholder: 'Riya Sharma' },
              { key: 'email',      label: 'Email *',      type: 'email',    placeholder: 'riya@company.com' },
              { key: 'department', label: 'Department',   type: 'text',     placeholder: 'Engineering' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input type={type} value={memberForm[key]} placeholder={placeholder}
                  onChange={e => setMemberForm(f => ({ ...f, [key]: e.target.value }))}
                  required={key !== 'department'} className="input" />
              </div>
            ))}
            {!editMember && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password *</label>
                <input type="password" value={memberForm.password}
                  onChange={e => setMemberForm(f => ({ ...f, password: e.target.value }))}
                  required className="input" placeholder="Min 8 chars, upper + number" />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowMemberModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-check" />}
                {saving ? 'Saving...' : editMember ? 'Save changes' : 'Add member'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Create Project Modal ───────────────────────────────────── */}
      {showProjectModal && (
        <Modal title="Create new project" onClose={() => setShowProjectModal(false)}>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input value={projectForm.title}
                onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="e.g. CRM Redesign Q3" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea value={projectForm.description}
                onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none" placeholder="Brief project description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select value={projectForm.status}
                  onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}
                  className="input">
                  {['planning','active','on-hold','completed'].map(s => (
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

            {/* Multi-member assign */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Assign team members
                <span className="ml-1 text-gray-400 font-normal">
                  ({projectForm.assignedMembers.length} selected)
                </span>
              </label>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {members.filter(m => m.isActive && m.role === 'member').map(m => (
                  <label key={m._id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox"
                      checked={projectForm.assignedMembers.includes(m._id)}
                      onChange={() => toggleAssignedMember(m._id)}
                      className="accent-blue-600 w-3.5 h-3.5" />
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center
                                    text-xs font-bold text-blue-700 shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-700">{m.name}</span>
                      {m.department && (
                        <span className="text-xs text-gray-400 ml-2">{m.department}</span>
                      )}
                    </div>
                  </label>
                ))}
                {members.filter(m => m.isActive && m.role === 'member').length === 0 && (
                  <p className="text-xs text-gray-400 p-3 text-center">No active members yet</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowProjectModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-folder-plus" />}
                {saving ? 'Creating...' : 'Create project'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Assign Task Modal ──────────────────────────────────────── */}
      {showTaskModal && (
        <Modal title="Assign task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Task title *</label>
              <input value={taskForm.title}
                onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="e.g. Design login screen" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea value={taskForm.description}
                onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none" placeholder="Task details and requirements" />
            </div>

            {/* Project selector */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Project *</label>
              <select value={taskForm.project}
                onChange={e => setTaskForm(f => ({ ...f, project: e.target.value, assignedTo: '' }))}
                required className="input">
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Assign to — only project members */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Assign to
                {taskForm.project && projectMemberList.length === 0 && (
                  <span className="ml-2 text-yellow-600 font-normal text-xs">
                    — no members on this project yet
                  </span>
                )}
              </label>
              <select value={taskForm.assignedTo}
                onChange={e => setTaskForm(f => ({ ...f, assignedTo: e.target.value }))}
                className="input"
                disabled={!taskForm.project || projectMemberList.length === 0}>
                <option value="">Unassigned</option>
                {projectMemberList.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
              {taskForm.project && projectMemberList.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  Add members to this project first before assigning tasks.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Priority</label>
                <select value={taskForm.priority}
                  onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                  className="input">
                  {['low','medium','high','critical'].map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Due date</label>
                <input type="date" value={taskForm.dueDate}
                  onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="input" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowTaskModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-send" />}
                {saving ? 'Assigning...' : 'Assign task'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Task row component (used inside expanded project) ──────────────────────
function TaskRow({ task, expandedTask, setExpandedTask, onDelete, isAdmin }) {
  const isOpen = expandedTask === task._id;
  const now    = new Date();
  const overdue = task.isOverdue;

  return (
    <div className={`${overdue ? 'bg-red-50/30' : 'bg-white'}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Priority dot */}
        <div className={`w-2 h-2 rounded-full shrink-0
          ${task.priority === 'critical' ? 'bg-red-500' :
            task.priority === 'high'     ? 'bg-orange-400' :
            task.priority === 'medium'   ? 'bg-yellow-400' : 'bg-gray-300'}`} />

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {overdue && <i className="ti ti-alert-circle text-red-400 text-xs shrink-0" />}
            <p className={`text-xs font-medium truncate
              ${overdue ? 'text-red-700' : 'text-gray-800'}`}>
              {task.title}
            </p>
          </div>
          {task.assignedTo && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <i className="ti ti-user text-xs" />
              {task.assignedTo.name}
              {task.dueDate && (
                <span className={`ml-2 ${overdue ? 'text-red-400' : ''}`}>
                  · Due {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Progress + status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-20 hidden sm:block">
            <ProgressBar value={task.progress || 0} size="sm" overdue={overdue} />
          </div>
          <Badge label={task.status} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {(task.logs || []).length > 0 && (
            <button
              onClick={() => setExpandedTask(isOpen ? null : task._id)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View logs">
              <i className="ti ti-notes text-sm" />
            </button>
          )}
          {isAdmin && (
            <button onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete task">
              <i className="ti ti-trash text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded logs */}
      {isOpen && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3 bg-gray-50/50">
          <p className="text-xs font-medium text-gray-600 mb-2">Activity logs</p>
          <TaskLogs logs={task.logs || []} isAdmin />
        </div>
      )}
    </div>
  );
}