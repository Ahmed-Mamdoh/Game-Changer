import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/Header";
import ScrollToTop from "@/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect } from "react";
import Spinner from "../ui/Spinner";
import ChatBot from "@/features/ChatBot/ChatBot";
import Footer from "@/ui/Footer";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAllGames,
  getGameModes,
  getGenres,
  getNumberOfResults,
  getThemes,
} from "@/api/igdbApi";
import useWishlistAlerts from "@/features/games/hooks/useWishlistAlerts";

function AppLayout() {
  const location = useLocation();
  const queryClient = useQueryClient();
  useWishlistAlerts();

  useEffect(() => {
    // Prefetch the first page of games
    queryClient.prefetchQuery({
      queryKey: ["genres"],
      queryFn: getGenres,
    });
    queryClient.prefetchQuery({
      queryKey: ["themes"],
      queryFn: getThemes,
    });
    queryClient.prefetchQuery({
      queryKey: ["GameModes"],
      queryFn: getGameModes,
    });
    queryClient.prefetchQuery({
      queryKey: ["numberOfResults", "all", [], null, null],
      queryFn: () => getNumberOfResults({ filters: [], isUpcoming: false }),
    });
    queryClient.prefetchQuery({
      queryKey: ["numberOfResults", "upcoming", [], null, null],
      queryFn: () => getNumberOfResults({ filters: [], isUpcoming: true }),
    });
    queryClient.prefetchQuery({
      queryKey: ["games", "all", 1, null, [], null, null, null],
      queryFn: () => getAllGames({ sortBy: "total_rating_count", page: 1 }),
    });
    queryClient.prefetchQuery({
      queryKey: ["games", "upcoming", 1, null, [], undefined, null],
      queryFn: () =>
        getAllGames({ sortBy: "hypes", isUpcoming: true, page: 1 }),
    });
  }, [queryClient]);

  return (
    <>
      {/* Brand backdrop: purple at the top of the screen fading to black */}
      <div aria-hidden="true" className="ambient" />
      <div className="relative min-h-[100dvh]">
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "var(--color-bg-raised)",
              color: "var(--color-text-main)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#7dd3a0", secondary: "#120f18" },
            },
            error: { iconTheme: { primary: "#ff8a80", secondary: "#120f18" } },
          }}
        />
        <ScrollToTop />
        <Header />
        <ChatBot />
        <Suspense fallback={<Spinner />} key={location.pathname}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

export default AppLayout;
