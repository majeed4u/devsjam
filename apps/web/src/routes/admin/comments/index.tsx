import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle2,
	Edit,
	ExternalLink,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/admin/comments/")({
	component: AdminCommentsComponent,
});

function AdminCommentsComponent() {
	const queryClient = useQueryClient();
	const { data: comments, isLoading } = useQuery(
		orpc.comment.getAllForAdmin.queryOptions(),
	);

	const deleteMutation = useMutation(
		orpc.comment.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getAllForAdmin.queryKey(),
				});
			},
		}),
	);

	const [editingComment, setEditingComment] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");

	const updateMutation = useMutation(
		orpc.comment.update.mutationOptions({
			onSuccess: () => {
				setEditingComment(null);
				setEditContent("");
				queryClient.invalidateQueries({
					queryKey: orpc.comment.getAllForAdmin.queryKey(),
				});
			},
		}),
	);

	const handleEdit = (commentId: string, content: string) => {
		setEditingComment(commentId);
		setEditContent(content);
	};

	const handleSaveEdit = (commentId: string) => {
		updateMutation.mutate({
			id: commentId,
			content: editContent,
		});
	};

	const handleCancelEdit = () => {
		setEditingComment(null);
		setEditContent("");
	};

	const handleDelete = (commentId: string) => {
		if (confirm("Are you sure you want to delete this comment?")) {
			deleteMutation.mutate({ id: commentId });
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
			</div>
		);
	}

	// Count total comments including replies
	const totalComments =
		comments?.reduce(
			(acc, comment) => acc + 1 + (comment.replies?.length || 0),
			0,
		) || 0;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Link
						to="/admin"
						className="text-foreground/60 text-sm hover:text-foreground hover:underline"
					>
						← Back to Dashboard
					</Link>
					<h1 className="font-bold text-3xl">Comments Management</h1>
					<p className="mt-1 text-foreground/60">
						Manage all comments across your blog posts. Total:{" "}
						{totalComments} comments
					</p>
				</div>
			</div>

			{!comments || comments.length === 0 ? (
				<div className="border-border/40 border rounded-lg p-12 text-center">
					<CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-foreground/40" />
					<h3 className="font-semibold text-xl">No comments yet</h3>
					<p className="mt-2 text-foreground/60">
						Comments will appear here once readers start engaging with your
						posts.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => (
						<CommentCard
							key={comment.id}
							comment={comment}
							isEditing={editingComment === comment.id}
							editContent={editContent}
							onEditContentChange={setEditContent}
							onEdit={() => handleEdit(comment.id, comment.content)}
							onSaveEdit={() => handleSaveEdit(comment.id)}
							onCancelEdit={handleCancelEdit}
							onDelete={() => handleDelete(comment.id)}
							isDeleting={deleteMutation.isPending}
							isUpdating={updateMutation.isPending}
						/>
					))}
				</div>
			)}
		</div>
	);
}

interface CommentCardProps {
	comment: {
		id: string;
		content: string;
		createdAt: Date;
		author: {
			id: string;
			name: string | null;
			image: string | null;
		};
		post: {
			id: string;
			title: string;
			slug: string;
		};
		replies?: Array<{
			id: string;
			content: string;
			createdAt: Date;
			author: {
				name: string | null;
			};
		}>;
	};
	isEditing: boolean;
	editContent: string;
	onEditContentChange: (content: string) => void;
	onEdit: () => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
	onDelete: () => void;
	isDeleting: boolean;
	isUpdating: boolean;
}

function CommentCard({
	comment,
	isEditing,
	editContent,
	onEditContentChange,
	onEdit,
	onSaveEdit,
	onCancelEdit,
	onDelete,
	isDeleting,
	isUpdating,
}: CommentCardProps) {
	const replyCount = comment.replies?.length || 0;

	return (
		<div className="border-border/40 hover:border-border/60 transition-colors border rounded-lg p-4">
			<div className="mb-3 flex items-start justify-between">
				<div className="flex items-center gap-3">
					{comment.author.image ? (
						<img
							src={comment.author.image}
							alt={comment.author.name || "User"}
							className="h-10 w-10 rounded-full"
						/>
					) : (
						<div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
							<span className="font-medium text-primary text-sm">
								{comment.author.name?.[0] || "U"}
							</span>
						</div>
					)}
					<div>
						<p className="font-medium">
							{comment.author.name || "Anonymous"}
						</p>
						<p className="text-foreground/60 text-xs">
							{new Date(comment.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Link
						to="/blog/$slug"
						params={{ slug: comment.post.slug }}
						className="text-foreground/60 hover:text-foreground text-xs flex items-center gap-1 transition-colors"
						target="_blank"
					>
						View Post
						<ExternalLink className="h-3 w-3" />
					</Link>
				</div>
			</div>

			<div className="mb-3">
				<p className="text-foreground/70 text-xs">
					On: <span className="font-medium">{comment.post.title}</span>
				</p>
				{replyCount > 0 && (
					<p className="text-foreground/60 text-xs mt-1">
						{replyCount} {replyCount === 1 ? "reply" : "replies"}
					</p>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-3">
					<textarea
						value={editContent}
						onChange={(e) => onEditContentChange(e.target.value)}
						className="border-border bg-background min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						disabled={isUpdating}
					/>
					<div className="flex gap-2">
						<button
							onClick={onSaveEdit}
							disabled={isUpdating || !editContent.trim()}
							className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isUpdating ? "Saving..." : "Save"}
						</button>
						<button
							onClick={onCancelEdit}
							disabled={isUpdating}
							className="border-border hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-3">
					<p className="whitespace-pre-wrap text-foreground/90 text-sm leading-relaxed">
						{comment.content}
					</p>
					<div className="flex gap-2">
						<button
							onClick={onEdit}
							className="text-foreground/70 hover:text-primary flex items-center gap-1 text-xs transition-colors"
						>
							<Edit className="h-3.5 w-3.5" />
							Edit
						</button>
						<button
							onClick={onDelete}
							disabled={isDeleting}
							className="text-destructive hover:text-destructive/80 flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Trash2 className="h-3.5 w-3.5" />
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
