const variants = {
  todo:        'bg-gray-100 text-gray-600',
  'in-progress':'bg-blue-50 text-blue-700',
  review:      'bg-yellow-50 text-yellow-700',
  done:        'bg-green-50 text-green-700',
  blocked:     'bg-red-50 text-red-700',
  low:         'bg-gray-100 text-gray-600',
  medium:      'bg-yellow-50 text-yellow-700',
  high:        'bg-orange-50 text-orange-700',
  critical:    'bg-red-100 text-red-700',
  active:      'bg-green-50 text-green-700',
  planning:    'bg-blue-50 text-blue-700',
  'on-hold':   'bg-yellow-50 text-yellow-700',
  completed:   'bg-green-100 text-green-800',
  overdue:     'bg-red-100 text-red-700',
  admin:       'bg-purple-50 text-purple-700',
  member:      'bg-gray-100 text-gray-600',
};

export default function Badge({ label }) {
  const cls = variants[label] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`badge ${cls}`}>
      {label.replace('-', ' ')}
    </span>
  );
}