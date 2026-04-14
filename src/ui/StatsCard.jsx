function StatsCard({ data, title, icon, className }) {
  return (
    <div
      className={`bg-obsidian-deep/60 border-obsidian-border hover:border-pulse-extra/50  flex w-full items-center justify-between rounded-2xl border-2 p-4 backdrop-blur-xs transition-all sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-1 sm:gap-2">
        <p className=" text-pulse-extra text-2xl font-bold sm:text-4xl">
          {data}
        </p>
        <p className=" text-text-primary/80 text-base sm:text-lg">{title}</p>
      </div>
      {icon}
    </div>
  );
}

export default StatsCard;
