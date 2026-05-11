export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <i className={`ti ti-loader-2 animate-spin text-brand-500 ${sizes[size]}`} />
    </div>
  );
}