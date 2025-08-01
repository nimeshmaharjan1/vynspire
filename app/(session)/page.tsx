"use client";

import { Filter, Grid, List, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	author: string;
	authorAvatar: string;
	publishedAt: string;
	category: string;
	tags: string[];
	readTime: string;
	image: string;
}

const mockPosts: BlogPost[] = [
	{
		id: "1",
		title: "Getting Started with Next.js 14",
		excerpt:
			"Learn the fundamentals of Next.js 14 and build modern web applications with the latest features.",
		content: "Full content here...",
		author: "John Doe",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-15",
		category: "Development",
		tags: ["Next.js", "React", "JavaScript"],
		readTime: "5 min read",
		image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
	},
	{
		id: "2",
		title: "Mastering TypeScript in 2024",
		excerpt:
			"Advanced TypeScript patterns and best practices for building scalable applications.",
		content: "Full content here...",
		author: "Jane Smith",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-12",
		category: "Programming",
		tags: ["TypeScript", "JavaScript", "Programming"],
		readTime: "8 min read",
		image: "/placeholder.svg?height=200&width=400&text=TypeScript+Guide",
	},
	{
		id: "3",
		title: "Building Responsive UIs with Tailwind CSS",
		excerpt:
			"Create beautiful, responsive user interfaces using Tailwind CSS utility classes.",
		content: "Full content here...",
		author: "Mike Johnson",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-10",
		category: "Design",
		tags: ["CSS", "Tailwind", "UI/UX"],
		readTime: "6 min read",
		image: "/placeholder.svg?height=200&width=400&text=Tailwind+CSS",
	},
	{
		id: "4",
		title: "Database Design Best Practices",
		excerpt:
			"Learn how to design efficient and scalable database schemas for modern applications.",
		content: "Full content here...",
		author: "Sarah Wilson",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-08",
		category: "Backend",
		tags: ["Database", "SQL", "Architecture"],
		readTime: "10 min read",
		image: "/placeholder.svg?height=200&width=400&text=Database+Design",
	},
	{
		id: "5",
		title: "React Server Components Explained",
		excerpt:
			"Understanding React Server Components and how they improve performance and user experience.",
		content: "Full content here...",
		author: "Alex Chen",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-05",
		category: "Development",
		tags: ["React", "Server Components", "Performance"],
		readTime: "7 min read",
		image: "/placeholder.svg?height=200&width=400&text=React+Server+Components",
	},
	{
		id: "6",
		title: "API Security Best Practices",
		excerpt:
			"Essential security measures to protect your APIs from common vulnerabilities and attacks.",
		content: "Full content here...",
		author: "David Brown",
		authorAvatar: "/placeholder.svg?height=40&width=40",
		publishedAt: "2024-01-03",
		category: "Security",
		tags: ["API", "Security", "Backend"],
		readTime: "9 min read",
		image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
	},
];

const categories = [
	"All",
	"Development",
	"Programming",
	"Design",
	"Backend",
	"Security",
];

export default function Dashboard() {
	const [posts, _setPosts] = useState<BlogPost[]>(mockPosts);
	const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockPosts);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 6;

	useEffect(() => {
		let filtered = posts;

		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.tags.some((tag) =>
						tag.toLowerCase().includes(searchQuery.toLowerCase()),
					),
			);
		}

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter((post) => post.category === selectedCategory);
		}

		setFilteredPosts(filtered);
		setCurrentPage(1);
	}, [searchQuery, selectedCategory, posts]);

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const startIndex = (currentPage - 1) * postsPerPage;
	const currentPosts = filteredPosts.slice(
		startIndex,
		startIndex + postsPerPage,
	);

	const BlogPostCard = ({ post }: { post: BlogPost }) => (
		<Card className="group hover:shadow-lg transition-all duration-200 pt-0 cursor-pointer">
			<div className="aspect-video relative overflow-hidden rounded-t-lg">
				<Image
					src={"/placeholder.svg"}
					alt={post.title}
					fill
					className="object-cover group-hover:scale-105 transition-transform duration-200"
				/>
			</div>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between mb-2">
					<Badge variant="secondary">{post.category}</Badge>
					<span className="text-sm text-muted-foreground">{post.readTime}</span>
				</div>
				<CardTitle className="group-hover:text-primary transition-colors">
					{post.title}
				</CardTitle>
				<CardDescription className="">{post.excerpt}</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Avatar className="h-6 w-6">
							<AvatarImage
								src={post.authorAvatar || "/placeholder.svg"}
								alt={post.author}
							/>
							<AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
						</Avatar>
						<span className="text-sm text-muted-foreground">{post.author}</span>
					</div>
					<span className="text-sm text-muted-foreground">
						{new Date(post.publishedAt).toLocaleDateString()}
					</span>
				</div>
				<div className="flex flex-wrap gap-1 mt-3">
					{post.tags.slice(0, 3).map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);

	const BlogPostListItem = ({ post }: { post: BlogPost }) => (
		<Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
			<CardContent className="p-6">
				<div className="flex gap-4">
					<div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
						<Image
							src={"/placeholder.svg"}
							alt={post.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-200"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-2">
							<Badge variant="secondary">{post.category}</Badge>
							<span className="text-sm text-muted-foreground">
								{post.readTime}
							</span>
						</div>
						<h3 className="font-semibold text-lg mb-2 group-hover:text-foreground transition-colors">
							{post.title}
						</h3>
						<p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Avatar className="h-5 w-5">
									<AvatarImage
										src={post.authorAvatar || "/placeholder.svg"}
										alt={post.author}
									/>
									<AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
								</Avatar>
								<span className="text-sm text-muted-foreground">
									{post.author}
								</span>
								<span className="text-sm text-muted-foreground">•</span>
								<span className="text-sm text-muted-foreground">
									{new Date(post.publishedAt).toLocaleDateString()}
								</span>
							</div>
							<div className="flex gap-1">
								{post.tags.slice(0, 2).map((tag) => (
									<Badge key={tag} variant="outline" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<>
			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search posts, tags, or authors..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-full sm:w-48">
						<Filter className="h-4 w-4 mr-2" />
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem key={category} value={category}>
								{category}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="flex gap-2">
					<Button
						variant={viewMode === "grid" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("grid")}
					>
						<Grid className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === "list" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("list")}
					>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Results Info */}
			<div className="mb-6">
				<p className="text-muted-foreground">
					Showing {currentPosts.length} of {filteredPosts.length} posts
					{selectedCategory !== "All" && ` in ${selectedCategory}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</p>
			</div>

			{/* Blog Posts */}
			{currentPosts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground text-lg">
						No posts found matching your criteria.
					</p>
					<Button
						className="mt-4"
						onClick={() => {
							setSearchQuery("");
							setSelectedCategory("All");
						}}
					>
						Clear Filters
					</Button>
				</div>
			) : (
				<>
					{viewMode === "grid" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
							{currentPosts.map((post) => (
								<BlogPostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="space-y-4 mb-8">
							{currentPosts.map((post) => (
								<BlogPostListItem key={post.id} post={post} />
							))}
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center space-x-2">
							<Button
								variant="outline"
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
							>
								Previous
							</Button>
							<div className="flex space-x-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(page) => (
										<Button
											key={page}
											variant={currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => setCurrentPage(page)}
										>
											{page}
										</Button>
									),
								)}
							</div>
							<Button
								variant="outline"
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}
							>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</>
	);
}
