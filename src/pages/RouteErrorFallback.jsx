import { Link, useRouteError } from "react-router-dom";

function RouteErrorFallback() {
  const routeError = useRouteError();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-4 px-4">
        <h2>This page didn't load</h2>
        <p className="max-w-[50ch] text-center">
          {routeError?.message ||
            routeError?.error?.message ||
            "Something unexpected went wrong."}{" "}
          Go back home and try again.
        </p>
        <Link className="btn-primary" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default RouteErrorFallback;
