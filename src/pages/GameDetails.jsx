import { useGetOneGame } from "@/features/games/hooks/useGetOneGame";
import Spinner from "@/ui/Spinner";
import GameDetailsLangTable from "@/features/games/components/GameDetailsLangTable";
import GameDetailsMedia from "@/features/games/components/GameDetailsMedia";
import GameDetailsOverview from "@/features/games/components/GameDetailsOverview";
import GameDetailsRelatedGames from "@/features/games/components/GameDetailsRelatedGames";
import GameDetailsReviews from "@/features/games/components/GameDetailsReviews";
import { useGetGameReviews } from "@/features/games/hooks/useGetGameReviews";
import { Helmet } from "react-helmet-async";

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetGameReviews();

  if (isLoading || reviewsLoading) return <Spinner />;
  return (
    <>
      <Helmet>
        {/* Basic SEO Meta Tags */}
        <title>{`${data[0].name} | Game-Changer`}</title>
        <meta
          name="description"
          content={`Explore ${data[0].name} on Game-Changer. "Discover game details, reviews, media, language support and related games."`}
        />
        <meta
          property="og:description"
          content={`Explore ${data[0].name} on Game-Changer. "Discover game details, reviews, media, language support and related games."`}
        />
        <link
          rel="canonical"
          href={`https://game-changer-gg.vercel.app/game/${data[0].id}`}
        />
        {/* Open Graph / Social */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${data[0].name} | Game-Changer`} />
        <meta
          property="og:description"
          content={`Explore ${data[0].name} on Game-Changer. ${data[0].summary || "Discover game details, reviews, media, language support and related games."}`}
        />
        <meta
          property="og:image"
          content={
            data[0].cover?.url?.replace("t_thumb", "t_cover_big") ||
            "https://game-changer-gg.vercel.app/og-image.jpg"
          }
        />
        <meta
          property="og:url"
          content={`https://game-changer-gg.vercel.app/game/${data[0].id}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* <GameDetailsTabs data={data} /> */}
      <div className="relative mt-0 pb-20">
        {/* Data */}
        <GameDetailsOverview data={data} />
        {/*Media*/}
        <GameDetailsMedia data={data} />

        {/* Related Games */}
        <GameDetailsRelatedGames data={data} />

        {/* Language Support */}
        <GameDetailsLangTable data={data} />

        {/* Game Reviews */}
        <GameDetailsReviews reviewsData={reviewsData} />
      </div>
    </>
  );
}

export default GameDetails;
