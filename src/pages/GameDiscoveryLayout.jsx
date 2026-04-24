import FadingBackground from "@/features/games/ui/FadingBackground";
import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import GamesGallery from "@/features/games/ui/GamesGallery";
import Spinner from "@/ui/Spinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function GameDiscoveryLayout() {
  return (
    <div className="relative py-20">
      <FadingBackground first={true} />
      {/* Content section */}
      <div className="z-10 w-full">
        <Suspense fallback={<Spinner />} key={location.pathname}>
          <Outlet />
        </Suspense>
        {location.pathname !== "/games/freeGames" && <FullPagination />}
      </div>
    </div>
  );
}

export default GameDiscoveryLayout;
