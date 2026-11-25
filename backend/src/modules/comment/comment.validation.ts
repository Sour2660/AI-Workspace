import { z } from "zod";

export const createCommentSchema = z.object({
  message: z.string().min(1),
  task: z.string(),
});

export const updateCommentSchema = z.object({
  message: z.string().min(1),
});