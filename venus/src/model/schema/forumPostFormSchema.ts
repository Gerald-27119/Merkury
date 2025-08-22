import { z } from "zod";

function stripHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent?.trim() || "";
}
export const ForumPostFormSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long.")
        .max(100, "Title must be less than 100 characters long"),
    category: z
        .object({
            value: z.string(),
            label: z.string(),
        })
        .nullable()
        .refine((val) => val !== null && val.value.trim() !== "", {
            message: "Choose a valid category",
        }),
    tags: z
        .array(
            z.object({
                value: z.string(),
                label: z.string(),
            }),
        )
        .max(3, "You can't select more than 3 tags")
        .optional(),
    content: z
        .string()
        .refine((val) => stripHtml(val).length >= 3, {
            message: "Content must be at least 3 characters long.",
        })
        .refine((val) => stripHtml(val).length <= 1000, {
            message: "Content must be at most 1000 characters long.",
        }),
});

export type ForumPostFormFields = z.infer<typeof ForumPostFormSchema>;
