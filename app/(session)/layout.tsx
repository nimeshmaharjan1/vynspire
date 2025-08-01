"use client";

import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth/use-auth.hook";
import PostCreateDialog from "./_components/posts/create-dialog";

export default function SessionLayout({ children }: PropsWithChildren) {
	const { theme, setTheme } = useTheme();
	const { loading, isAuthenticated, logout } = useAuth(true); // true → protected route

	if (loading)
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		); // optional loader
	if (!isAuthenticated) return null; // redirects via useAuth internally

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold">Vynspire Blogs</h1>
						</div>
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							>
								<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span className="sr-only">Toggle theme</span>
							</Button>
							{/* NOTE Handled the alert dialog for create post dialog here */}
							<PostCreateDialog></PostCreateDialog>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Profile</DropdownMenuItem>
									<DropdownMenuItem>Settings</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
