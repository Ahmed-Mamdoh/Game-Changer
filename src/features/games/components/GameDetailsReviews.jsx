import GG from "@/assets/GG.png";
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
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
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
        <ul className="border-stroke-subtle divide-stroke-subtle max-w-4xl divide-y border-t">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-4 py-6">
              <img
                src={review.user?.avatar_url || GG}
                alt=""
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-text-main font-semibold">
                    {review.user?.username || "Player"}
                  </span>
                  <RatingReadOnly
                    rating={review.rating}
                    bgColor="bg-pulse-primary"
                    maxRating={5}
                  />
                  <span className="text-text-muted tabular text-xs">
                    {review.stats?.games_count ?? 0} games ·{" "}
                    {review.stats?.reviews_count ?? 0} reviews ·{" "}
                    {formatDate(new Date(review.created_at), "d MMM yyyy")}
                  </span>
                </div>
                <p
                  dir="auto"
                  className="font-arabic text-text-main max-w-[65ch] leading-relaxed"
                >
                  {review.review}
                </p>
              </div>
            </li>
          ))}
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
