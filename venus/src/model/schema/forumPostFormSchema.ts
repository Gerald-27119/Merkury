import { z } from "zod";
import { htmlToText } from "html-to-text";

export const ForumPostFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
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
    content: z.string().refine(
        (val) => {
            const text = htmlToText(val, { wordwrap: false }).trim();
            return text.length >= 3;
        },
        {
            message: "Content must be at least 3 characters long.",
        },
    ),
});

export type ForumPostFormFields = z.infer<typeof ForumPostFormSchema>;
