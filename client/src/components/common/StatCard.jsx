const presets = {
  indigo: {
    bg:   'bg-indigo-600',
    glow: 'shadow-indigo-200',
    ring: 'ring-indigo-100',
    text: 'text-indigo-700',
    light:'bg-indigo-50',
  },
  emerald: {
    bg:   'bg-emerald-600',
    glow: 'shadow-emerald-200',
    ring: 'ring-emerald-100',
    text: 'text-emerald-700',
    light:'bg-emerald-50',
  },
  rose: {
    bg:   'bg-rose-600',
    glow: 'shadow-rose-200',
    ring: 'ring-rose-100',
    text: 'text-rose-700',
    light:'bg-rose-50',
  },
  amber: {
    bg:   'bg-amber-500',
    glow: 'shadow-amber-200',
    ring: 'ring-amber-100',
    text: 'text-amber-700',
    light:'bg-amber-50',
  },
  purple: {
    bg:   'bg-purple-600',
    glow: 'shadow-purple-200',
    ring: 'ring-purple-100',
    text: 'text-purple-700',
    light:'bg-purple-50',
  },
};

export default function StatCard({
  label, value, sub, subColor, icon,
  color = 'indigo', trend, className = '',
}) {
  const c = presets[color] || presets.indigo;

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 lg:p-5
                     shadow-sm hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-300 animate-fade-up group
                     ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="section-label mb-2">{label}</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900
                        tracking-tight leading-none">
            {value}
          </p>
          {sub && (
            <p className={`text-xs font-semibold mt-1.5 flex items-center gap-1
              ${subColor || 'text-gray-400'}`}>
              {trend === 'up'   && <i className="ti ti-trending-up text-sm" />}
              {trend === 'down' && <i className="ti ti-trending-down text-sm" />}
              {sub}
            </p>
          )}
        </div>

        <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-2xl ${c.bg}
                         flex items-center justify-center shrink-0
                         shadow-md ${c.glow}
                         group-hover:scale-110 transition-transform duration-300`}>
          <i className={`ti ti-${icon} text-xl text-white`} />
        </div>
      </div>
    </div>
  );
}