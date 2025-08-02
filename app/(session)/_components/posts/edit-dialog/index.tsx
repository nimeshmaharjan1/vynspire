"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Post, Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircleIcon, Plus, X } from "lucide-react";
import { type FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/global.store";
import { type PostSchemaType, postSchema } from "../_schema";
import { editPost } from "../_service";

const categories = [
	"Development",
	"Programming",
	"Design",
	"Backend",
	"Security",
	"DevOps",
	"Mobile",
];
const PostEditDialog: FC<{ post: Post }> = ({ post }) => {
	const { setShowDialog, showDialog } = useGlobalStore();
	const form = useForm<PostSchemaType>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: post?.title,
			excerpt: post?.excerpt ?? "",
			content: post?.content ?? "",
			tags: post?.tags?.map((t) => ({
				tag: t,
			})),
			category: post?.category ?? "",
		},
	});
	const [tags, setTags] = useState<string[]>([]);
	const [currentTag, setCurrentTag] = useState("");
	const tagsArray = useFieldArray({
		control: form.control,
		name: "tags",
	});
	const addTag = () => {
		if (currentTag.trim() && !tags.includes(currentTag.trim())) {
			setTags((prev) => [...prev, currentTag.trim()]);
			tagsArray.append({
				tag: currentTag.trim(),
			});
			setCurrentTag("");
		}
	};
	const removeTag = (tagToRemove: number) => {
		tagsArray.remove(tagToRemove);
	};
	const queryClient = useQueryClient();
	const mutation = useMutation<
		Prisma.PostSelect,
		AxiosError<{ error?: string }>,
		PostSchemaType
	>({
		mutationFn: (payload) => editPost({ ...payload, postId: post.id }),
		onSuccess: () => {
			queryClient
				.invalidateQueries({
					queryKey: ["get-all-posts"],
				})
				.then(() => {});
			queryClient
				.invalidateQueries({
					queryKey: ["get-single-post"],
				})
				.then(() => {
					toast.success(`Your post has been updated`);
					form.reset();
					setShowDialog(null);
				});
		},
	});

	return (
		<AlertDialog
			open={showDialog === "edit"}
			onOpenChange={(open) => setShowDialog(open ? "edit" : null)}
		>
			<AlertDialogContent className="min-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Update Post</AlertDialogTitle>
				</AlertDialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
						className="space-y-6"
					>
						{mutation.isError && (
							<Alert variant="destructive">
								<AlertCircleIcon className="h-4 w-4" />
								<AlertTitle>
									{mutation.error?.response?.data?.error ||
										"Something went wrong"}
								</AlertTitle>
							</Alert>
						)}

						<div className="space-y-6  overflow-y-auto max-h-[70vh] pb-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Enter post title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="excerpt"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Excerpt</FormLabel>
										<FormControl>
											<Input
												placeholder="Short summary (optional)"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Content</FormLabel>
										<FormControl>
											<MinimalTiptapEditor
												value={field.value}
												onChange={(value) => field.onChange(value)}
												className="w-full"
												editorContentClassName="p-5"
												output="html"
												autofocus={true}
												editable={true}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((cat) => (
													<SelectItem key={cat} value={cat}>
														{cat}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="space-y-2">
								<FormLabel>Tags</FormLabel>
								<div className="flex gap-2">
									<Input
										placeholder="Add tag"
										value={currentTag}
										onChange={(e) => setCurrentTag(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addTag();
											}
										}}
									/>
									<Button
										type="button"
										onClick={addTag}
										size="icon"
										variant="outline"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								{tagsArray.fields.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tagsArray.fields.map((tag, index) => (
											<Badge
												key={tag.id}
												variant="secondary"
												className="flex items-center gap-1"
											>
												{tag.tag}
												<button type="button" onClick={() => removeTag(index)}>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								)}
							</div>
						</div>

						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={() => {
									form.reset();
									setShowDialog(null);
								}}
								type="button"
							>
								Cancel
							</AlertDialogCancel>
							<Button
								type="submit"
								className="w-32"
								loading={mutation.isPending}
							>
								Save Changes
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PostEditDialog;
