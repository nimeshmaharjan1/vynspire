import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const user = getUserFromToken(request);

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const post = await prisma.post.create({
			data: {
				title: body.title,
				excerpt: body.excerpt,
				content: body.content,
				tags: body.tags || [],
				category: body.category,
				image: body.image,
				readTime: body.readTime,
				published: false,
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
