function StatsCard({ data, title, icon, className }) {
  return (
    <div
      className={`bg-obsidian-deep/60 border-obsidian-border hover:border-pulse-extra/50 flex h-full w-full flex-col items-start justify-between rounded-2xl border-2 p-4 backdrop-blur-xs transition-all sm:p-5 ${className}`}
    >
      <p className=" text-text-secondary text-base sm:text-base">{title}</p>
      <div className="flex w-full items-end justify-between gap-1 sm:gap-2">
        <p className=" text-pulse-extra text-2xl font-bold sm:text-4xl">
          {data}
        </p>
        {icon}
      </div>
    </div>
  );
}

export default StatsCard;
