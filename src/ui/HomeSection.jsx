import GamesGallary from "@/features/games/ui/GamesGallary";
import { Link } from "react-router-dom";

function HomeSection({ sectionName, data, isLoading, route, id }) {
  return (
    <div id={id} className="flex flex-col items-center">
      <div className="flex w-full items-end justify-center pt-20 pr-20 pl-36 md:pr-40 md:pl-56">
        <div className="w-full grow"></div>
        <h2 className="font-heading text-2xl text-nowrap md:text-4xl lg:text-5xl">
          {sectionName}
        </h2>
        <div className="w-full grow"></div>
        <Link
          to={`/${route}`}
          className="text-md text-nowrap text-blue-400 hover:underline"
        >
          See All →
        </Link>
      </div>
      <GamesGallary data={data} isLoading={isLoading} />
    </div>
  );
}

export default HomeSection;
