import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
  Archive,
  CalendarDays,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Star,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/features/project/types";

interface ProjectCardProps {
  project: Project;
  workspaceId: string;
  onEdit: (project: Project) => void;
  onArchive: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
  view: "grid" | "list";
}

const ProjectCard = ({
  project,
  workspaceId,
  onEdit,
  onArchive,
  isFavorite,
  onToggleFavorite,
  view,
}: ProjectCardProps) => (
  <article
    className={`group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6 ${
      view === "grid"
        ? "hover:-translate-y-0.5"
        : "flex flex-col gap-4 sm:flex-row sm:items-center"
    }`}
  >
    {view === "grid" && (
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 opacity-80" />
    )}
    <div className={`flex items-start justify-between gap-3 ${view === "list" ? "sm:w-[30%]" : ""}`}>
      <Link
        to={`/projects/${project._id}?workspace=${workspaceId}`}
        className="flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <FolderKanban className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 pt-0.5">
          <span className="block truncate font-semibold tracking-tight group-hover:text-primary">
            {project.name}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Project
          </span>
        </span>
      </Link>

      <button
        type="button"
        onClick={() => onToggleFavorite(project._id)}
        aria-label={`${isFavorite ? "Remove" : "Add"} ${project.name} ${isFavorite ? "from" : "to"} favorites`}
        aria-pressed={isFavorite}
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Star
          className={`size-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
          aria-hidden="true"
        />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Actions for ${project.name}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(project)}>
            <Pencil aria-hidden="true" />
            Edit project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => onArchive(project)}
          >
            <Archive aria-hidden="true" />
            Archive project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Link
      to={`/projects/${project._id}`}
      className={`block text-sm leading-6 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        view === "grid" ? "mt-5 min-h-12" : "flex-1"
      }`}
    >
      {project.description || "No description added yet."}
    </Link>

    <div className={`flex flex-wrap items-center justify-between gap-3 ${
      view === "grid" ? "mt-5 border-t pt-4" : "sm:w-[30%]"
    }`}>
      <span className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          {project.status === "ACTIVE" ? "Active" : "Archived"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="size-3.5" aria-hidden="true" />
          {project.members?.length ?? 0}
          <span className="sr-only">members</span>
        </span>
      </span>
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        {dayjs(project.createdAt).format("MMM D, YYYY")}
      </span>
    </div>
  </article>
);

export default ProjectCard;
