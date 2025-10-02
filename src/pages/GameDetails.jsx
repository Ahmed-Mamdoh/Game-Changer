import { Badge } from "@/components/ui/badge";
import { useGetOneGame } from "@/features/games/useGetOneGame";
import Spinner from "@/ui/Spinner";
import { formatDate } from "date-fns";
import Rating from "./../ui/Rating";
import { useNavigate } from "react-router-dom";
import YoutubeEmbed from "./../ui/YoutubeEmbed";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FaCalendar,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaRegClock,
  FaSteam,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import GameDetailsCarousel from "@/features/games/GameDetailsCarousel";
import { useGetTimeToBeat } from "@/features/games/useGetTimeToBeat";
import AddGameModal from "@/features/games/AddGameModal";

const ESRB_RATINGS = {
  6: { rating: "Rating Pending", badgeVariant: "outline" },
  7: { rating: "Early Childhood", badgeVariant: "darkgray" },
  8: { rating: "Everyone", badgeVariant: "darkgray" },
  9: { rating: "Everyone 10+", badgeVariant: "darkgray" },
  10: { rating: "Teen (13+)", badgeVariant: "darkgray" },
  11: { rating: "Mature (17+)", badgeVariant: "violet" },
  12: { rating: "Adults Only (18+)", badgeVariant: "destructive" },
};
const LANGUAGES = [
  {
    id: 7,
    native_name: "English (US)",
  },
  {
    id: 8,
    native_name: "English (UK)",
  },
  {
    id: 1,
    native_name: "العربية",
  },
  {
    id: 2,
    native_name: "简体中文",
  },
  {
    id: 3,
    native_name: "繁體中文",
  },
  {
    id: 4,
    native_name: "čeština",
  },
  {
    id: 5,
    native_name: "Dansk",
  },
  {
    id: 6,
    native_name: "Nederlands",
  },
  {
    id: 9,
    native_name: "Español (España)",
  },
  {
    id: 10,
    native_name: "Español (Mexico)",
  },
];
const LANGUAGES_TYPES = [
  { id: 1, name: "Audio" },
  { id: 2, name: "Subtitles" },
  { id: 3, name: "Interface" },
];

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { data: timeToBeat, isLoading: isLoading2 } = useGetTimeToBeat();

  //check if the screen size changed and set isSmall screen if the size < 1024
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isLoading || isLoading2) return <Spinner />;

  //destruct data
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
    screenshots,
    dlcs,
    external_games,
    language_supports,
    franchises,
    similar_games,
    videos,
    game_modes,
  } = data[0];
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

  return (
    <>
      <div className="sticky top-0 z-10 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-black/80 py-3 md:gap-x-6">
        <TabButton name="Overview" />
        {(screenshots || videos) && <TabButton name="Media" />}
        {dlcs && <TabButton name="DLCs" />}
        {similar_games && <TabButton name="Similar Games" />}
        {franchises && <TabButton name="Franchises" />}
        {language_supports && <TabButton name="Supported languages" />}
      </div>

      <div className="relative mx-4 mt-0 pb-20 sm:mx-12">
        {/* Data */}
        <div
          id="Overview"
          className="bg-bg-secondary/80 container mx-auto flex h-full flex-col items-center gap-x-12 gap-y-6 rounded-sm px-6 py-12 md:gap-y-12 md:px-12 lg:flex-row lg:items-start lg:gap-y-0"
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
              <AddGameModal game_id={id} releaseDate={releaseDate} />
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
                {game_modes.map((mode) => (
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
              <span className="text-text-general md:text-lg">
                Description:{" "}
              </span>
              {summary}
            </p>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-text-general text-lg">Rating: </span>
              <Rating bgColor="bg-accent-primary" rating={rating} />

              <div className="flex items-center gap-1">
                <p className="text-text-subtle text-xl font-medium">
                  {rating?.toFixed(0)}
                </p>
                <p className="text-text-muted self-center text-lg font-medium">
                  ({ratingCount})
                </p>
              </div>
            </div>

            {timeToBeat[0]?.hastily && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4 md:text-lg">
                <span className="text-text-general">Time To Beat:</span>

                <p>
                  Main Story: {(timeToBeat[0].hastily / 60 / 60).toFixed(0)}h
                </p>
                <span>|</span>
                <p>
                  Main + Extras: {(timeToBeat[0].normally / 60 / 60).toFixed(0)}
                  h
                </p>
                <span>|</span>
                <p>
                  Completionist:
                  {(timeToBeat[0].completely / 60 / 60).toFixed(0)}h
                </p>
              </div>
            )}

            {companies?.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                <span className="text-text-general text-lg">Developers:</span>
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
              <span className="text-text-general text-lg">Get the game:</span>
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

        {/*Media*/}
        {(screenshots?.length > 0 || videos?.length > 0) && (
          <>
            <div
              id="Media"
              className="font-heading flex items-center justify-center pt-12 pb-3 text-4xl md:text-6xl"
            >
              <h2 className="text-center">Media</h2>
            </div>
            <div className="bg-bg-secondary container mx-auto rounded-sm py-12">
              <Carousel className="mx-auto w-11/12 md:w-9/12">
                <CarouselContent>
                  {screenshots?.map((screenshot) => {
                    return (
                      <CarouselItem key={screenshot.id}>
                        <img
                          src={screenshot.url.replace("t_thumb", "t_1080p")}
                          alt=""
                          className="cursor-grab rounded-2xl select-none active:cursor-grabbing"
                        />
                      </CarouselItem>
                    );
                  })}
                  {videos?.map((video) => {
                    return (
                      <CarouselItem key={video.id}>
                        <YoutubeEmbed videoId={video.video_id} />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious
                  variant="default"
                  className="hidden h-12 w-12 translate-x-6 hover:scale-110 md:flex"
                />
                <CarouselNext
                  variant="default"
                  className="hidden h-12 w-12 -translate-x-6 hover:scale-110 md:flex"
                />
              </Carousel>
            </div>
          </>
        )}

        {/* DLCs */}
        {dlcs?.length > 0 && (
          <>
            <span className="" id="DLCs"></span>
            <GameDetailsCarousel sectionName="DLCs" data={dlcs} />
          </>
        )}

        {/* Similar Games */}
        {similar_games?.length > 0 && (
          <>
            <span id="Similar Games"></span>
            <GameDetailsCarousel
              sectionName="Similar Games"
              data={similar_games}
            />
          </>
        )}

        {/* franchises */}
        {franchises?.length > 0 && (
          <>
            <span id="Franchises"></span>
            <div className="font-heading flex items-center justify-center pt-12 pb-3 text-4xl md:text-6xl">
              <h2 className="text-center">Franchises</h2>
            </div>
          </>
        )}

        {franchises?.length > 0 &&
          franchises.map((franchise) => {
            franchise.games.sort(
              (a, b) => a.first_release_date - b.first_release_date,
            );
            const filteredGames = franchise.games.filter(
              (game) =>
                (game.game_type === 0 ||
                  game.game_type === 8 ||
                  game.game_type === 9) &&
                game.version_parent === undefined,
            );

            return (
              <GameDetailsCarousel
                sectionName={franchise.name}
                data={filteredGames}
              />
            );
          })}

        {/* language_supports large screen */}
        {language_supports?.length > 0 && !isSmallScreen && (
          <>
            <span id="Supported languages"></span>
            <div className="font-heading flex items-center justify-center pt-9 pb-4 text-4xl md:text-6xl">
              <h2 className="text-center">Language Support</h2>
            </div>
            <Table className="bg-bg-secondary rounded-sm px-4 py-8">
              <TableHeader>
                <TableRow className="border-text-muted">
                  <TableHead></TableHead>

                  {LANGUAGES.map((language, i) => (
                    <TableHead
                      key={language.id}
                      className={`text-text-general border-text-muted border-x py-4 text-center ${i === LANGUAGES.length - 1 ? "border-r-0" : ""}`}
                    >
                      {language.native_name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-text-muted">
                  <TableCell className="font-medium">Audio</TableCell>
                  {LANGUAGES.map((language, i) => {
                    return checkGameLanguages(
                      language_supports,
                      language,
                      "Audio",
                      i,
                    );
                  })}
                </TableRow>
                <TableRow className="border-text-muted">
                  <TableCell className="font-medium">Subtitles</TableCell>
                  {LANGUAGES.map((language, i) => {
                    return checkGameLanguages(
                      language_supports,
                      language,
                      "Subtitles",
                      i,
                    );
                  })}
                </TableRow>
                <TableRow className="border-text-muted">
                  <TableCell className="font-medium">Interface</TableCell>
                  {LANGUAGES.map((language, i) => {
                    return checkGameLanguages(
                      language_supports,
                      language,
                      "Interface",
                      i,
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}

        {/* language_supports small screen */}
        {language_supports?.length > 0 && isSmallScreen && (
          <>
            <span id="Supported languages"></span>

            <div className="font-heading flex items-center justify-center pt-9 pb-4 text-4xl md:text-6xl">
              <h2 className="text-center">Language Support</h2>
            </div>
            <Table className="bg-bg-secondary rounded-sm px-4 py-8">
              <TableHeader>
                <TableRow className="border-text-muted">
                  <TableHead></TableHead>
                  {LANGUAGES_TYPES.map((type, i) => (
                    <TableHead
                      className={`text-text-general border-text-muted border-x py-4 text-center ${i === LANGUAGES_TYPES.length - 1 ? "border-r-0" : ""}`}
                    >
                      {type.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {LANGUAGES.map((language) => {
                  return (
                    <TableRow key={language.id} className="border-text-muted">
                      <TableCell>{language.native_name}</TableCell>
                      {LANGUAGES_TYPES.map((type, i) =>
                        checkGameLanguages(
                          language_supports,
                          language,
                          type.name,
                          i,
                          "vertical",
                        ),
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </>
  );
}

function handleScroll(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function TabButton({ name }) {
  return (
    <button
      className="text-text-muted hover:text-text-general text-md cursor-pointer font-semibold tracking-wide transition-colors duration-200"
      onClick={() => handleScroll(name)}
    >
      {name}
    </button>
  );
}

function checkGameLanguages(
  language_supports,
  language,
  type,
  i,
  variant = "horizontal",
) {
  const currentLanguage = language_supports.filter((supportedLanguage) => {
    return supportedLanguage?.language?.id === language?.id;
  });

  const isAvailable = currentLanguage?.find(
    (lang) => lang?.language_support_type?.name === type,
  );
  if (isAvailable) {
    return (
      <TableCell
        className={`border-text-muted border-x py-4 font-medium ${
          variant === "horizontal"
            ? i === LANGUAGES.length - 1
              ? "border-r-0"
              : ""
            : i === LANGUAGES_TYPES.length - 1
              ? "border-r-0"
              : ""
        }`}
      >
        <FaCheck className="mx-auto" />
      </TableCell>
    );
  }
  return (
    <TableCell
      className={`border-text-muted border-x py-6 font-medium ${
        variant === "horizontal"
          ? i === LANGUAGES.length - 1
            ? "border-r-0"
            : ""
          : i === LANGUAGES_TYPES.length - 1
            ? "border-r-0"
            : ""
      }`}
    ></TableCell>
  );
}

export default GameDetails;
