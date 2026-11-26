import WorkspaceCard from "./WorkspaceCard";
import type { Workspace } from "../../types/workspace";

interface Props {
  workspaces: Workspace[];
}

const WorkspaceGrid = ({ workspaces }: Props) => {
  if (!workspaces.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        No workspace found.
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