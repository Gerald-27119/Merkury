import { z } from "zod";

export const addSpotCommentSchema = z.object({
    commentText: z
        .string()
        .trim()
        .min(1, "Comment text must be at least 1 character long.")
        .max(1000, "Comment text can have maximum 1000 characters."),
    spotRating: z
        .number()
        .min(0, "The minimum value of spot rating is 0 stars.")
        .max(5, "The maximum value of spot rating is 5 stars."),
});
