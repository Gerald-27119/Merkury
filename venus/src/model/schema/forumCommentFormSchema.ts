import { z } from "zod";

function stripHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent?.trim() || "";
}

export const ForumCommentFormSchema = z.object({
    content: z
        .string()
        .refine((val) => stripHtml(val).length >= 3, {
            message: "Content must be at least 3 characters long.",
        })
        .refine((val) => stripHtml(val).length <= 5000, {
            message: "Content must be at most 5000 characters long.",
        }),
});

export type ForumCommentFormFields = z.infer<typeof ForumCommentFormSchema>;
