import React, { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const AllGames = lazy(() => import("./pages/AllGames"));
const GameDetails = lazy(() => import("./pages/GameDetails"));
const FreeGames = lazy(() => import("./pages/FreeGames"));
const UpcomingGames = lazy(() => import("./pages/UpcomingGames"));
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
import RouteErrorFallback from "./pages/RouteErrorFallback";

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
        {
          path: "/account",
          element: <Account />,
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
