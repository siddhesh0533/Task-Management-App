export const SkeletonRow = ({ cols = 3 }) => (
  <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-surface-700/40 last:border-0">
    {Array.from({ length: cols }).map((_, i) => (
      <div
        key={i}
        className={`skeleton h-4 rounded ${i === 0 ? 'flex-1' : 'w-16 sm:w-20'}`}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="panel p-4 sm:p-5 space-y-3">
    <div className="skeleton h-5 w-1/3 rounded" />
    <div className="skeleton h-3 w-2/3 rounded" />
    <div className="skeleton h-3 w-1/2 rounded" />
  </div>
);