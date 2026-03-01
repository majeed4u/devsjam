import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

interface CommentFormProps {
	postId: string;
	parentId?: string;
	replyToName?: string;
	onCancel?: () => void;
	onSuccess?: () => void;
}

export function CommentForm({
	postId,
	parentId,
	replyToName,
	onCancel,
	onSuccess,
}: CommentFormProps) {
	const queryClient = useQueryClient();
	const [content, setContent] = useState("");

	// Create comment mutation
	const createComment = useMutation(
		orpc.comment.create.mutationOptions({
			onSuccess: () => {
				toast.success(
					parentId ? "Reply posted!" : "Comment posted!",
				);
				setContent("");
				onSuccess?.();
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getByPost.queryKey({ input: { postId } }),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getCount.queryKey({ input: { postId } }),
				});
			},
			onError: (error) => {
				toast.error(error.message || "Failed to post comment");
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (content.trim().length < 1) {
			toast.error("Comment cannot be empty");
			return;
		}

		if (content.trim().length > 5000) {
			toast.error("Comment is too long (max 5000 characters)");
			return;
		}

		createComment.mutate({
			postId,
			content: content.trim(),
			parentId,
		});
	};

	const isDisabled = createComment.isPending;

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			{replyToName && (
				<div className="flex items-center justify-between rounded-t-lg bg-muted/50 px-3 py-2">
					<span className="text-foreground/70 text-sm">
						Replying to <span className="font-medium">{replyToName}</span>
					</span>
					{onCancel && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0"
							onClick={onCancel}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			)}
			<Textarea
				placeholder={
					parentId
						? "Write a reply..."
						: "Join the discussion... (Markdown supported)"
				}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				className={`min-h-[100px] resize-none ${parentId ? "rounded-t-none" : ""}`}
				disabled={isDisabled}
				autoFocus
			/>
			<div className="flex items-center justify-between">
				<span className="text-foreground/50 text-xs">
					{content.length}/5000 characters
				</span>
				<div className="flex gap-2">
					{onCancel && !replyToName && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onCancel}
							disabled={isDisabled}
						>
							Cancel
						</Button>
					)}
					<Button
						type="submit"
						size="sm"
						disabled={isDisabled || content.trim().length < 1}
					>
						{isDisabled ? (
							"Posting..."
						) : (
							<>
								<MessageCircle className="mr-2 h-4 w-4" />
								{parentId ? "Reply" : "Comment"}
							</>
						)}
					</Button>
				</div>
			</div>
		</form>
	);
}
