const NUM_OF_STARS = 5;
function RatingReadOnly({ bgColor, rating, maxRating = 100 }) {
  return (
    <div className="rating rating-sm">
      {Array.from({ length: NUM_OF_STARS }, (_, i) => {
        return (
          <>
            <div
              className={`mask mask-star-2  ${bgColor}`}
              aria-current={i < rating / (maxRating / NUM_OF_STARS)}
              key={i}
            />
          </>
        );
      })}
    </div>
  );
}

export default RatingReadOnly;
