import z from "zod";

export const loginSchema = z.object({
	email: z.email().min(1, "Email is required"),
	password: z
		.string()
		.min(1, "Password is required")
		.max(20, "Password cannot be more than 20 characters"),
});
export type loginSchemaType = z.infer<typeof loginSchema>;
