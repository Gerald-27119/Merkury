import { z } from "zod";
import { ForumReportReason } from "../enum/forum/forumReportReason";

export const ForumReportFormSchema = z.object({
    reason: z.enum(ForumReportReason, "Choose a valid reason."),
    details: z
        .string()
        .min(3, "Details must be at least 3 characters long.")
        .max(1000, "Details must be at most 1000 characters long."),
});

export type ForumReportFormFields = z.infer<typeof ForumReportFormSchema>;
