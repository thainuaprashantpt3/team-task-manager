import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';

export default function MemberProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    api.get('/projects')
      .then(({ data }) => setProjects(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? projects
    : projects.filter((p) => p.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My projects</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Projects you own or are a member of
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'planning', 'on-hold', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${filter === f
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Project cards */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <i className="ti ti-folder-off text-5xl text-gray-200" />
          <p className="text-gray-400 mt-3 text-sm">No projects found</p>
          <p className="text-gray-300 text-xs mt-1">
            Ask your admin to add you to a project
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p._id}
              className={`card hover:shadow-md transition-shadow
                ${p.isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}
            >
              {/* Title + badge */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                  {p.title}
                </h3>
                <Badge label={p.isOverdue ? 'overdue' : p.status} />
              </div>

              {/* Description */}
              {p.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
              )}

              {/* Progress */}
              <ProgressBar value={p.progress} className="mb-3" />

              {/* Meta row */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <i className="ti ti-users text-sm" />
                  {p.members?.length || 0} members
                </span>
                {p.deadline && (
                  <span className={`flex items-center gap-1 ${p.isOverdue ? 'text-red-400' : ''}`}>
                    <i className="ti ti-calendar text-sm" />
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Owner */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                  {p.owner?.name?.charAt(0) || 'A'}
                </div>
                <span className="text-xs text-gray-400">
                  Owned by <span className="text-gray-600 font-medium">{p.owner?.name || 'Admin'}</span>
                </span>
                <Link
                  to={`/projects/${p._id}`}
                  className="ml-auto text-xs text-brand-600 hover:underline font-medium"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}