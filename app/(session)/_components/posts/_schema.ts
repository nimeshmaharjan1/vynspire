import { z } from "zod";

export const postSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	excerpt: z.string().optional(),
	content: z.string().optional(),
	tags: z.array(
		z.object({
			tag: z.string(),
		}),
	),
	category: z.string().optional(),
	readTime: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
