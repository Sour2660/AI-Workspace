import WorkspaceCard from "@/features/workspace/WorkspaceCard";
import type { Workspace } from "@/types/workspace";

interface Props {
  workspaces: Workspace[];
}

const WorkspaceGrid = ({ workspaces }: Props) => {
  if (!workspaces.length) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
        <h2 className="font-semibold">No workspaces found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a workspace or try another search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace._id}
          workspace={workspace}
        />
      ))}
    </div>
  );
};

export default WorkspaceGrid;