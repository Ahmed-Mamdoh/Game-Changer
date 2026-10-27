import UserCharts from "./UserCharts";

function UserStats({ userGames, isLoading }) {
  const user_games = userGames?.filter(
    (userGame) => userGame.status !== "to play",
  );
  const totalHours = user_games?.length
    ? user_games.reduce(
        (acc, userGame) => acc + (userGame.hours_played || 0),
        0,
      )
    : 0;
  const genresCount = user_games
    ?.map((userGame) => userGame?.game?.genres || [])
    .flat()
    .reduce((acc, item) => {
      return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
  const ThemesCount = user_games
    ?.map((userGame) => userGame?.game?.themes || [])
    .flat()
    .reduce((acc, item) => {
      return { ...acc, [item]: (acc[item] || 0) + 1 };
    }, {});
  const mostPlayedGenre =
    Object.entries(genresCount || {}).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";
  const mostPlayedTheme =
    Object.entries(ThemesCount || {}).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";
  const facts = [
    { label: "hours played", value: totalHours.toLocaleString() },
    { label: "games played", value: user_games?.length || 0 },
    { label: "top genre", value: mostPlayedGenre.split("(")[0].trim() },
    { label: "top theme", value: mostPlayedTheme },
  ];

  return (
    <>
      <dl className="border-stroke-subtle bg-bg-surface grid grid-cols-2 overflow-hidden rounded-lg border sm:grid-cols-4">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`border-stroke-subtle flex flex-col-reverse gap-0.5 px-4 py-3 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
          >
            <dt className="text-text-dim text-xs">{fact.label}</dt>
            <dd
              className={`text-text-main tabular truncate font-semibold ${
                i === 0 ? "text-2xl" : "text-lg"
              }`}
            >
              {isLoading ? "—" : fact.value}
            </dd>
          </div>
        ))}
      </dl>
      <UserCharts user_games={user_games} isLoading={isLoading} />
    </>
  );
}

export default UserStats;
