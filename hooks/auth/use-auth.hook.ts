"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/use-auth.store";

export function useAuth(protectedRoute = false) {
	const router = useRouter();
	const { token, user, logout, _hasHydrated } = useAuthStore();

	const isAuthenticated = !!token;

	useEffect(() => {
		if (!_hasHydrated) return;

		if (protectedRoute && !isAuthenticated) {
			router.replace("/login");
		}
	}, [_hasHydrated, isAuthenticated, protectedRoute, router]);

	const loading = !_hasHydrated;

	return { user, isAuthenticated, loading, logout };
}
