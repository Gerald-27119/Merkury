import z from "zod";
import { UserSettingsType } from "../../../../model/enum/account/settings/userSettingsType";

export const baseSchemas = {
    [UserSettingsType.USERNAME]: z.object({
        username: z
            .string("Username can't be empty")
            .min(3, "Username must be at least 3 characters")
            .max(16, "Username can't be longer that 16 characters"),
    }),
    [UserSettingsType.EMAIL]: z.object({
        email: z.email("Invalid email address"),
    }),
    [UserSettingsType.PASSWORD]: z
        .object({
            oldPassword: z
                .string("Old password can't be empty")
                .min(8, "Old password is required"),
            newPassword: z
                .string("New Password can't be empty")
                .min(8, "New password must be at least 8 characters")
                .regex(
                    /[A-Z]/,
                    "Password must contain at least one uppercase letter",
                )
                .regex(
                    /[a-z]/,
                    "Password must contain at least one lowercase letter",
                )
                .regex(/\d/, "Password must contain at least one number")
                .regex(
                    /[!@#$%^&*(),.?":{}|<>]/,
                    "Password must contain at least one special character",
                ),
            confirmPassword: z.string("Confirm password can't be empty"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }),
    [UserSettingsType.NONE]: z.object({}),
};
