import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';

export default function Reports() {
  const [tasks, setTasks]     = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange]     = useState('all'); // all | week | month

  useEffect(() => {
    Promise.all([
      api.get('/tasks'),
      api.get('/users'),
      api.get('/projects'),
    ]).then(([tRes, mRes, pRes]) => {
      setTasks(tRes.data.data);
      setMembers(mRes.data.data);
      setProjects(pRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  // ── Date filter helper ────────────────────────────────────────────────────
  const filterByRange = (items, field = 'createdAt') => {
    if (range === 'all') return items;
    const now = new Date();
    const cutoff = new Date();
    if (range === 'week')  cutoff.setDate(now.getDate() - 7);
    if (range === 'month') cutoff.setMonth(now.getMonth() - 1);
    return items.filter((i) => new Date(i[field]) >= cutoff);
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const filteredTasks = filterByRange(tasks);

  const totalTasks    = filteredTasks.length;
  const doneTasks     = filteredTasks.filter((t) => t.status === 'done').length;
  const overdueTasks  = filteredTasks.filter((t) => t.isOverdue).length;
  const inProgTasks   = filteredTasks.filter((t) => t.status === 'in-progress').length;
  const completionPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Per-member task breakdown
  const memberStats = members
    .filter((m) => m.role === 'member')
    .map((m) => {
      const myTasks    = filteredTasks.filter((t) => t.assignedTo?._id === m._id || t.assignedTo === m._id);
      const myDone     = myTasks.filter((t) => t.status === 'done').length;
      const myOverdue  = myTasks.filter((t) => t.isOverdue).length;
      const myInProg   = myTasks.filter((t) => t.status === 'in-progress').length;
      const pct        = myTasks.length ? Math.round((myDone / myTasks.length) * 100) : 0;
      return { ...m, total: myTasks.length, done: myDone, overdue: myOverdue, inProgress: myInProg, pct };
    })
    .sort((a, b) => b.total - a.total);

  // Per-project completion
  const projectStats = projects.map((p) => {
    const pTasks  = filteredTasks.filter((t) => t.project?._id === p._id || t.project === p._id);
    const pDone   = pTasks.filter((t) => t.status === 'done').length;
    const pct     = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0;
    return { ...p, total: pTasks.length, done: pDone, pct };
  }).sort((a, b) => b.total - a.total);

  // Priority breakdown
  const byPriority = ['critical', 'high', 'medium', 'low'].map((p) => ({
    label: p,
    count: filteredTasks.filter((t) => t.priority === p).length,
  }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">Team performance overview</p>
        </div>

        {/* Date range filter */}
        <div className="flex gap-2">
          {[
            { value: 'week',  label: 'Last 7 days' },
            { value: 'month', label: 'Last 30 days' },
            { value: 'all',   label: 'All time' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${range === value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total tasks"
          value={totalTasks}
          icon="checkbox"
        />
        <StatCard
          label="Completed"
          value={`${completionPct}%`}
          sub={`${doneTasks} of ${totalTasks} tasks`}
          subColor="text-green-600"
          icon="circle-check"
        />
        <StatCard
          label="In progress"
          value={inProgTasks}
          icon="loader-2"
          subColor="text-blue-500"
        />
        <StatCard
          label="Overdue"
          value={overdueTasks}
          sub={overdueTasks > 0 ? 'Needs attention' : 'None overdue'}
          subColor={overdueTasks > 0 ? 'text-red-500' : 'text-green-600'}
          icon="alert-triangle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Member performance table ──────────────────────────────── */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="ti ti-users text-brand-500" />
            Member performance
          </h2>

          {memberStats.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No members found</p>
          ) : (
            <div className="space-y-4">
              {memberStats.map((m) => (
                <div key={m._id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 leading-tight">
                          {m.name}
                          {!m.isActive && (
                            <span className="ml-2 text-xs text-yellow-600 font-normal">(on leave)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{m.department || 'No department'}</p>
                      </div>
                    </div>

                    {/* Completion % */}
                    <span className={`text-xs font-semibold ${m.pct >= 75 ? 'text-green-600' : m.pct >= 40 ? 'text-brand-600' : 'text-yellow-600'}`}>
                      {m.pct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500
                        ${m.pct >= 75 ? 'bg-green-500' : m.pct >= 40 ? 'bg-brand-500' : 'bg-yellow-400'}`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>

                  {/* Mini stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{m.total} tasks</span>
                    <span className="text-green-600">✓ {m.done} done</span>
                    {m.inProgress > 0 && <span className="text-blue-500">↻ {m.inProgress} in progress</span>}
                    {m.overdue > 0   && <span className="text-red-500">⚠ {m.overdue} overdue</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Project completion */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ti ti-folder text-brand-500" />
              Project completion
            </h2>
            {projectStats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No projects</p>
            ) : (
              <div className="space-y-3">
                {projectStats.slice(0, 6).map((p) => (
                  <div key={p._id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-800 truncate">{p.title}</span>
                        <Badge label={p.isOverdue ? 'overdue' : p.status} />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">
                        {p.done}/{p.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500
                          ${p.pct >= 75 ? 'bg-green-500' : p.pct >= 40 ? 'bg-brand-500' : 'bg-yellow-400'}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority breakdown */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ti ti-flag text-brand-500" />
              Tasks by priority
            </h2>
            <div className="space-y-2.5">
              {byPriority.map(({ label, count }) => {
                const pct = totalTasks ? Math.round((count / totalTasks) * 100) : 0;
                const barColor =
                  label === 'critical' ? 'bg-red-500' :
                  label === 'high'     ? 'bg-orange-400' :
                  label === 'medium'   ? 'bg-yellow-400' :
                                         'bg-gray-300';
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge label={label} />
                      </div>
                      <span className="text-xs text-gray-500">{count} tasks ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status summary */}
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ti ti-chart-pie text-brand-500" />
              Tasks by status
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {['todo', 'in-progress', 'review', 'done', 'blocked'].map((s) => {
                const count = filteredTasks.filter((t) => t.status === s).length;
                return (
                  <div key={s} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <Badge label={s} />
                    <span className="text-sm font-semibold text-gray-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}