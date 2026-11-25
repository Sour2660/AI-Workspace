export interface CreateTaskDto {
  title: string;
  description?: string;
  project: string;
  assignee: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: Date;
  labels?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignee?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  dueDate?: Date;
  labels?: string[];
}