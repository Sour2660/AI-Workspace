import { useEffect } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import WorkspaceGrid from "../features/workspace/WorkspaceGrid";
import CreateWorkspaceDialog from "../features/workspace/CreateWorkspaceDialog";

const WorkspacePage = () => {
  const { workspaces, getAll } = useWorkspace();

  useEffect(() => {
    getAll();
  }, []);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Workspaces
        </h1>

        <p className="text-gray-500">
          Manage your workspaces
        </p>
      </div>

      <CreateWorkspaceDialog />

      <WorkspaceGrid
        workspaces={workspaces}
      />
    </div>
  );
};

export default WorkspacePage;