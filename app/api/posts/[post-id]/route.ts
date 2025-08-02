import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// /app/api/posts/[post-id]/route.ts
export async function GET(
	_: Request,
	{ params }: { params: Promise<{ "post-id": string }> },
) {
	const { "post-id": postId } = await params;
	console.log("GET /api/posts/:id →", postId);

	const post = await prisma.post.findUnique({
		where: { id: postId },
		include: {
			author: true,
		},
	});
	if (!post) {
		console.log("Post not found");
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	return NextResponse.json(post);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ "post-id": string }> },
) {
	const { "post-id": postId } = await params;
	const user = getUserFromToken(request);
	console.log("PUT /api/posts/:id →", postId, "by user", user?.userId);

	if (!user) {
		console.log("Unauthorized request");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();

	console.log("Parsed body:", body);

	// First check if post exists
	const existingPost = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!existingPost) {
		console.log("Post not found");
		return NextResponse.json({ error: "Post not found" }, { status: 404 });
	}

	if (existingPost.authorId !== user.userId) {
		console.log("Forbidden: user does not own the post");
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	// Proceed with update
	const updatedPost = await prisma.post.update({
		where: { id: postId },
		data: {
			title: body.title,
			excerpt: body.excerpt,
			content: body.content,
			tags: body.tags ?? [],
			category: body.category,
			image: body.image,
			readTime: body.readTime,
			published: body.published ?? false,
		},
	});

	console.log("Post updated successfully:", updatedPost.id);
	return NextResponse.json(updatedPost);
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ "post-id": string }> },
) {
	const { "post-id": postId } = await params;
	const user = getUserFromToken(request);
	console.log("DELETE /api/posts/:id →", postId, "by user", user?.userId);

	if (!user) {
		console.log("Unauthorized");
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await prisma.post.delete({
		where: { id: postId, authorId: user.userId },
	});
	console.log("Post deleted:", postId);
	return NextResponse.json({ success: true });
}
