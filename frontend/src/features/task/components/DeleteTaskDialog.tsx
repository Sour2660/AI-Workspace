import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/features/task/types";

interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteTaskDialog = ({
  task,
  open,
  onOpenChange,
  onConfirm,
}: DeleteTaskDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {task && (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <Trash2 className="size-4" aria-hidden="true" />
              </span>
              <div>
                <Dialog.Title className="font-semibold">Delete task?</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                  This will remove{" "}
                  <span className="font-medium text-foreground">
                    {task.title}
                  </span>{" "}
                  from this local preview.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Delete task
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    )}
  </Dialog.Root>
);

export default DeleteTaskDialog;
