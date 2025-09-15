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
        .max(200, "Maximum 200 characters"),
    country: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(50, "Maximum 50 characters"),
    region: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(50, "Maximum 50 characters"),
    city: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(50, "Maximum 50 characters"),
    street: z
        .string()
        .trim()
        .min(3, "Minimum 3 characters")
        .max(50, "Maximum 50 characters"),
    borderPoints: z
        .array(
            z.object({
                x: z.number(),
                y: z.number(),
            }),
        )
        .min(3, "At least three border points are required"),
    media: z.array(z.any()).min(1, "At least one media file is required"),
});
