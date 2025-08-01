import type { Metadata } from "next";
import { Architects_Daughter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Architects_Daughter({
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Vynspire - Modern Blog Platform",
	description: "A modern, responsive blog platform for developers",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${poppins.className} antialiased`}>
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster richColors></Toaster>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
