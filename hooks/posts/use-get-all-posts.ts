import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/services/posts.services";
import type { GetPostsParams } from "@/types/request.types";

export const useGetAllPosts = (params: GetPostsParams = {}) => {
	return useQuery({
		queryKey: ["get-all-posts", params],
		queryFn: () => getAllPosts(params),
		placeholderData: keepPreviousData,
	});
};
