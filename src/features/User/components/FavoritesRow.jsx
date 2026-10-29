import {
  MAX_FAVORITES,
  gameOfEntry,
  useFavorites,
} from "@/features/games/hooks/useFavorites";
import { coverUrlOf } from "@/utils/igdbImage";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Heart, X } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

// The hearted games in the order the player dragged them into. Libraries from
// before the cap can hold more than five; they all show so they can be trimmed.
function FavoritesRow() {
  const { favorites, toggleFavorite, reorderFavorites } = useFavorites();
  const slots = Math.max(MAX_FAVORITES, favorites.length);
  const ids = favorites.map((f) => f.game_id);
  // A drag ends with a click on the cover; this stops it opening the game
  const justDragged = useRef(false);

  const sensors = useSensors(
    // A short move before dragging, so a plain click still opens the game
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Press and hold on touch, so the row still scrolls the page
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }) {
    setTimeout(() => (justDragged.current = false));
    if (!over || active.id === over.id) return;
    reorderFavorites(
      arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id)),
    );
  }

  return (
    <section
      aria-labelledby="favorites-title"
      className="panel flex flex-col gap-3 p-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="favorites-title"
          className="text-text-main flex items-center gap-2 text-lg font-semibold"
        >
          <Heart className="text-pulse-error h-4 w-4" aria-hidden="true" />
          Favorites
        </h2>
        <span className="text-text-dim tabular text-sm">
          {favorites.length} of {MAX_FAVORITES}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => (justDragged.current = true)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => (justDragged.current = false)}
      >
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-5 gap-2 sm:gap-3">
            {favorites.map((favorite) => (
              <FavoriteSlot
                key={favorite.game_id}
                favorite={favorite}
                justDragged={justDragged}
                onRemove={() => toggleFavorite(gameOfEntry(favorite))}
              />
            ))}
            {Array.from({ length: slots - favorites.length }, (_, i) => (
              <li
                key={`empty-${i}`}
                className="border-stroke-medium text-text-muted flex aspect-[3/4] items-center justify-center rounded-md border border-dashed"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {favorites.length === 0 && (
        <p className="text-text-dim text-sm">
          Heart a game you&apos;ve played to pin it here.
        </p>
      )}
      {favorites.length > 1 && favorites.length <= MAX_FAVORITES && (
        <p className="text-text-muted text-xs">Drag to reorder.</p>
      )}
      {favorites.length > MAX_FAVORITES && (
        <p className="text-text-dim text-sm">
          Favorites now hold {MAX_FAVORITES}. Remove{" "}
          {favorites.length - MAX_FAVORITES} to heart new ones.
        </p>
      )}
    </section>
  );
}

function FavoriteSlot({ favorite, justDragged, onRemove }) {
  const { game_id, game } = favorite;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game_id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`group relative touch-manipulation ${isDragging ? "z-10 scale-105 shadow-[var(--shadow-float)]" : ""}`}
    >
      <Link
        ref={setActivatorNodeRef}
        to={`/game/${game_id}`}
        title={game?.name}
        onClick={(e) => justDragged.current && e.preventDefault()}
        className="block cursor-grab rounded-md active:cursor-grabbing"
        {...attributes}
        {...listeners}
        // Still a link to the game; Space picks it up to move it
        role="link"
        aria-roledescription="sortable favorite"
      >
        <img
          src={coverUrlOf(game)}
          alt={game?.name}
          loading="lazy"
          draggable={false}
          className="bg-bg-raised aspect-[3/4] w-full rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover:brightness-110"
        />
      </Link>
      {!isDragging && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove from favorites"
          aria-label={`Remove ${game?.name} from favorites`}
          className="text-text-main hover:bg-pulse-error absolute top-1 right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border border-white/15 bg-black/65 backdrop-blur-md transition-[opacity,background-color] duration-100 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );
}

export default FavoritesRow;
