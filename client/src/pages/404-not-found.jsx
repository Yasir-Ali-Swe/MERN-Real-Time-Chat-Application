import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-7xl font-bold text-muted-foreground">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/conversations">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
