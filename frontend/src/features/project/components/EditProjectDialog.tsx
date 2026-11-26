import { useProject } from "@/features/project/project.hook";
import ProjectFormDialog from "@/features/project/components/ProjectFormDialog";
import type { Project } from "@/features/project/types";
import type { Workspace } from "@/types/workspace";

interface EditProjectDialogProps {
  project: Project | null;
  workspaceId: string;
  workspaces: Workspace[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProjectDialog = ({
  project,
  workspaceId,
  workspaces,
  open,
  onOpenChange,
}: EditProjectDialogProps) => {
  const { updateProject } = useProject();

  if (!project) {
    return null;
  }

  return (
    <ProjectFormDialog
      key={`${project._id}-${open ? "open" : "closed"}`}
      open={open}
      onOpenChange={onOpenChange}
      workspaces={workspaces}
      initialWorkspaceId={workspaceId}
      project={project}
      onSubmit={async ({ name, description }) => {
        await updateProject(project._id, workspaceId, { name, description });
      }}
    />
  );
};

export default EditProjectDialog;
