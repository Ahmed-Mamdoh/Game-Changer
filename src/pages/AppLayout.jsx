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

function AppLayout() {
  const location = useLocation();
  const queryClient = useQueryClient();

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
      queryKey: ["numberOfResults", "all", "", [], false],
      queryFn: () =>
        getNumberOfResults({ filters: [], search: "", isUpcoming: false }),
    });
    queryClient.prefetchQuery({
      queryKey: ["numberOfResults", "all", "", [], true],
      queryFn: () =>
        getNumberOfResults({ filters: [], search: "", isUpcoming: true }),
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
    <div className="relative min-h-[100dvh]">
      <Toaster />
      <ScrollToTop />
      <Header />
      <ChatBot />
      <Suspense fallback={<Spinner />} key={location.pathname}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}

export default AppLayout;
