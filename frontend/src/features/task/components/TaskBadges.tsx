import type { TaskPriority, TaskStatus } from "@/features/task/types";

const statusNames: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  REVIEW: "In review",
  DONE: "Done",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  IN_PROGRESS: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  REVIEW: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  DONE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  MEDIUM: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  HIGH: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  CRITICAL: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
    {statusNames[status]}
  </span>
);

export const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${priorityStyles[priority]}`}
  >
    {priority.toLocaleLowerCase()}
  </span>
);
