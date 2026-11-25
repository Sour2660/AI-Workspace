import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  project: z.string(),
  assignee: z.string(),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  assignee: z.string().optional(),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"])
    .optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
});