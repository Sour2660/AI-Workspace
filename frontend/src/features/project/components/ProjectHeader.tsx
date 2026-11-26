import { FolderPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Workspace } from "@/types/workspace";

interface ProjectHeaderProps {
  workspaces: Workspace[];
  workspaceId: string;
  search: string;
  onWorkspaceChange: (workspaceId: string) => void;
  onSearchChange: (search: string) => void;
  onCreate: () => void;
}

const ProjectHeader = ({
  workspaces,
  workspaceId,
  search,
  onWorkspaceChange,
  onSearchChange,
  onCreate,
}: ProjectHeaderProps) => (
  <header className="space-y-6">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Plan together, make progress
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Organize the work that moves your workspace forward.
        </p>
      </div>
      <Button onClick={onCreate} disabled={workspaces.length === 0}>
        <FolderPlus aria-hidden="true" />
        New project
      </Button>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects..."
          aria-label="Search projects"
          className="h-10 bg-background pl-9"
        />
      </label>
      <label className="sr-only" htmlFor="projects-workspace-filter">
        Filter by workspace
      </label>
      <select
        id="projects-workspace-filter"
        value={workspaceId}
        onChange={(event) => onWorkspaceChange(event.target.value)}
        disabled={workspaces.length === 0}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
      >
        {workspaces.length === 0 && <option value="">No workspaces</option>}
        {workspaces.map((workspace) => (
          <option key={workspace._id} value={workspace._id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  </header>
);

export default ProjectHeader;
