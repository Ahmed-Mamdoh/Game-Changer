import spaceBackground from "@/assets/space.png";

function FadingBackground() {
  return (
    <div
      className={`to-bg-base from-bg-base/60 absolute top-0 left-0 h-[70dvh] w-full overflow-hidden bg-gradient-to-b`}
    >
      <img
        src={spaceBackground}
        alt="space background"
        className="h-full w-full object-cover"
      />
      <div
        className={`to-bg-base from-bg-base/60 pointer-events-none absolute inset-0 bg-gradient-to-b  `}
      />
    </div>
  );
}

export default FadingBackground;
