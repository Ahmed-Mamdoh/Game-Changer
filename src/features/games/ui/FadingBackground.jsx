import spaceBackground from "@/assets/space.png";

function FadingBackground({ first = false, middle = false, last = false }) {
  const styles = middle
    ? "bg-gradient-to-b from-obsidian-muted/90 to-obsidian-muted/90 via-black/60 "
    : first
      ? "bg-gradient-to-b from-black/60  to-obsidian-muted"
      : last
        ? "bg-gradient-to-b from-obsidian-muted/90 to-obsidian-muted via-black/60"
        : null;
  return (
    <div
      className={`absolute top-0 left-0 h-[70vh] w-full overflow-hidden ${styles}`}
    >
      <img
        src={spaceBackground}
        alt="space background"
        className="h-full w-full object-cover"
      />
      <div className={` ${styles} pointer-events-none absolute inset-0  `} />
    </div>
  );
}

export default FadingBackground;
