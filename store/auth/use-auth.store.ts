import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserType } from "@/types/user.types";

type AuthState = {
	token: string | null;
	user: UserType | null;
	login: (token: string, user: UserType) => void;
	logout: () => void;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			_hasHydrated: false,
			setHasHydrated: (state) => set({ _hasHydrated: state }),
			login: (token, user) => set({ token, user }),
			logout: () => set({ token: null, user: null }),
		}),
		{
			name: "auth-store",
			onRehydrateStorage: () => {
				return (state) => {
					state?.setHasHydrated(true);
				};
			},
		},
	),
);
