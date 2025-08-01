import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth/use-auth.store";
import type { PostSchemaType } from "./_schema";

export const createPost = async (payload: PostSchemaType) => {
	const token = useAuthStore.getState().token;
	const response = await axios.post("/posts", payload, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
