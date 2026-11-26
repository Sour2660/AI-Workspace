import { useProject } from "@/features/project/project.hook";
import ProjectFormDialog from "@/features/project/components/ProjectFormDialog";
import type { Workspace } from "@/types/workspace";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaces: Workspace[];
  initialWorkspaceId: string;
}

const CreateProjectDialog = ({
  open,
  onOpenChange,
  workspaces,
  initialWorkspaceId,
}: CreateProjectDialogProps) => {
  const { createProject, setSelectedWorkspaceId } = useProject();

  return (
    <ProjectFormDialog
      key={open ? "create-open" : "create-closed"}
      open={open}
      onOpenChange={onOpenChange}
      workspaces={workspaces}
      initialWorkspaceId={initialWorkspaceId}
      onSubmit={async ({ name, description, workspaceId }) => {
        setSelectedWorkspaceId(workspaceId);
        await createProject({
          name,
          description,
          workspace: workspaceId,
        });
      }}
    />
  );
};

export default CreateProjectDialog;
