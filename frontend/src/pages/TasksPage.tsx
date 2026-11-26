import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownUp,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BulkDeleteTaskDialog from "@/features/task/components/BulkDeleteTaskDialog";
import DeleteTaskDialog from "@/features/task/components/DeleteTaskDialog";
import TaskDetailsDrawer from "@/features/task/components/TaskDetailsDrawer";
import TaskFormDialog from "@/features/task/components/TaskFormDialog";
import TaskTable from "@/features/task/components/TaskTable";
import { initialTasks, mockAssignees, mockProjects } from "@/features/task/mock-tasks";
import type {
  Task,
  TaskDraft,
  TaskPriority,
  TaskStatus,
} from "@/features/task/types";

type StatusFilter = TaskStatus | "ALL";
type PriorityFilter = TaskPriority | "ALL";
type TaskSort = "dueDate" | "priority" | "title";

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "TODO", label: "To do" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "REVIEW", label: "In review" },
  { value: "DONE", label: "Done" },
];

const priorityOrder: Record<TaskPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const TasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState(initialTasks);
  const search = searchParams.get("search") ?? "";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<TaskSort>("dueDate");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkAssignee, setBulkAssignee] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  const setSearch = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("search", value);
    else nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return tasks
      .filter((task) => {
        const matchesQuery =
          !query ||
          task.title.toLocaleLowerCase().includes(query) ||
          task.description.toLocaleLowerCase().includes(query) ||
          task.project.name.toLocaleLowerCase().includes(query) ||
          task.assignee.name.toLocaleLowerCase().includes(query) ||
          task.labels.some((label) => label.toLocaleLowerCase().includes(query));
        const matchesStatus =
          statusFilter === "ALL" || task.status === statusFilter;
        const matchesPriority =
          priorityFilter === "ALL" || task.priority === priorityFilter;
        const matchesProject =
          projectFilter === "ALL" || task.project.id === projectFilter;
        return (
          matchesQuery && matchesStatus && matchesPriority && matchesProject
        );
      })
      .sort((left, right) => {
        if (sortBy === "title") {
          return left.title.localeCompare(right.title);
        }
        if (sortBy === "priority") {
          return priorityOrder[left.priority] - priorityOrder[right.priority];
        }
        return dayjs(left.dueDate).valueOf() - dayjs(right.dueDate).valueOf();
      });
  }, [priorityFilter, projectFilter, search, sortBy, statusFilter, tasks]);

  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const selectedTasks = tasks.filter((task) => selectedIds.includes(task.id));

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setProjectFilter("ALL");
    setSortBy("dueDate");
    setPage(1);
  };

  const createTask = () => {
    setActiveTask(null);
    setTaskDialogOpen(true);
  };

  const editTask = (task: Task) => {
    setActiveTask(task);
    setDetailTask(null);
    setTaskDialogOpen(true);
  };

  const saveTask = (draft: TaskDraft) => {
    if (activeTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === activeTask.id
            ? { ...task, ...draft, updatedAt: new Date().toISOString() }
            : task
        )
      );
      console.info("[tasks-ui] task updated in local preview");
      setDetailTask((current) =>
        current?.id === activeTask.id
          ? { ...current, ...draft, updatedAt: new Date().toISOString() }
          : current
      );
      return;
    }

    const task: Task = {
      ...draft,
      id: `task-${Date.now()}`,
      checklist: { completed: 0, total: 0 },
      comments: 0,
      attachments: 0,
      updatedAt: new Date().toISOString(),
    };
    setTasks((current) => [task, ...current]);
    setSelectedIds([]);
    setPage(1);
    console.info("[tasks-ui] task created in local preview");
  };

  const changeStatus = (taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
    console.info("[tasks-ui] task status changed in local preview");
  };

  const confirmDelete = () => {
    if (!deleteTask) {
      return;
    }
    setTasks((current) =>
      current.filter((task) => task.id !== deleteTask.id)
    );
    setSelectedIds((current) =>
      current.filter((id) => id !== deleteTask.id)
    );
    setDeleteTask(null);
    setDetailTask(null);
    console.info("[tasks-ui] task deleted from local preview");
  };

  const bulkUpdateStatus = (status: string) => {
    if (!status) {
      return;
    }
    setTasks((current) =>
      current.map((task) =>
        selectedIds.includes(task.id)
          ? {
              ...task,
              status: status as TaskStatus,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
    setSelectedIds([]);
    setBulkStatus("");
    console.info("[tasks-ui] selected task statuses updated in local preview", {
      count: selectedIds.length,
    });
  };

  const bulkUpdateAssignee = (assigneeId: string) => {
    if (!assigneeId) {
      return;
    }
    const assignee = mockAssignees.find((person) => person.id === assigneeId);
    if (!assignee) {
      return;
    }
    setTasks((current) =>
      current.map((task) =>
        selectedIds.includes(task.id)
          ? { ...task, assignee, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setSelectedIds([]);
    setBulkAssignee("");
    console.info("[tasks-ui] selected tasks reassigned in local preview", {
      count: selectedIds.length,
    });
  };

  const confirmBulkDelete = () => {
    setTasks((current) =>
      current.filter((task) => !selectedIds.includes(task.id))
    );
    console.info("[tasks-ui] selected tasks deleted from local preview", {
      count: selectedIds.length,
    });
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const hasFilters =
    search.length > 0 ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    projectFilter !== "ALL";

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 p-5 sm:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Keep the team moving
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tasks
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A clear view of what’s next, in progress, and done.
          </p>
        </div>
        <Button onClick={createTask}>
          <Plus aria-hidden="true" />
          New task
        </Button>
      </header>

      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search tasks, projects, people, labels..."
              aria-label="Search tasks"
              className="h-10 bg-background pl-9"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListFilter className="size-4" aria-hidden="true" />
            <span className="sr-only">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="sr-only">Priority</span>
            <select
              value={priorityFilter}
              onChange={(event) => {
                setPriorityFilter(event.target.value as PriorityFilter);
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="sr-only">Project</span>
            <select
              value={projectFilter}
              onChange={(event) => {
                setProjectFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ALL">All projects</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownUp className="size-4" aria-hidden="true" />
            <span className="sr-only">Sort tasks</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as TaskSort)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredTasks.length}
            </span>{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
            {hasFilters ? " matching filters" : " across your projects"}
          </p>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw aria-hidden="true" />
                Clear filters
              </Button>
            )}
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              Demo data · changes stay in this session
            </span>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <section
          className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 sm:flex-row sm:items-center"
          aria-label="Bulk task actions"
        >
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="bulk-task-status">
              Update selected task status
            </label>
            <select
              id="bulk-task-status"
              value={bulkStatus}
              onChange={(event) => bulkUpdateStatus(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Change status...</option>
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="REVIEW">In review</option>
              <option value="DONE">Done</option>
            </select>
            <label className="sr-only" htmlFor="bulk-task-assignee">
              Assign selected tasks
            </label>
            <select
              id="bulk-task-assignee"
              value={bulkAssignee}
              onChange={(event) => bulkUpdateAssignee(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Assign to...</option>
              {mockAssignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              <X aria-hidden="true" />
              Clear selection
            </Button>
          </div>
        </section>
      )}

      {visibleTasks.length > 0 ? (
        <TaskTable
          tasks={visibleTasks}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onOpen={setDetailTask}
          onStatusChange={changeStatus}
        />
      ) : (
        <section className="rounded-2xl border border-dashed px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Search className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-semibold">
            {hasFilters ? "No tasks match these filters" : "You’re all caught up"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "Try changing your search or clearing one of the filters."
              : "Create a task to start organizing your team's work."}
          </p>
          {hasFilters ? (
            <Button className="mt-5" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : (
            <Button className="mt-5" onClick={createTask}>
              <Plus aria-hidden="true" />
              Create task
            </Button>
          )}
        </section>
      )}

      {filteredTasks.length > pageSize && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredTasks.length)} of{" "}
            {filteredTasks.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pageCount}
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <TaskFormDialog
        key={`${activeTask?.id ?? "new"}-${taskDialogOpen ? "open" : "closed"}`}
        open={taskDialogOpen}
        task={activeTask}
        onOpenChange={setTaskDialogOpen}
        onSubmit={saveTask}
      />
      <TaskDetailsDrawer
        task={detailTask}
        open={Boolean(detailTask)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailTask(null);
          }
        }}
        onEdit={editTask}
        onDelete={(task) => {
          setDetailTask(null);
          setDeleteTask(task);
        }}
      />
      <DeleteTaskDialog
        task={deleteTask}
        open={Boolean(deleteTask)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTask(null);
          }
        }}
        onConfirm={confirmDelete}
      />
      <BulkDeleteTaskDialog
        open={bulkDeleteOpen}
        count={selectedTasks.length}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
};

export default TasksPage;
