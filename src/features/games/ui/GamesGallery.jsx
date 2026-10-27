import { Link } from "react-router-dom";
import GameItem from "./GameItem";

function GamesGallery({
  data,
  isLoading,
  emptyTitle = "No games match",
  emptyText = "Try fewer filters or a different search.",
  emptyAction,
}) {
  const errorMessage = data?.message || data?.[0]?.message;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[repeat(auto-fill,minmax(var(--game-card-w-mobile),1fr))] gap-x-4 gap-y-6 px-4 pt-6 pb-16 md:grid-cols-[repeat(auto-fill,minmax(var(--game-card-w-desktop),1fr))] md:px-8">
      {isLoading &&
        Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2" aria-hidden="true">
            <div className="bg-bg-surface aspect-[3/4] animate-pulse rounded-md" />
            <div className="bg-bg-surface h-4 w-3/4 animate-pulse rounded-sm" />
          </div>
        ))}

      {!isLoading && errorMessage && (
        <p className="text-text-error col-span-full py-16 text-center">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && data?.length === 0 && (
        <div className="col-span-full py-16 text-center">
          <h3>{emptyTitle}</h3>
          <p className="mx-auto mt-1 max-w-[50ch]">{emptyText}</p>
          {emptyAction && (
            <Link to={emptyAction.to} className="btn-primary mt-5">
              {emptyAction.label}
            </Link>
          )}
        </div>
      )}

      {!isLoading &&
        data?.length > 0 &&
        data.map((game) =>
          game.id ? <GameItem key={game.id} game={game} /> : null,
        )}
    </div>
  );
}

export default GamesGallery;
