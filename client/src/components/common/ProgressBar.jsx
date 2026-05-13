export default function ProgressBar({
  value = 0, showLabel = true, size = 'md',
  overdue = false, className = '',
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  const color = overdue       ? 'bg-red-500' :
                pct >= 75     ? 'bg-emerald-500' :
                pct >= 40     ? 'bg-indigo-500' :
                                'bg-amber-400';

  const glow  = overdue       ? '' :
                pct >= 75     ? 'shadow-emerald-300' :
                pct >= 40     ? 'shadow-indigo-300' :
                                '';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out
                      ${color} ${glow}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-bold w-8 text-right shrink-0
          ${overdue ? 'text-red-500' : 'text-gray-600'}`}>
          {pct}%
        </span>
      )}
    </div>
  );
}