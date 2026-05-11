import { useState } from 'react';
import Badge from './Badge';

export default function TaskLogs({ logs = [], isAdmin = false }) {
  const [expanded, setExpanded] = useState(false);

  const sorted  = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const visible = expanded ? sorted : sorted.slice(0, 3);
  const hasMore = sorted.length > 3;

  if (sorted.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic py-2 text-center">
        No activity logged yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {visible.map((log, i) => (
        <div key={i}
          className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center
                              text-xs font-bold text-blue-700 shrink-0">
                {(log.updatedBy?.name || '?').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {log.updatedBy?.name || 'Unknown'}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(log.date).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {log.status && <Badge label={log.status} />}
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all
                    ${log.progress >= 75 ? 'bg-green-500' :
                      log.progress >= 40 ? 'bg-blue-500' : 'bg-yellow-400'}`}
                  style={{ width: `${log.progress || 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 w-8 text-right shrink-0">
                {log.progress || 0}%
              </span>
            </div>
          </div>

          {log.notes && (
            <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-1.5">
              {log.notes}
            </p>
          )}
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium
                     text-blue-600 hover:text-blue-700 py-2
                     border border-dashed border-blue-200 rounded-lg hover:bg-blue-50
                     transition-colors"
        >
          <i className={`ti ti-chevron-${expanded ? 'up' : 'down'} text-sm`} />
          {expanded
            ? 'Show less'
            : isAdmin
              ? `Show more queue ▼  (${sorted.length - 3} more entries)`
              : `Tap to expand ▼  (${sorted.length - 3} more days)`
          }
        </button>
      )}
    </div>
  );
}