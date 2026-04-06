import GamesGallary from "@/features/games/ui/GamesGallary";
import { Link } from "react-router-dom";

function HomeSection({ sectionName, data, isLoading, route, id }) {
  return (
    <div id={id} className="flex flex-col items-center">
      <div className="flex w-9/10 items-center justify-between">
        <h2 className="font-heading text-2xl text-nowrap md:text-4xl lg:text-5xl">
          {sectionName}
        </h2>
        <Link
          to={`/${route}`}
          className="text-md text-pulse-accent text-nowrap"
        >
          See All →
        </Link>
      </div>
      <GamesGallary data={data} isLoading={isLoading} />
    </div>
  );
}

export default HomeSection;
