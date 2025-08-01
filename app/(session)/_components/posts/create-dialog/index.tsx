"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircleIcon, Plus, X } from "lucide-react";
import {
	EditorBubble,
	EditorContent,
	EditorRoot,
	handleCommandNavigation,
} from "novel";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NodeSelector } from "@/components/editor/node-selector";
import { TextButtons } from "@/components/editor/text-buttons";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { defaultExtensions } from "@/lib/extensions";
import { cn } from "@/lib/utils";
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
	const [openNode, setOpenNode] = useState(false);
	const [openColor, setOpenColor] = useState(false);
	const [openLink, setOpenLink] = useState(false);
	const [content, setContent] = useState(null);
	const form = useForm<PostSchemaType>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: "",
			excerpt: "",
			content: "",
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
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Create New Post</AlertDialogTitle>
				</AlertDialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
						className="space-y-4"
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
										<Input placeholder="Short summary (optional)" {...field} />
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
										<EditorRoot>
											<EditorContent
												editorProps={{
													handleDOMEvents: {
														keydown: (_view, event) =>
															handleCommandNavigation(event),
													},
													attributes: {
														class: cn(
															"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
															"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
															"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
														),
													},
												}}
												extensions={defaultExtensions}
												initialContent={content}
												onUpdate={({ editor }) => {
													const json = editor.getJSON();
													setContent(json);
												}}
											>
												<EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl">
													<NodeSelector
														open={openNode}
														onOpenChange={setOpenNode}
													/>
													<TextButtons />
												</EditorBubble>
											</EditorContent>
										</EditorRoot>
										{/* <Textarea
											rows={5}
											placeholder="Write your blog post..."
											{...field}
										/> */}
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

						<AlertDialogFooter>
							<AlertDialogCancel type="button">Cancel</AlertDialogCancel>
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
