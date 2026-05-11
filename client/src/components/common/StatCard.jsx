export default function StatCard({ label, value, sub, subColor = 'text-gray-400', icon }) {
  return (
    <div className="card flex items-start gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
          <i className={`ti ti-${icon} text-xl text-brand-600`} />
        </div>
      )}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}