const NUM_OF_STARS = 10;
function Rating({ bgColor, rating }) {
  return (
    <div className="rating rating-lg rating-half">
      {Array.from({ length: NUM_OF_STARS }, (_, i) => {
        return (
          <>
            <div
              className={`mask mask-star-2 mask-half-1 ${bgColor}`}
              aria-label={`${i + 0.5} star`}
              aria-current={i + 1 - 0.5 <= rating / 10}
              key={i + 0.5}
            />
            <div
              className={`mask mask-star-2 mask-half-2 ${bgColor}`}
              aria-label={`${i + 1} star`}
              aria-current={i + 1 <= rating / 10}
              key={i}
            />
          </>
        );
      })}
    </div>
  );
}

export default Rating;
