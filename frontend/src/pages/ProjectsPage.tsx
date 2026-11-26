import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowDownUp,
  ArrowRight,
  BriefcaseBusiness,
  LayoutGrid,
  List,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProjectDialog from "@/features/project/components/CreateProjectDialog";
import DeleteProjectDialog from "@/features/project/components/DeleteProjectDialog";
import EditProjectDialog from "@/features/project/components/EditProjectDialog";
import ProjectGrid from "@/features/project/components/ProjectGrid";
import ProjectHeader from "@/features/project/components/ProjectHeader";
import { useProject } from "@/features/project/project.hook";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Project } from "@/features/project/types";

const ProjectsPage = () => {
  const { workspaces, getAll } = useWorkspace();
  const {
    projects,
    selectedWorkspaceId,
    isLoading,
    error,
    setSelectedWorkspaceId,
    loadProjects,
    archiveProject,
  } = useProject();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [sortBy, setSortBy] = useState<"updated" | "name" | "created">("updated");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "ARCHIVED">("ALL");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);
  const initialWorkspaceResolved = useRef(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [archivingProject, setArchivingProject] = useState<Project | null>(
    null
  );
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const setSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("search", value);
    else nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    void getAll()
      .then(() => setWorkspaceError(""))
      .catch((loadError: unknown) => {
        setWorkspaceError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load workspaces."
        );
        console.error("[projects] failed to load workspaces");
      })
      .finally(() => setIsWorkspaceLoading(false));
  }, [getAll]);

  useEffect(() => {
    if (workspaces.length === 0 || initialWorkspaceResolved.current) {
      return;
    }

    const requestedWorkspaceId = searchParams.get("workspace");
    const requestedWorkspaceExists = workspaces.some(
      (workspace) => workspace._id === requestedWorkspaceId
    );
    const selectedWorkspaceExists = workspaces.some(
      (workspace) => workspace._id === selectedWorkspaceId
    );
    initialWorkspaceResolved.current = true;
    setSelectedWorkspaceId(
      requestedWorkspaceExists
        ? requestedWorkspaceId!
        : selectedWorkspaceExists
          ? selectedWorkspaceId
          : workspaces[0]._id
    );
  }, [
    searchParams,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    workspaces,
  ]);

  useEffect(() => {
    if (!selectedWorkspaceId) {
      return;
    }

    void loadProjects(selectedWorkspaceId).catch(() => {
      // The hook stores the request error for the page's error state.
    });
  }, [loadProjects, selectedWorkspaceId]);

  useEffect(() => {
    if (selectedWorkspaceId && searchParams.get("workspace") !== selectedWorkspaceId) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("workspace", selectedWorkspaceId);
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, selectedWorkspaceId, setSearchParams]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return projects
      .filter((project) => {
        const matchesQuery =
          !query ||
          project.name.toLocaleLowerCase().includes(query) ||
          project.description?.toLocaleLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "ALL" || project.status === statusFilter;
        const matchesFavorite =
          !favoritesOnly || favorites.includes(project._id);
        return matchesQuery && matchesStatus && matchesFavorite;
      })
      .sort((left, right) => {
        if (sortBy === "name") return left.name.localeCompare(right.name);
        if (sortBy === "created") return left.createdAt.localeCompare(right.createdAt);
        return right.updatedAt.localeCompare(left.updatedAt);
      });
  }, [favorites, favoritesOnly, projects, search, sortBy, statusFilter]);

  const toggleFavorite = (projectId: string) => {
    setFavorites((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    );
  };

  const handleArchive = async () => {
    if (!archivingProject || !selectedWorkspaceId) {
      return;
    }

    setIsArchiving(true);
    setArchiveError(null);
    try {
      await archiveProject(archivingProject._id, selectedWorkspaceId);
      setArchivingProject(null);
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

  const activeWorkspace = workspaces.find(
    (workspace) => workspace._id === selectedWorkspaceId
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      <ProjectHeader
        workspaces={workspaces}
        workspaceId={selectedWorkspaceId}
        search={search}
        onWorkspaceChange={setSelectedWorkspaceId}
        onSearchChange={setSearch}
        onCreate={() => setIsCreateOpen(true)}
      />

      {workspaceError ? (
        <div
          className="rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-10 text-center"
          role="alert"
        >
          <p className="font-medium">We couldn’t load your workspaces.</p>
          <p className="mt-2 text-sm text-muted-foreground">{workspaceError}</p>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => {
              setWorkspaceError("");
              setIsWorkspaceLoading(true);
              void getAll()
                .then(() => setWorkspaceError(""))
                .catch((loadError: unknown) => {
                  setWorkspaceError(
                    loadError instanceof Error
                      ? loadError.message
                      : "Unable to load workspaces."
                  );
                })
                .finally(() => setIsWorkspaceLoading(false));
            }}
          >
            Try again
          </Button>
        </div>
      ) : isWorkspaceLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-semibold">Create a workspace first</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Projects belong to a workspace. Create one before adding your first
            project.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/workspace">
              Go to workspaces
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {activeWorkspace && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: activeWorkspace.color }}
                aria-hidden="true"
              />
              Showing projects in{" "}
              <span className="font-medium text-foreground">
                {activeWorkspace.name}
              </span>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              {visibleProjects.length}{" "}
              {visibleProjects.length === 1 ? "project" : "projects"}
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownUp className="size-4" aria-hidden="true" />
              <span className="sr-only">Sort projects</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "updated" | "name" | "created")
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="updated">Recently updated</option>
                <option value="name">Name</option>
                <option value="created">Date created</option>
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="project-status-filter">
                Filter projects by status
              </label>
              <select
                id="project-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | "ACTIVE" | "ARCHIVED")
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <Button
                type="button"
                variant={favoritesOnly ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFavoritesOnly((current) => !current)}
                aria-pressed={favoritesOnly}
              >
                <Star className={favoritesOnly ? "fill-amber-400 text-amber-400" : ""} aria-hidden="true" />
                Favorites
              </Button>
              <div className="flex rounded-lg border p-0.5">
                <button
                  type="button"
                  className={`grid size-8 place-items-center rounded ${
                    view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`grid size-8 place-items-center rounded ${
                    view === "list" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  <List className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          {!isLoading && visibleProjects.length === 0 && projects.length > 0 ? (
            <div className="rounded-2xl border border-dashed px-6 py-14 text-center">
              <h2 className="font-semibold">No projects match these filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Adjust your search or clear the current filters.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setFavoritesOnly(false);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ProjectGrid
              projects={visibleProjects}
              isLoading={isLoading}
              error={error}
              workspaceId={selectedWorkspaceId}
              onEdit={setEditingProject}
              onArchive={(project) => {
                setArchiveError(null);
                setArchivingProject(project);
              }}
              onRetry={() => {
                void loadProjects(selectedWorkspaceId).catch(() => {
                  // The hook stores the request error for the page's error state.
                });
              }}
              view={view}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </>
      )}

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        workspaces={workspaces}
        initialWorkspaceId={selectedWorkspaceId}
      />
      <EditProjectDialog
        project={editingProject}
        workspaceId={selectedWorkspaceId}
        workspaces={workspaces}
        open={Boolean(editingProject)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null);
          }
        }}
      />
      <DeleteProjectDialog
        project={archivingProject}
        open={Boolean(archivingProject)}
        isSubmitting={isArchiving}
        error={archiveError}
        onOpenChange={(open) => {
          if (!open) {
            setArchivingProject(null);
            setArchiveError(null);
          }
        }}
        onConfirm={handleArchive}
      />
    </div>
  );
};

export default ProjectsPage;
