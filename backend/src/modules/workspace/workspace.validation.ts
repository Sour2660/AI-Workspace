import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(50),

  description: z.string().optional(),

  color: z.string().optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();