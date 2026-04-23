import GameItem from "./GameItem";
import Spinner from "../../../ui/Spinner";

function GamesGallery({ data, isLoading }) {
  if (isLoading) return <Spinner />;

  return (
    <div
      className="relative mx-auto grid w-9/10 grid-cols-[repeat(auto-fill,minmax(var(--game-card-w-mobile),1fr))]
    justify-items-center gap-y-2 pt-8 pb-16 md:grid-cols-[repeat(auto-fill,minmax(var(--game-card-w-desktop),1fr))] md:gap-y-5"
    >
      {data?.length === 0 && (
        <h2 className="col-span-full">🔍 No Games Found</h2>
      )}
      {data?.message && <h2 className="text-text-error">{data?.message}</h2>}
      {data?.[0]?.message && (
        <h2 className="text-text-error">{data?.[0]?.message}</h2>
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
