import { useGetOneGame } from "@/features/games/hooks/useGetOneGame";
import Spinner from "@/ui/Spinner";

import GameDetailsTabs from "@/features/games/components/GameDetailsTabs";
import GameDetailsOverview from "@/features/games/components/GameDetailsOverview";
import GameDetailsMedia from "@/features/games/components/GameDetailsMedia";
import GameDetailsRelatedGames from "@/features/games/components/GameDetailsRelatedGames";
import GameDetailsLangTable from "@/features/games/components/GameDetailsLangTable";
import { useGetGameReviews } from "@/features/games/hooks/useGetGameReviews";
import GG from "@/assets/GG.png";
import RatingReadOnly from "@/ui/RatingReadOnly";
import { formatDate } from "date-fns";

function GameDetails() {
  const { data, isLoading } = useGetOneGame();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetGameReviews();
  const reviews =
    reviewsData?.data.filter(
      (review) => review.review !== null && review.review !== "",
    ) || [];

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  if (isLoading || reviewsLoading) return <Spinner />;

  return (
    <>
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
        <span id="Game Reviews"></span>
        <div className="xs:flex-row xs:items-center mx-auto flex w-9/10 flex-col justify-between gap-3 pt-9 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-center">Game Reviews</h2>
            {reviews.length > 0 && (
              <span className="glass-badge mt-1">{reviews.length}</span>
            )}
          </div>
          {reviews.length > 0 && (
            <div className="border-stroke-subtle flex w-fit items-center gap-3 rounded-full border bg-white/5 px-4 py-2">
              <div className="flex flex-col items-end leading-none">
                <span className="text-text-main text-lg font-bold">
                  {averageRating}
                </span>
                <span className="text-text-muted text-[10px] tracking-wider uppercase">
                  Avg Rating
                </span>
              </div>
              <div className="bg-stroke-subtle h-8 w-px"></div>
              <RatingReadOnly
                rating={parseFloat(averageRating)}
                bgColor="bg-pulse-primary"
                maxRating={5}
              />
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="mx-auto flex h-full w-9/10 flex-col gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-bg-card border-stroke-subtle flex flex-col gap-6 rounded-xl border p-6 sm:p-8"
              >
                <div className="xs:flex-row xs:items-center flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={review.user.avatar_url || GG}
                      alt={review.user.username}
                      className=" h-12 w-12 rounded-full object-cover transition-transform duration-300"
                    />

                    <div className="flex flex-col">
                      <h4 className="text-text-main text-lg font-semibold tracking-tight">
                        {review.user.username}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="glass-badge flex items-center gap-1 bg-white/5 py-0.5 text-[10px] tracking-wider uppercase">
                          {review.stats.games_count} Games
                        </span>
                        <span className="glass-badge flex items-center gap-1 bg-white/5 py-0.5 text-[10px] tracking-wider uppercase">
                          {review.stats.reviews_count} Reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="xs:place-self-auto flex w-fit items-center gap-4 place-self-end rounded-lg bg-white/5 p-2 px-4">
                    <div className="flex flex-col items-end">
                      <RatingReadOnly
                        rating={review.rating}
                        bgColor="bg-pulse-primary"
                        maxRating={5}
                      />
                      <span className="text-text-brand mt-0.5 text-xs font-bold">
                        {review.rating}/5 RATING
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-stroke-subtle h-px w-full opacity-50"></div>
                  <p
                    dir="auto"
                    className="font-arabic text-text-main text-lg leading-relaxed"
                  >
                    {review.review}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-text-muted text-xs font-medium">
                      Posted on {formatDate(new Date(review.created_at), "PPP")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bg-card border-stroke-subtle mx-auto flex w-9/10 flex-col items-center justify-center gap-4 rounded-xl border py-16 text-center">
            <div className="bg-pulse-primary/10 rounded-full p-4">
              <svg
                className="text-pulse-primary h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">No reviews yet</h3>
              <p className="text-text-dim mt-2">
                Be the first to share your experience with this game!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GameDetails;
