import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2, Edit2, Reply, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";
import { authClient } from "@/lib/auth-client";

interface CommentItemProps {
	comment: any;
	postId: string;
	isReply?: boolean;
	onReply?: (parentId: string, authorName: string) => void;
	level?: number;
}

export function CommentItem({
	comment,
	postId,
	isReply = false,
	onReply,
	level = 0,
}: CommentItemProps) {
	const queryClient = useQueryClient();
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [isCollapsed, setIsCollapsed] = useState(false);

	// Check if current user is the author or admin
	const { data: session } = authClient.useSession();
	const isAuthor = session?.user?.id === comment.author.id;
	const isAdmin = session?.user?.role === "admin";
	const canEdit = isAuthor || isAdmin;

	// Delete comment mutation
	const deleteComment = useMutation(
		orpc.comment.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Comment deleted");
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getByPost.queryKey({ input: { postId } }),
				});
			},
			onError: (error) => {
				toast.error(error.message || "Failed to delete comment");
			},
		}),
	);

	// Update comment mutation
	const updateComment = useMutation(
		orpc.comment.update.mutationOptions({
			onSuccess: () => {
				toast.success("Comment updated");
				setIsEditing(false);
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getByPost.queryKey({ input: { postId } }),
				});
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update comment");
			},
		}),
	);

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this comment?")) {
			deleteComment.mutate({ id: comment.id });
		}
	};

	const handleUpdate = () => {
		if (editContent.trim().length < 1) {
			toast.error("Comment cannot be empty");
			return;
		}
		updateComment.mutate({ id: comment.id, content: editContent });
	};

	const handleCancel = () => {
		setEditContent(comment.content);
		setIsEditing(false);
	};

	const handleReply = () => {
		if (onReply) {
			onReply(comment.id, comment.author.name);
		}
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Don't nest too deep
	const maxNestingLevel = 3;
	const shouldShowReplies = !isReply && comment.replies && comment.replies.length > 0;

	return (
		<div
			className={`${isReply ? "ml-8 mt-3" : "mt-4"} ${level >= maxNestingLevel ? "ml-0" : ""}`}
		>
			<div className="group flex gap-3">
				{/* Avatar */}
				<div className="flex-shrink-0">
					{comment.author.image ? (
						<img
							src={comment.author.image}
							alt={comment.author.name}
							className="h-8 w-8 rounded-full"
						/>
					) : (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<User className="h-4 w-4 text-primary" />
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div>
							<span className="font-medium text-sm">
								{comment.author.name}
							</span>
							<span className="mx-2 text-foreground/40">·</span>
							<span className="text-foreground/50 text-xs">
								{formatDate(comment.createdAt)}
							</span>
							{comment.updatedAt !== comment.createdAt && (
								<>
									<span className="mx-2 text-foreground/40">·</span>
									<span className="text-foreground/50 text-xs">(edited)</span>
								</>
							)}
						</div>

						{/* Actions menu - only show for author/admin */}
						{canEdit && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => setIsEditing(true)}>
										<Edit2 className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleDelete}
										className="text-destructive"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>

					{/* Comment content */}
					{isEditing ? (
						<div className="mt-2 space-y-2">
							<Textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className="min-h-[80px] resize-none"
								autoFocus
							/>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={handleUpdate}
									disabled={updateComment.isPending}
								>
									{updateComment.isPending ? "Saving..." : "Save"}
								</Button>
								<Button
									size="sm"
									variant="ghost"
									onClick={handleCancel}
									disabled={updateComment.isPending}
								>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<p className="text-foreground/80 text-sm whitespace-pre-wrap break-words">
								{comment.content}
							</p>

							{/* Action buttons - always visible for replies */}
							<div className="flex flex-wrap items-center gap-3 pt-1">
								{!isReply && onReply && (
									<button
										onClick={handleReply}
										className="text-foreground/50 text-xs hover:text-primary transition-colors flex items-center gap-1"
									>
										<Reply className="h-3 w-3" />
										Reply
									</button>
								)}
							</div>
						</div>
					)}

					{/* Replies */}
					{shouldShowReplies && (
						<>
							{comment.replies.length > 0 && (
								<button
									onClick={() => setIsCollapsed(!isCollapsed)}
									className="mt-2 text-foreground/50 text-xs hover:text-foreground transition-colors"
								>
									{isCollapsed
										? `Show ${comment.replies.length} repl${comment.replies.length === 1 ? "y" : "ies"}`
										: "Hide replies"}
								</button>
							)}
							{!isCollapsed &&
								comment.replies.map((reply: any) => (
									<CommentItem
										key={reply.id}
										comment={reply}
										postId={postId}
										isReply
										level={level + 1}
									/>
								))}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
