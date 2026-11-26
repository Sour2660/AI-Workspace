import { FolderKanban, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/features/project/components/ProjectCard";
import type { Project } from "@/features/project/types";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  workspaceId: string;
  onEdit: (project: Project) => void;
  onArchive: (project: Project) => void;
  onRetry: () => void;
  view: "grid" | "list";
  favorites: string[];
  onToggleFavorite: (projectId: string) => void;
}

const ProjectGrid = ({
  projects,
  isLoading,
  error,
  workspaceId,
  onEdit,
  onArchive,
  onRetry,
  view,
  favorites,
  onToggleFavorite,
}: ProjectGridProps) => {
  if (isLoading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Loading projects"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-4 rounded-2xl border p-6">
            <div className="flex gap-3">
              <Skeleton className="size-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center">
        <p className="font-medium">We couldn’t load these projects.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FolderKanban className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-semibold">No projects yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Create a project to give your team a home for goals, tasks, and
          progress.
        </p>
      </div>
    );
  }

  return (
    <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          workspaceId={workspaceId}
          onEdit={onEdit}
          onArchive={onArchive}
          isFavorite={favorites.includes(project._id)}
          onToggleFavorite={onToggleFavorite}
          view={view}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
