import axiosInstance from "@/lib/axios";
import type { registerSchemaType } from "./_schema";

export const register = async (payload: registerSchemaType) => {
	const res = await axiosInstance.post(`/auth/register`, payload);
	return res.data;
};
