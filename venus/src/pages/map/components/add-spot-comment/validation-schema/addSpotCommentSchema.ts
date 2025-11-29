import { z } from "zod";

export const addSpotCommentSchema = z.object({
    commentText: z
        .string()
        .trim()
        .min(1, "Minimum 1 character.")
        .max(1000, "Maximum 1000 characters."),
    spotRating: z
        .number()
        .min(0, "Minimum 0 stars.")
        .max(5, "Maximum 5 stars."),
});
