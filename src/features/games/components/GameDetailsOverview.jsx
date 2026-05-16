import { useGetUserGame } from "@/features/User/hooks/useGetUserGame";
import { useGetUserGameReview } from "@/features/User/hooks/useGetUserGameReview";
import useScreenWidth from "@/hooks/useScreenWidth";
import { UserToken } from "@/hooks/useUserToken";
import RatingReadOnly from "@/ui/RatingReadOnly";
import Spinner from "@/ui/Spinner";
import { formatIGDBImage } from "@/utils/igdbImage";
import { formatDate } from "date-fns";
import {
  FaBook,
  FaCalendarAlt,
  FaFlagCheckered,
  FaPlaystation,
  FaSteam,
  FaTrophy,
  FaXbox,
} from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import AddGameModal from "./AddGameModal";
import AddedGameActions from "./AddedGameActions";
import WishlistButton from "./WishlistButton";

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
  const screenWidth = useScreenWidth();

  const user_id = UserToken()?.user?.id;

  const { data: timeToBeat } = useGetTimeToBeat();
  const { data: userGame, isLoading: isLoadingUserGame } =
    useGetUserGame(user_id);
  const { data: userGameReview, isLoading: isLoadingUserGameReview } =
    useGetUserGameReview({ user_id });

  const isReleased = new Date(releaseDate * 1000) < new Date();
  const isAddedToLibrary =
    userGame?.data?.length > 0 &&
    userGame?.data?.[0]?.status !== null &&
    userGame?.data?.[0]?.status !== "to play";

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
  const imageUrl = formatIGDBImage(chosenArtwork?.url, "t_1080p_2x") || null;

  if (isLoadingUserGame || isLoadingUserGameReview) return <Spinner />;

  function renderExternalGameLinks() {
    const platformConfig = [
      {
        name: "Steam",
        urlPattern: "steam",
        icon: <FaSteam className="h-5 w-5" />,
        bgColor: "bg-[#2a475e25]",
      },
      {
        name: "GOG",
        urlPattern: "gog",
        icon: <SiGogdotcom className="h-5 w-5" />,
        bgColor: "bg-[#310E7625]",
      },
      {
        name: "Epic Games",
        urlPattern: "epic",
        icon: <SiEpicgames className="h-5 w-5" />,
        bgColor: "bg-black/25",
      },
      {
        name: "PlayStation",
        urlPattern: "playstation",
        icon: <FaPlaystation className="h-5 w-5" />,
        bgColor: "bg-[#0170cc25]",
      },
      {
        name: "Xbox",
        urlPattern: "xbox",
        icon: <FaXbox className="h-5 w-5" />,
        bgColor: "bg-[#107C1025]",
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
            className={`flex items-center gap-x-2 rounded-full p-3 text-lg text-nowrap
              backdrop-blur-xs transition-all hover:scale-105 md:px-4 md:py-2 ${platform.bgColor}`}
            target="_blank"
            rel="noopener noreferrer"
            key={`${platform.name}-${link.url}`}
          >
            <span>{platform.icon}</span>
            <span className="hidden lg:inline">{platform.name}</span>
          </a>
        );
      }

      return null;
    });
  }
  return (
    <>
      <div className="relative h-[100dvh] w-full overflow-hidden">
        {/* Cover */}
        <img
          src={imageUrl}
          alt="Hero Image"
          title="Hero Image"
          loading="eager"
          fetchPriority="high"
          className="absolute top-0 left-0 h-full w-full object-cover object-top"
        />
        <div className="to-bg-base pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15" />

        {/* Content */}
        <div className="absolute bottom-[25%] left-1/2 flex w-9/10 -translate-x-1/2 translate-y-1/2 flex-col gap-2">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            {/* Name */}
            {screenWidth > 640 ? <h1>{name}</h1> : <h2>{name}</h2>}
            {/* Actions */}

            {isReleased ? (
              isAddedToLibrary ? (
                <AddedGameActions
                  game={data[0]}
                  userGame={userGame?.data?.[0]}
                  userGameReview={userGameReview?.data?.[0]}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <WishlistButton
                    status={userGame?.data?.[0]?.status}
                    game_id={id}
                  />
                  <AddGameModal game={data[0]} userGame={userGame?.data?.[0]} />
                </div>
              )
            ) : (
              <WishlistButton
                status={userGame?.data?.[0]?.status}
                game_id={id}
              />
            )}
          </div>

          {/* Row 2 */}
          <div className="flex w-full flex-col items-center justify-between md:flex-row">
            <div className="flex w-full flex-col items-center gap-2 md:flex-row">
              <div className="flex w-full items-center justify-between gap-x-2 md:w-fit md:justify-start">
                {/* Release Date */}
                <div className="flex flex-row items-center md:flex-col md:items-start md:text-xl">
                  <p className="md:hidden">
                    <FaCalendarAlt className="mr-1" />
                  </p>
                  <h4 className="hidden text-nowrap md:block">
                    Release Date:{" "}
                  </h4>
                  <p>
                    {releaseDate
                      ? formatDate(new Date(releaseDate * 1000), "dd/MM/yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="border-text-dim hidden w-[1px] self-stretch border-1 md:block"></div>

                {/* Rating */}
                <div className="flex flex-row md:flex-col">
                  <h4 className=" hidden md:block">Rating:</h4>
                  <div className="flex items-center gap-1">
                    <RatingReadOnly
                      bgColor="bg-pulse-primary"
                      rating={rating}
                    />
                    <p className="pt-1">{rating?.toFixed(0)}%</p>
                    <p className="self-center pt-1">({ratingCount})</p>
                  </div>
                </div>
              </div>

              <div className="border-text-dim w-full self-stretch border-1 md:w-[1px]"></div>

              {/* Time To Beat */}
              <div className="flex w-full flex-wrap items-center justify-between gap-1">
                <div className="md:flex-col">
                  <h4 className="hidden md:block">Time To Beat: </h4>

                  <div className="flex items-center gap-x-2 gap-y-1 md:gap-x-2 ">
                    <p className="flex items-center gap-x-1">
                      <span className="xl:hidden">
                        <FaBook className="mr-1" />
                      </span>
                      <p className="hidden xl:inline">Main Story: </p>
                      {timeToBeat?.[0]?.hastily
                        ? (timeToBeat[0]?.hastily / 60 / 60).toFixed(0)
                        : "0"}
                      h
                    </p>
                    <p>|</p>
                    <p className="flex items-center gap-x-1">
                      <span className="xl:hidden">
                        <FaFlagCheckered className="mr-1" />
                      </span>
                      <p className="hidden xl:inline">Main + Extras: </p>
                      {timeToBeat?.[0]?.normally
                        ? (timeToBeat[0]?.normally / 60 / 60).toFixed(0)
                        : "0"}
                      h
                    </p>
                    <p>|</p>
                    <p className="flex items-center gap-x-1">
                      <span className="xl:hidden">
                        <FaTrophy className="mr-1" />
                      </span>
                      <p className="hidden xl:inline">Completionist: </p>
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
          <div className="flex flex-col gap-x-5 gap-y-3 pt-2 md:flex-row md:flex-wrap md:items-center">
            {/* Genres */}
            {genres?.length > 0 && (
              <div className="flex items-center gap-x-1.5 gap-y-2">
                <p className=" text-text-main  whitespace-nowrap">Genres:</p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto px-1">
                  {genres.map((genre) => (
                    <button
                      className="bg-bg-card text-text-dim cursor-pointer rounded-full px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/games/allGames?genre=${genre.id}`);
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
                <p className=" text-text-main  whitespace-nowrap">Themes:</p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto px-1">
                  {themes?.map((theme) => (
                    <button
                      className="bg-bg-card text-text-dim cursor-pointer rounded-full px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/games/allGames?theme=${theme.id}`);
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
                <p className=" text-text-main whitespace-nowrap">Modes:</p>
                <div className="no-scrollbar flex w-full gap-x-2 overflow-x-auto px-1">
                  {game_modes?.map((mode) => (
                    <button
                      className="bg-bg-card text-text-dim cursor-pointer rounded-full px-4 py-1 text-sm whitespace-nowrap backdrop-blur-md transition-all hover:scale-105 hover:bg-gray-400/20"
                      onClick={() => {
                        navigate(`/games/allGames?gameMode=${mode.id}`);
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
        <p className="text-text-secondary leading-8 tracking-wide sm:text-lg md:text-xl">
          {summary}
        </p>
      </div>
    </>
  );
}

export default GameDetailsOverview;
