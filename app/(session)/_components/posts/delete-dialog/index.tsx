import type { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/global.store";
import { deletePost } from "../_service";

const DeleteDialog: FC<{ postId: string }> = ({ postId }) => {
	const { showDialog, setShowDialog } = useGlobalStore();
	const queryClient = useQueryClient();
	const router = useRouter();
	const mutation = useMutation<
		Prisma.PostSelect,
		AxiosError<{ error?: string }>
	>({
		mutationFn: () => deletePost({ postId }),
		onSuccess: () => {
			queryClient
				.invalidateQueries({
					queryKey: ["get-all-posts"],
				})
				.then(() => {
					toast.success(`Your post has been deleted`);
					setShowDialog(null);
					router.replace(`/`);
				});
		},
	});
	return (
		<AlertDialog
			open={showDialog === "delete"}
			onOpenChange={(open) => setShowDialog(open ? "delete" : null)}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. Are you sure you want to permanently
						delete this post?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						onClick={() => mutation.mutate()}
						loading={mutation.isPending}
						variant={"destructive"}
					>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDialog;
