export default function EmptyState({
  icon = 'inbox',
  title = 'Nothing here yet',
  description = '',
  action = null,   // { label: 'Create project', onClick: fn }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <i className={`ti ti-${icon} text-2xl text-gray-400`} />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      {description && (
        <p className="text-xs text-gray-400 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-4 flex items-center gap-2"
        >
          <i className="ti ti-plus text-sm" />
          {action.label}
        </button>
      )}
    </div>
  );
}