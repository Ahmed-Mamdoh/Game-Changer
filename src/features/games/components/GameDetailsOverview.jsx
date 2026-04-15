import { deleteUserGame, updateUserGame } from "@/api/supabase";
import { useGetUserGame } from "@/features/User/hooks/useGetUserGame";
import Rating from "@/ui/Rating";
import Spinner from "@/ui/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaSteam,
  FaTrash,
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaTrophy,
  FaFlagCheckered,
  FaBook,
} from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import AddGameModal from "./AddGameModal";
import useScreenWidth from "@/hooks/useScreenWidth";

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
  const screenWidth = useScreenWidth();

  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;

  const { data: timeToBeat } = useGetTimeToBeat();
  const { data: userGame, isLoading: isLoadingUserGame } =
    useGetUserGame(user_id);

  //  gets the full quality image instead of low quality
  const chosenArtwork =
    screenWidth < 640
      ? cover
      : artworks?.find((a) => a.artwork_type === 2) ||
        artworks?.find((a) => a.artwork_type === 3) ||
        artworks?.find((a) => a.artwork_type === 1) ||
        artworks?.find((a) => a.artwork_type === 4) ||
        artworks?.[0] ||
        cover;
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

  function renderExternalGameLinks() {
    const platformConfig = [
      {
        name: "Steam",
        urlPattern: "steam",
        icon: <FaSteam className="h-5 w-5" />,
        bgColor: "bg-[#2a475e30]",
      },
      {
        name: "GOG",
        urlPattern: "gog",
        icon: <SiGogdotcom className="h-5 w-5" />,
        bgColor: "bg-[#310E7630]",
      },
      {
        name: "Epic Games",
        urlPattern: "epic",
        icon: <SiEpicgames className="h-5 w-5" />,
        bgColor: "bg-black/30",
      },
    ];

    const shownPlatforms = new Set();

    return external_games?.map((link) => {
      const platform = platformConfig.find(
        (p) => link?.url?.includes(p.urlPattern) && !shownPlatforms.has(p.name),
      );

      if (platform) {
        shownPlatforms.add(platform.name);
        return (
          <a
            href={link.url}
            className={`flex items-center gap-x-2 rounded-full p-3 text-lg text-nowrap backdrop-blur-xs transition-all hover:scale-105 md:px-4 md:py-2 ${platform.bgColor}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${platform.name}-${link.url}`}
          >
            <span>{platform.icon}</span>
            <span className="hidden md:inline">{platform.name}</span>
          </a>
        );
      }

      return null;
    });
  }

  return (
    <>
      <div className="relative  h-[100dvh] w-full overflow-hidden">
        {/* Cover */}
        <img
          src={imageUrl}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
        <div className=" to-obsidian-muted pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15" />

        {/* Content */}
        <div className="absolute bottom-[25%] left-1/2 flex w-9/10 -translate-x-1/2 translate-y-1/2 flex-col gap-2">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            {/* Name */}
            <h1 className="font-heading text-2xl md:text-[4rem]">{name}</h1>
            {/* Actions */}
            {new Date(releaseDate * 1000) < new Date() ? (
              userGame?.data?.length > 0 ? (
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
              )
            ) : null}
          </div>

          {/* Row 2 */}
          <div className="flex w-full flex-col items-center justify-between md:flex-row">
            <div className="flex w-full flex-col items-center gap-2 md:flex-row">
              <div className="flex w-full items-center justify-between gap-x-2 md:w-fit md:justify-start">
                {/* Release Date */}
                <div className="text-text-secondary flex flex-row items-center text-lg md:flex-col md:items-start md:text-xl">
                  <p className="md:hidden">
                    <FaCalendarAlt className="mr-1" />
                  </p>
                  <p className="hidden text-nowrap md:block">Release Date: </p>
                  <p>
                    {releaseDate
                      ? formatDate(new Date(releaseDate * 1000), "dd/MM/yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="border-text-secondary/50 hidden w-[1px] self-stretch border-1 md:block"></div>

                {/* Rating */}
                <div className="text-text-secondary flex flex-row text-lg  md:flex-col md:text-xl">
                  <p className="hidden md:block">Rating:</p>
                  <div className="flex items-center gap-1">
                    <Rating bgColor="bg-pulse-primary" rating={rating} />
                    <p className="text-text-subtle text-lg font-medium md:text-xl">
                      {rating?.toFixed(0)}%
                    </p>
                    <p className="text-text-muted self-center text-lg font-medium">
                      ({ratingCount})
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-text-secondary/50 w-full self-stretch border-1 md:w-[1px]"></div>

              {/* Time To Beat */}
              <div className="flex w-full items-center justify-between">
                <div className="text-text-secondary text-lg md:flex-col md:text-xl ">
                  <span className="hidden md:block">Time To Beat: </span>

                  <div className="flex items-center gap-x-2 gap-y-1 text-lg md:gap-x-2 ">
                    <p className="flex items-center gap-x-1">
                      <span className="lg:hidden">
                        <FaBook className="mr-1" />
                      </span>
                      <span className="hidden lg:inline">Main Story: </span>
                      {timeToBeat?.[0]?.hastily
                        ? (timeToBeat[0]?.hastily / 60 / 60).toFixed(0)
                        : "0"}
                      h
                    </p>
                    <span>|</span>
                    <p className="flex items-center gap-x-1">
                      <span className="lg:hidden">
                        <FaFlagCheckered className="mr-1" />
                      </span>
                      <span className="hidden lg:inline">Main + Extras: </span>
                      {timeToBeat?.[0]?.normally
                        ? (timeToBeat[0]?.normally / 60 / 60).toFixed(0)
                        : "0"}
                      h
                    </p>
                    <span>|</span>
                    <p className="flex items-center gap-x-1">
                      <span className="lg:hidden">
                        <FaTrophy className="mr-1" />
                      </span>
                      <span className="hidden lg:inline">Completionist: </span>
                      {timeToBeat?.[0]?.completely
                        ? (timeToBeat[0]?.completely / 60 / 60).toFixed(0)
                        : "0"}
                      h
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2 md:hidden ">
                  {renderExternalGameLinks()}
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-x-2 md:flex">
              {renderExternalGameLinks()}
            </div>
          </div>

          {/* Row 3 - Horizontal scroll on mobile */}
          <div className="flex flex-col gap-x-5 gap-y-3 pt-4 md:flex-row md:flex-wrap md:items-center">
            {/* Genres */}
            {genres?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg whitespace-nowrap">
                  Genres:
                </p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto ">
                  {genres.map((genre) => (
                    <button
                      className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/allGames?genre=${genre.id}`);
                      }}
                      key={genre.id}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Themes */}
            {themes?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg whitespace-nowrap">
                  Themes:
                </p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto ">
                  {themes?.map((theme) => (
                    <button
                      className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/allGames?theme=${theme.id}`);
                      }}
                      key={theme.id}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modes */}
            {game_modes?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className="text-text-secondary text-lg whitespace-nowrap">
                  Modes:
                </p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto ">
                  {game_modes?.map((mode) => (
                    <button
                      className="text-text-primary cursor-pointer rounded-full bg-gray-400/15 px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/allGames?gameMode=${mode.id}`);
                      }}
                      key={mode.id}
                    >
                      {mode.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mx-auto w-9/10">
        <p className="text-text-secondary text-base leading-8 tracking-wide sm:text-lg md:text-xl">
          {summary}
        </p>
      </div>
    </>
  );
}

export default GameDetailsOverview;
