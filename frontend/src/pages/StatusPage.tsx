import { AlertTriangle, ArrowLeft, CloudOff, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type StatusKind = "error" | "offline" | "maintenance";

const statusContent = {
  error: {
    code: "500",
    title: "Something went wrong",
    description:
      "The page couldn’t be loaded because of an unexpected error. Please try again.",
    icon: AlertTriangle,
  },
  offline: {
    code: "OFFLINE",
    title: "You’re offline",
    description:
      "Reconnect to the internet, then try loading your workspace again.",
    icon: CloudOff,
  },
  maintenance: {
    code: "MAINTENANCE",
    title: "We’ll be right back",
    description:
      "This workspace is temporarily unavailable while maintenance is in progress.",
    icon: Wrench,
  },
} satisfies Record<StatusKind, {
  code: string;
  title: string;
  description: string;
  icon: typeof AlertTriangle;
}>;

interface StatusPageProps {
  kind: StatusKind;
}

const StatusPage = ({ kind }: StatusPageProps) => {
  const content = statusContent[kind];
  const Icon = content.icon;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <section className="w-full max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-primary">
          {content.code}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {content.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {content.description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft aria-hidden="true" />
              Back to workspace
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default StatusPage;
