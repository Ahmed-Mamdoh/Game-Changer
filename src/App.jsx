import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllGames from "./pages/AllGames";
import AppLayout from "./pages/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GameDetails from "./pages/GameDetails";
import FreeGames from "./pages/FreeGames";
import RouteErrorFallback from "./pages/RouteErrorFallback";
import Home from "./pages/Home";
import UpcomingGames from "./pages/UpcomingGames";
import ScrollToTop from "./ui/ScrollToTop";
import Auth from "./pages/Auth";
import { Toaster } from "./../node_modules/react-hot-toast/src/components/toaster";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 min
      },
    },
  });

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <RouteErrorFallback />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/allGames",
          element: <AllGames />,
        },
        {
          path: "/game/:gameId",
          element: <GameDetails />,
        },
        {
          path: "/freeGames",
          element: <FreeGames />,
        },
        {
          path: "/upcomingGames",
          element: <UpcomingGames />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
