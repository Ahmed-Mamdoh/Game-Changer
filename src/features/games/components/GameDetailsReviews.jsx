import RatingReadOnly from "@/ui/RatingReadOnly";
import { formatDate } from "date-fns";
import { MessageSquareText } from "lucide-react";

function GameDetailsReviews({ reviewsData }) {
  const reviews =
    reviewsData?.data?.filter(
      (review) => review.review !== null && review.review !== "",
    ) || [];
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <section
      id="reviews"
      aria-label="Reviews"
      className="mx-auto w-full max-w-[1440px] px-4 pt-14 md:px-8"
    >
      <div className="mb-4 flex max-w-4xl flex-wrap items-baseline justify-between gap-3">
        <h2>
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-text-muted tabular font-normal">
              {reviews.length}
            </span>
          )}
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <RatingReadOnly
              rating={parseFloat(averageRating)}
              bgColor="bg-pulse-primary"
              maxRating={5}
            />
            <span className="text-text-main tabular text-sm font-semibold">
              {averageRating}
            </span>
            <span className="text-text-dim text-sm">average</span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <ul className="border-stroke-subtle bg-bg-surface divide-stroke-subtle max-w-4xl divide-y rounded-lg border">
          {reviews.map((review) => {
            const name = review.user?.username || "Player";
            const games = review.stats?.games_count ?? 0;
            const reviewCount = review.stats?.reviews_count ?? 0;
            return (
              <li key={review.id} className="flex flex-col gap-3 p-5">
                <div className="flex items-start gap-3">
                  {review.user?.avatar_url ? (
                    <img
                      src={review.user.avatar_url}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="bg-bg-chip text-text-main flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase"
                    >
                      {name.charAt(0)}
                    </span>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-text-main truncate font-semibold">
                      {name}
                    </span>
                    <span className="text-text-muted tabular text-xs">
                      {games} {games === 1 ? "game" : "games"} · {reviewCount}{" "}
                      {reviewCount === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div
                      className="flex items-center gap-2"
                      aria-label={`Rated ${review.rating} out of 5`}
                    >
                      <RatingReadOnly
                        rating={review.rating}
                        bgColor="bg-pulse-primary"
                        maxRating={5}
                      />
                      <span className="text-text-main tabular text-sm font-semibold">
                        {Number(review.rating).toFixed(1)}
                      </span>
                    </div>
                    <time
                      dateTime={review.created_at}
                      className="text-text-muted tabular text-xs"
                    >
                      {formatDate(new Date(review.created_at), "d MMM yyyy")}
                    </time>
                  </div>
                </div>
                <p
                  dir="auto"
                  className="font-arabic text-text-main max-w-[65ch] leading-relaxed sm:pl-[52px]"
                >
                  {review.review}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-stroke-subtle flex max-w-4xl flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <MessageSquareText className="text-text-muted h-6 w-6" />
          <h3 className="text-base">No reviews yet</h3>
          <p className="text-sm">Log this game and write the first review.</p>
        </div>
      )}
    </section>
  );
}

export default GameDetailsReviews;
