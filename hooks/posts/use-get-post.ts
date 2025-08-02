import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "@/services/posts.services";

export const useGetSinglePost = (payload: { postId: string }) => {
	return useQuery({
		queryKey: ["get-single-post"],
		queryFn: () => getSinglePost(payload),
		retry: false,
	});
};
