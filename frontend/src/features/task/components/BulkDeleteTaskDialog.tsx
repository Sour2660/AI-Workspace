import * as Dialog from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkDeleteTaskDialogProps {
  open: boolean;
  count: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const BulkDeleteTaskDialog = ({
  open,
  count,
  onOpenChange,
  onConfirm,
}: BulkDeleteTaskDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none">
        <Dialog.Title className="font-semibold">Delete selected tasks?</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
          This will remove {count} selected {count === 1 ? "task" : "tasks"} from
          this local preview.
        </Dialog.Description>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <Trash2 aria-hidden="true" />
            Delete {count} {count === 1 ? "task" : "tasks"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default BulkDeleteTaskDialog;
