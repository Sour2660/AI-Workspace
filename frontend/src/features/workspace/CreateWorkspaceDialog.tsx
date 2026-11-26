import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/hooks/useWorkspace";

const colors = ["#2563EB", "#16A34A", "#DC2626", "#9333EA", "#F59E0B"];

const CreateWorkspaceDialog = () => {
  const { create } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await create({ name: trimmedName, description: description.trim(), color });
      setName("");
      setDescription("");
      setColor(colors[0]);
      setOpen(false);
    } catch (submitError) {
      console.error("[workspace] failed to create workspace", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create the workspace. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          Create workspace
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Create a workspace
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Create a shared place for your team’s projects and tasks.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close dialog"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="workspace-name" className="text-sm font-medium">
                Workspace name
              </label>
              <Input
                id="workspace-name"
                autoFocus
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Product team"
                aria-invalid={Boolean(error && name.trim().length < 2)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="workspace-description"
                className="text-sm font-medium"
              >
                Description <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="workspace-description"
                rows={3}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What does this team work on?"
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">Workspace color</legend>
              <div className="flex gap-3">
                {colors.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Choose color ${index + 1}`}
                    aria-pressed={color === option}
                    onClick={() => setColor(option)}
                    className={`size-8 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      color === option ? "ring-2 ring-foreground ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: option }}
                  />
                ))}
              </div>
            </fieldset>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                )}
                {isSubmitting ? "Creating..." : "Create workspace"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateWorkspaceDialog;
