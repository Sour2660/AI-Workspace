import dayjs from "dayjs";
import { CalendarDays, CheckSquare, MessageCircle, Paperclip } from "lucide-react";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/features/task/components/TaskBadges";
import type { Task, TaskStatus } from "@/features/task/types";

interface TaskTableProps {
  tasks: Task[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpen: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const TaskTable = ({
  tasks,
  selectedIds,
  onSelectionChange,
  onOpen,
  onStatusChange,
}: TaskTableProps) => {
  const allSelected =
    tasks.length > 0 && tasks.every((task) => selectedIds.includes(task.id));

  const toggleTask = (taskId: string) => {
    onSelectionChange(
      selectedIds.includes(taskId)
        ? selectedIds.filter((id) => id !== taskId)
        : [...selectedIds, taskId]
    );
  };

  const dueDate = (task: Task) => {
    if (!task.dueDate) {
      return <span className="text-muted-foreground">No date</span>;
    }

    const overdue = task.status !== "DONE" && dayjs(task.dueDate).isBefore(dayjs(), "day");
    return (
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs ${
          overdue ? "font-medium text-destructive" : "text-muted-foreground"
        }`}
      >
        <CalendarDays className="size-3.5" aria-hidden="true" />
        {dayjs(task.dueDate).format("MMM D")}
        {overdue && <span className="sr-only">overdue</span>}
      </span>
    );
  };

  return (
    <>
      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <article key={task.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(task.id)}
                onChange={() => toggleTask(task.id)}
                aria-label={`Select ${task.title}`}
                className="mt-1 size-4 accent-primary"
              />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onOpen(task)}
                  className="text-left text-sm font-semibold hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {task.title}
                </button>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {task.project.name}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
              {dueDate(task)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold text-white ${task.assignee.color}`}
                >
                  {task.assignee.initials}
                </span>
                {task.assignee.name}
              </span>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                onClick={() => onOpen(task)}
                aria-label={`Open ${task.title} details`}
              >
                <CheckSquare className="size-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="border-b bg-muted/30">
            <tr className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    onSelectionChange(
                      allSelected
                        ? selectedIds.filter(
                            (id) => !tasks.some((task) => task.id === id)
                          )
                        : Array.from(
                            new Set([...selectedIds, ...tasks.map((task) => task.id)])
                          )
                    )
                  }
                  aria-label="Select all visible tasks"
                  className="size-4 accent-primary"
                />
              </th>
              <th className="px-3 py-3">Task</th>
              <th className="px-3 py-3">Project</th>
              <th className="px-3 py-3">Assignee</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Due date</th>
              <th className="px-4 py-3">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task) => (
              <tr key={task.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Select ${task.title}`}
                    className="size-4 accent-primary"
                  />
                </td>
                <td className="max-w-[280px] px-3 py-4">
                  <button
                    type="button"
                    onClick={() => onOpen(task)}
                    className="block truncate text-left text-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {task.title}
                  </button>
                  {task.labels.length > 0 && (
                    <div className="mt-1 flex gap-1.5">
                      {task.labels.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="max-w-40 truncate px-3 py-4 text-sm text-muted-foreground">
                  {task.project.name}
                </td>
                <td className="px-3 py-4">
                  <span className="flex items-center gap-2 whitespace-nowrap text-sm">
                    <span
                      className={`grid size-7 place-items-center rounded-full text-[10px] font-semibold text-white ${task.assignee.color}`}
                      aria-hidden="true"
                    >
                      {task.assignee.initials}
                    </span>
                    {task.assignee.name}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="px-3 py-4">
                  <label className="sr-only" htmlFor={`status-${task.id}`}>
                    Update status for {task.title}
                  </label>
                  <select
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) =>
                      onStatusChange(task.id, event.target.value as TaskStatus)
                    }
                    className="max-w-36 rounded-md border-0 bg-transparent p-0 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="REVIEW">In review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
                <td className="px-3 py-4">{dueDate(task)}</td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      {task.comments}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Paperclip className="size-3.5" aria-hidden="true" />
                      {task.attachments}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskTable;
