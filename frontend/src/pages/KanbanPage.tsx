import { useMemo, useState } from "react";
import {
  CheckSquare,
  CirclePlus,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriorityBadge } from "@/features/task/components/TaskBadges";
import TaskDetailsDrawer from "@/features/task/components/TaskDetailsDrawer";
import TaskFormDialog from "@/features/task/components/TaskFormDialog";
import DeleteTaskDialog from "@/features/task/components/DeleteTaskDialog";
import { initialTasks } from "@/features/task/mock-tasks";
import type {
  Task,
  TaskDraft,
  TaskPriority,
  TaskStatus,
} from "@/features/task/types";

const columns: Array<{ status: TaskStatus; label: string; accent: string }> = [
  { status: "TODO", label: "To do", accent: "bg-slate-400" },
  { status: "IN_PROGRESS", label: "In progress", accent: "bg-blue-500" },
  { status: "REVIEW", label: "In review", accent: "bg-violet-500" },
  { status: "DONE", label: "Done", accent: "bg-emerald-500" },
];

const KanbanPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">(
    "ALL"
  );
  const [draggedTaskId, setDraggedTaskId] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogStatus, setTaskDialogStatus] =
    useState<TaskStatus>("TODO");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return tasks.filter(
      (task) =>
        (priorityFilter === "ALL" || task.priority === priorityFilter) &&
        (!query ||
          task.title.toLocaleLowerCase().includes(query) ||
          task.project.name.toLocaleLowerCase().includes(query) ||
          task.assignee.name.toLocaleLowerCase().includes(query) ||
          task.labels.some((label) => label.toLocaleLowerCase().includes(query)))
    );
  }, [priorityFilter, search, tasks]);

  const moveTask = (taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setDraggedTaskId("");
    console.info("[kanban-ui] task moved in local preview");
  };

  const createInColumn = (status: TaskStatus) => {
    setTaskDialogStatus(status);
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
    setDetailTask(null);
  };

  const saveTask = (draft: TaskDraft) => {
    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...draft, updatedAt: new Date().toISOString() }
            : task
        )
      );
      console.info("[kanban-ui] task updated in local preview");
      return;
    }

    setTasks((current) => [
      {
        ...draft,
        id: `task-${Date.now()}`,
        checklist: { completed: 0, total: 0 },
        comments: 0,
        attachments: 0,
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ]);
    console.info("[kanban-ui] task created in local preview");
  };

  const removeTask = () => {
    if (!deleteTask) return;
    setTasks((current) =>
      current.filter((task) => task.id !== deleteTask.id)
    );
    setDeleteTask(null);
    console.info("[kanban-ui] task deleted from local preview");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            See work move forward
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Kanban board
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Drag cards between columns to update their status · Local demo data
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              aria-label="Search board tasks"
              className="h-10 bg-background pl-9"
            />
          </label>
          <label className="sr-only" htmlFor="kanban-priority-filter">
            Filter tasks by priority
          </label>
          <select
            id="kanban-priority-filter"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as TaskPriority | "ALL")
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">All priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </header>

      <div className="-mx-5 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8">
        <div className="grid min-w-[1080px] grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = visibleTasks.filter(
              (task) => task.status === column.status
            );
            return (
              <section
                key={column.status}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedTaskId) moveTask(draggedTaskId, column.status);
                }}
                aria-label={`${column.label} tasks`}
                className={`min-h-[65vh] rounded-2xl bg-muted/40 p-3 transition ${
                  draggedTaskId ? "ring-1 ring-primary/20" : ""
                }`}
              >
                <header className="mb-3 flex items-center justify-between gap-3 px-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${column.accent}`}
                      aria-hidden="true"
                    />
                    <h2 className="truncate text-sm font-semibold">
                      {column.label}
                    </h2>
                    <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Add task to ${column.label}`}
                    onClick={() => createInColumn(column.status)}
                  >
                    <CirclePlus aria-hidden="true" />
                  </Button>
                </header>

                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <article
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTaskId(task.id)}
                      onDragEnd={() => setDraggedTaskId("")}
                      className={`group rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        draggedTaskId === task.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailTask(task)}
                          className="text-left text-sm font-medium leading-5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {task.title}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 hover:bg-muted group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`Actions for ${task.title}`}
                            >
                              <MoreHorizontal className="size-4" aria-hidden="true" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => editTask(task)}>
                              <Pencil aria-hidden="true" />
                              Edit task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => setDeleteTask(task)}
                            >
                              <Trash2 aria-hidden="true" />
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {task.description || "No description"}
                      </p>

                      {task.labels.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {task.labels.slice(0, 3).map((label) => (
                            <span
                              key={label}
                              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <TaskPriorityBadge priority={task.priority} />
                        <span className="text-[11px] text-muted-foreground">
                          {task.dueDate
                            ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric" }
                              )
                            : "No date"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <span
                          className={`grid size-7 place-items-center rounded-full text-[10px] font-semibold text-white ${task.assignee.color}`}
                          title={task.assignee.name}
                        >
                          {task.assignee.initials}
                        </span>
                        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CheckSquare className="size-3" aria-hidden="true" />
                            {task.checklist.completed}/{task.checklist.total}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MessageCircle className="size-3" aria-hidden="true" />
                            {task.comments}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="size-3" aria-hidden="true" />
                            {task.attachments}
                          </span>
                        </span>
                      </div>
                    </article>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="rounded-xl border border-dashed px-3 py-8 text-center text-xs text-muted-foreground">
                      Drop a task here or add one.
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => createInColumn(column.status)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <CirclePlus className="size-3.5" aria-hidden="true" />
                    Add a task
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <TaskFormDialog
        key={`${editingTask?.id ?? "new"}-${taskDialogStatus}-${taskDialogOpen ? "open" : "closed"}`}
        open={taskDialogOpen}
        task={editingTask}
        defaultStatus={taskDialogStatus}
        onOpenChange={setTaskDialogOpen}
        onSubmit={saveTask}
      />
      <TaskDetailsDrawer
        task={detailTask}
        open={Boolean(detailTask)}
        onOpenChange={(open) => !open && setDetailTask(null)}
        onEdit={editTask}
        onDelete={(task) => {
          setDetailTask(null);
          setDeleteTask(task);
        }}
      />
      <DeleteTaskDialog
        task={deleteTask}
        open={Boolean(deleteTask)}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        onConfirm={removeTask}
      />
    </div>
  );
};

export default KanbanPage;
