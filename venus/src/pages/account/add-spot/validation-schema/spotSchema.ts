import { z } from "zod";

export const spotSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    description: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    country: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    region: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    city: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    street: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
    borderPoints: z
        .array(
            z.object({
                x: z.number(),
                y: z.number(),
            }),
        )
        .min(3, "At least three border point is required"),
    media: z.array(z.any()).min(1, "At least one media file is required"),
});
