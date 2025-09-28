import { Link, useRouteError } from "react-router-dom";

function RouteErrorFallback() {
  const routeError = useRouteError();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-5">
        <h1 className="text-4xl font-semibold">
          Oops! Something went wrong 😅
        </h1>
        <p className="text-lg">
          {routeError?.message ||
            routeError.error.message ||
            "Unexpected error occurred"}
        </p>
        <Link className="btn bg-accent-primary border-0 font-bold" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
