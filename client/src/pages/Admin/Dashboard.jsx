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
  const [projects, setProjects]  = useState([]);
  const [tasks,    setTasks]     = useState([]);
  const [members,  setMembers]   = useState([]);
  const [loading,  setLoading]   = useState(true);

  const [showMemberModal,  setShowMemberModal]  = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal,    setShowTaskModal]    = useState(false);
  const [editMember,       setEditMember]       = useState(null);
  const [expandedProject,  setExpandedProject]  = useState(null);
  const [expandedTask,     setExpandedTask]     = useState(null);
  const [saving,           setSaving]           = useState(false);

  const [memberForm, setMemberForm]   = useState({ name:'', email:'', password:'', department:'' });
  const [projectForm, setProjectForm] = useState({ title:'', description:'', deadline:'', status:'planning', assignedMembers:[] });
  const [taskForm, setTaskForm]       = useState({ title:'', description:'', project:'', assignedTo:'', priority:'medium', status:'todo', dueDate:'' });

  const fetchAll = useCallback(async () => {
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        api.get('/projects'), api.get('/tasks'), api.get('/users'),
      ]);
      setProjects(pRes.data.data);
      setTasks(tRes.data.data);
      setMembers(mRes.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAddMember = () => {
    setEditMember(null);
    setMemberForm({ name:'', email:'', password:'', department:'' });
    setShowMemberModal(true);
  };
  const openEditMember = (m) => {
    setEditMember(m);
    setMemberForm({ name:m.name, email:m.email, password:'', department:m.department||'' });
    setShowMemberModal(true);
  };
  const handleMemberSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editMember
        ? await api.patch(`/users/${editMember._id}`, { name:memberForm.name, email:memberForm.email, department:memberForm.department })
        : await api.post('/users', memberForm);
      toast.success(editMember ? 'Member updated!' : `${memberForm.name} added!`);
      setShowMemberModal(false);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };
  const handleToggleMember = async (m) => {
    try {
      await api.patch(`/users/${m._id}/toggle`);
      toast.success(`${m.name} → ${m.isActive?'inactive':'active'}`);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const toggleAssignedMember = (id) =>
    setProjectForm(f => ({
      ...f,
      assignedMembers: f.assignedMembers.includes(id)
        ? f.assignedMembers.filter(m => m !== id)
        : [...f.assignedMembers, id],
    }));

  const handleCreateProject = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/projects', projectForm);
      toast.success('Project created!');
      setShowProjectModal(false);
      setProjectForm({ title:'', description:'', deadline:'', status:'planning', assignedMembers:[] });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project and all tasks?')) return;
    try { await api.delete(`/projects/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/tasks', taskForm);
      toast.success('Task assigned!');
      setShowTaskModal(false);
      setTaskForm({ title:'', description:'', project:'', assignedTo:'', priority:'medium', status:'todo', dueDate:'' });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete task?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const overdueTasks   = tasks.filter(t => t.isOverdue);
  const doneTasks      = tasks.filter(t => t.status === 'done');
  const activeProjects = projects.filter(p => p.status === 'active');
  const activeMembers  = members.filter(m => m.isActive);
  const completionRate = tasks.length ? Math.round((doneTasks.length/tasks.length)*100) : 0;

  const tasksByProject = tasks.reduce((acc, t) => {
    const pid = t.project?._id || t.project;
    if (!pid) return acc;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(t);
    return acc;
  }, {});

  const selectedProject   = projects.find(p => p._id === taskForm.project);
  const projectMemberList = selectedProject?.assignedMembers || [];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <i className="ti ti-loader-2 animate-spin text-4xl text-indigo-500" />
        <p className="text-sm text-gray-400 font-medium">Loading workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-screen-2xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Live workspace
            </span>
          </div>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-sub">
            {overdueTasks.length > 0
              ? `⚠ ${overdueTasks.length} task${overdueTasks.length>1?'s':''} need attention`
              : `${activeProjects.length} active projects · Everything on track`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={openAddMember}
            className="btn-primary text-sm">
            <i className="ti ti-user-plus" />
            <span className="hidden sm:inline">Add member</span>
            <span className="sm:hidden">Member</span>
          </button>
          <button onClick={() => setShowProjectModal(true)}
            className="btn-secondary text-sm">
            <i className="ti ti-folder-plus" />
            <span className="hidden sm:inline">New project</span>
            <span className="sm:hidden">Project</span>
          </button>
          <button onClick={() => setShowTaskModal(true)}
            className="btn-secondary text-sm">
            <i className="ti ti-plus" />
            <span className="hidden sm:inline">Assign task</span>
            <span className="sm:hidden">Task</span>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Projects" value={projects.length}
          sub={`${activeProjects.length} active`}
          subColor="text-emerald-600" icon="folder" color="indigo"
          trend="up" className="delay-1" />
        <StatCard label="Total tasks" value={tasks.length}
          sub={overdueTasks.length>0 ? `${overdueTasks.length} overdue` : 'All on track'}
          subColor={overdueTasks.length>0 ? 'text-red-500' : 'text-emerald-600'}
          icon="checkbox" color={overdueTasks.length>0 ? 'rose' : 'emerald'}
          className="delay-2" />
        <StatCard label="Team" value={members.length}
          sub={`${activeMembers.length} active members`}
          subColor="text-emerald-600" icon="users" color="purple"
          className="delay-3" />
        <StatCard label="Completion" value={`${completionRate}%`}
          sub={`${doneTasks.length} of ${tasks.length} done`}
          subColor="text-gray-400" icon="chart-bar" color="amber"
          className="delay-4" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">

        {/* Projects list — 2/3 */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">All projects</h2>
              <p className="text-xs text-gray-400">{projects.length} projects total</p>
            </div>
            <Link to="/projects"
              className="btn-ghost text-xs text-indigo-600 font-semibold">
              View all <i className="ti ti-arrow-right text-sm" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="card text-center py-16 animate-fade-up">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center
                              justify-center mx-auto mb-4">
                <i className="ti ti-folder-off text-3xl text-indigo-300" />
              </div>
              <p className="font-bold text-gray-900 mb-1">No projects yet</p>
              <p className="text-sm text-gray-400 mb-4">
                Create your first project to get started
              </p>
              <button onClick={() => setShowProjectModal(true)} className="btn-primary mx-auto">
                <i className="ti ti-plus" /> Create project
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p, idx) => {
                const pTasks     = tasksByProject[p._id] || [];
                const isExpanded = expandedProject === p._id;
                return (
                  <div key={p._id}
                    className={`bg-white border rounded-2xl overflow-hidden
                                 shadow-sm hover:shadow-md transition-all duration-200
                                 animate-fade-up
                                 ${p.isOverdue ? 'border-red-200' : 'border-gray-100'}`}
                    style={{ animationDelay: `${idx*0.05}s` }}>

                    <div className={`p-4 sm:p-5 ${p.isOverdue ? 'bg-red-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Link to={`/projects/${p._id}`}
                              className="text-sm font-bold text-gray-900
                                         hover:text-indigo-600 transition-colors">
                              {p.title}
                            </Link>
                            <Badge label={p.isOverdue ? 'overdue' : p.status} />
                          </div>
                          <p className="text-xs text-gray-400 mb-3">
                            By <span className="font-semibold text-gray-600">
                              {p.owner?.name}
                            </span>
                            {p.deadline && (
                              <span className={`ml-2 font-medium
                                ${p.isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                                · Due {new Date(p.deadline).toLocaleDateString('en-IN',
                                  { day:'2-digit', month:'short', year:'numeric' })}
                              </span>
                            )}
                          </p>

                          {/* Progress */}
                          <div className="mb-2.5">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-400 font-medium">
                                {pTasks.filter(t=>t.status==='done').length}/{pTasks.length} tasks
                              </span>
                              <span className={`font-bold
                                ${p.isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
                                {p.progress||0}%
                              </span>
                            </div>
                            <ProgressBar value={p.progress||0} showLabel={false}
                              size="md" overdue={p.isOverdue} />
                          </div>

                          {/* Members */}
                          {(p.assignedMembers||[]).length > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {p.assignedMembers.slice(0,5).map(m => (
                                  <div key={m._id} title={m.name}
                                    className="w-6 h-6 rounded-full bg-indigo-600
                                               border-2 border-white flex items-center
                                               justify-center text-xs font-bold text-white
                                               shadow-sm">
                                    {m.name?.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {p.assignedMembers.length > 5 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-200
                                                  border-2 border-white flex items-center
                                                  justify-center text-xs font-bold text-gray-600">
                                    +{p.assignedMembers.length-5}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {p.assignedMembers.length} member{p.assignedMembers.length!==1?'s':''}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setExpandedProject(isExpanded ? null : p._id)}
                            className="btn-ghost text-xs px-2.5 py-1.5">
                            <i className={`ti ti-chevron-${isExpanded?'up':'down'} text-sm`} />
                            <span className="hidden sm:inline">
                              {pTasks.length} task{pTasks.length!==1?'s':''}
                            </span>
                          </button>
                          <button onClick={() => handleDeleteProject(p._id)}
                            className="btn-ghost p-1.5 text-gray-300 hover:text-red-500">
                            <i className="ti ti-trash text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tasks */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/60
                                      animate-fade-in">
                        {pTasks.length === 0 ? (
                          <div className="px-5 py-5 text-center">
                            <p className="text-xs text-gray-400 mb-2">
                              No tasks yet
                            </p>
                            <button
                              onClick={() => {
                                setTaskForm(f => ({ ...f, project: p._id }));
                                setShowTaskModal(true);
                              }}
                              className="text-xs text-indigo-600 font-bold hover:underline">
                              + Assign first task
                            </button>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {pTasks.map(t => (
                              <TaskRowAdmin
                                key={t._id}
                                task={t}
                                expandedTask={expandedTask}
                                setExpandedTask={setExpandedTask}
                                onDelete={handleDeleteTask}
                              />
                            ))}
                            <div className="px-5 py-2.5">
                              <button
                                onClick={() => {
                                  setTaskForm(f => ({ ...f, project: p._id }));
                                  setShowTaskModal(true);
                                }}
                                className="text-xs text-indigo-600 font-bold
                                           hover:text-indigo-700 flex items-center gap-1">
                                <i className="ti ti-plus text-sm" />
                                Add task
                              </button>
                            </div>
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

        {/* Right column */}
        <div className="space-y-4">

          {/* Overdue tasks */}
          <div className={`card animate-fade-up delay-2
            ${overdueTasks.length > 0 ? 'border-red-100' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                  <i className="ti ti-alert-triangle text-red-500 text-sm" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Overdue</h3>
                {overdueTasks.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5
                                   rounded-full font-bold">
                    {overdueTasks.length}
                  </span>
                )}
              </div>
              <Link to="/tasks" className="text-xs text-indigo-600 font-semibold hover:underline">
                All tasks
              </Link>
            </div>

            {overdueTasks.length === 0 ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center
                                justify-center shrink-0">
                  <i className="ti ti-circle-check text-emerald-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700">All clear!</p>
                  <p className="text-xs text-gray-400">No overdue tasks today</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {overdueTasks.slice(0,5).map(t => (
                  <div key={t._id}
                    className="flex items-start justify-between gap-2 p-3
                               bg-red-50/60 rounded-xl border border-red-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-red-700 truncate">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t.project?.title}
                        {t.assignedTo && ` · ${t.assignedTo.name}`}
                      </p>
                      <ProgressBar value={t.progress||0} size="sm"
                        overdue className="mt-1.5" />
                    </div>
                    <Badge label={t.priority} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team snapshot */}
          <div className="card animate-fade-up delay-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center
                                justify-center">
                  <i className="ti ti-users text-indigo-600 text-sm" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Team</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={openAddMember}
                  className="text-xs text-indigo-600 font-semibold hover:underline
                             flex items-center gap-1">
                  <i className="ti ti-plus text-sm" /> Add
                </button>
                <Link to="/admin/members"
                  className="text-xs text-gray-400 hover:text-gray-600 font-semibold">
                  All →
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              {/* Only show active members */}
              {members.filter(m => m.isActive).slice(0, 6).map((m, i) => {
                const myTasks = tasks.filter(
                  t => t.assignedTo?._id === m._id || t.assignedTo === m._id
                );
                const myDone = myTasks.filter(t => t.status === 'done').length;
                const pct    = myTasks.length
                  ? Math.round((myDone/myTasks.length)*100) : 0;

                return (
                  <div key={m._id}
                    className="flex items-center gap-3 p-2 rounded-xl
                               hover:bg-gray-50 transition-colors cursor-pointer
                               animate-fade-up"
                    style={{ animationDelay: `${i*0.04}s` }}
                    onClick={() => openEditMember(m)}
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center
                                    justify-center text-xs font-bold text-white
                                    shrink-0 shadow-sm shadow-indigo-200">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {m.name}
                        </p>
                        <span className="text-xs font-bold text-indigo-600 shrink-0">
                          {pct}%
                        </span>
                      </div>
                      <ProgressBar value={pct} showLabel={false} size="sm" />
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleToggleMember(m); }}
                      className="p-1 text-gray-300 hover:text-amber-500 rounded-lg
                                 transition-colors shrink-0"
                      title="Mark on leave">
                      <i className="ti ti-refresh text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {showMemberModal && (
        <Modal
          title={editMember ? `Edit — ${editMember.name}` : 'Add team member'}
          onClose={() => setShowMemberModal(false)}>
          <form onSubmit={handleMemberSubmit} className="space-y-4">
            {[
              { k:'name',       l:'Full name *',  t:'text',     p:'Riya Sharma' },
              { k:'email',      l:'Work email *', t:'email',    p:'riya@ethera.ai' },
              { k:'department', l:'Department',   t:'text',     p:'Engineering' },
            ].map(({ k, l, t, p }) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">{l}</label>
                <input type={t} value={memberForm[k]} placeholder={p}
                  onChange={e => setMemberForm(f => ({ ...f, [k]: e.target.value }))}
                  required={k !== 'department'} className="input" />
              </div>
            ))}
            {!editMember && (
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">Password *</label>
                <input type="password" value={memberForm.password}
                  onChange={e => setMemberForm(f => ({ ...f, password: e.target.value }))}
                  required className="input" placeholder="Min 8 chars" />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowMemberModal(false)}
                className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1">
                {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-check" />}
                {saving ? 'Saving...' : editMember ? 'Save changes' : 'Add member'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <Modal title="Create new project" onClose={() => setShowProjectModal(false)} size="lg">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Title *
              </label>
              <input value={projectForm.title}
                onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="e.g. CRM Redesign Q3" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea value={projectForm.description}
                onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none"
                placeholder="Project overview and goals" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">Status</label>
                <select value={projectForm.status}
                  onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}
                  className="input">
                  {['planning','active','on-hold','completed'].map(s => (
                    <option key={s} value={s}>{s.replace('-',' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">Deadline</label>
                <input type="date" value={projectForm.deadline}
                  onChange={e => setProjectForm(f => ({ ...f, deadline: e.target.value }))}
                  className="input" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Member assignment */}
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-2">
                Assign members ({projectForm.assignedMembers.length} selected)
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden
                              max-h-44 overflow-y-auto">
                {members.filter(m => m.isActive && m.role === 'member').map(m => (
                  <label key={m._id}
                    className="flex items-center gap-3 px-3 py-2.5
                               hover:bg-indigo-50 cursor-pointer transition-colors
                               border-b border-gray-50 last:border-0">
                    <input type="checkbox"
                      checked={projectForm.assignedMembers.includes(m._id)}
                      onChange={() => toggleAssignedMember(m._id)}
                      className="accent-indigo-600 w-4 h-4 rounded" />
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center
                                    justify-center text-xs font-bold text-white shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                      {m.department && (
                        <p className="text-xs text-gray-400">{m.department}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowProjectModal(false)}
                className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                  : <><i className="ti ti-folder-plus" /> Create project</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <Modal title="Assign task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-2">Task title *</label>
              <input value={taskForm.title}
                onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="e.g. Design login screen" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-2">Description</label>
              <textarea value={taskForm.description}
                onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none"
                placeholder="Task details and acceptance criteria" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-2">Project *</label>
              <select value={taskForm.project}
                onChange={e => setTaskForm(f => ({ ...f, project: e.target.value, assignedTo: '' }))}
                required className="input">
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500
                                uppercase tracking-wider mb-2">
                Assign to
                {taskForm.project && projectMemberList.length === 0 && (
                  <span className="ml-2 normal-case text-amber-500 font-normal">
                    — add members to project first
                  </span>
                )}
              </label>
              <select value={taskForm.assignedTo}
                onChange={e => setTaskForm(f => ({ ...f, assignedTo: e.target.value }))}
                className="input"
                disabled={!taskForm.project || projectMemberList.length === 0}>
                <option value="">— Unassigned —</option>
                {projectMemberList.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name}{m.department ? ` (${m.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">Priority</label>
                <select value={taskForm.priority}
                  onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                  className="input">
                  {['low','medium','high','critical'].map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase()+p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500
                                  uppercase tracking-wider mb-2">Due date</label>
                <input type="date" value={taskForm.dueDate}
                  onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="input"
                  min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowTaskModal(false)}
                className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Assigning...</>
                  : <><i className="ti ti-send" /> Assign task</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function TaskRowAdmin({ task, expandedTask, setExpandedTask, onDelete }) {
  const isOpen  = expandedTask === task._id;
  const overdue = task.isOverdue;

  return (
    <div className={overdue ? 'bg-red-50/40' : ''}>
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3">
        <div className={`w-2 h-2 rounded-full shrink-0
          ${task.priority==='critical' ? 'bg-red-500' :
            task.priority==='high'     ? 'bg-orange-400' :
            task.priority==='medium'   ? 'bg-amber-400' : 'bg-gray-300'}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {overdue && (
              <i className="ti ti-alert-circle text-red-400 text-xs shrink-0" />
            )}
            <p className={`text-xs font-bold truncate
              ${overdue ? 'text-red-700' : 'text-gray-800'}`}>
              {task.title}
            </p>
          </div>
          {task.assignedTo && (
            <p className="text-xs text-gray-400">
              {task.assignedTo.name}
              {task.dueDate && (
                <span className={`ml-2 ${overdue ? 'text-red-400 font-medium' : ''}`}>
                  · Due {new Date(task.dueDate).toLocaleDateString('en-IN',
                    { day:'2-digit', month:'short' })}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-16 hidden sm:block">
            <ProgressBar value={task.progress||0} size="sm" overdue={overdue} />
          </div>
          <Badge label={task.status} />
        </div>

        <div className="flex items-center gap-1">
          {(task.logs||[]).length > 0 && (
            <button onClick={() => setExpandedTask(isOpen ? null : task._id)}
              className="btn-ghost p-1.5 text-indigo-500" title="View logs">
              <i className="ti ti-notes text-sm" />
            </button>
          )}
          <button onClick={() => onDelete(task._id)}
            className="btn-ghost p-1.5 text-gray-300 hover:text-red-500"
            title="Delete">
            <i className="ti ti-trash text-sm" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-white/80
                        animate-fade-in">
          <p className="section-label mb-2.5">Activity logs</p>
          <TaskLogs logs={task.logs||[]} isAdmin />
        </div>
      )}
    </div>
  );
}