import GameItem from "./GameItem";
import Spinner from "../../../ui/Spinner";

function GamesGallery({ data, isLoading }) {
  if (isLoading) return <Spinner />;

  return (
    <div
      className="mx-auto grid w-9/10 grid-cols-[repeat(auto-fill,minmax(144px,1fr))]
    justify-items-center gap-x-2 gap-y-4 pt-8 pb-16 md:grid-cols-[repeat(auto-fill,minmax(192px,1fr))] md:gap-x-10"
    >
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
        data?.map((game) => {
          if (!game.id) return null;
          return <GameItem key={game.id} game={game} />;
        })}
    </div>
  );
}

export default GamesGallery;
