import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section className="w-full max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          The page may have moved, or the link may be incorrect.
        </p>
        <Button className="mt-7" asChild>
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Back to workspace
          </Link>
        </Button>
      </section>
    </main>
  );
};

export default NotFoundPage;