import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
	search: z.string().optional(),
	category: z.string().optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const user = getUserFromToken(request);

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const wordsPerMinute = 200;
		const text = body.content?.replace(/<[^>]+>/g, "") || ""; // strip HTML tags
		const wordCount = text.trim().split(/\s+/).length;
		const readTime = `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min read`;
		const post = await prisma.post.create({
			data: {
				title: body.title,
				excerpt: body.excerpt,
				content: body.content,
				tags: body.tags || [],
				category: body.category,
				image: body.image,
				readTime,
				published: true,
				authorId: user.userId,
			},
		});

		return NextResponse.json(post, { status: 201 });
	} catch (error) {
		console.error("Create Post Error:", error);
		return NextResponse.json(
			{ error: "Failed to create post" },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const query = querySchema.parse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
			search: searchParams.get("search") || undefined,
			category: searchParams.get("category") || undefined,
		});

		const page = parseInt(query.page ?? "1");
		const limit = parseInt(query.limit ?? "10");
		const offset = (page - 1) * limit;

		const filters: any = {};
		if (query.search) {
			filters.OR = [
				{ title: { contains: query.search, mode: "insensitive" } },
				{ excerpt: { contains: query.search, mode: "insensitive" } },
				{ tags: { hasSome: [query.search] } },
			];
		}
		if (query.category) {
			filters.category = query.category;
		}

		const [posts, total] = await Promise.all([
			prisma.post.findMany({
				where: filters,
				skip: offset,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					author: true,
				},
			}),
			prisma.post.count({ where: filters }),
		]);

		return NextResponse.json({ posts, total }, { status: 200 });
	} catch (error) {
		console.error("Fetch Posts Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch posts" },
			{ status: 500 },
		);
	}
}
