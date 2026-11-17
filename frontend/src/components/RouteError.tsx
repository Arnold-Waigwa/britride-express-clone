import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

const RouteError = () => {
  const error = useRouteError();
  const serviceUnavailable =
    isRouteErrorResponse(error) && error.status === 503;

  return (
    <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Unable to load this page</h1>
      <Alert variant="destructive">
        <AlertTitle>
          {serviceUnavailable
            ? "We couldn’t connect to the service"
            : "Something went wrong"}
        </AlertTitle>
        <AlertDescription>
          Please try again. If the problem continues, come back later.
        </AlertDescription>
      </Alert>
      <div className="flex items-center gap-4">
        <Button type="button" onClick={() => window.location.reload()}>
          Try again
        </Button>
        <Link to="/login" className="text-sm underline underline-offset-4">
          Go to login
        </Link>
      </div>
    </main>
  );
};

export default RouteError;
