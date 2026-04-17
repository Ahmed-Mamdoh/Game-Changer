import { Link, useRouteError } from "react-router-dom";

function RouteErrorFallback() {
  const routeError = useRouteError();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-5">
        <h2>Oops! Something went wrong 😅</h2>
        <p className="text-lg">
          {routeError?.message ||
            routeError.error.message ||
            "Unexpected error occurred"}
        </p>
        <Link
          className="bg-pulse-primary text-primary-content rounded-full px-4 py-2 font-bold"
          to="/"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
