function StatsCard({ data, title, icon, className }) {
  return (
    <div
      className={`bg-bg-card border-stroke-medium hover:border-pulse-secondary flex
        h-full w-full flex-col items-start justify-between rounded-xl border p-4
        backdrop-blur-xl transition-all sm:p-5 ${className}`}
    >
      <p className="text-base">{title}</p>
      <div className="flex w-full items-end justify-between gap-1 sm:gap-2">
        <h2 className="text-text-brand">{data}</h2>
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;
