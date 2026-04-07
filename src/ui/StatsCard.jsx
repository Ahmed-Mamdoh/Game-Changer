function StatsCard({ data, title, icon }) {
  return (
    <div className="bg-obsidian-deep/60 flex w-full items-center justify-between rounded-2xl p-5 backdrop-blur-xs">
      <div className="flex flex-col gap-2">
        <p className=" text-pulse-extra text-4xl font-bold">{data}</p>
        <p className=" text-text-primary/80 text-lg">{title}</p>
      </div>
      {icon}
    </div>
  );
}

export default StatsCard;
