import { formatDate } from "date-fns";
import {
  FaBookmark,
  FaCalendarAlt,
  FaHeart,
  FaRegBookmark,
  FaRegHeart,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import { FaSteam } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import AddGameModal from "./AddGameModal";
import Rating from "@/ui/Rating";
import { Badge } from "@/components/ui/badge";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import { useGetUserGame } from "../../User/hooks/useGetUserGame";
import Spinner from "@/ui/Spinner";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { deleteUserGame, updateUserGame } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";

const ESRB_RATINGS = {
  6: { rating: "Rating Pending", badgeVariant: "outline" },
  7: { rating: "Early Childhood", badgeVariant: "darkgray" },
  8: { rating: "Everyone", badgeVariant: "darkgray" },
  9: { rating: "Everyone 10+", badgeVariant: "darkgray" },
  10: { rating: "Teen (13+)", badgeVariant: "darkgray" },
  11: { rating: "Mature (17+)", badgeVariant: "violet" },
  12: { rating: "Adults Only (18+)", badgeVariant: "destructive" },
};

function GameDetailsOverview({ data }) {
  const {
    id,
    name,
    first_release_date: releaseDate,
    summary,
    cover,
    age_ratings,
    total_rating: rating,
    total_rating_count: ratingCount,
    genres,
    themes,
    involved_companies: companies,
    game_modes,
    external_games,
  } = data[0];

  const queryClient = useQueryClient();

  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;

  const { data: timeToBeat, isLoading: isLoadingTimeToBeat } =
    useGetTimeToBeat();
  const { data: userGame, isLoading: isLoadingUserGame } =
    useGetUserGame(user_id);

  // gets the 1080p image instead of low quality
  const imageUrl = cover?.url ? cover.url.replace("t_thumb", "t_1080p") : null;

  // find the esrb rating among age_ratings
  const EsrbRating = age_ratings?.find((rating) => rating?.category === 1);

  // if no esrb rating found, set ageRating to "N/A"
  // else get its value from the esrb rating array
  const ageRating = EsrbRating ? ESRB_RATINGS[EsrbRating.rating].rating : "N/A";

  // if no esrb rating found, set badgeVariant to "outline"
  // else get the badgeVariant from the esrb rating array
  const badgeVariant =
    EsrbRating?.category === 1
      ? ESRB_RATINGS[EsrbRating?.rating].badgeVariant
      : "outline";

  const navigate = useNavigate();
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
    <div
      id="Overview"
      className="bg-base-100 container mx-auto flex h-full flex-col items-center gap-x-12 gap-y-6 rounded-sm px-6 py-12 md:gap-y-12 md:px-12 lg:flex-row lg:items-start lg:gap-y-0"
    >
      <div className="max-w-96 flex-shrink-0">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex h-4/5 flex-col items-center gap-y-6 lg:items-start">
        <div className="flex w-full flex-col items-center justify-between gap-y-2 md:flex-row">
          <div className="flex items-center gap-x-4">
            <h1 className="text-center text-2xl font-semibold md:text-start md:text-5xl">
              {name}
            </h1>
            <Badge
              variant={badgeVariant}
              className="h-fit w-fit px-4 py-1 text-sm"
            >
              {ageRating}
            </Badge>
          </div>
          {userGame?.data?.length > 0 ? (
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-x-4">
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
                />
              </div>
              <Button
                onClick={handleDeleteGame}
                className="bg-error/70 hover:bg-error/70 text-secondary-content cursor-pointer px-6 py-3 text-xl font-bold"
              >
                <FaTrash />
                <span>Delete Game</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-x-2">
              <label className="swap tooltip" data-tip="Add to Wishlist">
                <input
                  type="checkbox"
                  defaultChecked={userGame.data[0]?.is_favorite}
                  onChange={handleFavoriteChange}
                />
                <div className="swap-on text-warning text-3xl">
                  <FaBookmark />
                </div>
                <div className="swap-off text-3xl">
                  <FaRegBookmark />
                </div>
              </label>
              <AddGameModal
                game_id={id}
                releaseDate={releaseDate}
                genresData={genres}
                themesData={themes}
                game_cover={cover}
                game_name={name}
              />
            </div>
          )}
        </div>

        {releaseDate && (
          <div className="flex items-center gap-x-2">
            <FaCalendarAlt />
            <p>
              Release Date:{" "}
              {formatDate(new Date(releaseDate * 1000), "dd/MM/yyyy")}
            </p>
          </div>
        )}

        {genres?.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-lg">Genres:</p>
            {genres.map((genre) => (
              <Badge
                variant={genre.name}
                className="h-fit w-fit cursor-pointer px-4 py-1 text-sm transition-all duration-300 hover:scale-105 hover:font-bold"
                onClick={() => {
                  navigate(`/allGames?genre=${genre.id}`);
                }}
                key={genre.id}
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        {themes?.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="md:text-lg">Themes:</p>
            {themes.map((theme) => (
              <Badge
                variant={theme.name}
                className="h-fit w-fit cursor-pointer px-4 py-1 text-sm transition-all duration-300 hover:scale-105 hover:font-bold"
                onClick={() => {
                  navigate(`/allGames?theme=${theme.id}`);
                }}
                key={theme.id}
              >
                {theme.name}
              </Badge>
            ))}
          </div>
        )}

        {themes?.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="md:text-lg">Modes:</p>
            {game_modes?.map((mode) => (
              <Badge
                variant={mode.name}
                className="h-fit w-fit cursor-pointer px-4 py-1 text-sm transition-all duration-300 hover:scale-105 hover:font-bold"
                onClick={() => {
                  navigate(`/allGames?gameMode=${mode.id}`);
                }}
                key={mode.id}
              >
                {mode.name}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-text-subtle text-md text-start leading-8 font-medium text-wrap md:w-10/12 md:text-center md:text-lg lg:w-full lg:text-start xl:w-3/4">
          <span className="base-content md:text-lg">Description: </span>
          {summary}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="base-content text-lg">Rating: </span>
          <Rating bgColor="bg-primary" rating={rating} />

          <div className="flex items-center gap-1">
            <p className="text-text-subtle text-xl font-medium">
              {rating?.toFixed(0)}
            </p>
            <p className="text-text-muted self-center text-lg font-medium">
              ({ratingCount})
            </p>
          </div>
        </div>

        {timeToBeat?.[0]?.hastily ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4 md:text-lg">
            <span className="base-content">Time To Beat:</span>

            <p>Main Story: {(timeToBeat[0].hastily / 60 / 60).toFixed(0)}h</p>
            <span>|</span>
            <p>
              Main + Extras: {(timeToBeat[0].normally / 60 / 60).toFixed(0)}h
            </p>
            <span>|</span>
            <p>
              Completionist:
              {(timeToBeat[0].completely / 60 / 60).toFixed(0)}h
            </p>
          </div>
        ) : isLoadingTimeToBeat ? (
          <p>Loading time to beat...</p>
        ) : null}

        {companies?.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="base-content text-lg">Developers:</span>
            {companies.map((company) => (
              <Badge
                variant="default"
                className="h-fit w-fit px-4 py-1 text-sm"
                key={company.company.id}
              >
                {company.company.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="base-content text-lg">Get the game:</span>
          {external_games?.map((link) => {
            if (link?.url?.includes("steam"))
              return (
                <a
                  href={link.url}
                  className="bg- flex items-center gap-x-2 rounded-full bg-[#2a475e] px-4 py-2 text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaSteam className="h-5 w-5" /> Steam
                </a>
              );

            if (link?.url?.includes("gog"))
              return (
                <a
                  href={link.url}
                  className="bg- flex items-center gap-x-2 rounded-full bg-[#722b75] px-4 py-2 text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiGogdotcom className="h-5 w-5" /> GOG
                </a>
              );

            if (link?.url?.includes("epic"))
              return (
                <a
                  href={link.url}
                  className="bg- flex items-center gap-x-2 rounded-full bg-black px-4 py-2 text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiEpicgames className="h-5 w-5" /> Epic Games
                </a>
              );
          })}
        </div>
      </div>
    </div>
  );
}

export default GameDetailsOverview;
