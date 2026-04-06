const NUM_OF_STARS = 5;
function Rating({ bgColor, rating }) {
  return (
    <div className="rating rating-sm">
      {Array.from({ length: NUM_OF_STARS }, (_, i) => {
        return (
          <>
            <div
              className={`mask mask-star-2  ${bgColor}`}
              aria-current={(i) < rating / (100 / NUM_OF_STARS)}
              key={i}
            />
          </>
        );
      })}
    </div>
  );
}

export default Rating;
