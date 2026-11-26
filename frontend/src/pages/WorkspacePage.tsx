import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import WorkspaceGrid from "@/features/workspace/WorkspaceGrid";
import CreateWorkspaceDialog from "@/features/workspace/CreateWorkspaceDialog";
import { Input } from "@/components/ui/input";

const WorkspacePage = () => {
  const { workspaces, getAll } = useWorkspace();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void getAll().catch((error: unknown) => {
      console.error("[workspace] failed to load workspaces", error);
      setError(
        error instanceof Error
          ? error.message
          : "Could not load workspaces. Please try again."
      );
    }).finally(() => setIsLoading(false));
  }, [getAll]);

  const filteredWorkspaces = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return workspaces;
    return workspaces.filter(
      (workspace) =>
        workspace.name.toLocaleLowerCase().includes(query) ||
        workspace.description.toLocaleLowerCase().includes(query)
    );
  }, [search, workspaces]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Workspaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize your teams, projects, and shared work.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search workspaces..."
          aria-label="Search workspaces"
          className="pl-9"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"
        >
          <p>{error}</p>
          <button
            type="button"
            className="mt-2 font-medium underline underline-offset-4"
            onClick={() => {
              setIsLoading(true);
              setError("");
              void getAll()
                .catch((loadError: unknown) => {
                  console.error("[workspace] failed to load workspaces", loadError);
                  setError(
                    loadError instanceof Error
                      ? loadError.message
                      : "Could not load workspaces. Please try again."
                  );
                })
                .finally(() => setIsLoading(false));
            }}
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading workspaces">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-2xl border bg-muted/40" />
          ))}
        </div>
      ) : (
        <WorkspaceGrid workspaces={filteredWorkspaces} />
      )}
    </div>
  );
};

export default WorkspacePage;