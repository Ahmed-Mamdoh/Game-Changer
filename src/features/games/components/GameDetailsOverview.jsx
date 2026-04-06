import { deleteUserGame, updateUserGame } from "@/api/supabase";
import { useGetUserGame } from "@/features/User/hooks/useGetUserGame";
import Rating from "@/ui/Rating";
import Spinner from "@/ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaSteam, FaTrash } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import AddGameModal from "./AddGameModal";

function GameDetailsOverview({ data }) {
  const {
    id,
    name,
    first_release_date: releaseDate,
    summary,
    cover,
    artworks,
    total_rating: rating,
    total_rating_count: ratingCount,
    genres,
    themes,
    game_modes,
    external_games,
  } = data[0];

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;

  const { data: timeToBeat } = useGetTimeToBeat();
  const { data: userGame, isLoading: isLoadingUserGame } =
    useGetUserGame(user_id);

  //  gets the full quality image instead of low quality
  const chosenArtwork =
    artworks.find((a) => a.artwork_type === 2) ||
    artworks.find((a) => a.artwork_type === 3) ||
    artworks.find((a) => a.artwork_type === 1) ||
    artworks.find((a) => a.artwork_type === 4) ||
    artworks[0];
  const imageUrl =
    chosenArtwork?.url
      ?.replace("t_thumb", "t_1080p_2x")
      ?.replace("jpg", "webp") || null;

  if (isLoadingUserGame) return <Spinner />;

  function handleDeleteGame() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "oklch(63% 0.237 25.331)",
      background: "oklch(22% 0.019 237.69)",
      color: "oklch(77.383% 0.043 245.096)",
      cancelButtonColor: "oklch(26% 0.019 237.69)",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // delete game logic
        toast
          .promise(
            async () => {
              const { error } = await deleteUserGame({ game_id: id, user_id });
              if (error) throw error;
            },
            {
              loading: "Deleting game...",
              success: "Game deleted successfully",
              error: (error) => error.message,
            },
          )
          .finally(() => {
            const gameId = String(id);
            queryClient.invalidateQueries({
              queryKey: ["user_game", user_id, gameId],
            });
            queryClient.invalidateQueries({
              queryKey: ["user_games", user_id],
            });
          });
      }
    });
  }

  async function handleFavoriteChange(e) {
    const isFavorite = e.target.checked;

    const { error } = await updateUserGame({
      game_id: id,
      user_id,
      is_favorite: isFavorite,
    });
    if (error) throw error;

    queryClient.invalidateQueries({
      queryKey: ["user_games", user_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, String(id)],
    });
  }

  return (
    <>
      <div className="relative h-[100vh] w-full overflow-hidden">
        {/* Cover */}
        <img src={imageUrl} className="h-full w-full object-cover" />
        <div className=" to-obsidian-muted pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15" />

        {/* Content */}
        <div className="absolute bottom-[25%] left-1/2 flex w-9/10 -translate-x-1/2 translate-y-1/2 flex-col">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            {/* Name */}
            <h1 className="font-heading">{name}</h1>
            {/* Actions */}
            {userGame?.data?.length > 0 ? (
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-x-4">
                  <label className="swap tooltip" data-tip="Delete Game">
                    <button
                      onClick={handleDeleteGame}
                      className="text-text-primary cursor-pointer bg-transparent text-2xl"
                    >
                      <FaTrash />
                    </button>
                  </label>
                  <label className="swap tooltip" data-tip="Add to Favorites">
                    <input
                      type="checkbox"
                      defaultChecked={userGame.data[0].is_favorite}
                      onChange={handleFavoriteChange}
                    />
                    <div className="swap-on text-error text-3xl">
                      <FaHeart />
                    </div>
                    <div className="swap-off text-3xl">
                      <FaRegHeart />
                    </div>
                  </label>
                  <AddGameModal
                    isUpdate={true}
                    game_id={id}
                    releaseDate={releaseDate}
                    userGame={userGame.data[0]}
                    game_cover={
                      cover?.url
                        ?.replace("t_thumb", "t_720p_2x")
                        ?.replace("jpg", "webp") || null
                    }
                    game_name={name}
                  />
                </div>
              </div>
            ) : (
              <AddGameModal
                game_id={id}
                releaseDate={releaseDate}
                genresData={genres}
                themesData={themes}
                game_cover={
                  cover?.url
                    ?.replace("t_thumb", "t_720p_2x")
                    ?.replace("jpg", "webp") || null
                }
                game_name={name}
              />
            )}
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              {/* Release Date */}
              <div className="text-text-secondary flex flex-col text-xl">
                <p>Release Date: </p>
                <p>{formatDate(new Date(releaseDate * 1000), "dd/MM/yyyy")}</p>
              </div>
              <div className="border-text-secondary/50 w-[1px] self-stretch border-1"></div>

              {/* Rating */}
              <div className="text-text-secondary flex flex-col text-xl">
                <p>Rating:</p>
                <div className="flex items-center gap-1">
                  <Rating bgColor="bg-pulse-primary" rating={rating} />
                  <p className="text-text-subtle text-xl font-medium">
                    {rating?.toFixed(0)}
                  </p>
                  <p className="text-text-muted self-center text-lg font-medium">
                    ({ratingCount})
                  </p>
                </div>
              </div>
              <div className="border-text-secondary/50 w-[1px] self-stretch border-1"></div>

              {/* Time To Beat */}
              <div className="text-text-secondary flex flex-col text-xl">
                <span>Time To Beat:</span>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-2 md:text-lg">
                  <p>
                    Main Story:{" "}
                    {timeToBeat?.[0]?.hastily
                      ? (timeToBeat[0]?.hastily / 60 / 60).toFixed(0)
                      : "0"}
                    h
                  </p>
                  <span>|</span>
                  <p>
                    Main + Extras:{" "}
                    {timeToBeat?.[0]?.normally
                      ? (timeToBeat[0]?.normally / 60 / 60).toFixed(0)
                      : "0"}
                    h
                  </p>
                  <span>|</span>
                  <p>
                    Completionist:
                    {timeToBeat?.[0]?.completely
                      ? (timeToBeat[0]?.completely / 60 / 60).toFixed(0)
                      : "0"}
                    h
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              {(() => {
                let steamAppearance = 0;
                let gogAppearance = 0;
                let epicAppearance = 0;

                return external_games?.map((link) => {
                  if (link?.url?.includes("steam") && steamAppearance === 0) {
                    steamAppearance++;
                    return (
                      <a
                        href={link.url}
                        className="bg- flex items-center gap-x-2 rounded-full bg-[#2a475e30] px-4 py-2 text-lg backdrop-blur-xs transition-all hover:scale-105"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaSteam className="h-5 w-5" /> Steam
                      </a>
                    );
                  }

                  if (link?.url?.includes("gog") && gogAppearance === 0) {
                    gogAppearance++;
                    return (
                      <a
                        href={link.url}
                        className="flex items-center gap-x-2 rounded-full bg-[#310E7630] px-4 py-2 text-lg backdrop-blur-xs transition-all hover:scale-105"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiGogdotcom className="h-5 w-5" /> GOG
                      </a>
                    );
                  }

                  if (link?.url?.includes("epic") && epicAppearance === 0) {
                    epicAppearance++;
                    return (
                      <a
                        href={link.url}
                        className="flex items-center gap-x-2 rounded-full bg-black/30 px-4  py-2 text-lg backdrop-blur-xs transition-all hover:scale-105"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiEpicgames className="h-5 w-5" /> Epic Games
                      </a>
                    );
                  }
                });
              })()}
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap items-center gap-x-5  gap-y-4 pt-4">
            {/* Genres */}
            {genres?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg">Genres:</p>
                {genres.map((genre) => (
                  <button
                    className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                    onClick={() => {
                      navigate(`/allGames?genre=${genre.id}`);
                    }}
                    key={genre.id}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}

            {/* Themes */}
            {themes?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg">Themes:</p>
                {themes?.map((theme) => (
                  <button
                    className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                    onClick={() => {
                      navigate(`/allGames?theme=${theme.id}`);
                    }}
                    key={theme.id}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            )}

            {/* Modes */}
            {game_modes?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg">Modes:</p>
                {game_modes?.map((mode) => (
                  <button
                    className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                    onClick={() => {
                      navigate(`/allGames?gameMode=${mode.id}`);
                    }}
                    key={mode.id}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mx-auto w-9/10">
        <p className="text-text-secondary text-xl leading-8 tracking-wide">
          {summary}
        </p>
      </div>
    </>
  );
}

export default GameDetailsOverview;
