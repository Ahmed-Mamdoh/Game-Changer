function StatsCard({ data, title, icon }) {
  return (
    <div className="bg-obsidian-deep/60 border-obsidian-border hover:border-pulse-extra/50 flex w-full items-center justify-between rounded-2xl border-2 p-5 backdrop-blur-xs transition-all">
      <div className="flex flex-col gap-2">
        <p className=" text-pulse-extra text-4xl font-bold">{data}</p>
        <p className=" text-text-primary/80 text-lg">{title}</p>
      </div>
      {icon}
    </div>
  );
}

export default StatsCard;
