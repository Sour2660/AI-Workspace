import { useState, type FormEvent, type ChangeEvent } from "react";
import dayjs from "dayjs";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Paperclip,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/features/task/components/TaskBadges";
import type { Task } from "@/features/task/types";

interface TaskDetailsDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  complete: boolean;
}

const TaskDetailsContent = ({
  task,
  onEdit,
  onDelete,
}: Omit<TaskDetailsDrawerProps, "open" | "onOpenChange"> & { task: Task }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    Array.from({ length: task.checklist.total }, (_, index) => ({
      id: `${task.id}-check-${index}`,
      title: `Checklist item ${index + 1}`,
      complete: index < task.checklist.completed,
    }))
  );
  const [subtasks, setSubtasks] = useState([
    { id: `${task.id}-sub-1`, title: "Review requirements", complete: true },
    { id: `${task.id}-sub-2`, title: "Complete implementation", complete: false },
  ]);
  const [newSubtask, setNewSubtask] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = commentDraft.trim();
    if (!comment) return;
    setComments((current) => [...current, comment]);
    setCommentDraft("");
  };

  const addSubtask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newSubtask.trim();
    if (!title) return;
    setSubtasks((current) => [
      ...current,
      { id: `${task.id}-sub-${Date.now()}`, title, complete: false },
    ]);
    setNewSubtask("");
  };

  const addAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setAttachmentNames((current) => [...current, ...files.map((file) => file.name)]);
    event.target.value = "";
  };

  const completedChecklist = checklist.filter((item) => item.complete).length;
  const completedSubtasks = subtasks.filter((item) => item.complete).length;

  return (
    <SheetContent
      side="right"
      className="w-full overflow-y-auto sm:max-w-xl"
      aria-describedby="task-details-description"
    >
      <SheetHeader className="border-b pb-5 pr-8 text-left">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {task.project.name}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="shrink-0"
            >
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(task)}
            >
              <Trash2 aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <SheetTitle className="text-2xl leading-tight">{task.title}</SheetTitle>
        <SheetDescription id="task-details-description">
          Task details and collaboration · Local preview
        </SheetDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </SheetHeader>

      <div className="space-y-7 py-6">
        <section>
          <h3 className="text-sm font-semibold">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {task.description || "No description yet."}
          </p>
        </section>

        <section className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Assignee</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`grid size-8 place-items-center rounded-full text-xs font-semibold text-white ${task.assignee.color}`}
                aria-hidden="true"
              >
                {task.assignee.initials}
              </span>
              <span className="text-sm font-medium">{task.assignee.name}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reporter</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
              Workspace member
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due date</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              {task.dueDate
                ? dayjs(task.dueDate).format("MMMM D, YYYY")
                : "No due date"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Updated</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium">
              <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
              {dayjs(task.updatedAt).format("MMM D, h:mm A")}
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold">Labels</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {task.labels.length ? (
              task.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs"
                >
                  {label}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No labels</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold">Checklist</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {completedChecklist}/{checklist.length}
            </span>
          </div>
          {checklist.length ? (
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={item.complete}
                    onChange={() =>
                      setChecklist((current) =>
                        current.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, complete: !entry.complete }
                            : entry
                        )
                      )
                    }
                    aria-label={item.title}
                    className="size-4 rounded border-input accent-primary"
                  />
                  <span className={item.complete ? "text-muted-foreground line-through" : ""}>
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No checklist items.</p>
          )}
        </section>

        <section className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Subtasks</h3>
            <span className="text-xs text-muted-foreground">
              {completedSubtasks}/{subtasks.length} complete
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {subtasks.map((subtask) => (
              <li key={subtask.id} className="flex items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={subtask.complete}
                  onChange={() =>
                    setSubtasks((current) =>
                      current.map((item) =>
                        item.id === subtask.id
                          ? { ...item, complete: !item.complete }
                          : item
                      )
                    )
                  }
                  aria-label={subtask.title}
                  className="size-4 rounded border-input accent-primary"
                />
                <span className={subtask.complete ? "text-muted-foreground line-through" : ""}>
                  {subtask.title}
                </span>
              </li>
            ))}
          </ul>
          <form onSubmit={addSubtask} className="mt-3 flex gap-2">
            <Input
              value={newSubtask}
              onChange={(event) => setNewSubtask(event.target.value)}
              aria-label="New subtask title"
              placeholder="Add a subtask"
              className="h-9"
            />
            <Button type="submit" size="icon" variant="outline" aria-label="Add subtask" disabled={!newSubtask.trim()}>
              <Plus aria-hidden="true" />
            </Button>
          </form>
        </section>

        <section className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-muted-foreground" aria-hidden="true" />
              <h3 className="text-sm font-semibold">Comments</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {task.comments + comments.length} comments
            </span>
          </div>
          {comments.length > 0 && (
            <ul className="mt-3 space-y-3">
              {comments.map((comment, index) => (
                <li key={`${task.id}-comment-${index}`} className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs font-medium">You · just now</p>
                  <p className="mt-1 text-sm leading-5">{comment}</p>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addComment} className="mt-3 space-y-2">
            <label htmlFor={`task-comment-${task.id}`} className="sr-only">
              Add a comment
            </label>
            <textarea
              id={`task-comment-${task.id}`}
              rows={2}
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder="Write a comment..."
              className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={!commentDraft.trim()}>
                Add comment
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Paperclip className="size-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-semibold">Attachments</h3>
            <span className="text-xs text-muted-foreground">
              {task.attachments + attachmentNames.length}
            </span>
          </div>
          {attachmentNames.length > 0 && (
            <ul className="mt-3 space-y-2">
              {attachmentNames.map((fileName, index) => (
                <li key={`${fileName}-${index}`} className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  {fileName}
                </li>
              ))}
            </ul>
          )}
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Plus className="size-4" aria-hidden="true" />
            Add files
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={addAttachments}
              aria-label="Add task attachments"
            />
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            File names are held in this local preview only.
          </p>
        </section>

        <section className="rounded-xl border border-dashed p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-violet-500" aria-hidden="true" />
            Activity
          </div>
          <div className="mt-3 border-l pl-4">
            <p className="text-sm font-medium">Task updated</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {dayjs(task.updatedAt).format("MMM D, YYYY · h:mm A")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Current status: <span className="font-medium text-foreground">{task.status.replace("_", " ")}</span>
            </p>
          </div>
        </section>
      </div>
    </SheetContent>
  );
};

const TaskDetailsDrawer = ({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: TaskDetailsDrawerProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    {task && (
      <TaskDetailsContent
        key={task.id}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )}
  </Sheet>
);

export default TaskDetailsDrawer;
