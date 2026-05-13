export default function StatCard({
  label, value, sub, subColor = 'text-gray-400', icon, color = 'indigo',
}) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200',
    green:  'from-emerald-500 to-green-600 shadow-emerald-200',
    red:    'from-red-500 to-rose-600 shadow-red-200',
    amber:  'from-amber-500 to-orange-500 shadow-amber-200',
    purple: 'from-purple-500 to-violet-600 shadow-purple-200',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                    hover:shadow-md transition-all duration-300 animate-fade-in
                    hover:-translate-y-0.5 group">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color] || colors.indigo}
                         flex items-center justify-center shadow-md
                         group-hover:scale-110 transition-transform duration-200 shrink-0`}>
          <i className={`ti ti-${icon} text-xl text-white`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
          {sub && (
            <p className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}