import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth/use-auth.store";
import type { PostSchemaType } from "./_schema";

export const createPost = async (payload: PostSchemaType) => {
	const token = useAuthStore.getState().token;
	const _payload = {
		...payload,
		tags: payload.tags.map((t) => t.tag),
	};
	const response = await axios.post("/posts", _payload, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
export const editPost = async (
	payload: PostSchemaType & {
		postId: string;
	},
) => {
	const token = useAuthStore.getState().token;
	const _payload = {
		...payload,
		tags: payload.tags.map((t) => t.tag),
		id: payload.postId,
	};
	const response = await axios.put(`/posts/${payload.postId}`, _payload, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
export const deletePost = async (payload: { postId: string }) => {
	const token = useAuthStore.getState().token;
	const response = await axios.delete(`/posts/${payload.postId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
