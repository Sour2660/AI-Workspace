import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAssignees, mockProjects } from "@/features/task/mock-tasks";
import type { Task, TaskDraft } from "@/features/task/types";

interface TaskFormDialogProps {
  open: boolean;
  task: Task | null;
  defaultStatus?: Task["status"];
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: TaskDraft) => void;
}

const TaskFormDialog = ({
  open,
  task,
  defaultStatus = "TODO",
  onOpenChange,
  onSubmit,
}: TaskFormDialogProps) => {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [projectId, setProjectId] = useState(
    task?.project.id ?? mockProjects[0].id
  );
  const [assigneeId, setAssigneeId] = useState(
    task?.assignee.id ?? mockAssignees[0].id
  );
  const [status, setStatus] = useState<Task["status"]>(
    task?.status ?? defaultStatus
  );
  const [priority, setPriority] = useState<Task["priority"]>(
    task?.priority ?? "MEDIUM"
  );
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [labels, setLabels] = useState(task?.labels.join(", ") ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setError("Task title must be at least 3 characters.");
      return;
    }

    const project = mockProjects.find((item) => item.id === projectId);
    const assignee = mockAssignees.find((item) => item.id === assigneeId);
    if (!project || !assignee) {
      setError("Choose a project and an assignee.");
      return;
    }

    setError("");
    onSubmit({
      title: cleanTitle,
      description: description.trim(),
      project,
      assignee,
      status,
      priority,
      dueDate,
      labels: labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-background p-6 shadow-2xl focus:outline-none sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-tight">
                {task ? "Edit task" : "Create task"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                {task
                  ? "Update task details and ownership."
                  : "Capture a piece of work for your team."}
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

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task title
              </label>
              <Input
                id="task-title"
                autoFocus
                maxLength={140}
                placeholder="What needs to get done?"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="task-description"
                rows={3}
                maxLength={2000}
                placeholder="Add helpful context for the team..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="task-project" className="text-sm font-medium">
                  Project
                </label>
                <select
                  id="task-project"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {mockProjects.map((projectOption) => (
                    <option key={projectOption.id} value={projectOption.id}>
                      {projectOption.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-assignee" className="text-sm font-medium">
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  value={assigneeId}
                  onChange={(event) => setAssigneeId(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {mockAssignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as Task["status"])
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="REVIEW">In review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as Task["priority"])
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-due-date" className="text-sm font-medium">
                  Due date
                </label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="task-labels" className="text-sm font-medium">
                  Labels
                </label>
                <Input
                  id="task-labels"
                  placeholder="Design, Frontend"
                  value={labels}
                  onChange={(event) => setLabels(event.target.value)}
                />
              </div>
            </div>

            {error && (
              <p
                className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {task ? "Save changes" : "Create task"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TaskFormDialog;
