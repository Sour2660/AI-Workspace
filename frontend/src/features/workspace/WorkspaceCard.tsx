import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Archive,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { Workspace } from "@/types/workspace";
import WorkspaceEditDialog from "./WorkspaceEditDialog";

interface Props {
  workspace: Workspace;
}

const WorkspaceCard = ({ workspace }: Props) => {
  const { archive } = useWorkspace();
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState("");

  const handleArchive = async () => {
    setIsArchiving(true);
    setArchiveError("");
    try {
      await archive(workspace._id);
      setArchiveOpen(false);
    } catch (error) {
      console.error("[workspace] failed to archive workspace", error);
      setArchiveError(
        error instanceof Error
          ? error.message
          : "Could not archive this workspace. Please try again."
      );
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <article className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: workspace.color || "#2563EB" }}
              aria-hidden="true"
            >
              {workspace.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-semibold">{workspace.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Created {new Date(workspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${workspace.name}`}
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil aria-hidden="true" />
                Edit workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setArchiveOpen(true)}
              >
                <Archive aria-hidden="true" />
                Archive workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {workspace.description || "No description added yet."}
        </p>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" />
            {workspace.members.length} members
          </span>
          <Link
            to={`/projects?workspace=${workspace._id}`}
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      <WorkspaceEditDialog
        key={`${workspace._id}-${workspace.updatedAt}`}
        workspace={workspace}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog.Root open={archiveOpen} onOpenChange={setArchiveOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold">
                  Archive workspace?
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                  <span className="font-medium text-foreground">{workspace.name}</span>{" "}
                  will be removed from your active workspace list.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                  disabled={isArchiving}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            {archiveError && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {archiveError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setArchiveOpen(false)}
                disabled={isArchiving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleArchive()}
                disabled={isArchiving}
              >
                {isArchiving && (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                )}
                {isArchiving ? "Archiving..." : "Archive workspace"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default WorkspaceCard;
