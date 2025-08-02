"use client";

import {
	ArrowLeft,
	Bookmark,
	Check,
	Copy,
	Facebook,
	Heart,
	Linkedin,
	PenIcon,
	Share2,
	TrashIcon,
	Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSinglePost } from "@/hooks/posts/use-get-post";
import { useAuthStore } from "@/store/auth/use-auth.store";
import { useGlobalStore } from "@/store/global.store";
import DeleteDialog from "../_components/posts/delete-dialog";
import PostEditDialog from "../_components/posts/edit-dialog";

export default function PostViewPage() {
	const params = useParams<{
		"post-id": string;
	}>();
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);
	const postQuery = useGetSinglePost({
		postId: params["post-id"],
	});
	const isLoading = postQuery.isLoading;
	const post = postQuery.data;

	const currentUser = useAuthStore((state) => state.user);
	const isAuthor = currentUser?.id === post?.authorId;
	const { setShowDialog, showDialog } = useGlobalStore();
	if (postQuery.isError) {
		return (
			<div className="flex items-center justify-center bg-background">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Post not found</h1>
					<Link href="/">
						<Button>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</Link>
				</div>
			</div>
		);
	}
	if (!isLoading && !post) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Post not found</h1>
					<Link href="/">
						<Button>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// const relatedPosts = mockPosts
	// 	.filter(
	// 		(p) =>
	// 			p.id !== post?.id &&
	// 			(p.category === post?.category ||
	// 				p.tags.some((tag) => post?.tags.includes(tag))),
	// 	)
	// 	.slice(0, 3);

	const handleShare = async (platform: string) => {
		const url = window.location.href;
		const title = postQuery.data?.title;

		switch (platform) {
			case "twitter":
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(title ?? "")}&url=${encodeURIComponent(url)}`,
					"_blank",
				);
				break;
			case "facebook":
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
					"_blank",
				);
				break;
			case "linkedin":
				window.open(
					`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
					"_blank",
				);
				break;
			case "copy":
				try {
					await navigator.clipboard.writeText(url);
					setCopySuccess(true);
					setTimeout(() => setCopySuccess(false), 2000);
					toast.success("Link has been copied");
				} catch (err) {
					console.error("Failed to copy URL:", err);
				}
				break;
		}
		setShowShareMenu(false);
	};

	return (
		<main>
			<article>
				{/* Featured Image */}
				{isLoading ? (
					<Skeleton className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden"></Skeleton>
				) : (
					<div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
						<Image
							src={post?.image ?? "/placeholder.svg"}
							alt={post?.title ?? ""}
							fill
							unoptimized
							className="object-cover"
						/>
					</div>
				)}

				{/* Article Header */}
				<header className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						{isLoading ? (
							<>
								<Skeleton className="h-6 w-30"></Skeleton>
								<Skeleton className="h-6 w-30"></Skeleton>
							</>
						) : (
							<>
								<Badge variant="secondary">{post?.category}</Badge>
								<span className="text-sm text-muted-foreground">
									{post?.readTime}
								</span>
							</>
						)}
					</div>

					{isLoading ? (
						<Skeleton className="h-8 mb-2 w-96"></Skeleton>
					) : (
						<h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
							{post?.title}
						</h1>
					)}

					{isLoading ? (
						<Skeleton className="h-5 w-[80%] mb-6" />
					) : (
						<p className="text-xl text-muted-foreground mb-6 leading-relaxed">
							{post?.excerpt}
						</p>
					)}

					{/* Author Info */}
					{isLoading ? (
						<div className="flex items-center space-x-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div>
								<Skeleton className="h-4 w-32 mb-1" />
								<Skeleton className="h-3 w-40" />
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between flex-wrap gap-4 mb-6">
							<div className="flex items-center space-x-4">
								<Avatar className="h-12 w-12">
									<AvatarImage
										src={
											post?.author?.avatar ??
											`https://randomuser.me/api/portraits/lego/5.jpg`
										}
										alt={""}
									/>
									{/* <AvatarFallback>{post?.author.charAt(0)}</AvatarFallback> */}
								</Avatar>
								<div>
									<p className="font-semibold">{post?.author.user_name}</p>
									<div className="flex items-center space-x-2 text-sm text-muted-foreground">
										<span>
											{post?.createdAt
												? new Date(post.createdAt).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})
												: ""}
										</span>
										{post?.updatedAt &&
											post?.updatedAt !== post?.publishedAt && (
												<>
													<span>•</span>
													<span>
														Updated{" "}
														{new Date(post?.updatedAt).toLocaleDateString()}
													</span>
												</>
											)}
									</div>
								</div>
							</div>
							{post && showDialog === "edit" && (
								<PostEditDialog key={post?.id} post={post}></PostEditDialog>
							)}
							{/* Action Buttons */}
							<div className="flex items-center space-x-2">
								{post && isAuthor && (
									<Button
										size="sm"
										variant={"outline"}
										onClick={() => setShowDialog("edit")}
										className="flex items-center space-x-1"
									>
										<PenIcon className={`h-4 w-4`} />
									</Button>
								)}
								<Button
									variant={isLiked ? "default" : "outline"}
									size="sm"
									onClick={() => setIsLiked(!isLiked)}
									className="flex items-center space-x-1"
								>
									<Heart
										className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
									/>
									<span>{isLiked ? 1 : 0}</span>
								</Button>

								<Button
									variant={isBookmarked ? "default" : "outline"}
									size="sm"
									onClick={() => setIsBookmarked(!isBookmarked)}
								>
									<Bookmark
										className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
									/>
								</Button>

								<DropdownMenu
									open={showShareMenu}
									onOpenChange={setShowShareMenu}
								>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm">
											<Share2 className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Share this post</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => handleShare("twitter")}>
											<Twitter className="h-4 w-4 mr-2" />
											Twitter
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleShare("facebook")}>
											<Facebook className="h-4 w-4 mr-2" />
											Facebook
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleShare("linkedin")}>
											<Linkedin className="h-4 w-4 mr-2" />
											LinkedIn
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => handleShare("copy")}>
											{copySuccess ? (
												<Check className="h-4 w-4 mr-2 text-green-600" />
											) : (
												<Copy className="h-4 w-4 mr-2" />
											)}
											{copySuccess ? "Copied!" : "Copy Link"}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								{post && isAuthor && (
									<Button
										size="sm"
										variant={"destructive"}
										onClick={() => {
											setShowDialog("delete");
										}}
										className="flex items-center space-x-1"
									>
										<TrashIcon className={`h-4 w-4`} />
									</Button>
								)}
								{post && showDialog === "delete" && (
									<DeleteDialog postId={post?.id}></DeleteDialog>
								)}
							</div>
						</div>
					)}

					{/* Tags */}
					{isLoading ? (
						<div className="flex gap-2 mt-3">
							<Skeleton className="h-6 w-16 rounded-md" />
							<Skeleton className="h-6 w-20 rounded-md" />
						</div>
					) : (
						<div className="flex flex-wrap gap-2 mb-6">
							{post?.tags.map((tag) => (
								<Badge key={tag} variant="outline">
									{tag}
								</Badge>
							))}
						</div>
					)}
				</header>

				<Separator className="mb-8" />

				{/* Article Content */}
				<div className="prose dark:prose-invert !text-foreground prose-lg max-w-none my-12 mb-16">
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="h-40 w-full" />
							<Skeleton className="h-40 w-[90%]" />
							<Skeleton className="h-40 w-[80%]" />
							<Skeleton className="h-40 w-[95%]" />
						</div>
					) : (
						<div
							className="whitespace-pre-wrap leading-relaxed"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: it will always be html
							dangerouslySetInnerHTML={{ __html: post?.content ?? "" }}
						></div>
					)}
				</div>

				<Separator className="mb-8" />

				{/* Author Bio */}
				<div className="bg-muted/50 rounded-lg p-6 mb-8">
					<div className="flex items-start space-x-4">
						<Avatar className="h-16 w-16">
							<AvatarImage
								src={
									post?.author?.avatar ??
									`https://randomuser.me/api/portraits/lego/5.jpg`
								}
								alt={""}
							/>
							{/* <AvatarFallback>{post?.author.charAt(0)}</AvatarFallback> */}
						</Avatar>
						<div className="flex-1">
							<h3 className="text-lg font-semibold mb-2">
								About {post?.author?.user_name}
							</h3>
							<p className="text-muted-foreground mb-4">
								{post?.author?.email}
							</p>
							<Button variant="outline" size="sm">
								Follow
							</Button>
						</div>
					</div>
				</div>

				{/* Engagement Stats */}
				<div className="flex items-center justify-center space-x-8 py-6 border-y mb-8">
					<div className="text-center">
						<div className="text-2xl font-bold">{isLiked ? 1 : 0}</div>
						<div className="text-sm text-muted-foreground">Likes</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">Really good</div>
						<div className="text-sm text-muted-foreground">Comments</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold">{isBookmarked ? 1 : 0}</div>
						<div className="text-sm text-muted-foreground">Bookmarks</div>
					</div>
				</div>
			</article>

			{/* Related Posts */}
			{/* {relatedPosts.length > 0 && (
				<section>
					<h2 className="text-2xl font-bold mb-6">Related Posts</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{relatedPosts.map((relatedPost) => (
							<Link key={relatedPost?.id} href={`/post/${relatedPost?.id}`}>
								<Card className="group hover:shadow-lg pt-0 transition-all duration-200 cursor-pointer h-full">
									<div className="aspect-video relative overflow-hidden rounded-t-lg">
										<Image
											src={relatedPost?.image || "/placeholder.svg"}
											alt={relatedPost?.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-200"
										/>
									</div>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between mb-2">
											<Badge variant="secondary">{relatedPost?.category}</Badge>
											<span className="text-sm text-muted-foreground">
												{relatedPost?.readTime}
											</span>
										</div>
										<CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
											{relatedPost?.title}
										</CardTitle>
										<CardDescription className="line-clamp-3">
											{relatedPost?.excerpt}
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="flex items-center space-x-2">
											<Avatar className="h-5 w-5">
												<AvatarImage
													src={relatedPost?.authorAvatar || "/placeholder.svg"}
													alt={relatedPost?.author}
												/>
												<AvatarFallback>
													{relatedPost?.author.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm text-muted-foreground">
												{relatedPost?.author}
											</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</section>
			)} */}
		</main>
	);
}
