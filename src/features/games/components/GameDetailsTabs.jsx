function GameDetailsTabs({ data }) {
  const {
    screenshots,
    dlcs,
    language_supports,
    franchises,
    similar_games,
    videos,
  } = data[0];
  return (
    <div className="bg-base-300/80 sticky top-0 z-10 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 py-3 md:gap-x-6">
      <TabButton name="Overview" />
      {(screenshots || videos) && <TabButton name="Media" />}
      {dlcs && <TabButton name="DLCs" />}
      {similar_games && <TabButton name="Similar Games" />}
      {franchises && <TabButton name="Franchises" />}
      {language_supports && <TabButton name="Supported languages" />}
    </div>
  );
}

// TabButton component to handle scrolling to the respective section
function TabButton({ name }) {
  function handleScroll(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <button
      className="text-text-muted hover:base-content text-md cursor-pointer font-semibold tracking-wide transition-colors duration-200"
      onClick={() => handleScroll(name)}
    >
      {name}
    </button>
  );
}

export default GameDetailsTabs;
