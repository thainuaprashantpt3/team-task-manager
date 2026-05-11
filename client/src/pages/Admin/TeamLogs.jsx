import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function TeamLogs() {
  const [data,      setData]      = useState({ byMember: [], logs: [], total: 0 });
  const [projects,  setProjects]  = useState([]);
  const [members,   setMembers]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState('member'); // 'member' | 'timeline'
  const [expanded,  setExpanded]  = useState(null);    // memberId expanded

  // Filters
  const [filters, setFilters] = useState({
    memberId:  '',
    projectId: '',
    date:      '',
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.memberId)  params.append('memberId',  filters.memberId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.date)      params.append('date',      filters.date);

      const { data: res } = await api.get(
        `/tasks/reports/team-logs?${params.toString()}`
      );
      setData(res);
    } catch {
      toast.error('Failed to load team logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/users')]).then(([pRes, mRes]) => {
      setProjects(pRes.data.data);
      setMembers(mRes.data.data.filter(m => m.role === 'member'));
    });
  }, []);

  const setFilter = (key, val) =>
    setFilters(f => ({ ...f, [key]: val }));

  const clearFilters = () =>
    setFilters({ memberId: '', projectId: '', date: '' });

  const hasFilters = filters.memberId || filters.projectId || filters.date;

  // Today's logs count
  const today     = new Date(); today.setHours(0, 0, 0, 0);
  const todayLogs = data.logs.filter(l => {
    const d = new Date(l.date); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  // Members who have NOT logged today
  const loggedTodayIds = new Set(
    todayLogs.map(l => l.updatedBy?._id?.toString())
  );
  const notLoggedToday = members.filter(
    m => m.isActive && !loggedTodayIds.has(m._id)
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team activity logs</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data.total} log entries · {todayLogs.length} submitted today
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'member',   label: 'By member',   icon: 'users' },
            { key: 'timeline', label: 'Timeline',    icon: 'calendar-time' },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                          transition-colors
                ${view === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}>
              <i className={`ti ti-${icon} text-sm`} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Alert: members not logged today ─────────────────────── */}
      {notLoggedToday.length > 0 && !filters.date && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3
                        flex items-start gap-3">
          <i className="ti ti-clock-exclamation text-amber-500 text-lg shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {notLoggedToday.length} member{notLoggedToday.length > 1 ? 's have' : ' has'} not
              logged work today
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {notLoggedToday.map(m => (
                <button key={m._id}
                  onClick={() => setFilter('memberId', m._id)}
                  className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full
                             hover:bg-amber-200 transition-colors font-medium">
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Filter by member
            </label>
            <select value={filters.memberId}
              onChange={e => setFilter('memberId', e.target.value)}
              className="input">
              <option value="">All members</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Filter by project
            </label>
            <select value={filters.projectId}
              onChange={e => setFilter('projectId', e.target.value)}
              className="input">
              <option value="">All projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Filter by date
            </label>
            <div className="flex gap-2">
              <input type="date" value={filters.date}
                onChange={e => setFilter('date', e.target.value)}
                className="input flex-1" />
              {hasFilters && (
                <button onClick={clearFilters}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                             text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick date shortcuts */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: 'Today',     days: 0 },
            { label: 'Yesterday', days: -1 },
          ].map(({ label, days }) => {
            const d = new Date();
            d.setDate(d.getDate() + days);
            const val = d.toISOString().split('T')[0];
            return (
              <button key={label}
                onClick={() => setFilter('date', filters.date === val ? '' : val)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors font-medium
                  ${filters.date === val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <Spinner className="h-48" />
      ) : data.total === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
          <i className="ti ti-notes-off text-5xl text-gray-200" />
          <p className="text-gray-500 text-sm font-medium mt-3">No logs found</p>
          <p className="text-gray-400 text-xs mt-1">
            {hasFilters ? 'Try different filters' : 'Members have not logged any work yet'}
          </p>
        </div>
      ) : view === 'member' ? (
        /* ── By member view ─────────────────────────────────────── */
        <div className="space-y-4">
          {data.byMember.map(entry => {
            const isOpen  = expanded === entry.member?._id;
            const recentLogs = entry.logs.slice(0, 3);
            const hasMore = entry.logs.length > 3;

            // Check if this member logged today
            const loggedToday = entry.logs.some(l => {
              const d = new Date(l.date); d.setHours(0, 0, 0, 0);
              return d.getTime() === today.getTime();
            });

            return (
              <div key={entry.member?._id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

                {/* Member header */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">

                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center
                                      justify-center text-sm font-bold text-blue-700 shrink-0">
                        {entry.member?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900">
                            {entry.member?.name || 'Unknown'}
                          </p>
                          {loggedToday ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5
                                             rounded-full font-medium flex items-center gap-1">
                              <i className="ti ti-circle-check text-xs" /> Logged today
                            </span>
                          ) : (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5
                                             rounded-full font-medium flex items-center gap-1">
                              <i className="ti ti-clock text-xs" /> Not yet today
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {entry.member?.department || entry.member?.email}
                          <span className="mx-1.5">·</span>
                          {entry.totalLogs} log{entry.totalLogs !== 1 ? 's' : ''} total
                        </p>
                      </div>
                    </div>

                    {/* Avg progress + expand */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Avg progress</p>
                        <p className={`text-lg font-bold
                          ${entry.avgProgress >= 75 ? 'text-green-600' :
                            entry.avgProgress >= 40 ? 'text-blue-600' :
                            'text-yellow-600'}`}>
                          {entry.avgProgress}%
                        </p>
                      </div>
                      <button
                        onClick={() => setExpanded(isOpen ? null : entry.member?._id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border
                                   border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50
                                   transition-colors">
                        <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'} text-sm`} />
                        {isOpen ? 'Collapse' : 'View logs'}
                      </button>
                    </div>
                  </div>

                  {/* Recent 3 logs preview */}
                  {!isOpen && entry.logs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {recentLogs.map((log, i) => (
                        <LogRow key={i} log={log} compact />
                      ))}
                      {hasMore && !isOpen && (
                        <button
                          onClick={() => setExpanded(entry.member?._id)}
                          className="w-full text-xs text-blue-600 hover:text-blue-700
                                     font-medium py-1.5 border border-dashed border-blue-200
                                     rounded-lg hover:bg-blue-50 transition-colors">
                          Show more queue ▼ ({entry.logs.length - 3} more entries)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded: all logs */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600">
                        All activity — {entry.logs.length} entries
                      </p>
                      <button onClick={() => setExpanded(null)}
                        className="text-xs text-gray-400 hover:text-gray-600">
                        Collapse ↑
                      </button>
                    </div>
                    {entry.logs.map((log, i) => (
                      <LogRow key={i} log={log} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Timeline view ──────────────────────────────────────── */
        <div className="space-y-3">
          {data.logs.map((log, i) => (
            <LogRow key={i} log={log} showMember />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single log row component ───────────────────────────────────────────────
function LogRow({ log, compact = false, showMember = false }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg
      ${compact ? 'px-3 py-2' : 'px-4 py-3'} space-y-2`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {/* Member avatar (timeline view) */}
          {showMember && log.updatedBy && (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center
                            text-xs font-bold text-blue-700 shrink-0">
              {log.updatedBy.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            {showMember && (
              <span className="text-xs font-semibold text-gray-800 mr-1.5">
                {log.updatedBy?.name}
              </span>
            )}

            {/* Task title */}
            <span className="text-xs font-medium text-gray-700 truncate">
              {log.task?.title}
            </span>

            {/* Project */}
            {log.project?.title && (
              <span className="text-xs text-gray-400 ml-1.5">
                · {log.project.title}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(log.date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      </div>

      {/* Status + progress bar */}
      <div className="flex items-center gap-3">
        {log.status && <Badge label={log.status} />}
        {log.task?.isOverdue && <Badge label="overdue" />}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all
                ${(log.progress || 0) >= 75 ? 'bg-green-500' :
                  (log.progress || 0) >= 40 ? 'bg-blue-500' : 'bg-yellow-400'}`}
              style={{ width: `${log.progress || 0}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600 w-8 text-right shrink-0">
            {log.progress || 0}%
          </span>
        </div>
      </div>

      {/* Notes */}
      {log.notes && !compact && (
        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded px-2 py-1.5">
          {log.notes}
        </p>
      )}
      {log.notes && compact && (
        <p className="text-xs text-gray-500 truncate">{log.notes}</p>
      )}
    </div>
  );
}