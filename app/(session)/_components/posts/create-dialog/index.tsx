"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircleIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
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
import { type PostSchemaType, postSchema } from "../_schema";
import { createPost } from "../_service";

const categories = [
	"Development",
	"Programming",
	"Design",
	"Backend",
	"Security",
	"DevOps",
	"Mobile",
];
const PostCreateDialog = () => {
	const form = useForm<PostSchemaType>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			excerpt: "",
			content: "",
			tags: [],
			category: "Development",
		},
	});
	const [tags, setTags] = useState<string[]>([]);
	const [currentTag, setCurrentTag] = useState("");

	const addTag = () => {
		if (currentTag.trim() && !tags.includes(currentTag.trim())) {
			setTags((prev) => [...prev, currentTag.trim()]);
			setCurrentTag("");
		}
	};
	console.log(form.formState.errors);
	const removeTag = (tagToRemove: string) => {
		setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
	};

	const mutation = useMutation<
		any,
		AxiosError<{ error?: string }>,
		PostSchemaType
	>({
		mutationFn: (payload) => createPost(payload),
		onSuccess: () => {
			form.reset();
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					New Post
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="min-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Create New Post</AlertDialogTitle>
				</AlertDialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => console.log(values))}
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

						<div className="space-y-6  overflow-y-scroll max-h-[80vh] pb-6">
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
								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="flex items-center gap-1"
											>
												{tag}
												<button type="button" onClick={() => removeTag(tag)}>
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
								Create
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PostCreateDialog;
