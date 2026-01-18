import GameItem from "./GameItem";
import Spinner from "../../../ui/Spinner";

function GamesGallary({ data, isLoading }) {
  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto flex flex-wrap items-center justify-center gap-x-16 gap-y-10 px-4 pt-8 pb-16 md:px-6 lg:px-8">
      {data?.length === 0 && (
        <span className="text-3xl font-bold">🔍 No Games Found</span>
      )}
      {data?.message && (
        <span className="text-3xl font-bold text-red-500">{data?.message}</span>
      )}
      {data?.[0]?.message && (
        <span className="text-3xl font-bold text-red-500">
          {data?.[0]?.message}
        </span>
      )}
      {data?.length > 0 &&
        data[0]?.id &&
        data?.map((game) => {
          if (!game.id) return null;
          return <GameItem key={game.id} game={game} />;
        })}
    </div>
  );
}

export default GamesGallary;
