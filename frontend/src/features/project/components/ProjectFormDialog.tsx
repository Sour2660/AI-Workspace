import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Workspace } from "@/types/workspace";
import type { Project } from "@/features/project/types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaces: Workspace[];
  initialWorkspaceId: string;
  project?: Project;
  onSubmit: (data: {
    name: string;
    description: string;
    workspaceId: string;
  }) => Promise<void>;
}

const ProjectFormDialog = ({
  open,
  onOpenChange,
  workspaces,
  initialWorkspaceId,
  project,
  onSubmit,
}: ProjectFormDialogProps) => {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      setError("Project name must be at least 3 characters.");
      return;
    }
    if (!workspaceId) {
      setError("Choose a workspace for this project.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim(),
        workspaceId,
      });
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save the project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-tight">
                {project ? "Edit project" : "Create a project"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {project
                  ? "Update the project details."
                  : "Give your team a place to plan and track work."}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project name
              </label>
              <Input
                id="project-name"
                autoFocus
                maxLength={100}
                placeholder="e.g. Website redesign"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(error && name.trim().length < 3)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="project-description"
                rows={4}
                maxLength={1000}
                placeholder="What are you working on?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project-workspace" className="text-sm font-medium">
                Workspace
              </label>
              <select
                id="project-workspace"
                value={workspaceId}
                onChange={(event) => setWorkspaceId(event.target.value)}
                disabled={Boolean(project)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="" disabled>
                  Select a workspace
                </option>
                {workspaces.map((workspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || workspaces.length === 0}
              >
                {isSubmitting && (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isSubmitting
                  ? "Saving..."
                  : project
                    ? "Save changes"
                    : "Create project"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectFormDialog;
