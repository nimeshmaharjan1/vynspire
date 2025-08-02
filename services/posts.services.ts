import type { Post, Prisma, User } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import type { GetPostsParams } from "@/types/request.types";

export const getSinglePost = async ({ postId }: { postId: string }) => {
	const res = await axiosInstance.get(`/posts/${postId}`);
	return res.data as Prisma.PostGetPayload<{
		include: { author: true };
	}>;
};

export type PostWithAuthor = Post & {
	author: User;
};
export const getAllPosts = async (params: GetPostsParams = {}) => {
	const response = await axiosInstance.get("/posts", {
		params,
	});
	return response.data as {
		total: number;
		posts: PostWithAuthor[];
	};
};
