import {
  STATUS_ICONS,
  STATUS_LABELS,
} from "@/features/games/hooks/useQuickStatus";
import RatingReadOnly from "@/ui/RatingReadOnly";
import { formatDate } from "date-fns";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";

const formatHours = (hours) =>
  `${Number(hours).toLocaleString("en", { maximumFractionDigits: 1 })} h`;

// Steam-style playtime: hours now, and hours when the review was written
function ReviewPlaytime({ play, hoursAtReview }) {
  const hasHours = play?.hours_played != null;
  const status = STATUS_ICONS[play?.status];
  if (!status && !hasHours) return null;
  const StatusIcon = status?.icon;

  return (
    <p className="text-text-dim tabular flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:pl-[52px]">
      {status && (
        <span className="text-text-main inline-flex items-center gap-1 font-semibold">
          <StatusIcon className={`h-3.5 w-3.5 ${status.color}`} aria-hidden />
          {STATUS_LABELS[play.status]}
        </span>
      )}
      {status && hasHours && <span aria-hidden>·</span>}
      {hasHours && <span>{formatHours(play.hours_played)} on record</span>}
      {hoursAtReview != null && (
        <>
          <span aria-hidden>·</span>
          <span>{formatHours(hoursAtReview)} at review time</span>
        </>
      )}
    </p>
  );
}

// Store-style summary: big average on the left, a bar per star on the right
function RatingBreakdown({ ratings }) {
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => Math.round(r) === star).length,
  }));
  const most = Math.max(...counts.map((c) => c.count));

  return (
    <div className="border-stroke-subtle bg-bg-surface mb-3 grid max-w-4xl gap-6 rounded-lg border p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
      <div className="flex flex-col items-start gap-1.5">
        <span className="text-text-main tabular font-heading text-5xl leading-none font-bold">
          {average.toFixed(1)}
        </span>
        <RatingReadOnly
          rating={Math.round(average)}
          bgColor="bg-pulse-primary"
          maxRating={5}
        />
        <span className="text-text-dim tabular text-xs">
          {ratings.length} {ratings.length === 1 ? "rating" : "ratings"}
        </span>
      </div>
      <ul
        className="flex w-full max-w-md flex-col gap-1.5"
        aria-label="Ratings by star"
      >
        {counts.map(({ star, count }) => (
          <li
            key={star}
            className="grid grid-cols-[1.25rem_1fr_2rem] items-center gap-3 text-xs"
            aria-label={`${star} stars: ${count}`}
          >
            <span className="text-text-dim tabular text-right">{star}</span>
            <span className="bg-bg-chip h-1.5 overflow-hidden rounded-full">
              <span
                className="bg-pulse-primary block h-full rounded-full"
                style={{ width: most ? `${(count / most) * 100}%` : 0 }}
              />
            </span>
            <span className="text-text-muted tabular">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SORTS = {
  newest: {
    label: "Newest",
    compare: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  },
  highest: { label: "Highest", compare: (a, b) => b.rating - a.rating },
  lowest: { label: "Lowest", compare: (a, b) => a.rating - b.rating },
};

function GameDetailsReviews({ reviewsData }) {
  const [sort, setSort] = useState("newest");
  const ratings =
    reviewsData?.data
      ?.map((review) => Number(review.rating))
      .filter((rating) => rating > 0) || [];
  const reviews =
    reviewsData?.data
      ?.filter((review) => review.review !== null && review.review !== "")
      // Ties keep newest first
      .sort(
        (a, b) => SORTS[sort].compare(a, b) || SORTS.newest.compare(a, b),
      ) || [];

  return (
    <section
      id="reviews"
      aria-label="Reviews"
      className="mx-auto w-full max-w-[1440px] px-4 pt-14 md:px-8"
    >
      <div className="mb-4 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <h2>
          Reviews{" "}
          {reviews.length > 0 && (
            <span className="text-text-muted tabular font-normal">
              {reviews.length}
            </span>
          )}
        </h2>
        {reviews.length > 1 && (
          <div
            role="radiogroup"
            aria-label="Sort reviews"
            className="segmented bg-bg-surface backdrop-blur-none"
          >
            {Object.entries(SORTS).map(([id, { label }]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={sort === id}
                onClick={() => setSort(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {ratings.length > 0 && <RatingBreakdown ratings={ratings} />}

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
                <ReviewPlaytime
                  play={review.play}
                  hoursAtReview={review.hours_at_review}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-stroke-subtle flex max-w-4xl flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <MessageSquareText className="text-text-muted h-6 w-6" />
          <h3 className="text-base">
            {ratings.length ? "No written reviews yet" : "No reviews yet"}
          </h3>
          <p className="text-sm">Log this game and write the first review.</p>
        </div>
      )}
    </section>
  );
}

export default GameDetailsReviews;
