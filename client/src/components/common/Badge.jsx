const variants = {
  'todo':        'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'review':      'bg-amber-100 text-amber-800',
  'done':        'bg-emerald-100 text-emerald-700',
  'blocked':     'bg-red-100 text-red-700',
  'low':         'bg-slate-100 text-slate-600',
  'medium':      'bg-amber-100 text-amber-700',
  'high':        'bg-orange-100 text-orange-700',
  'critical':    'bg-red-100 text-red-700',
  'active':      'bg-emerald-100 text-emerald-700',
  'planning':    'bg-indigo-100 text-indigo-700',
  'on-hold':     'bg-amber-100 text-amber-700',
  'completed':   'bg-emerald-100 text-emerald-800',
  'overdue':     'bg-red-100 text-red-700',
  'admin':       'bg-purple-100 text-purple-700',
  'member':      'bg-slate-100 text-slate-600',
};

const dots = {
  'done':      'bg-emerald-500',
  'active':    'bg-emerald-500',
  'completed': 'bg-emerald-500',
  'in-progress':'bg-blue-500',
  'blocked':   'bg-red-500',
  'overdue':   'bg-red-500',
};

export default function Badge({ label }) {
  const cls = variants[label] || 'bg-gray-100 text-gray-600';
  const dot = dots[label];

  return (
    <span className={`badge ${cls}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      )}
      {label?.replace('-', ' ')}
    </span>
  );
}