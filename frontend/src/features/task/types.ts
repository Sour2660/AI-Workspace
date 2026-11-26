export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TaskAssignee {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface TaskProject {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project: TaskProject;
  assignee: TaskAssignee;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  labels: string[];
  checklist: { completed: number; total: number };
  comments: number;
  attachments: number;
  updatedAt: string;
}

export type TaskDraft = Pick<
  Task,
  "title" | "description" | "project" | "assignee" | "status" | "priority" | "dueDate" | "labels"
>;
