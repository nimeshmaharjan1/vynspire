import { create } from "zustand";
import type { PostWithAuthor } from "@/services/posts.services";

type actionType = "create" | "edit" | "delete" | null;

type GlobalStoreType = {
	showDialog: actionType;
	selectedPost: PostWithAuthor | null;
	setShowDialog: (state: actionType) => void;
	setSelectedPost: (post: PostWithAuthor | null) => void;
};

export const useGlobalStore = create<GlobalStoreType>()((set) => ({
	showDialog: null,
	selectedPost: null,
	setShowDialog: (value) => set({ showDialog: value }),
	setSelectedPost: (post) => set({ selectedPost: post }),
}));
