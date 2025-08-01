import axiosInstance from "@/lib/axios";
import type { loginSchemaType } from "./_schema";

export const login = async (payload: loginSchemaType) => {
	const response = await axiosInstance.post("/auth/login", payload);
	return response.data;
};
