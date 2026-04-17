import GamesGallery from "@/features/games/ui/GamesGallery";
import { Link } from "react-router-dom";

function HomeSection({ sectionName, data, isLoading, route, id }) {
  return (
    <div id={id} className="flex flex-col items-center pt-12">
      <div className="flex w-9/10 items-center justify-between">
        <h2>{sectionName}</h2>
        <Link
          to={`/${route}`}
          className="text-text-brand text-nowrap hover:underline"
        >
          See All →
        </Link>
      </div>
      <GamesGallery data={data} isLoading={isLoading} />
    </div>
  );
}

export default HomeSection;
