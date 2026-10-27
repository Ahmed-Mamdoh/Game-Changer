// The number leads; label above, icon muted beside it
function StatsCard({ data, title, icon, className = "" }) {
  return (
    <div
      className={`bg-bg-surface border-stroke-subtle flex h-full w-full flex-col justify-between gap-3 rounded-lg border p-4 ${className}`}
    >
      <p className="text-text-dim text-sm">{title}</p>
      <div className="flex w-full items-end justify-between gap-2">
        <span className="text-text-main tabular text-2xl font-semibold">
          {data}
        </span>
        <span className="text-text-muted [&>svg]:mb-0 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-current">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default StatsCard;
