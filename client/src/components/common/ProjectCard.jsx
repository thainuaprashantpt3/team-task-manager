import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import Badge from './Badge';
import TaskLogs from './TaskLogs';

export default function ProjectCard({ project, isAdmin, onDelete }) {
  const [showTasks, setShowTasks] = useState(false);

  const memberAvatars = (project.assignedMembers || []).slice(0, 4);
  const extra         = (project.assignedMembers || []).length - 4;

  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md
                     transition-shadow space-y-3
                     ${project.isOverdue ? 'border-red-200 bg-red-50/20' : 'border-gray-100'}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/projects/${project._id}`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600
                         transition-colors truncate"
            >
              {project.title}
            </Link>
            {project.isOverdue && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                Overdue
              </span>
            )}
          </div>

          {/* Owner info — visible to admin */}
          {isAdmin && project.owner && (
            <p className="text-xs text-gray-400 mt-0.5">
              Created by <span className="font-medium text-gray-600">{project.owner.name}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Badge label={project.status} />
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="p-1 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
              title="Delete project"
            >
              <i className="ti ti-trash text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className={`text-xs font-semibold
            ${project.isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
            {project.progress || 0}%
          </span>
        </div>
        <ProgressBar
          value={project.progress || 0}
          showLabel={false}
          size="md"
          overdue={project.isOverdue}
        />
      </div>

      {/* Assigned members row */}
      {(project.assignedMembers || []).length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {memberAvatars.map((m) => (
              <div
                key={m._id}
                title={m.name}
                className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white
                           flex items-center justify-center text-xs font-bold text-blue-700"
              >
                {m.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {extra > 0 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white
                              flex items-center justify-center text-xs font-bold text-gray-600">
                +{extra}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {(project.assignedMembers || []).length} member{(project.assignedMembers || []).length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Deadline */}
      {project.deadline && (
        <div className={`flex items-center gap-1 text-xs
          ${project.isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
          <i className="ti ti-calendar text-sm" />
          {new Date(project.deadline).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          onClick={() => setShowTasks(!showTasks)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium
                     flex items-center gap-1"
        >
          <i className={`ti ti-chevron-${showTasks ? 'up' : 'down'} text-sm`} />
          {showTasks ? 'Hide tasks' : 'View tasks'}
        </button>
        <Link
          to={`/projects/${project._id}`}
          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}