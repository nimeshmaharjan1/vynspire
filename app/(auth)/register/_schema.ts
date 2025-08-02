import { z } from "zod";
export const registerSchema = z.object({
	user_name: z
		.string()
		.min(1, "Full name is required")
		.max(100, "Max length reached"),
	email: z.email().min(1, "Email is required"),
	password: z
		.string()
		.min(1, "Password is required")
		.max(20, "Password cannot be more than 20 characters"),
	avatar: z.string().optional().nullable(),
});
export type registerSchemaType = z.infer<typeof registerSchema>;
