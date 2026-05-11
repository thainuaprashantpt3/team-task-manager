// export default function ProgressBar({ value = 0, showLabel = true, className = '' }) {
//   const pct = Math.min(100, Math.max(0, Math.round(value)));

//   const color =
//     pct >= 75 ? 'bg-green-500' :
//     pct >= 40 ? 'bg-brand-500' :
//                 'bg-yellow-400';

//   return (
//     <div className={`flex items-center gap-3 ${className}`}>
//       <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${color}`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//       {showLabel && (
//         <span className="text-xs text-gray-500 w-8 text-right shrink-0">
//           {pct}%
//         </span>
//       )}
//     </div>
//   );
// }






export default function ProgressBar({
  value = 0,
  showLabel = true,
  size = 'md',       // sm | md | lg
  overdue = false,
  className = '',
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  const color = overdue
    ? 'bg-red-500'
    : pct >= 75 ? 'bg-green-500'
    : pct >= 40 ? 'bg-blue-500'
    :             'bg-yellow-400';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-medium shrink-0 w-8 text-right
          ${overdue ? 'text-red-500' : 'text-gray-500'}`}>
          {pct}%
        </span>
      )}
    </div>
  );
}