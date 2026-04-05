import spaceBackground from "@/assets/space.png";

function FadingBackground() {
  return (
    <div className="relative h-[100vh] overflow-hidden">
      <img
        src={spaceBackground}
        alt="space background"
        className="h-full w-full object-cover"
      />
      <div className=" to-obsidian-muted pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50" />
    </div>
  );
}

export default FadingBackground;
