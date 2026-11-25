import { z } from "zod";

export const uploadAttachmentSchema = z.object({
  task: z.string(),
});