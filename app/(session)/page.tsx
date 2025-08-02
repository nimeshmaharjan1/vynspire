"use client";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { EyeIcon, Filter, PenIcon, Search, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetAllPosts } from "@/hooks/posts/use-get-all-posts";
import type { PostWithAuthor } from "@/services/posts.services";
import { useAuthStore } from "@/store/auth/use-auth.store";
import { useGlobalStore } from "@/store/global.store";
import DeleteDialog from "./_components/posts/delete-dialog";
import PostEditDialog from "./_components/posts/edit-dialog";

const categories = [
	"All",
	"Development",
	"Programming",
	"Design",
	"Backend",
	"Security",
];

export default function Dashboard() {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearch] = useDebounce(searchQuery, 500); // ⏱️ 500ms debounce
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 6;

	const postQuery = useGetAllPosts({
		search: debouncedSearch,
		category: selectedCategory !== "All" ? selectedCategory : undefined,
		page: currentPage,
		limit: postsPerPage,
	});
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch, selectedCategory]);

	const posts = postQuery.data?.posts || [];
	const total = postQuery.data?.total || 0;
	const totalPages = Math.ceil(total / postsPerPage);
	const { setShowDialog, showDialog, selectedPost, setSelectedPost } =
		useGlobalStore();
	const currentUser = useAuthStore((state) => state.user);
	const BlogPostCard = ({ post }: { post: PostWithAuthor }) => {
		const isAuthor = currentUser?.id === post.authorId;

		const CardInner = (
			<Card className="group hover:shadow-lg transition-all duration-200 pt-0 cursor-pointer">
				<div className="aspect-video relative overflow-hidden rounded-t-lg">
					<Image
						src={post.image || "/placeholder.svg"}
						alt={post.title}
						fill
						unoptimized
						className="object-cover group-hover:scale-105 transition-transform duration-200"
					/>
				</div>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between mb-2">
						<Badge variant="secondary">{post.category}</Badge>
						<span className="text-sm text-muted-foreground">
							{post.readTime}
						</span>
					</div>
					<CardTitle className="group-hover:text-primary transition-colors">
						{post.title}
					</CardTitle>
					<CardDescription>{post.excerpt}</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Avatar className="h-6 w-6">
								<AvatarImage
									src={
										post?.author?.avatar ??
										`https://randomuser.me/api/portraits/lego/5.jpg`
									}
									alt={post.author?.user_name || "Author"}
								/>
								<AvatarFallback>
									{post.author?.user_name?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm text-muted-foreground">
								{post.author?.user_name}
							</span>
						</div>
						<span className="text-sm text-muted-foreground">
							{new Date(
								post.publishedAt || post.createdAt,
							).toLocaleDateString()}
						</span>
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="flex flex-wrap gap-1 mt-3 flex-1">
							{post.tags?.slice(0, 3).map((tag: string) => (
								<Badge key={tag} variant="outline" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>

						{isAuthor && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="icon" variant="ghost" className="mt-2">
										<DotsVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem asChild>
										<Link href={`/${post?.id}`}>
											<EyeIcon className="h-4 w-4 mr-2" />
											View
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSelectedPost(post);
											setShowDialog("edit");
										}}
									>
										<PenIcon className="h-4 w-4 mr-2" />
										Edit
									</DropdownMenuItem>

									<DropdownMenuItem
										className="!text-destructive"
										onClick={() => {
											setSelectedPost(post);
											setShowDialog("delete");
										}}
									>
										<TrashIcon className="!text-destructive h-4 w-4 mr-2" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</CardContent>
			</Card>
		);

		// If not author, wrap whole card in link
		return isAuthor ? (
			CardInner
		) : (
			<Link href={`/${post.id}`} passHref>
				{CardInner}
			</Link>
		);
	};

	return (
		<>
			{selectedPost && showDialog === "edit" && (
				<PostEditDialog
					key={selectedPost?.id}
					post={selectedPost}
				></PostEditDialog>
			)}
			{selectedPost && showDialog === "delete" && (
				<DeleteDialog postId={selectedPost?.id}></DeleteDialog>
			)}
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
			</div>

			{/* Results Info */}
			<div className="mb-6">
				<p className="text-muted-foreground">
					Showing {posts.length} of {total} posts
					{selectedCategory !== "All" && ` in ${selectedCategory}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</p>
			</div>

			{/* Blog Posts */}
			{postQuery.isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{Array.from({ length: postsPerPage }).map((_, i) => (
						<Card key={i} className="animate-pulse">
							<div className="aspect-video bg-muted rounded-t-lg" />
							<CardHeader className="pb-3">
								<div className="h-4 w-1/3 bg-muted rounded mb-2" />
								<div className="h-6 w-2/3 bg-muted rounded mb-2" />
								<div className="h-4 w-full bg-muted rounded" />
							</CardHeader>
							<CardContent>
								<div className="flex items-center space-x-2">
									<div className="h-6 w-6 rounded-full bg-muted" />
									<div className="h-4 w-24 bg-muted rounded" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : posts.length === 0 ? (
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{posts.map((post) => (
							<BlogPostCard key={post.id} post={post} />
						))}
					</div>

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
