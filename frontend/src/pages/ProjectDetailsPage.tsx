import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Archive,
  CalendarDays,
  ClipboardList,
  Pencil,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteProjectDialog from "@/features/project/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/project/components/EditProjectDialog";
import { useProject } from "@/features/project/project.hook";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Project } from "@/features/project/types";

const getWorkspaceId = (project: Project) =>
  typeof project.workspace === "string"
    ? project.workspace
    : project.workspace._id;

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { workspaces, getAll } = useWorkspace();
  const {
    currentProject,
    isLoading,
    error,
    loadProject,
    archiveProject,
  } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    void loadProject(projectId).catch(() => {
      // The hook stores the request error for the page's error state.
    });
  }, [loadProject, projectId]);

  useEffect(() => {
    void getAll().catch((loadError: unknown) => {
      console.error("[projects] failed to load workspaces for project details", {
        message:
          loadError instanceof Error ? loadError.message : "Unknown error",
      });
    });
  }, [getAll]);

  const project = currentProject?._id === projectId ? currentProject : null;
  const workspaceId = project
    ? getWorkspaceId(project)
    : searchParams.get("workspace") ?? "";
  const workspace = workspaces.find((item) => item._id === workspaceId);

  const handleArchive = async () => {
    if (!project) {
      return;
    }

    setIsArchiving(true);
    setArchiveError(null);
    try {
      await archiveProject(project._id, workspaceId);
      setIsArchiveOpen(false);
      navigate(`/projects?workspace=${workspaceId}`, { replace: true });
    } catch (requestError) {
      setArchiveError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to archive this project."
      );
    } finally {
      setIsArchiving(false);
    }
  };

  if (isLoading && !project) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-5 sm:p-8">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl p-5 sm:p-8">
        <Button variant="ghost" asChild className="-ml-3 mb-6">
          <Link to="/projects">
            <ArrowLeft aria-hidden="true" />
            Back to projects
          </Link>
        </Button>
        <div
          className="rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center"
          role="alert"
        >
          <h1 className="font-semibold">Project unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "We couldn’t find this project."}
          </p>
          <Button className="mt-5" variant="outline" asChild>
            <Link to="/projects">Return to projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const memberCount = project.members?.length ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-7 p-5 sm:p-8">
      <Button variant="ghost" asChild className="-ml-3">
        <Link to={`/projects?workspace=${workspaceId}`}>
          <ArrowLeft aria-hidden="true" />
          All projects
        </Link>
      </Button>

      <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              {workspace && (
                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: workspace.color }}
                    aria-hidden="true"
                  />
                  {workspace.name}
                </p>
              )}
              <h1 className="break-words text-3xl font-semibold tracking-tight">
                {project.name}
              </h1>
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {project.description || "No description added yet."}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {project.status === "ACTIVE" ? "Active" : "Archived"}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setArchiveError(null);
                setIsArchiveOpen(true);
              }}
              className="text-destructive hover:text-destructive"
            >
              <Archive aria-hidden="true" />
              Archive
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Project stats">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Members</p>
            <Users className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">{memberCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {memberCount === 1 ? "project member" : "project members"}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Tasks</p>
            <ClipboardList className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-2xl font-semibold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Task data is currently shown in demo mode.
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            asChild
          >
            <Link to="/tasks">Open task list</Link>
          </Button>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Created</p>
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-lg font-semibold">
            {dayjs(project.createdAt).format("MMM D, YYYY")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Project start date</p>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="font-semibold">Recent activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Project timeline from the details currently available.
        </p>
        <ol className="mt-5 space-y-4 border-l pl-5">
          <li className="relative">
            <span className="absolute -left-[1.57rem] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
            <p className="text-sm font-medium">Project created</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {dayjs(project.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            </p>
          </li>
          {project.updatedAt !== project.createdAt && (
            <li className="relative">
              <span className="absolute -left-[1.57rem] top-1.5 size-2.5 rounded-full bg-muted-foreground ring-4 ring-background" />
              <p className="text-sm font-medium">Project details updated</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {dayjs(project.updatedAt).format("MMMM D, YYYY [at] h:mm A")}
              </p>
            </li>
          )}
        </ol>
      </section>

      <EditProjectDialog
        project={project}
        workspaceId={workspaceId}
        workspaces={workspaces}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
      <DeleteProjectDialog
        project={project}
        open={isArchiveOpen}
        isSubmitting={isArchiving}
        error={archiveError}
        onOpenChange={setIsArchiveOpen}
        onConfirm={handleArchive}
      />
    </div>
  );
};

export default ProjectDetailsPage;
